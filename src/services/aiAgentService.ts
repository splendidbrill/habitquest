import { supabase } from '../lib/supabase';
import catalog, { type AgeGroup } from '../data/missionCatalog';
import type { Recommendation } from './recommendationService';
import type { Pillar } from './syncService';
import { getCurrentFocusPillar } from './pillarScore';

export type ParentDigest = {
  summary: string;
  patterns: string[];
  suggestion: string;
  alerts: string[];
};


// ─── Gather child context from Supabase ──────────────────────────────────────
async function buildContext(childId: string, ageGroup: AgeGroup) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const iso = cutoff.toISOString();

  const [missionsRes, foodRes, moodRes, scoresRes] = await Promise.all([
    supabase
      .from('mission_completions')
      .select('mission_id, mission_title, completed_at')
      .eq('child_id', childId)
      .gte('completed_at', iso)
      .order('completed_at', { ascending: false }),
    supabase
      .from('food_logs')
      .select('food_item, action')
      .eq('child_id', childId)
      .gte('logged_at', iso),
    ageGroup === '10-12'
      ? supabase
          .from('mood_logs')
          .select('mood_level, energy_level')
          .eq('child_id', childId)
          .gte('logged_at', iso)
      : Promise.resolve({ data: [] as { mood_level: number; energy_level: number }[] }),
    supabase
      .from('pillar_scores')
      .select('nutrition_score, movement_score, sleep_score, confidence_score')
      .eq('child_id', childId)
      .order('week_start', { ascending: false })
      .limit(1)
      .single(),
  ]);

  const recentIds = new Set((missionsRes.data ?? []).map(m => m.mission_id));

  const food = foodRes.data ?? [];
  const liked   = [...new Set(food.filter(f => f.action === 'liked' || f.action === 'repeated').map(f => f.food_item))].slice(0, 5);
  const skipped = [...new Set(food.filter(f => f.action === 'skipped').map(f => f.food_item))].slice(0, 5);

  // 10-12: summarise mood as aggregated trend — never expose raw entries to parent
  let moodSummary = '';
  const moods = (moodRes.data ?? []) as { mood_level: number; energy_level: number }[];
  if (moods.length > 0) {
    const avgM = (moods.reduce((s, m) => s + m.mood_level, 0) / moods.length).toFixed(1);
    const avgE = (moods.reduce((s, m) => s + m.energy_level, 0) / moods.length).toFixed(1);
    moodSummary = `avg mood ${avgM}/5, avg energy ${avgE}/5 (${moods.length} check-ins)`;
  }

  const s = scoresRes.data ?? { nutrition_score: 50, movement_score: 50, sleep_score: 50, confidence_score: 50 };
  const pillarMap: Record<Pillar, number> = {
    nutrition: s.nutrition_score, movement: s.movement_score,
    sleep: s.sleep_score, confidence: s.confidence_score,
  };
  const weakPillar = (Object.entries(pillarMap).sort(([, a], [, b]) => a - b)[0][0]) as Pillar;
  const focusPillar = getCurrentFocusPillar(new Date().toISOString().split('T')[0]);

  return {
    recentIds,
    liked,
    skipped,
    moodSummary,
    weakPillar,
    focusPillar,
    pillarMap,
    completedThisWeek: missionsRes.data ?? [],
  };
}

// ─── Call the ai-proxy Edge Function ─────────────────────────────────────────
async function callProxy(
  type: 'recommendations' | 'digest',
  prompt: string,
  maxTokens = 300,
): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: { type, prompt, maxTokens },
  });
  if (error || !data?.text) return null;
  return data.text as string;
}

function parseJSON<T>(text: string): T | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

// ─── AI mission recommendations ───────────────────────────────────────────────
export async function getAIRecommendations(
  childId: string,
  ageGroup: AgeGroup,
): Promise<Recommendation[] | null> {
  if (!DEEPSEEK_AZURE_ENDPOINT || !DEEPSEEK_AZURE_KEY) return null;

  try {
    const ctx = await buildContext(childId, ageGroup);
    const pool = catalog.filter(m => m.ageGroup === ageGroup && !ctx.recentIds.has(m.id));
    if (pool.length < 3) return null;

    const catalogLines = pool
      .map(m => `${m.id}: "${m.title}" [${m.pillar}, ${m.difficulty}, ${m.durationMin}min, tags:${m.tags.join(',')}]`)
      .join('\n');

    const tone = ageGroup === '6-8'
      ? 'fun and simple, max 10 words'
      : ageGroup === '8-10'
      ? 'sporty and motivating, max 12 words'
      : 'relatable, non-preachy, max 12 words';

    const prompt = `You are a personalised health coach for a child aged ${ageGroup}. Pick the 3 best missions. Reasons: ${tone}.

MISSIONS (pick IDs from this list only):
${catalogLines}

PROFILE:
- Focus pillar: ${ctx.focusPillar}
- Weakest pillar: ${ctx.weakPillar}
- Foods they like: ${ctx.liked.join(', ') || 'none yet'}
- Foods they avoid: ${ctx.skipped.join(', ') || 'none yet'}
${ctx.moodSummary ? `- Wellbeing trend: ${ctx.moodSummary}` : ''}

Respond ONLY with JSON (no extra text):
{"picks":[{"id":"...","reason":"..."},{"id":"...","reason":"..."},{"id":"...","reason":"..."}]}`;

    const text = await callProxy('recommendations', prompt, 256);
    if (!text) return null;

    const parsed = parseJSON<{ picks: { id: string; reason: string }[] }>(text);
    if (!Array.isArray(parsed?.picks)) return null;

    const results: Recommendation[] = [];
    for (const pick of parsed.picks.slice(0, 3)) {
      const mission = catalog.find(m => m.id === pick.id);
      if (mission) results.push({ ...mission, score: 100, reason: pick.reason || 'Good for you today' });
    }

    return results.length === 3 ? results : null;
  } catch {
    return null;
  }
}

// ─── Parent weekly digest ─────────────────────────────────────────────────────
export async function getParentDigest(
  childId: string,
  childName: string,
  ageGroup: AgeGroup,
): Promise<ParentDigest | null> {
  if (!GPT41_AZURE_ENDPOINT || !GPT41_AZURE_KEY) return null;

  try {
    const ctx = await buildContext(childId, ageGroup);

    const missionList = ctx.completedThisWeek.map(m => m.mission_title).join(', ') || 'none this week';
    const scores = ctx.pillarMap;
    const pillarsText = `Nutrition:${scores.nutrition} Movement:${scores.movement} Sleep:${scores.sleep} Confidence:${scores.confidence}`;

    const privacyNote = ageGroup === '10-12'
      ? '\nPRIVACY: Describe mood/energy as patterns only (e.g. "lower energy this week"). Never quote specific numbers or raw entries.'
      : '';

    const prompt = `You are a warm family health coach. Write a brief weekly digest for the parent of ${childName} (age ${ageGroup}).

WEEK DATA:
- Missions completed: ${ctx.completedThisWeek.length} (${missionList})
- Foods tried/liked: ${ctx.liked.join(', ') || 'none logged'}
- Foods avoided: ${ctx.skipped.join(', ') || 'none logged'}
- Pillar scores: ${pillarsText}
${ctx.moodSummary ? `- Wellbeing trend: ${ctx.moodSummary}` : ''}
${privacyNote}

Respond ONLY with JSON (no extra text). Max 30 words per field:
{"summary":"...","patterns":["...","..."],"suggestion":"...","alerts":["..."]}

Be warm, specific, constructive. Empty alerts array if no concerns.`;

    const text = await callProxy('digest', prompt, 400);
    if (!text) return null;

    const parsed = parseJSON<{
      summary?: string;
      patterns?: string[];
      suggestion?: string;
      alerts?: string[];
    }>(text);

    if (!parsed?.summary) return null;

    return {
      summary:    parsed.summary,
      patterns:   (parsed.patterns ?? []).slice(0, 3),
      suggestion: parsed.suggestion ?? '',
      alerts:     (parsed.alerts ?? []).filter(Boolean),
    };
  } catch {
    return null;
  }
}
