// Supabase Edge Function — delete-account
// Permanently deletes the calling user's account and ALL their data.
//
// The database cascades on delete: auth.users → profiles → children → every
// child/family table (ON DELETE CASCADE). Data the cascade cannot reach — meal
// photos in storage and a few unlinked tables — is purged first (see
// purgeUnlinkedData), then the auth user is deleted. Google Play requires an
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

  // The cascade does not reach everything: storage objects have no foreign
  // key to the user, weekly_focus is keyed by a bare family_code, and the
  // photo/voucher/adventure/reaction tables were created in the dashboard, so
  // their cascade rules are not guaranteed. Remove those explicitly first.
  // Each step is idempotent, so if one fails the account is left in place and
  // the user can simply retry.
  try {
    await purgeUnlinkedData(admin, user.id);
  } catch (e) {
    return json(
      {
        error: 'Could not delete account',
        detail: e instanceof Error ? e.message : String(e),
      },
      500,
    );
  }

  const { error: delError } = await admin.auth.admin.deleteUser(user.id);
  if (delError) {
    return json(
      { error: 'Could not delete account', detail: delError.message },
      500,
    );
  }

  return json({ success: true });
});

type Admin = ReturnType<typeof createClient>;

const PHOTO_BUCKET = 'meal-photos';

async function purgeUnlinkedData(admin: Admin, uid: string): Promise<void> {
  // Meal photos are uploaded to `${parentId}/...` in the meal-photos bucket.
  for (;;) {
    const { data: files, error } = await admin.storage
      .from(PHOTO_BUCKET)
      .list(uid, { limit: 1000 });
    if (error) throw new Error(`list photos: ${error.message}`);
    if (!files || files.length === 0) break;
    const { error: rmError } = await admin.storage
      .from(PHOTO_BUCKET)
      .remove(files.map(f => `${uid}/${f.name}`));
    if (rmError) throw new Error(`remove photos: ${rmError.message}`);
  }

  const { data: adventures, error: advError } = await admin
    .from('family_adventures')
    .select('id')
    .eq('parent_id', uid);
  if (advError) throw new Error(`family_adventures: ${advError.message}`);
  const adventureIds = (adventures ?? []).map(a => a.id);
  if (adventureIds.length > 0) {
    await must(
      'adventure_contributions',
      admin.from('adventure_contributions').delete().in('adventure_id', adventureIds),
    );
  }

  // voucher_wins before photo_submissions in case it references a submission.
  for (const table of [
    'family_adventures',
    'voucher_wins',
    'photo_submissions',
    'mission_reactions',
  ]) {
    await must(table, admin.from(table).delete().eq('parent_id', uid));
  }

  const { data: profile, error: profError } = await admin
    .from('profiles')
    .select('family_code')
    .eq('id', uid)
    .maybeSingle();
  if (profError) throw new Error(`profiles: ${profError.message}`);
  if (profile?.family_code) {
    await must(
      'weekly_focus',
      admin.from('weekly_focus').delete().eq('family_code', profile.family_code),
    );
  }
}

async function must(
  label: string,
  query: PromiseLike<{ error: { message: string } | null }>,
): Promise<void> {
  const { error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
