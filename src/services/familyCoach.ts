// ============================================================
// Family Coach line — the deterministic, behaviour-aware sentence the
// doc asks for: "You usually enjoy quick Mediterranean meals and active
// family games after school, so we've chosen today's plan based on those."
//
// This is the MVP, non-AI version of the "AI coach voice": it cites ONLY
// real learned values from the PreferenceModel (top cuisine / activity /
// time window) — never fabricated. The proactive, memory-driven agent
// ("repeat last Tuesday's taco night?") remains future work.
// ============================================================

import type { PreferenceModel } from './preferenceEngine';

// "team_sport" / "middle eastern" -> "Team Sport" / "Middle Eastern"
function titleCase(s: string): string {
  return s
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * One warm sentence summarising what the engine has learned about this
 * family. Returns a gentle cold-start line when there isn't enough signal.
 */
export function buildCoachLine(model: PreferenceModel): string {
  if (!model.hasSignal) {
    return "We're still getting to know your family. The more you cook, play and react, the more your plans tune to you.";
  }

  const cuisine = model.topCuisines[0]?.label;
  const activity = model.topActivities[0]?.label;
  const { weekday, weekend } = model.timePatterns;

  const likes: string[] = [];
  if (cuisine) likes.push(`${titleCase(cuisine)} meals`);
  if (activity) likes.push(`${titleCase(activity)} activities`);

  // Prefer the weekday window (most plans are weekday-driven); fall back to weekend.
  const when = weekday ?? weekend;

  if (likes.length && when) {
    return `Your family leans towards ${joinNicely(
      likes,
    )}, and you're most active ${when} — today's plan is built around that.`;
  }
  if (likes.length) {
    return `Your family leans towards ${joinNicely(
      likes,
    )} — we've shaped today's plan around what's worked for you.`;
  }
  if (when) {
    return `You're most active ${when} — we've shaped today's plan around your rhythm.`;
  }
  // hasSignal but nothing nameable yet (e.g. only generic tag signal).
  return "We're learning what works for your family and tuning each plan to match.";
}

function joinNicely(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
