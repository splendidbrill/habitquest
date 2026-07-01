// ============================================================
// Kids Meal Explainer (6–8) — "Your food for the day"
//
// Turns today's family meal (the SAME meal the parent sees on the Weekly Plan)
// into a fun, exciting, kid-friendly explanation of why the food is cool and
// why it matters. AI-driven via the ai-proxy edge function, with a warm local
// fallback so it always shows something even if the AI is unreachable.
//
// Cached per meal-name + week so we call the AI at most once per meal per week.
// ============================================================

import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';
import type { DayMeal } from './weeklyPlanStore';

/** Which child interface is asking — tunes the tone (and cache bucket). */
export type KidsAgeBand = '6-8' | '8-10';

export type KidsMealExplanation = {
  /** One punchy, exciting opener a 6-year-old would love. */
  hook: string;
  /** 2–3 fun "superpowers" this meal gives them. */
  superpowers: string[];
  /** A single wow / did-you-know fact about the food. */
  funFact: string;
  /** A short cheer that makes them want to eat it. */
  cheer: string;
};

const CACHE_PREFIX = 'kidsMealExplain:';

/** Week bucket so the explanation refreshes weekly, matching the plan cadence. */
function weekKey(d = new Date()): string {
  const days = Math.floor(d.getTime() / 86_400_000);
  return String(Math.floor(days / 7));
}

function cacheKey(mealName: string, ageBand: KidsAgeBand): string {
  const safe = mealName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
// Deterministic, cheerful explanation built from the meal's own fields so the
// section is never empty even with no network / AI.
function localExplanation(meal: DayMeal): KidsMealExplanation {
  const first = (meal.ingredients ?? [])[0] ?? 'yummy food';
  return {
    hook: `Guess what's for dinner? ${meal.name}! 🎉`,
    superpowers: [
      'Gives you energy to run, jump and play 🏃',
      'Helps you grow big and strong 💪',
      'Keeps your tummy happy 😋',
    ],
    funFact: `Did you know? ${first} helps your body do amazing things every single day!`,
    cheer: 'Take a big bite and feel your superpowers grow! ⭐',
  };
}

// ─── AI call ──────────────────────────────────────────────────────────────────
// Reuses the existing 'digest' route (GPT-4.1) — best for warm, creative,
// kid-safe copy — so no edge-function redeploy is needed. Prompt does the work.
async function callAI(
  meal: DayMeal,
  ageBand: KidsAgeBand,
): Promise<KidsMealExplanation | null> {
  const ingredients = (meal.ingredients ?? []).join(', ') || 'a tasty mix';
  const audience =
    ageBand === '8-10'
      ? 'an 8-10 year old young athlete — be sporty, energetic and cool (call the food "fuel")'
      : 'a 6-8 year old child — be playful, warm and simple';
  const prompt = `You are a fun, kind food buddy talking to ${audience} about tonight's dinner. Make the food sound exciting and explain simply why it is good for them. Use simple words and add emojis. NEVER mention calories, weight, diets or scary health words.

TONIGHT'S MEAL: ${meal.name}
MADE WITH: ${ingredients}

Respond ONLY with JSON (no extra text):
{"hook":"one exciting sentence, max 12 words","superpowers":["short power 1","short power 2","short power 3"],"funFact":"one cool did-you-know fact, max 20 words","cheer":"one encouraging cheer, max 12 words"}`;

  try {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: { type: 'digest', prompt, maxTokens: 300 },
    });
    if (error || !data?.text) return null;

    const parsed = parseJSON<KidsMealExplanation>(data.text as string);
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
 * Kid-friendly explanation for today's meal. Returns cached content when
 * available, otherwise asks the AI (once per meal per week) and caches the
 * result. Always resolves — falls back to a warm local explanation.
 */
export async function getKidsMealExplanation(
  meal: DayMeal,
  ageBand: KidsAgeBand = '6-8',
): Promise<KidsMealExplanation> {
  const key = cacheKey(meal.name, ageBand);

  try {
    const cached = await storage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as KidsMealExplanation;
      if (parsed?.hook) return parsed;
    }
  } catch {}

  const ai = await callAI(meal, ageBand);
  const result = ai ?? localExplanation(meal);

  // Only cache real AI results so a temporary outage doesn't lock in the
  // fallback for the whole week.
  if (ai) {
    try {
      await storage.setItem(key, JSON.stringify(result));
    } catch {}
  }

  return result;
}
