import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { Sparkles, MapPin, Flame, Star } from 'lucide-react-native';
import { RecommendedMissions } from '../../components/RecommendedMissions';
import { DailySpin, useDailySpin } from '../../components/DailySpin';
import { ParentReactionBanner } from '../../components/ParentReactionBanner';
import { useChild } from '../../context/ChildContext';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import {
  getTodaysPlan,
  type DayMeal,
  type DayActivity,
} from '../../services/weeklyPlanStore';
import {
  getKidsMealExplanation,
  type KidsMealExplanation,
} from '../../services/kidsMealExplainer';
import {
  getKidsExerciseExplanation,
  type KidsExerciseExplanation,
} from '../../services/kidsExerciseExplainer';
import {
  kids8Theme as T,
  KIDS8_BG_GRADIENT,
  KIDS8_GRADIENTS,
} from './kids8Theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// A grouped tile (canonical 🎮 Games / 🍎 Food Adventures / 🎒 School Tools).
type Tile = {
  icon: string;
  label: string;
  colors: [string, string];
  screen: keyof RootStackParamList;
};

const GAME_TILES: Tile[] = [
  {
    icon: '🏃',
    label: 'Stadium Sprint',
    colors: KIDS8_GRADIENTS.games,
    screen: 'Kids8RunnerChallenge',
  },
  {
    icon: '⚡',
    label: 'Energy Meter',
    colors: KIDS8_GRADIENTS.energy,
    screen: 'Kids8EnergyMeter',
  },
  {
    icon: '🎯',
    label: 'Skill Drills',
    colors: KIDS8_GRADIENTS.games,
    screen: 'Kids8SkillDrills',
  },
  {
    icon: '💪',
    label: 'Train Like a Pro',
    colors: KIDS8_GRADIENTS.cta,
    screen: 'Kids8TrainLikePro',
  },
];

const FOOD_TILES: Tile[] = [
  {
    icon: '🍽️',
    label: 'Choose Dinner',
    colors: KIDS8_GRADIENTS.dinner,
    screen: 'Kids8DinnerChoice',
  },
  {
    icon: '🥕',
    label: 'Veggie Week',
    colors: KIDS8_GRADIENTS.veggie,
    screen: 'Kids8VeggieSelector',
  },
  {
    icon: '👨‍🍳',
    label: 'Kitchen Helper',
    colors: KIDS8_GRADIENTS.kitchen,
    screen: 'Kids8KitchenHelper',
  },
  {
    icon: '⛽',
    label: 'Fuel Station',
    colors: KIDS8_GRADIENTS.foodsTried,
    screen: 'Kids8FuelStation',
  },
];

const SCHOOL_TILES: Tile[] = [
  {
    icon: '🍱',
    label: 'Lunch Builder',
    colors: KIDS8_GRADIENTS.lunch,
    screen: 'Kids8LunchBuilder',
  },
  {
    icon: '🔄',
    label: 'Snack Swaps',
    colors: KIDS8_GRADIENTS.snack,
    screen: 'Kids8SnackSwap',
  },
  {
    icon: '🎒',
    label: 'School Fuel',
    colors: KIDS8_GRADIENTS.school,
    screen: 'Kids8SchoolFuel',
  },
];

// Named XP levels (kept consistent with the rest of the kids8 flow).
function deriveLevel(xp: number) {
  if (xp >= 500)
    return {
      level: 'All-Star',
      next: 'Legend',
      toNext: 1000 - xp,
      pct: ((xp - 500) / 500) * 100,
    };
  if (xp >= 200)
    return {
      level: 'Pro',
      next: 'All-Star',
      toNext: 500 - xp,
      pct: ((xp - 200) / 300) * 100,
    };
  if (xp >= 50)
    return {
      level: 'Starter',
      next: 'Pro',
      toNext: 200 - xp,
      pct: ((xp - 50) / 150) * 100,
    };
  return {
    level: 'Rookie',
    next: 'Starter',
    toNext: 50 - xp,
    pct: (xp / 50) * 100,
  };
}

export function Kids8TrainingDashboard() {
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();
  const { showSpin, dismissSpin } = useDailySpin();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [todaysMeal, setTodaysMeal] = useState<DayMeal | null>(null);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [mealExplanation, setMealExplanation] =
    useState<KidsMealExplanation | null>(null);
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [todaysActivity, setTodaysActivity] = useState<DayActivity | null>(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [exerciseExplanation, setExerciseExplanation] =
    useState<KidsExerciseExplanation | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [missionDone, setMissionDone] = useState(false);

  useEffect(() => {
    loadFamilyProfile().then(setProfile);
    getTodaysPlan().then(p => {
      setTodaysMeal(p.meal);
      setTodaysActivity(p.activity);
    });
  }, []);

  // Re-check completion whenever the hub regains focus (native-stack keeps this
  // screen mounted, so returning from the mission must refresh the done state).
  useFocusEffect(
    useCallback(() => {
      storage.getItem('kids8MissionCompletedDate').then(v => {
        setMissionDone(v === new Date().toDateString());
      });
    }, []),
  );

  // Phase A.2: mark avatar/onboarding complete so ProfileSelector can skip it.
  useEffect(() => {
    if (activeChild?.id) storage.setItem('avatarReady:' + activeChild.id, '1');
  }, [activeChild?.id]);

  // Floating buddy animation (replaces the web bundle's motion/react loop).
  const floatY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [floatY]);

  const xp = activeChild?.xp ?? 0;
  const streak = activeChild?.streak ?? 0;
  const userName = activeChild?.name ?? 'Explorer';
  const { level, next, toNext, pct } = deriveLevel(xp);
  const buddyEmoji = activeChild?.avatar || '🐉';

  // C.2: the day's Movement Quest is the headline "adventure" (same quest the
  // parent Weekly Plan shows for this child's age band).
  const quest: MovementQuest = selectDailyMovementQuest('8-10', profile);

  const go = (screen: keyof RootStackParamList) =>
    navigation.navigate(screen as never);

  const openMeal = async () => {
    if (!todaysMeal) return;
    setMealModalVisible(true);
    if (!mealExplanation) {
      setLoadingMeal(true);
      const ex = await getKidsMealExplanation(todaysMeal, '8-10');
      setMealExplanation(ex);
      setLoadingMeal(false);
    }
  };

  const openExercise = async () => {
    if (!todaysActivity) return;
    setExerciseModalVisible(true);
    if (!exerciseExplanation) {
      setLoadingExercise(true);
      const ex = await getKidsExerciseExplanation(todaysActivity, '8-10');
      setExerciseExplanation(ex);
      setLoadingExercise(false);
    }
  };

  const renderTiles = (tiles: Tile[]) => (
    <View style={styles.tileGrid}>
      {tiles.map(t => (
        <TouchableOpacity
          key={t.screen}
          activeOpacity={0.85}
          onPress={() => go(t.screen)}
          style={styles.tileWrap}
        >
          <LinearGradient colors={t.colors} style={styles.tile}>
            <Text style={styles.tileIcon}>{t.icon}</Text>
            <Text style={styles.tileLabel}>{t.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={KIDS8_BG_GRADIENT} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => go('Kids8PersonalizationSetup')}
              >
                <LinearGradient
                  colors={KIDS8_GRADIENTS.buddy}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarEmoji}>{buddyEmoji}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View>
                <Text style={styles.hello}>Hey, {userName}!</Text>
                <View style={styles.levelRow}>
                  <Sparkles size={14} color={T.purple700} />
                  <Text style={styles.levelText}>{level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.pills}>
              <View style={styles.pill}>
                <Flame size={16} color="#F97316" />
                <Text style={styles.pillText}>{streak} days</Text>
              </View>
              <View style={styles.pill}>
                <Star size={16} color={T.gold} />
                <Text style={styles.pillText}>{xp} XP</Text>
              </View>
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.xpCard}>
            <View style={styles.xpHead}>
              <Text style={styles.xpLabel}>XP Progress</Text>
              <Text style={styles.xpValue}>
                {level} · {toNext} XP to {next}
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <View
                style={[styles.xpFill, { width: `${Math.min(pct, 100)}%` }]}
              />
            </View>
          </View>

          {/* Animated buddy */}
          <Animated.View style={{ transform: [{ translateY: floatY }] }}>
            <LinearGradient
              colors={KIDS8_GRADIENTS.buddy}
              style={styles.buddyCard}
            >
              <Text style={styles.buddyEmoji}>{buddyEmoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.buddyName}>Your buddy</Text>
                <Text style={styles.buddySub}>Ready for adventure!</Text>
              </View>
              <Sparkles size={28} color={T.gold} />
            </LinearGradient>
          </Animated.View>

          {/* Today's Adventure — the daily Movement Quest */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Today's Adventure</Text>
            {!missionDone && (
              <TouchableOpacity onPress={() => go('Kids8DailyMission')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>
          {missionDone ? (
            <View style={styles.doneCard}>
              <Text style={styles.doneEmoji}>🎉</Text>
              <Text style={styles.doneTitle}>Adventure Complete!</Text>
              <Text style={styles.doneSub}>
                Come back tomorrow for a new one! 🌟
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => go('Kids8DailyMission')}
            >
              <View style={styles.questCard}>
                <Text style={styles.questEmoji}>{quest.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questSub} numberOfLines={2}>
                    {quest.challenge}
                  </Text>
                  <View style={styles.questMetaRow}>
                    <Text style={styles.questMeta}>
                      ⏱ {quest.durationMin} min
                    </Text>
                    <Text style={styles.questXp}>+{quest.xp} XP</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Your fuel for the day — same meal the parent sees, made exciting */}
          {todaysMeal && (
            <TouchableOpacity activeOpacity={0.92} onPress={openMeal}>
              <LinearGradient
                colors={KIDS8_GRADIENTS.dinner}
                style={styles.planCard}
              >
                <Text style={styles.planEmoji}>🍽️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planKicker}>YOUR FUEL FOR THE DAY</Text>
                  <Text style={styles.planName} numberOfLines={2}>
                    {todaysMeal.name}
                  </Text>
                  <View style={styles.planPill}>
                    <Text style={styles.planPillText}>
                      Tap to see why it fuels you ⚡
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Your move for the day — same activity the parent sees, made cool */}
          {todaysActivity && (
            <TouchableOpacity activeOpacity={0.92} onPress={openExercise}>
              <LinearGradient
                colors={KIDS8_GRADIENTS.games}
                style={styles.planCard}
              >
                <Text style={styles.planEmoji}>🤸</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planKicker}>YOUR MOVE FOR THE DAY</Text>
                  <Text style={styles.planName} numberOfLines={2}>
                    {todaysActivity.name}
                  </Text>
                  <View style={styles.planPill}>
                    <Text style={styles.planPillText}>
                      Tap to see why it's awesome 🔥
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Personalised recommendations */}
          <RecommendedMissions isDark={false} />

          {/* Grouped sections */}
          <Text style={styles.groupTitle}>🍎 Food Adventures</Text>
          {renderTiles(FOOD_TILES)}

          <Text style={styles.groupTitle}>🎒 School Tools</Text>
          {renderTiles(SCHOOL_TILES)}

          <Text style={styles.groupTitle}>🎮 Games</Text>
          {renderTiles(GAME_TILES)}

          {/* Main CTA */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => go('WorldMap')}>
            <LinearGradient colors={KIDS8_GRADIENTS.cta} style={styles.cta}>
              <MapPin size={22} color="#fff" />
              <Text style={styles.ctaText}>Start Today's Adventure!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom nav (5-item: Home / Map / Games / Quests / Rewards) */}
        <View style={styles.bottomNav}>
          {[
            { icon: '🏠', label: 'Home', screen: undefined },
            { icon: '🗺️', label: 'Map', screen: 'WorldMap' as const },
            {
              icon: '🎮',
              label: 'Games',
              screen: 'Kids8RunnerChallenge' as const,
            },
            {
              icon: '✨',
              label: 'Quests',
              screen: 'Kids8DailyMission' as const,
            },
            {
              icon: '🏆',
              label: 'Rewards',
              screen: 'Kids8Achievements' as const,
            },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              disabled={!item.screen}
              onPress={() => item.screen && go(item.screen)}
              style={styles.navItem}
            >
              <View style={styles.navIconWrap}>
                <Text style={styles.navIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* "Your fuel for the day" — AI-driven, kid-friendly meal explainer */}
        <Modal
          visible={mealModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMealModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.planOverlay}
            activeOpacity={1}
            onPress={() => setMealModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.planModalCard}
              onPress={() => {}}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.planModalEmoji}>🍽️</Text>
                <Text style={styles.planModalTitle}>{todaysMeal?.name}</Text>

                {loadingMeal || !mealExplanation ? (
                  <View style={styles.planLoading}>
                    <ActivityIndicator size="large" color={T.accent} />
                    <Text style={styles.planLoadingText}>
                      Working out why it fuels you… ⚡
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.planHook}>{mealExplanation.hook}</Text>
                    {mealExplanation.superpowers.length > 0 && (
                      <View style={styles.planPowersBox}>
                        <Text style={styles.planBoxTitle}>
                          💪 Your fuel powers
                        </Text>
                        {mealExplanation.superpowers.map((p, i) => (
                          <Text key={i} style={styles.planPowerItem}>
                            ⭐ {p}
                          </Text>
                        ))}
                      </View>
                    )}
                    {!!mealExplanation.funFact && (
                      <View style={styles.planFactBox}>
                        <Text style={styles.planBoxTitle}>🤩 Cool fact</Text>
                        <Text style={styles.planFactText}>
                          {mealExplanation.funFact}
                        </Text>
                      </View>
                    )}
                    {!!mealExplanation.cheer && (
                      <Text style={styles.planCheer}>{mealExplanation.cheer}</Text>
                    )}
                  </>
                )}

                <TouchableOpacity
                  style={styles.planCloseBtn}
                  onPress={() => setMealModalVisible(false)}
                >
                  <Text style={styles.planCloseText}>Fuel up! 😋</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* "Your move for the day" — AI-driven, kid-friendly exercise explainer */}
        <Modal
          visible={exerciseModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setExerciseModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.planOverlay}
            activeOpacity={1}
            onPress={() => setExerciseModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.planModalCard}
              onPress={() => {}}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.planModalEmoji}>🤸</Text>
                <Text style={styles.planModalTitle}>{todaysActivity?.name}</Text>
                {todaysActivity?.description ? (
                  <Text style={styles.planDesc}>
                    {todaysActivity.description}
                  </Text>
                ) : null}

                {loadingExercise || !exerciseExplanation ? (
                  <View style={styles.planLoading}>
                    <ActivityIndicator size="large" color={T.accent} />
                    <Text style={styles.planLoadingText}>
                      Working out why it's awesome… 🔥
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.planHook}>
                      {exerciseExplanation.hook}
                    </Text>
                    {exerciseExplanation.superpowers.length > 0 && (
                      <View style={styles.planPowersBox}>
                        <Text style={styles.planBoxTitle}>
                          💪 Why it's awesome
                        </Text>
                        {exerciseExplanation.superpowers.map((p, i) => (
                          <Text key={i} style={styles.planPowerItem}>
                            ⭐ {p}
                          </Text>
                        ))}
                      </View>
                    )}
                    {!!exerciseExplanation.funFact && (
                      <View style={styles.planFactBox}>
                        <Text style={styles.planBoxTitle}>🤩 Cool fact</Text>
                        <Text style={styles.planFactText}>
                          {exerciseExplanation.funFact}
                        </Text>
                      </View>
                    )}
                    {!!exerciseExplanation.cheer && (
                      <Text style={styles.planCheer}>
                        {exerciseExplanation.cheer}
                      </Text>
                    )}
                  </>
                )}

                <TouchableOpacity
                  style={styles.planCloseBtn}
                  onPress={() => setExerciseModalVisible(false)}
                >
                  <Text style={styles.planCloseText}>Let's go! 🚀</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <DailySpin visible={showSpin} onClose={dismissSpin} />
        <ParentReactionBanner />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 110 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: { fontSize: 30 },
  hello: { fontSize: 20, fontWeight: '800', color: T.purple900 },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  levelText: { fontSize: 14, fontWeight: '700', color: T.purple700 },
  pills: { gap: 6, alignItems: 'flex-end' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: T.foreground },

  xpCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: T.radius,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: T.border,
  },
  xpHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: { fontSize: 13, fontWeight: '700', color: T.purple700 },
  xpValue: { fontSize: 12, color: T.purple900, fontWeight: '600' },
  xpTrack: {
    height: 12,
    backgroundColor: T.muted,
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: T.xpBar, borderRadius: 6 },

  buddyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: T.radius,
    padding: 20,
    marginBottom: 24,
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buddyEmoji: { fontSize: 52 },
  buddyName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  buddySub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: T.purple900 },
  seeAll: { fontSize: 14, fontWeight: '700', color: T.primary },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: T.radius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  questEmoji: { fontSize: 40 },
  questTitle: { fontSize: 16, fontWeight: '800', color: T.purple900 },
  questSub: { fontSize: 13, color: '#6B5B95', lineHeight: 18, marginTop: 2 },
  questMetaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  questMeta: { fontSize: 12, fontWeight: '700', color: T.purple700 },
  questXp: { fontSize: 12, fontWeight: '800', color: T.accent },

  doneCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: T.radius,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  doneEmoji: { fontSize: 52, marginBottom: 6 },
  doneTitle: { fontSize: 20, fontWeight: '800', color: T.purple900 },
  doneSub: {
    fontSize: 14,
    color: '#6B5B95',
    marginTop: 4,
    textAlign: 'center',
  },

  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: T.radius,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  planEmoji: { fontSize: 42 },
  planKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 0.6,
  },
  planName: { fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 2 },
  planPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  planPillText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  planOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  planModalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    maxHeight: '85%',
  },
  planModalEmoji: { fontSize: 50, textAlign: 'center', marginBottom: 4 },
  planModalTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: T.purple900,
    textAlign: 'center',
    marginBottom: 12,
  },
  planDesc: {
    fontSize: 15,
    color: '#6B5B95',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: -6,
    marginBottom: 14,
  },
  planLoading: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  planLoadingText: { fontSize: 15, fontWeight: '600', color: T.purple700 },
  planHook: {
    fontSize: 18,
    fontWeight: '800',
    color: T.accent,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 16,
  },
  planPowersBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  planFactBox: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  planBoxTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: T.purple900,
    marginBottom: 8,
  },
  planPowerItem: {
    fontSize: 15,
    color: '#78350F',
    lineHeight: 23,
    marginBottom: 4,
  },
  planFactText: { fontSize: 15, color: '#0C4A6E', lineHeight: 22 },
  planCheer: {
    fontSize: 17,
    fontWeight: '800',
    color: T.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  planCloseBtn: {
    backgroundColor: T.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  planCloseText: { fontSize: 18, fontWeight: '800', color: '#fff' },

  groupTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: T.purple900,
    marginBottom: 10,
    marginTop: 4,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  tileWrap: { width: '47%' },
  tile: {
    borderRadius: T.radius,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tileIcon: { fontSize: 38, marginBottom: 8 },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: T.radius,
    paddingVertical: 18,
    marginTop: 4,
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: { alignItems: 'center', gap: 2 },
  navIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, fontWeight: '600', color: T.purple700 },
});
