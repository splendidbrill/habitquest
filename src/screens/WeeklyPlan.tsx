import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
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
  Heart,
  ChevronRight,
} from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { storage } from '../utils/storage';
import { loadFamilyProfile, type FamilyProfile } from '../data/familyProfile';
import { useChild } from '../context/ChildContext';
import {
  computePreferenceModel,
  type PreferenceModel,
} from '../services/preferenceEngine';
import {
  buildLocalPlan,
  emptyPreferenceModel,
} from '../services/localPlanBuilder';
import { enhancePlanWithAI } from '../services/planEnhancer';
import { pushAppState } from '../services/appStateSync';
import { buildMealWhy, buildActivityWhy } from '../services/transparency';
import {
  recordMealFeedback,
  recordActivityFeedback,
  type MealReaction,
  type ActivityReaction,
} from '../services/feedbackService';
import {
  type DayPlan,
  FALLBACK_PLAN,
  todayName,
} from '../services/weeklyPlanStore';
import {
  getHealthierInfo,
  getRecipe,
  NUTRITION_PILLARS,
  NUTRITION_DOT,
} from '../services/healthierMeal';
import {
  movementQuests,
  MOVEMENT_INSPIRATION,
  ageToBand,
  type MovementQuest,
} from '../data/movementQuests';
import { colors, typography, withOpacity } from '../theme';

// Warm, non-judgemental one-tap reactions. "disaster" stays internal —
// the parent only ever sees the 😬 face.
const MEAL_REACTIONS: { value: MealReaction; emoji: string; label: string }[] =
  [
    { value: 'everyone_ate', emoji: '😋', label: 'Ate it all' },
    { value: 'most_ate', emoji: '🙂', label: 'Ate most' },
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

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Surfaced here too (mirrors the Parent tab's "Support & Guidance" section) so
// the help pages aren't buried two screens deep.
const SUPPORT_LINKS: { label: string; screen: keyof RootStackParamList }[] = [
  { label: 'Handling resistance to new foods', screen: 'HandlingResistance' },
  { label: 'Supportive responses guide', screen: 'SupportiveResponses' },
  { label: 'Difficult behaviour tips', screen: 'DifficultBehaviors' },
];

const PILLAR_COLORS: Record<string, string> = {
  movement: '#f97316',
  nutrition: '#22c55e',
  sleep: '#8b5cf6',
  confidence: '#ec4899',
};

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
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>('Monday');
  const [hasProfile, setHasProfile] = useState(false);
  // Canonical profile kept in state to personalise the daily Movement Quest.
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(
    null,
  );
  // "Want extra inspiration?" links toggle.
  const [inspoOpen, setInspoOpen] = useState(false);
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  // One-tap reaction state, keyed `${day}:meal` / `${day}:activity`.
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  // "Why am I seeing this?" expand state, same key scheme.
  const [whyOpen, setWhyOpen] = useState<Record<string, boolean>>({});
  // Portion-guide expand state, keyed by day name.
  const [portionsOpen, setPortionsOpen] = useState<Record<string, boolean>>({});
  // "View recipe" expand state, keyed by day name.
  const [recipeOpen, setRecipeOpen] = useState<Record<string, boolean>>({});
  // True once the optional AI layer has fine-tuned the deterministic plan.
  const [aiEnhanced, setAiEnhanced] = useState(false);

  // Guards the background AI upgrade against setting state after unmount.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const toggleWhy = (key: string) =>
    setWhyOpen(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePortions = (day: string) =>
    setPortionsOpen(prev => ({ ...prev, [day]: !prev[day] }));
  const toggleRecipe = (day: string) =>
    setRecipeOpen(prev => ({ ...prev, [day]: !prev[day] }));

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

    // Keep the canonical profile in state so the Movement Quest personalises
    // even when we short-circuit on the cached plan below.
    setFamilyProfile(await loadFamilyProfile());

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
    setHasProfile(!!p);

    if (!p) {
      // No onboarding profile yet — show the generic sample week (the
      // "complete your profile" banner is rendered above).
      setPlan(FALLBACK_PLAN);
      setLoading(false);
      return;
    }

    // Personalise from the family's preference model when a child has signal;
    // otherwise an empty model (buildLocalPlan seeds it from onboarding
    // cultures so the first plan still reflects what they told us).
    let model = emptyPreferenceModel();
    const childId = activeChild?.id;
    if (childId) {
      try {
        model = await computePreferenceModel(childId);
      } catch {
        // best-effort; fall back to the empty model
      }
    }

    // Deterministic, offline, sheet-driven plan — no network dependency, so it
    // is always personalised and always resolves to real recipes (previously
    // this relied on the Supabase `ai-proxy` call and fell back to a generic
    // week whenever that was unreachable). The day-based seed rotates the picks
    // each day so "Generate new plan" produces a fresh week.
    const weekSeed = Math.floor(Date.now() / 86_400_000);
    const base = buildLocalPlan(p, model, weekSeed);
    const enriched = enrichPlanWhy(base, model, p);
    setAiEnhanced(false);
    setPlan(enriched);
    await storage.setItem('weeklyPlan', JSON.stringify(enriched));
    await storage.setItem(
      'weeklyPlanDate',
      new Date().toISOString().split('T')[0],
    );
    // Mirror the new plan so a returning user keeps it across devices/reinstall.
    void pushAppState();
    setLoading(false);

    // Optional AI upgrade — runs AFTER the working plan is already on screen.
    // It can only re-order + re-word the same meals (see planEnhancer.ts); any
    // failure leaves the deterministic plan exactly as-is. Never awaited so the
    // UI is never blocked on the network.
    void enhancePlanWithAI(base, p)
      .then(improved => {
        if (!improved || !mountedRef.current) return;
        const upgraded = enrichPlanWhy(improved, model, p);
        setPlan(upgraded);
        setAiEnhanced(true);
        void storage
          .setItem('weeklyPlan', JSON.stringify(upgraded))
          .then(() => pushAppState());
      })
      .catch(() => {
        /* keep the deterministic plan */
      });
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

  // Today's mission = today's plan activity (SAME name the Home tab shows). The
  // plan activity is built from a Movement Quest (localPlanBuilder), so we can
  // look the full quest back up by title to surface real how-to guidance.
  const todaysActivity =
    plan.find(d => d.day === todayName())?.activity ?? plan[0]?.activity;
  const band = activeChild?.age_group ?? ageToBand(familyProfile?.childAge);
  const todaysQuest: MovementQuest | undefined = todaysActivity
    ? movementQuests.find(q => q.title === todaysActivity.name)
    : undefined;
  const coachTip =
    todaysQuest?.coachingTips?.[
      band === '6-8' ? 'age6to8' : band === '10-12' ? 'age10to12' : 'age8to10'
    ];

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
            {!hasProfile
              ? 'Complete onboarding for personalised plans'
              : aiEnhanced
              ? '✨ Fine-tuned for your family'
              : 'Personalised for your family'}
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

      {/* Today's Mission — tap for step-by-step guidance on how to do it.
          Same activity the Home tab shows (single source of truth). */}
      {todaysActivity ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setMissionModalOpen(true)}
          style={s.questCard}
        >
          <View style={s.questHeader}>
            <Text style={s.questEmoji}>{todaysQuest?.emoji ?? '🏃'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.questKicker}>TODAY'S MISSION</Text>
              <Text style={s.questTitle}>{todaysActivity.name}</Text>
            </View>
            <ChevronRight size={20} color="#f97316" />
          </View>

          <View style={s.questThemeRow}>
            {todaysActivity.duration ? (
              <Text style={s.questThemePill}>⏱ {todaysActivity.duration}</Text>
            ) : null}
            {todaysQuest ? (
              <Text style={s.questThemePill}>+{todaysQuest.xp} XP</Text>
            ) : null}
          </View>

          <Text style={s.questChallenge} numberOfLines={2}>
            {todaysQuest?.challenge ?? todaysActivity.description}
          </Text>

          <View style={s.missionCta}>
            <Text style={s.missionCtaText}>Tap for how to do it →</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {/* How-to guidance modal for today's mission */}
      <Modal
        visible={missionModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMissionModalOpen(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.modalHeaderRow}>
              <Text style={s.modalEmoji}>{todaysQuest?.emoji ?? '🏃'}</Text>
              <Text style={s.modalTitle} numberOfLines={2}>
                {todaysActivity?.name}
              </Text>
              <TouchableOpacity
                onPress={() => setMissionModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {/* Quick facts */}
              <View style={s.questThemeRow}>
                {todaysActivity?.duration ? (
                  <Text style={s.questThemePill}>
                    ⏱ {todaysActivity.duration}
                  </Text>
                ) : null}
                {todaysQuest?.equipment ? (
                  <Text style={s.questThemePill}>
                    🎒 {todaysQuest.equipment}
                  </Text>
                ) : null}
              </View>

              {/* What to do */}
              <Text style={s.guideLabel}>What to do</Text>
              <Text style={s.guideText}>
                {todaysQuest?.challenge ?? todaysActivity?.description}
              </Text>

              {/* Step-by-step how-to */}
              {todaysQuest?.warmUp ? (
                <>
                  <Text style={s.guideLabel}>1 · Warm up</Text>
                  <Text style={s.guideText}>{todaysQuest.warmUp}</Text>
                </>
              ) : null}
              {todaysQuest?.mainDrill ? (
                <>
                  <Text style={s.guideLabel}>
                    {todaysQuest.warmUp ? '2 · Main activity' : 'How to do it'}
                  </Text>
                  <Text style={s.guideText}>{todaysQuest.mainDrill}</Text>
                </>
              ) : null}
              {todaysQuest?.coolDown ? (
                <>
                  <Text style={s.guideLabel}>3 · Cool down</Text>
                  <Text style={s.guideText}>{todaysQuest.coolDown}</Text>
                </>
              ) : null}

              {/* Coaching tip for this age */}
              {coachTip ? (
                <View style={s.guideTipBox}>
                  <Text style={s.guideTipTitle}>💡 Coaching tip</Text>
                  <Text style={s.guideTipText}>{coachTip}</Text>
                </View>
              ) : null}

              {/* Safety */}
              {todaysQuest?.safety ? (
                <View style={s.guideSafetyBox}>
                  <Text style={s.guideTipTitle}>🛟 Keep it safe</Text>
                  <Text style={s.guideTipText}>{todaysQuest.safety}</Text>
                </View>
              ) : null}

              {/* Why it matters */}
              {(todaysQuest?.whyMatters || todaysActivity?.description) && (
                <>
                  <Text style={s.guideLabel}>Why it matters</Text>
                  <Text style={s.guideText}>
                    {todaysQuest?.whyMatters ?? todaysActivity?.description}
                  </Text>
                </>
              )}

              {/* Extra inspiration links */}
              <Text style={s.guideLabel}>Want extra inspiration?</Text>
              {MOVEMENT_INSPIRATION.map(link => (
                <TouchableOpacity
                  key={link.url}
                  onPress={() => Linking.openURL(link.url)}
                  style={s.inspoLink}
                >
                  <Text style={s.inspoLinkText}>↗ {link.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={s.modalDoneBtn}
              onPress={() => setMissionModalOpen(false)}
            >
              <Text style={s.modalDoneText}>Got it 👍</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Day cards */}
      {plan.map((day, i) => {
        const isExpanded = expanded === day.day;
        const pillarColor =
          PILLAR_COLORS[day.activity?.pillar] ?? colors.primary;
        // Match "today" by weekday name — the SAME rule getTodaysPlan() uses on
        // the Home tab — so both tabs land on the same day (index-based matching
        // drifted when the plan wasn't Monday-first).
        const isToday = day.day === todayName();
        // Deterministic, static healthier-meal content (Phase C.1).
        const healthier = getHealthierInfo({
          name: day.meal?.name ?? '',
          ingredients: day.meal?.ingredients,
        });
        // Real recipe (ingredients + method + age servings) when the planned
        // meal resolves to one of the 100 spreadsheet meals.
        const recipe = getRecipe(day.meal?.name ?? '');
        const showPortions = portionsOpen[day.day];
        const showRecipe = recipeOpen[day.day];

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
                    <Text style={s.mealMeta}>⏱ {day.meal?.time}</Text>
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

                  {/* Healthier-meal details (Phase C.1) */}
                  <View style={s.healthierCard}>
                    <View style={s.healthierHeader}>
                      <Sparkles size={13} color="#15803d" />
                      <Text style={s.healthierTitle}>
                        How to make this meal healthier
                      </Text>
                    </View>

                    {/* Why this version is healthier (AI line preferred, else static) */}
                    <Text style={s.healthierText}>
                      {day.meal?.whyHealthier || healthier.whyHealthier}
                    </Text>

                    {/* Nutrition snapshot — icons only, no calories */}
                    <View style={s.nutritionRow}>
                      {NUTRITION_PILLARS.map(p => (
                        <View key={p.key} style={s.nutritionChip}>
                          <Text style={s.nutritionDot}>
                            {NUTRITION_DOT[healthier.nutrition[p.key]]}
                          </Text>
                          <Text style={s.nutritionLabel}>
                            {p.icon} {p.label}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Small Wins */}
                    <Text style={s.smallWinsTitle}>✨ Small wins</Text>
                    {healthier.smallWins.map((w, wi) => (
                      <Text key={wi} style={s.smallWinItem}>
                        • {w}
                      </Text>
                    ))}

                    {day.meal?.familyTakeaway ? (
                      <Text style={s.takeawayText}>
                        💡 {day.meal.familyTakeaway}
                      </Text>
                    ) : null}

                    {/* Age-adjusted, hand-based portion guide (collapsible) */}
                    <TouchableOpacity
                      onPress={() => togglePortions(day.day)}
                      style={s.portionToggle}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={s.portionToggleText}>
                        🖐 Portion guide (by age)
                      </Text>
                      {showPortions ? (
                        <ChevronUp size={14} color="#15803d" />
                      ) : (
                        <ChevronDown size={14} color="#15803d" />
                      )}
                    </TouchableOpacity>

                    {showPortions && (
                      <View style={s.portionTable}>
                        <View style={s.portionHeaderRow}>
                          <Text
                            style={[
                              s.portionCell,
                              s.portionLabelCell,
                              s.portionHeadText,
                            ]}
                          >
                            {' '}
                          </Text>
                          <Text style={[s.portionCell, s.portionHeadText]}>
                            Adult
                          </Text>
                          <Text style={[s.portionCell, s.portionHeadText]}>
                            6–8
                          </Text>
                          <Text style={[s.portionCell, s.portionHeadText]}>
                            8–10
                          </Text>
                          <Text style={[s.portionCell, s.portionHeadText]}>
                            10–12
                          </Text>
                        </View>
                        {healthier.portions.map((row, ri) => (
                          <View key={ri} style={s.portionRow}>
                            <Text style={[s.portionCell, s.portionLabelCell]}>
                              {row.icon} {row.label}
                            </Text>
                            <Text style={s.portionCell}>{row.adult}</Text>
                            <Text style={s.portionCell}>{row.age6to8}</Text>
                            <Text style={s.portionCell}>{row.age8to10}</Text>
                            <Text style={s.portionCell}>{row.age10to12}</Text>
                          </View>
                        ))}
                        <Text style={s.portionNote}>
                          Tip: measure with your child’s own hand — it scales
                          the portion to their size.
                        </Text>
                      </View>
                    )}

                    {/* Full recipe — real ingredients + method (DB meals only) */}
                    {recipe && (
                      <>
                        <TouchableOpacity
                          onPress={() => toggleRecipe(day.day)}
                          style={s.portionToggle}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Text style={s.portionToggleText}>
                            🍳 View recipe
                            {recipe.cookTimeMin
                              ? `  ·  ${recipe.cookTimeMin} min`
                              : ''}
                          </Text>
                          {showRecipe ? (
                            <ChevronUp size={14} color="#15803d" />
                          ) : (
                            <ChevronDown size={14} color="#15803d" />
                          )}
                        </TouchableOpacity>

                        {showRecipe && (
                          <View style={s.recipeBody}>
                            <Text style={s.recipeHeading}>Ingredients</Text>
                            {recipe.ingredients.map((ing, ii) => (
                              <Text key={ii} style={s.recipeIngredient}>
                                • {ing}
                              </Text>
                            ))}

                            <Text style={s.recipeHeading}>Method</Text>
                            {recipe.method.map((step, si) => (
                              <Text key={si} style={s.recipeStep}>
                                {si + 1}. {step}
                              </Text>
                            ))}

                            <Text style={s.recipeHeading}>Serving by age</Text>
                            <Text style={s.recipeServe}>
                              🧒 6–8: {recipe.servings.age6to8}
                            </Text>
                            <Text style={s.recipeServe}>
                              🧒 8–10: {recipe.servings.age8to10}
                            </Text>
                            <Text style={s.recipeServe}>
                              🧒 10–12: {recipe.servings.age10to12}
                            </Text>
                            <Text style={s.recipeServe}>
                              🧑 Adult: {recipe.servings.adult}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
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

      {/* Support & guidance — surfaced here as well as the Parent tab */}
      <View style={s.supportCard}>
        <View style={s.supportHeader}>
          <Heart size={16} color="#ec4899" />
          <Text style={s.supportTitle}>Support & guidance</Text>
        </View>
        {SUPPORT_LINKS.map(item => (
          <TouchableOpacity
            key={item.screen}
            style={s.supportBtn}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Text style={s.supportBtnText}>{item.label}</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

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
    marginTop: 8,
    lineHeight: 17,
  },

  nutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  nutritionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nutritionDot: { fontSize: 11 },
  nutritionLabel: { fontSize: 11, color: '#374151', fontWeight: '600' },

  smallWinsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
    marginTop: 10,
    marginBottom: 4,
  },
  smallWinItem: { fontSize: 12, color: '#374151', lineHeight: 18 },

  portionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
  },
  portionToggleText: { fontSize: 12, fontWeight: '800', color: '#15803d' },
  recipeBody: { marginTop: 8, gap: 3 },
  recipeHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
    marginTop: 8,
    marginBottom: 2,
  },
  recipeIngredient: { fontSize: 12, color: '#374151', lineHeight: 18 },
  recipeStep: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 2,
  },
  recipeServe: { fontSize: 11, color: '#4b5563', lineHeight: 16 },
  portionTable: { marginTop: 8, gap: 6 },
  portionHeaderRow: { flexDirection: 'row', gap: 4 },
  portionRow: {
    flexDirection: 'row',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 6,
  },
  portionCell: {
    flex: 1,
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 14,
  },
  portionLabelCell: { flex: 1.6, fontWeight: '700', color: '#374151' },
  portionHeadText: { fontWeight: '800', color: '#15803d', fontSize: 10 },
  portionNote: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 14,
  },

  questCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
  },
  questHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  questEmoji: { fontSize: 30 },
  questKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f97316',
    letterSpacing: 0.6,
  },
  questTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  questXp: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  questXpText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  questThemeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  questThemePill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9a3412',
    backgroundColor: '#ffedd5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  questChallenge: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginTop: 10,
  },
  questMetaRow: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' },
  questMetaLabel: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  questMetaValue: { fontSize: 12, color: '#374151', flex: 1 },
  questUpgrade: {
    backgroundColor: '#ffedd5',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  questUpgradeText: { fontSize: 12, color: '#9a3412', lineHeight: 17 },
  questWhy: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 10,
  },
  inspoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#fed7aa',
  },
  inspoToggleText: { fontSize: 12, fontWeight: '800', color: '#f97316' },
  inspoList: { marginTop: 8, gap: 8 },
  inspoLink: { paddingVertical: 4 },
  inspoLinkText: { fontSize: 13, color: '#2563eb', fontWeight: '600' },

  missionCta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#fff7ed',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  missionCtaText: { fontSize: 13, fontWeight: '800', color: '#c2410c' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '88%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  modalEmoji: { fontSize: 32 },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#111827' },
  modalClose: { fontSize: 20, fontWeight: '700', color: '#6b7280', padding: 4 },
  guideLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#f97316',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
  },
  guideText: { fontSize: 15, color: '#374151', lineHeight: 22 },
  guideTipBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  guideSafetyBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  guideTipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  guideTipText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  modalDoneBtn: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  modalDoneText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  supportTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  supportBtnText: { fontSize: 14, color: '#374151', flex: 1, paddingRight: 8 },
});
