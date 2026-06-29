// ============================================================
// Plan Enhancer — the OPTIONAL AI layer on top of the deterministic plan.
//
// The deterministic builder (localPlanBuilder.ts) is the foundation: it always
// produces a correct, personalised, safety-filtered week from the spreadsheets.
// This module is pure polish on top — when the AI (Supabase ai-proxy → Azure)
// is reachable, it:
//   1. RE-ARRANGES the already-chosen meals across the week for smarter
//      leftover pairing (e.g. a big-batch dinner before its leftover day),
//   2. RE-PHRASES each meal's short "reason" to be warmer and family-specific,
//   3. adds a "leftoverNote" where a day realistically reuses an earlier meal.
//
// HARD GUARANTEES (safety):
//   - It can NEVER introduce, remove or rename a meal — the returned days must
//     be an exact permutation of the deterministic meal set, or the whole AI
//     result is discarded. This keeps the dietary/allergy filtering and the
//     real recipes intact.
//   - Activities are left exactly as the deterministic builder set them.
//   - Any error/timeout/invalid response → returns null → caller keeps the
//     deterministic plan. The AI is never load-bearing.
// ============================================================

import { supabase } from '../lib/supabase';
import type { FamilyProfile } from '../data/familyProfile';
import type { DayPlan } from './weeklyPlanStore';

// Give up on the background upgrade if the AI is slow — the user already has a
// fully working plan on screen, so we never want to hang on this.
const AI_TIMEOUT_MS = 12_000;

type AIDay = {
  day?: string;
  meal?: string;
  mealReason?: string;
  leftoverNote?: string;
};

function profileSummary(p: FamilyProfile): string {
  const parts: string[] = [];
  if (p.cultures?.length) parts.push(`cultures: ${p.cultures.join(', ')}`);
  if (p.dietary?.length) parts.push(`dietary: ${p.dietary.join(', ')}`);
  if (p.prepTime) parts.push(`prep time: ${p.prepTime}`);
  if (p.budget) parts.push(`budget: ${p.budget}`);
  if (p.childAge != null) parts.push(`child age: ${p.childAge}`);
  return parts.join('; ') || 'no specific preferences given';
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('ai-timeout')), ms),
    ),
  ]);
}

/**
 * Try to improve a deterministic plan with the AI. Returns an improved plan
 * (same meals, re-arranged + re-worded) or null if the AI is unavailable or
 * returns anything we can't safely trust.
 */
export async function enhancePlanWithAI(
  base: DayPlan[],
  profile: FamilyProfile,
): Promise<DayPlan[] | null> {
  try {
    const mealNames = base.map(d => d.meal.name);

    const planLines = base
      .map(d => `${d.day} — "${d.meal.name}" (${d.meal.time})`)
      .join('\n');

    const prompt = `You are a warm UK family meal planner. Below is a fixed set of 7 dinners already chosen for a family. Your ONLY job is to (a) decide the best day-order for these EXACT meals so leftovers flow naturally (a meal that makes leftovers should come the day before a lighter day), (b) write a short, warm "reason" for each, and (c) add a "leftoverNote" only where a day genuinely reuses an earlier day's meal.

STRICT RULES:
- Use ONLY these exact meal names, each exactly once. Do NOT invent, rename, remove or add any meal.
- Keep each "reason" under 12 words. Leave "leftoverNote" as "" when it doesn't apply.

Family: ${profileSummary(profile)}

Meals (keep these names verbatim):
${planLines}

Return ONLY JSON, no prose:
{"days":[{"day":"Monday","meal":"<one of the exact names>","mealReason":"...","leftoverNote":""}, ... 7 items]}`;

    const { data, error } = await withTimeout(
      supabase.functions.invoke('ai-proxy', {
        body: { type: 'recommendations', prompt, maxTokens: 900 },
      }),
      AI_TIMEOUT_MS,
    );

    if (error || !data?.text) return null;

    const match = String(data.text).match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]) as { days?: AIDay[] };
    const days = parsed.days;
    if (!Array.isArray(days) || days.length !== base.length) return null;

    // SAFETY: the AI's meals must be an exact permutation of the chosen set —
    // otherwise it changed the menu, so we discard the whole result.
    const wantSorted = [...mealNames].sort();
    const gotSorted = days.map(d => (d.meal ?? '').trim()).sort();
    const isPermutation =
      gotSorted.length === wantSorted.length &&
      wantSorted.every((n, i) => n === gotSorted[i]);
    if (!isPermutation) return null;

    const mealByName = new Map(base.map(d => [d.meal.name, d.meal]));

    return base.map((d, i): DayPlan => {
      const ai = days[i];
      const meal = mealByName.get((ai.meal ?? '').trim());
      if (!meal) return d; // defensive — permutation check already guarantees it
      return {
        ...d, // keep this day's deterministic activity untouched
        meal: {
          ...meal,
          reason: ai.mealReason?.trim() || meal.reason,
          leftoverNote: ai.leftoverNote?.trim() || meal.leftoverNote,
        },
      };
    });
  } catch {
    return null;
  }
}
