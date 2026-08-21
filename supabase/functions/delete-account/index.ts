// Supabase Edge Function — delete-account
// Permanently deletes the calling user's account and ALL their data.
//
// The database cascades on delete: auth.users → profiles → children → every
// child/family table (ON DELETE CASCADE). So deleting the auth user with the
// service role wipes everything the family created. Google Play requires an
// in-app account-deletion path; this is the server side of that.
//
// Deploy:  supabase functions deploy delete-account
// (SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
//  automatically by Supabase — no extra secrets needed.)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // The caller must be signed in — identify them from their own JWT so a user
  // can only ever delete THEIR OWN account.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();
  if (authError || !user) return json({ error: 'Unauthorized' }, 401);

  // Service-role client can delete auth users; the cascade removes all data.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: delError } = await admin.auth.admin.deleteUser(user.id);
  if (delError) {
    return json(
      { error: 'Could not delete account', detail: delError.message },
      500,
    );
  }

  return json({ success: true });
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
