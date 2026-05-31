// Supabase Edge Function — ai-proxy
// Proxies AI calls to Azure AI Foundry, keeping API keys server-side.
// Deploy:  supabase functions deploy ai-proxy
// Secrets: supabase secrets set DEEPSEEK_AZURE_ENDPOINT=... DEEPSEEK_AZURE_KEY=... GPT41_AZURE_ENDPOINT=... GPT41_AZURE_KEY=...

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

const DEEPSEEK_ENDPOINT = Deno.env.get('DEEPSEEK_AZURE_ENDPOINT')!;
const DEEPSEEK_KEY      = Deno.env.get('DEEPSEEK_AZURE_KEY')!;
const GPT41_ENDPOINT    = Deno.env.get('GPT41_AZURE_ENDPOINT')!;
const GPT41_KEY         = Deno.env.get('GPT41_AZURE_KEY')!;

const DEEPSEEK_MODEL = 'DeepSeek-V3';
const GPT41_MODEL    = 'gpt-4.1';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify caller is an authenticated app user
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // Parse request
  let body: { type: string; prompt: string; maxTokens?: number };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { type, prompt, maxTokens = 300 } = body;

  if (!prompt) {
    return json({ error: 'Missing prompt' }, 400);
  }

  // Route to the right model
  let endpoint: string;
  let apiKey: string;
  let model: string;

  if (type === 'recommendations') {
    endpoint = DEEPSEEK_ENDPOINT;
    apiKey   = DEEPSEEK_KEY;
    model    = DEEPSEEK_MODEL;
  } else if (type === 'digest') {
    endpoint = GPT41_ENDPOINT;
    apiKey   = GPT41_KEY;
    model    = GPT41_MODEL;
  } else {
    return json({ error: 'type must be "recommendations" or "digest"' }, 400);
  }

  if (!endpoint || !apiKey) {
    return json({ error: 'AI service not configured' }, 503);
  }

  // Forward to Azure AI Foundry
  let aiRes: Response;
  try {
    aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    return json({ error: 'AI service unreachable' }, 502);
  }

  if (!aiRes.ok) {
    const detail = await aiRes.text().catch(() => '');
    return json({ error: 'AI service error', detail }, aiRes.status);
  }

  const aiJson = await aiRes.json();
  const text: string | null = aiJson.choices?.[0]?.message?.content ?? null;

  return json({ text });
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
