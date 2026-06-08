import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  RefreshCw,
  Apple,
  Footprints,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';
import { loadFamilyProfile, type FamilyProfile } from '../data/familyProfile';
import { useChild } from '../context/ChildContext';
import {
  computePreferenceModel,
  type PreferenceModel,
} from '../services/preferenceEngine';
import { selectMeals } from '../services/mealEngine';
import { buildMealWhy, buildActivityWhy } from '../services/transparency';
import {
  recordMealFeedback,
  recordActivityFeedback,
  type MealReaction,
  type ActivityReaction,
} from '../services/feedbackService';
import { colors, typography, withOpacity } from '../theme';

// Warm, non-judgemental one-tap reactions. "disaster" stays internal —
// the parent only ever sees the 😬 face.
const MEAL_REACTIONS: { value: MealReaction; emoji: string; label: string }[] =
  [
    { value: 'everyone_ate', emoji: '😋', label: 'All ate it' },
    { value: 'most_ate', emoji: '🙂', label: 'Most did' },
    { value: 'mixed', emoji: '😐', label: 'Mixed' },
    { value: 'disaster', emoji: '😬', label: 'Not today' },
  ];

const ACTIVITY_REACTIONS: {
  value: ActivityReaction;
  emoji: string;
  label: string;
}[] = [
  { value: 'loved', emoji: '💚', label: 'Loved it' },
  { value: 'okay', emoji: '🙂', label: 'It was ok' },
  { value: 'not_for_us', emoji: '🤷', label: 'Not for us' },
];

const FEEDBACK_KEY = 'planFeedback';

type DayMeal = {
  name: string;
  reason: string;
  time: string;
  cost: string;
  ingredients: string[];
  leftoverNote?: string;
  why?: string[]; // Phase 7 transparency ("Why am I seeing this?")
  // Phase 7 healthy-swap rationale (AI-provided, optional).
  whyHealthier?: string;
  familyTakeaway?: string;
};

type DayActivity = {
  name: string;
  description: string;
  duration: string;
  pillar: string;
  why?: string[]; // Phase 7 transparency
};

type DayPlan = {
  day: string;
  meal: DayMeal;
  activity: DayActivity;
};

const PILLAR_COLORS: Record<string, string> = {
  movement: '#f97316',
  nutrition: '#22c55e',
  sleep: '#8b5cf6',
  confidence: '#ec4899',
};

const FALLBACK_PLAN: DayPlan[] = [
  {
    day: 'Monday',
    meal: {
      name: 'Quick Veggie Pasta',
      reason: 'Fast, filling, child-friendly',
      time: '15 min',
      cost: '£3-4',
      ingredients: [
        'Pasta',
        'Tinned tomatoes',
        'Courgette',
        'Garlic',
        'Cheese',
      ],
    },
    activity: {
      name: 'Kick Around',
      description: 'Take a ball outside and practice keepy-uppies or shooting',
      duration: '20 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Tuesday',
    meal: {
      name: 'Pasta Bake (using leftovers)',
      reason: "Transforms Monday's pasta into a new meal, saves money",
      time: '20 min',
      cost: '£1-2',
      ingredients: ['Leftover pasta', 'Extra cheese', 'Tinned tomatoes'],
      leftoverNote: 'Uses leftover pasta from Monday',
    },
    activity: {
      name: 'Indoor Dance Challenge',
      description: 'Pick 3 songs and dance together as a family',
      duration: '15 min',
      pillar: 'confidence',
    },
  },
  {
    day: 'Wednesday',
    meal: {
      name: 'Chicken & Rice One-Pot',
      reason: 'High protein, one pan, minimal washing up',
      time: '30 min',
      cost: '£4-6',
      ingredients: ['Chicken thighs', 'Rice', 'Frozen peas', 'Onion', 'Stock'],
    },
    activity: {
      name: 'Park Explorer Mission',
      description:
        'Walk to the park and try to find 5 different things in nature',
      duration: '30 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Thursday',
    meal: {
      name: 'Rice Bowl (leftovers)',
      reason: 'Leftover chicken and rice with a fresh twist',
      time: '10 min',
      cost: '£1',
      ingredients: ['Leftover chicken & rice', 'Cucumber', 'Yogurt', 'Lemon'],
      leftoverNote: 'Uses leftover chicken & rice from Wednesday',
    },
    activity: {
      name: 'Skill Drills',
      description:
        'Practice a sport skill for 5 minutes each: shooting, balancing, jumping',
      duration: '20 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Friday',
    meal: {
      name: 'Homemade Wraps',
      reason: 'Fun to assemble, everyone chooses their own fillings',
      time: '15 min',
      cost: '£3-5',
      ingredients: ['Wraps', 'Chicken', 'Lettuce', 'Cheese', 'Salsa'],
    },
    activity: {
      name: 'Friday Free Play',
      description: 'Let the child choose any active game they want',
      duration: '30 min',
      pillar: 'confidence',
    },
  },
  {
    day: 'Saturday',
    meal: {
      name: 'Cook Together Meal',
      reason: 'Weekend cooking together builds life skills and confidence',
      time: '45 min',
      cost: '£5-8',
      ingredients: [
        'Choose based on what you have',
        'Make it a family project',
      ],
    },
    activity: {
      name: 'Weekend Quest',
      description:
        'Set a family challenge: who can score the most goals, jump the furthest, etc.',
      duration: '45 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Sunday',
    meal: {
      name: 'Big Family Lunch',
      reason: 'Sunday together, prep for the week ahead',
      time: '40 min',
      cost: '£6-10',
      ingredients: ['Family favourite meal', 'Enough for leftovers Monday'],
    },
    activity: {
      name: 'Prep & Chill',
      description:
        'Prep lunches for next week together, then relax as a family',
      duration: '30 min',
      pillar: 'nutrition',
    },
  },
];

function profileToPrompt(p: FamilyProfile): string {
  const parts: string[] = [];
  if (p.cultures.length)
    parts.push(`Cultural background: ${p.cultures.join(', ')}`);
  if (p.foodGroups.length)
    parts.push(`Food groups eaten: ${p.foodGroups.join(', ')}`);
  if (p.prepTime) parts.push(`Meal prep time: ${p.prepTime}`);
  if (p.budget) parts.push(`Weekly food budget: ${p.budget}`);
  if (p.dietary.length)
    parts.push(`Dietary requirements: ${p.dietary.join(', ')}`);
  parts.push(`Child activity level: ${p.activityLevel}`);
  if (p.spaces.length) parts.push(`Activity spaces: ${p.spaces.join(', ')}`);
  if (p.equipment.length)
    parts.push(`Equipment available: ${p.equipment.join(', ')}`);
  if (p.childAge !== null) parts.push(`Child age: ${p.childAge}`);
  if (p.postcode)
    parts.push(
      `Postcode area: ${p.postcode} (suggest local outdoor/park ideas where relevant)`,
    );
  return parts.join('. ');
}

// Phase 7: attach the deterministic "Why am I seeing this?" reasons to each
// day's meal/activity, citing real model + profile values (never fabricated).
function enrichPlanWhy(
  days: DayPlan[],
  model: PreferenceModel,
  profile: FamilyProfile,
): DayPlan[] {
  return days.map(d => ({
    ...d,
    meal: { ...d.meal, why: buildMealWhy(d.meal.name, model, profile) },
    activity: {
      ...d.activity,
      why: buildActivityWhy(
        { name: d.activity.name, pillar: d.activity.pillar },
        model,
        profile,
      ),
    },
  }));
}

export function WeeklyPlan() {
  const { activeChild } = useChild();
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>('Monday');
  const [hasProfile, setHasProfile] = useState(false);
  // One-tap reaction state, keyed `${day}:meal` / `${day}:activity`.
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  // "Why am I seeing this?" expand state, same key scheme.
  const [whyOpen, setWhyOpen] = useState<Record<string, boolean>>({});

  const toggleWhy = (key: string) =>
    setWhyOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const submitMealReaction = async (day: DayPlan, reaction: MealReaction) => {
    const key = `${day.day}:meal`;
    const next = { ...feedback, [key]: reaction };
    setFeedback(next);
    await storage.setItem(FEEDBACK_KEY, JSON.stringify(next));
    await recordMealFeedback(activeChild?.id, day.meal.name, reaction);
  };

  const submitActivityReaction = async (
    day: DayPlan,
    reaction: ActivityReaction,
  ) => {
    const key = `${day.day}:activity`;
    const next = { ...feedback, [key]: reaction };
    setFeedback(next);
    await storage.setItem(FEEDBACK_KEY, JSON.stringify(next));
    await recordActivityFeedback(
      activeChild?.id,
      { name: day.activity.name },
      reaction,
    );
  };

  const loadPlan = useCallback(async () => {
    setLoading(true);

    // Restore any previously tapped reactions for this plan.
    const savedFeedback = await storage.getItem(FEEDBACK_KEY);
    if (savedFeedback) {
      try {
        setFeedback(JSON.parse(savedFeedback));
      } catch {}
    }

    // Try cached plan first
    const cached = await storage.getItem('weeklyPlan');
    const cachedDate = await storage.getItem('weeklyPlanDate');
    const today = new Date().toISOString().split('T')[0];

    if (cached && cachedDate === today) {
      setPlan(JSON.parse(cached));
      setHasProfile(true);
      setLoading(false);
      return;
    }

    await generatePlan();
  }, [activeChild?.id]);

  useFocusEffect(
    useCallback(() => {
      loadPlan();
    }, [loadPlan]),
  );

  const generatePlan = async () => {
    setLoading(true);
    const p = await loadFamilyProfile();
    const profile = p ? profileToPrompt(p) : '';
    setHasProfile(!!profile);

    if (!profile || !p) {
      setPlan(FALLBACK_PLAN);
      setLoading(false);
      return;
    }

    // Phase 5: bias the plan toward the family's preference model using the
    // 70% familiar / 20% adjacent / 10% new meal selection. The model is also
    // reused for Phase 7 transparency below. Falls back to the plain profile
    // prompt when there is no child or no learned signal yet.
    let candidateBlock = '';
    let model: PreferenceModel | null = null;
    const childId = activeChild?.id;
    if (childId) {
      try {
        model = await computePreferenceModel(childId);
        if (model.hasSignal) {
          const picks = selectMeals(model, p, 7);
          if (picks.length) {
            candidateBlock =
              `\n\nPreferred meal options (already balanced 70% familiar / 20% adjacent / 10% new — build the week around these, keeping the leftovers logic):\n` +
              picks
                .map(
                  pk =>
                    `- ${pk.meal.name} (${pk.meal.cuisine}, ${
                      pk.bucket
                    }): ${pk.why.join('; ')}`,
                )
                .join('\n');
          }
        }
      } catch {
        // best-effort personalisation; fall back to the profile-only prompt
      }
    }

    // Phase 7: enrich a parsed plan with deterministic why + AI rationale,
    // then cache. Uses the computed model when available, else an empty one.
    const enrich = (days: DayPlan[]): DayPlan[] =>
      enrichPlanWhy(
        days,
        model ?? {
          cuisineScores: {},
          activityScores: {},
          tagScores: {},
          topCuisines: [],
          topActivities: [],
          timePatterns: { weekday: null, weekend: null, hasTimeSignal: false },
          hasSignal: false,
        },
        p,
      );

    const prompt = `You are a family nutrition and wellbeing coach. Create a personalised 7-day meal and activity plan.

Family profile: ${profile}${candidateBlock}

Rules:
- Tuesday and Thursday dinners should use leftovers from Monday/Wednesday
- Activities framed as play/missions, NOT "exercise" — children should want to do them
- Meals must respect budget, time, dietary requirements, and cultural background
- Keep costs realistic to the stated budget
- Activity pillar: one of movement, nutrition, confidence, sleep
- For each meal also add a short "whyHealthier" (how it beats a typical convenience version) and a "familyTakeaway" (one reusable habit) — keep each under 12 words

Return ONLY valid JSON array with exactly 7 items:
[{"day":"Monday","meal":{"name":"...","reason":"...","time":"X min","cost":"£X-X","ingredients":["..."],"whyHealthier":"...","familyTakeaway":"..."},"activity":{"name":"...","description":"...","duration":"X min","pillar":"movement"}},...]`;

    try {
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: { type: 'recommendations', prompt, maxTokens: 1600 },
      });

      if (!error && data?.text) {
        const match = data.text.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]) as DayPlan[];
          if (Array.isArray(parsed) && parsed.length === 7) {
            const enriched = enrich(parsed);
            setPlan(enriched);
            await storage.setItem('weeklyPlan', JSON.stringify(enriched));
            await storage.setItem(
              'weeklyPlanDate',
              new Date().toISOString().split('T')[0],
            );
            setLoading(false);
            return;
          }
        }
      }
    } catch {}

    setPlan(enrich(FALLBACK_PLAN));
    setLoading(false);
  };

  const handleRefresh = () => {
    Alert.alert(
      'Generate new plan?',
      'This will create a fresh week plan. Your current plan will be replaced.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            await storage.removeItem('weeklyPlan');
            await storage.removeItem('weeklyPlanDate');
            await storage.removeItem(FEEDBACK_KEY);
            setFeedback({});
            generatePlan();
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.loadingText}>Building your family's week...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>This week</Text>
          <Text style={s.subtitle}>
            {hasProfile
              ? 'Personalised for your family'
              : 'Complete onboarding for personalised plans'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={s.refreshBtn}>
          <RefreshCw size={18} color="#f97316" />
        </TouchableOpacity>
      </View>

      {!hasProfile && (
        <View style={s.noProfileBanner}>
          <Text style={s.noProfileText}>
            💡 Complete your family profile in onboarding to get a plan tailored
            to your culture, budget, and schedule.
          </Text>
        </View>
      )}

      {/* Day cards */}
      {plan.map((day, i) => {
        const isExpanded = expanded === day.day;
        const pillarColor =
          PILLAR_COLORS[day.activity?.pillar] ?? colors.primary;
        const isToday =
          new Date().getDay() === (i + 1) % 7 ||
          (i === 6 && new Date().getDay() === 0);

        return (
          <View key={day.day} style={[s.dayCard, isToday && s.dayCardToday]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setExpanded(isExpanded ? null : day.day)}
              style={s.dayHeader}
            >
              <View style={s.dayLeft}>
                <Text style={[s.dayName, isToday && s.dayNameToday]}>
                  {day.day}
                </Text>
                {isToday && <View style={s.todayDot} />}
              </View>
              <View style={s.dayPreview}>
                <View style={s.previewChip}>
                  <Apple size={12} color={colors.primary} />
                  <Text style={s.previewText} numberOfLines={1}>
                    {day.meal?.name}
                  </Text>
                </View>
                <View
                  style={[
                    s.previewChip,
                    { backgroundColor: withOpacity(pillarColor, 0.1) },
                  ]}
                >
                  <Footprints size={12} color={pillarColor} />
                  <Text
                    style={[s.previewText, { color: pillarColor }]}
                    numberOfLines={1}
                  >
                    {day.activity?.name}
                  </Text>
                </View>
              </View>
              {isExpanded ? (
                <ChevronUp size={16} color="#9ca3af" />
              ) : (
                <ChevronDown size={16} color="#9ca3af" />
              )}
            </TouchableOpacity>

            {isExpanded && (
              <View style={s.dayBody}>
                {/* Meal section */}
                <LinearGradient
                  colors={['#f0fdf4', '#dcfce7']}
                  style={s.mealSection}
                >
                  <View style={s.sectionHeader}>
                    <Apple size={16} color="#16a34a" />
                    <Text style={s.sectionTitle}>Dinner</Text>
                    <Text style={s.mealMeta}>
                      ⏱ {day.meal?.time} · {day.meal?.cost}
                    </Text>
                    {day.meal?.why?.length ? (
                      <TouchableOpacity
                        onPress={() => toggleWhy(`${day.day}:meal`)}
                        style={s.whyBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Info size={15} color="#16a34a" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={s.mealName}>{day.meal?.name}</Text>
                  {day.meal?.leftoverNote && (
                    <View style={s.leftoverBadge}>
                      <Text style={s.leftoverText}>
                        ♻️ {day.meal.leftoverNote}
                      </Text>
                    </View>
                  )}
                  <Text style={s.mealReason}>{day.meal?.reason}</Text>
                  {day.meal?.ingredients?.length > 0 && (
                    <Text style={s.ingredients}>
                      {day.meal.ingredients.join(' · ')}
                    </Text>
                  )}

                  {/* One-tap meal reaction — "Did everyone eat it?" */}
                  <Text style={s.reactionPrompt}>How did dinner go?</Text>
                  <View style={s.reactionRow}>
                    {MEAL_REACTIONS.map(r => {
                      const selected = feedback[`${day.day}:meal`] === r.value;
                      return (
                        <TouchableOpacity
                          key={r.value}
                          activeOpacity={0.8}
                          onPress={() => submitMealReaction(day, r.value)}
                          style={[
                            s.reactionChip,
                            selected && s.reactionChipSelected,
                          ]}
                        >
                          <Text style={s.reactionEmoji}>{r.emoji}</Text>
                          <Text
                            style={[
                              s.reactionLabel,
                              selected && s.reactionLabelSelected,
                            ]}
                          >
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* "Why am I seeing this?" — deterministic reasons */}
                  {whyOpen[`${day.day}:meal`] && day.meal?.why?.length ? (
                    <View style={s.whyPanel}>
                      <Text style={s.whyTitle}>Why am I seeing this?</Text>
                      {day.meal.why.map((reason, ri) => (
                        <Text key={ri} style={s.whyItem}>
                          • {reason}
                        </Text>
                      ))}
                    </View>
                  ) : null}

                  {/* Healthy-swap rationale (Phase 7) */}
                  {(day.meal?.whyHealthier || day.meal?.familyTakeaway) && (
                    <View style={s.healthierCard}>
                      <View style={s.healthierHeader}>
                        <Sparkles size={13} color="#15803d" />
                        <Text style={s.healthierTitle}>Healthier choice</Text>
                      </View>
                      {day.meal.whyHealthier ? (
                        <Text style={s.healthierText}>
                          {day.meal.whyHealthier}
                        </Text>
                      ) : null}
                      {day.meal.familyTakeaway ? (
                        <Text style={s.takeawayText}>
                          💡 {day.meal.familyTakeaway}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </LinearGradient>

                {/* Activity section */}
                <LinearGradient
                  colors={[
                    withOpacity(pillarColor, 0.08),
                    withOpacity(pillarColor, 0.15),
                  ]}
                  style={s.activitySection}
                >
                  <View style={s.sectionHeader}>
                    <Zap size={16} color={pillarColor} />
                    <Text style={[s.sectionTitle, { color: pillarColor }]}>
                      Today's Mission
                    </Text>
                    <Text style={[s.mealMeta, { color: pillarColor }]}>
                      ⏱ {day.activity?.duration}
                    </Text>
                    {day.activity?.why?.length ? (
                      <TouchableOpacity
                        onPress={() => toggleWhy(`${day.day}:activity`)}
                        style={s.whyBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Info size={15} color={pillarColor} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={s.activityName}>{day.activity?.name}</Text>
                  <Text style={s.activityDesc}>
                    {day.activity?.description}
                  </Text>

                  {/* One-tap quest reaction — feeds the activity engine */}
                  <Text style={[s.reactionPrompt, { color: pillarColor }]}>
                    Did they enjoy it?
                  </Text>
                  <View style={s.reactionRow}>
                    {ACTIVITY_REACTIONS.map(r => {
                      const selected =
                        feedback[`${day.day}:activity`] === r.value;
                      return (
                        <TouchableOpacity
                          key={r.value}
                          activeOpacity={0.8}
                          onPress={() => submitActivityReaction(day, r.value)}
                          style={[
                            s.reactionChip,
                            selected && {
                              borderColor: pillarColor,
                              backgroundColor: withOpacity(pillarColor, 0.12),
                            },
                          ]}
                        >
                          <Text style={s.reactionEmoji}>{r.emoji}</Text>
                          <Text
                            style={[
                              s.reactionLabel,
                              selected && {
                                color: pillarColor,
                                fontWeight: '700',
                              },
                            ]}
                          >
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* "Why am I seeing this?" — deterministic reasons */}
                  {whyOpen[`${day.day}:activity`] &&
                  day.activity?.why?.length ? (
                    <View
                      style={[
                        s.whyPanel,
                        { backgroundColor: withOpacity(pillarColor, 0.08) },
                      ]}
                    >
                      <Text style={[s.whyTitle, { color: pillarColor }]}>
                        Why am I seeing this?
                      </Text>
                      {day.activity.why.map((reason, ri) => (
                        <Text key={ri} style={s.whyItem}>
                          • {reason}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </LinearGradient>
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: { fontSize: 15, color: colors.mutedForeground },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    marginTop: 4,
  },

  noProfileBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  noProfileText: { fontSize: 13, color: '#92400e', lineHeight: 19 },

  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  dayCardToday: { borderWidth: 2, borderColor: colors.primary },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  dayLeft: { alignItems: 'center', width: 80, gap: 4 },
  dayName: { fontSize: 15, fontWeight: '700', color: '#374151' },
  dayNameToday: { color: colors.primary },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  dayPreview: { flex: 1, gap: 4 },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: withOpacity(colors.primary, 0.08),
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },

  dayBody: { gap: 1 },
  mealSection: { padding: 16 },
  activitySection: { padding: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flex: 1,
  },
  mealMeta: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  mealName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  leftoverBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  leftoverText: { fontSize: 12, color: '#15803d', fontWeight: '600' },
  mealReason: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
    marginBottom: 6,
  },
  ingredients: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  activityName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  activityDesc: { fontSize: 13, color: '#4b5563', lineHeight: 19 },

  reactionPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 12,
    marginBottom: 8,
  },
  reactionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reactionChipSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  reactionEmoji: { fontSize: 15 },
  reactionLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  reactionLabelSelected: { color: '#15803d', fontWeight: '700' },

  whyBtn: { padding: 2, marginLeft: 4 },
  whyPanel: {
    marginTop: 12,
    backgroundColor: 'rgba(22,163,74,0.08)',
    borderRadius: 12,
    padding: 12,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
    marginBottom: 6,
  },
  whyItem: { fontSize: 12, color: '#374151', lineHeight: 18 },

  healthierCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  healthierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  healthierTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  healthierText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  takeawayText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 17,
  },
});
