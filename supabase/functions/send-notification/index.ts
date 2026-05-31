// Supabase Edge Function — send-notification (FCM HTTP v1 API)
// Deploy:  supabase functions deploy send-notification
// Secret:  supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SA_JSON          = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON')!;

// ─── PEM private key → ArrayBuffer ───────────────────────────────────────────
function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// ─── Base64url encode ─────────────────────────────────────────────────────────
function b64url(input: string): string {
  return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// ─── Build a signed JWT and exchange it for an OAuth2 access token ────────────
async function getAccessToken(sa: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }));

  const signingInput = `${header}.${payload}`;

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBytes = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signingInput}.${sig}`;

  // Exchange JWT for OAuth2 access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`OAuth token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { recipientUserId, type, title, body } = await req.json();
  if (!recipientUserId || !title) {
    return new Response('Missing required fields', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);

  // 1. Look up recipient's push token
  const { data: tokenRow } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('user_id', recipientUserId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (!tokenRow?.token) {
    return new Response(JSON.stringify({ sent: false, reason: 'no_token' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Parse service account and get OAuth2 access token
  const sa = JSON.parse(SA_JSON);
  const accessToken = await getAccessToken(sa);

  // 3. Send via FCM HTTP v1 API
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;

  const fcmRes = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      message: {
        token:        tokenRow.token,
        notification: { title, body },
        data:         { type },
      },
    }),
  });

  const fcmJson = await fcmRes.json();

  // 4. Log the notification
  await supabase.from('notification_log').insert({
    recipient_id: recipientUserId,
    type,
    payload: { title, body, fcm_result: fcmJson },
  });

  return new Response(
    JSON.stringify({ sent: true, fcm: fcmJson }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
