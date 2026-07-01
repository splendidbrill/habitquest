// ============================================================
// Kids Exercise Explainer (6–8 & 8–10) — "Your move for the day"
//
// Turns today's family activity (the SAME activity the parent sees on the
// Weekly Plan) into a fun, exciting, kid-friendly reason to get moving.
// AI-driven via the ai-proxy edge function, with a warm local fallback so it
// always shows something even if the AI is unreachable.
//
// Cached per activity-name + age band + week so we call the AI at most once
// per activity per week.
// ============================================================

import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';
import type { DayActivity } from './weeklyPlanStore';
import type { KidsAgeBand } from './kidsMealExplainer';

export type KidsExerciseExplanation = {
  /** One punchy, exciting opener that makes them want to move. */
  hook: string;
  /** 2–3 fun "superpowers" this activity gives them. */
  superpowers: string[];
  /** A single wow / did-you-know fact about moving your body. */
  funFact: string;
  /** A short cheer that gets them off the sofa. */
  cheer: string;
};

const CACHE_PREFIX = 'kidsExerciseExplain:';

/** Week bucket so the explanation refreshes weekly, matching the plan cadence. */
function weekKey(d = new Date()): string {
  const days = Math.floor(d.getTime() / 86_400_000);
  return String(Math.floor(days / 7));
}

function cacheKey(name: string, ageBand: KidsAgeBand): string {
  const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${CACHE_PREFIX}${ageBand}:${weekKey()}:${safe}`;
}

function parseJSON<T>(text: string): T | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

// ─── Local fallback ───────────────────────────────────────────────────────────
function localExplanation(
  activity: DayActivity,
  ageBand: KidsAgeBand,
): KidsExerciseExplanation {
  return {
    hook: `Today's move: ${activity.name}! ${ageBand === '8-10' ? '🔥' : '🎉'}`,
    superpowers: [
      'Makes your heart big and strong ❤️',
      'Gives you loads of energy ⚡',
      'Puts a giant smile on your face 😄',
    ],
    funFact:
      'Did you know? Moving your body helps your brain think faster and feel happier!',
    cheer:
      ageBand === '8-10'
        ? "Let's go, champion — you've got this! 💪"
        : 'Ready, set, GO have fun! 🚀',
  };
}

// ─── AI call ──────────────────────────────────────────────────────────────────
// Reuses the existing 'digest' route (GPT-4.1) — best for warm, creative,
// kid-safe copy — so no edge-function redeploy is needed.
async function callAI(
  activity: DayActivity,
  ageBand: KidsAgeBand,
): Promise<KidsExerciseExplanation | null> {
  const audience =
    ageBand === '8-10'
      ? 'an 8-10 year old young athlete — be sporty, energetic and cool'
      : 'a 6-8 year old child — be playful, warm and simple';
  const prompt = `You are a fun, kind movement buddy talking to ${audience} about today's activity. Make it sound exciting and explain simply why moving is awesome and good for them. Use simple words and add emojis. Frame it as PLAY and fun — NEVER mention calories, weight, losing weight, diets or scary health words.

TODAY'S ACTIVITY: ${activity.name}
WHAT TO DO: ${activity.description}

Respond ONLY with JSON (no extra text):
{"hook":"one exciting sentence, max 12 words","superpowers":["short power 1","short power 2","short power 3"],"funFact":"one cool did-you-know fact, max 20 words","cheer":"one encouraging cheer, max 12 words"}`;

  try {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: { type: 'digest', prompt, maxTokens: 300 },
    });
    if (error || !data?.text) return null;

    const parsed = parseJSON<KidsExerciseExplanation>(data.text as string);
    if (!parsed?.hook || !Array.isArray(parsed.superpowers)) return null;

    return {
      hook: parsed.hook,
      superpowers: parsed.superpowers.filter(Boolean).slice(0, 3),
      funFact: parsed.funFact ?? '',
      cheer: parsed.cheer ?? '',
    };
  } catch {
    return null;
  }
}

/**
 * Kid-friendly explanation for today's activity. Returns cached content when
 * available, otherwise asks the AI (once per activity per week) and caches the
 * result. Always resolves — falls back to a warm local explanation.
 */
export async function getKidsExerciseExplanation(
  activity: DayActivity,
  ageBand: KidsAgeBand = '6-8',
): Promise<KidsExerciseExplanation> {
  const key = cacheKey(activity.name, ageBand);

  try {
    const cached = await storage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as KidsExerciseExplanation;
      if (parsed?.hook) return parsed;
    }
  } catch {}

  const ai = await callAI(activity, ageBand);
  const result = ai ?? localExplanation(activity, ageBand);

  // Only cache real AI results so a temporary outage doesn't lock in the
  // fallback for the whole week.
  if (ai) {
    try {
      await storage.setItem(key, JSON.stringify(result));
    } catch {}
  }

  return result;
}
