// ============================================================
// Video analytics flush (Phase 9 follow-up).
//
// The onboarding intro runs BEFORE a parent is authenticated, so its
// retention signal (watched / skipped / percent) is written to AsyncStorage
// at the time. Once the parent reaches the personalised end-card they ARE
// authenticated, so we flush those local values into `video_analytics`
// (one row per parent). Idempotent per parent via a local flushed flag;
// best-effort — never blocks the UI.
// ============================================================

import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';

const FLUSH_KEY = 'videoAnalyticsFlushed';

export async function flushVideoAnalytics(): Promise<void> {
  try {
    if (await storage.getItem(FLUSH_KEY)) return;

    const [watched, skipped, percent] = await Promise.all([
      storage.getItem('videoWatched'),
      storage.getItem('videoSkipped'),
      storage.getItem('videoPercentWatched'),
    ]);

    // Nothing recorded yet (e.g. flow entered without the intro) → no-op.
    if (watched == null && skipped == null && percent == null) return;

    const { data } = await supabase.auth.getUser();
    const parentId = data.user?.id;
    if (!parentId) return; // not authenticated yet; retry next time (flag unset)

    await supabase.from('video_analytics').insert({
      parent_id: parentId,
      watched: watched === 'true',
      skipped: skipped === 'true',
      percent_watched: percent ? parseInt(percent, 10) || 0 : 0,
    });

    await storage.setItem(FLUSH_KEY, 'true');
  } catch {
    // best-effort; AsyncStorage keeps the values and the flag stays unset.
  }
}
