import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { useChild } from '../../context/ChildContext';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import { getTodaysPlan } from '../../services/weeklyPlanStore';
import { Lock, ChevronRight } from 'lucide-react-native';
import { kids12Theme as T } from './kids12Theme';

// ============================================================
// "Create Your Profile" — the 10–12 opening screen.
//
// A mature, dark, performance-platform vibe (Duolingo / Nike Run Club / Strava
// / FIFA Career Mode) — NOT childish. The child picks Style + Goal + Favourite
// Activity; the app generates a player profile (avatar + future title) instead
// of a from-scratch avatar builder. On "Start My Journey" it reveals a
// personalised "Quest Path" mission pack built from their choices + today's
// family plan — the "this app actually knows me" moment.
// ============================================================

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Opt = { id: string; emoji: string; label: string };

const STYLES: Opt[] = [
  { id: 'football', emoji: '⚽', label: 'Football' },
  { id: 'basketball', emoji: '🏀', label: 'Basketball' },
  { id: 'dance', emoji: '💃', label: 'Dance' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'running', emoji: '🏃', label: 'Running' },
  { id: 'adventure', emoji: '🧗', label: 'Adventure' },
  { id: 'martial', emoji: '🥋', label: 'Martial Arts' },
];

const GOALS: Opt[] = [
  { id: 'energy', emoji: '⚡', label: 'More Energy' },
  { id: 'stronger', emoji: '💪', label: 'Get Stronger' },
  { id: 'healthier', emoji: '🌱', label: 'Feel Healthier' },
  { id: 'confidence', emoji: '🔥', label: 'Build Confidence' },
  { id: 'fitness', emoji: '📈', label: 'Improve Fitness' },
  { id: 'sleep', emoji: '😴', label: 'Better Sleep' },
];

const ACTIVITIES: Opt[] = [
  { id: 'football', emoji: '⚽', label: 'Football' },
  { id: 'swimming', emoji: '🏊', label: 'Swimming' },
  { id: 'cricket', emoji: '🏏', label: 'Cricket' },
  { id: 'cycling', emoji: '🚴', label: 'Cycling' },
  { id: 'dance', emoji: '💃', label: 'Dance' },
  { id: 'basketball', emoji: '🏀', label: 'Basketball' },
  { id: 'tennis', emoji: '🎾', label: 'Tennis' },
  { id: 'martial', emoji: '🥋', label: 'Martial Arts' },
  { id: 'gym', emoji: '🏋️', label: 'Gym' },
  { id: 'walking', emoji: '🚶', label: 'Walking' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming Breaks' },
];

const UNLOCKS: Opt[] = [
  { id: 'ach', emoji: '🏆', label: 'Achievements' },
  { id: 'prog', emoji: '📈', label: 'Progress Tracking' },
  { id: 'map', emoji: '🗺️', label: 'Quest Map' },
  { id: 'weekly', emoji: '🎯', label: 'Weekly Challenges' },
  { id: 'coach', emoji: '🤖', label: 'Personal Coach' },
];

// Goals that lean "athlete" vs "wellness" → drives the generated future title.
const ATHLETE_GOALS = new Set(['energy', 'stronger', 'fitness']);

export function Kids12Onboarding() {
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();

  const [phase, setPhase] = useState<'build' | 'reveal'>('build');
  const [style, setStyle] = useState('football');
  const [goal, setGoal] = useState('energy');
  const [activity, setActivity] = useState('football');
  const [search, setSearch] = useState('');

  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [nutritionMeal, setNutritionMeal] = useState<string>(
    'a fresh, tasty meal',
  );

  useEffect(() => {
    loadFamilyProfile().then(setProfile);
    getTodaysPlan().then(p => setNutritionMeal(p.meal.name));
  }, []);

  const styleData = STYLES.find(s => s.id === style) ?? STYLES[0];
  const activityData = ACTIVITIES.find(a => a.id === activity) ?? ACTIVITIES[0];
  const futureTitle = ATHLETE_GOALS.has(goal)
    ? '⚡ Rising Athlete'
    : '🧠 Wellness Champion';

  const quest: MovementQuest = selectDailyMovementQuest('10-12', profile);

  const filteredActivities = ACTIVITIES.filter(a =>
    a.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleStartJourney = () => setPhase('reveal');

  const handleFinish = async () => {
    await storage.setItem('kids12HasOnboarded', 'true');
    await storage.setItem('kids12Style', style);
    await storage.setItem('kids12Goal', goal);
    await storage.setItem('kids12FavActivity', activity);
    await storage.setItem('kids12Title', futureTitle);
    navigation.navigate('Kids12Today');
  };

  const renderChips = (
    items: Opt[],
    selected: string,
    onSelect: (id: string) => void,
  ) => (
    <View style={styles.chipWrap}>
      {items.map(o => {
        const sel = o.id === selected;
        return (
          <TouchableOpacity
            key={o.id}
            activeOpacity={0.85}
            onPress={() => onSelect(o.id)}
            style={[styles.chip, sel && styles.chipSel]}
          >
            <Text style={styles.chipEmoji}>{o.emoji}</Text>
            <Text style={[styles.chipLabel, sel && styles.chipLabelSel]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ─── Quest Path reveal ──────────────────────────────────────────────────────
  if (phase === 'reveal') {
    const missions = [
      {
        emoji: '🥕',
        tag: 'NUTRITION QUEST',
        title: nutritionMeal,
        sub: 'Fuel up with today’s meal and log how it felt.',
        color: T.nutrition,
      },
      {
        emoji: activityData.emoji,
        tag: `${activityData.label.toUpperCase()} CHALLENGE`,
        title: quest.title,
        sub: quest.challenge,
        color: T.activity,
      },
      {
        emoji: '😴',
        tag: 'SLEEP STREAK',
        title: 'Wind down tonight',
        sub: 'Screens off 30 min early — start your sleep streak.',
        color: T.sleep,
      },
      {
        emoji: '🧠',
        tag: 'CONFIDENCE CHALLENGE',
        title: 'One small win',
        sub: 'Note one thing you did well today.',
        color: T.confidence,
      },
    ];

    return (
      <LinearGradient
        colors={['#0B0B14', '#1A1430', '#0B0B14']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.revealBadge}>QUEST PATH CREATED</Text>
            <Text style={styles.revealTitle}>
              Your Quest Path{'\n'}Has Been Created
            </Text>
            <Text style={styles.revealSub}>
              We built today’s missions around your style, goals and what your
              family loves. Let’s go.
            </Text>

            {missions.map((m, i) => (
              <View key={i} style={styles.missionCard}>
                <View
                  style={[
                    styles.missionIcon,
                    { backgroundColor: m.color + '22', borderColor: m.color },
                  ]}
                >
                  <Text style={styles.missionEmoji}>{m.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.missionTag, { color: m.color }]}>
                    {m.tag}
                  </Text>
                  <Text style={styles.missionTitle} numberOfLines={1}>
                    {m.title}
                  </Text>
                  <Text style={styles.missionText} numberOfLines={2}>
                    {m.sub}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleFinish}
              style={{ marginTop: 8 }}
            >
              <LinearGradient
                colors={['#7C3AED', '#22D3EE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>Enter Habit Quest</Text>
                <ChevronRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ─── Build profile ──────────────────────────────────────────────────────────
  return (
    <LinearGradient
      colors={['#0B0B14', '#1A1430', '#0B0B14']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.kicker}>WELCOME TO HABIT QUEST</Text>
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>
            Build healthy habits. Level up your future.
          </Text>

          {/* Generated player profile preview */}
          <LinearGradient
            colors={['#1A1430', '#241a3d']}
            style={styles.profileCard}
          >
            <LinearGradient
              colors={['#7C3AED', '#22D3EE']}
              style={styles.avatarOrb}
            >
              <Text style={styles.avatarEmoji}>{styleData.emoji}</Text>
            </LinearGradient>
            <Text style={styles.profileLabel}>PLAYER PROFILE</Text>
            <Text style={styles.profileLevel}>Level 1</Text>
            <View style={styles.titlePill}>
              <Text style={styles.titlePillText}>{futureTitle}</Text>
            </View>
            <Text style={styles.profileHint}>Your future title</Text>
          </LinearGradient>

          {/* Style */}
          <Text style={styles.sectionTitle}>Style</Text>
          {renderChips(STYLES, style, setStyle)}

          {/* Goal */}
          <Text style={styles.sectionTitle}>Goal</Text>
          {renderChips(GOALS, goal, setGoal)}

          {/* Favourite activity (searchable) */}
          <Text style={styles.sectionTitle}>Favourite Activity</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search activities…"
            placeholderTextColor={T.mutedDim}
            style={styles.search}
          />
          {renderChips(filteredActivities, activity, id => {
            setActivity(id);
          })}
          {filteredActivities.length === 0 && (
            <Text style={styles.noResults}>No matches — try another word.</Text>
          )}

          {/* Upcoming unlocks (greyed) */}
          <Text style={styles.sectionTitle}>Upcoming unlocks</Text>
          <View style={styles.unlocksCard}>
            {UNLOCKS.map(u => (
              <View key={u.id} style={styles.unlockRow}>
                <Text style={styles.unlockEmoji}>{u.emoji}</Text>
                <Text style={styles.unlockLabel}>{u.label}</Text>
                <Lock size={15} color={T.mutedDim} />
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleStartJourney}>
            <LinearGradient
              colors={['#7C3AED', '#22D3EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>Start My Journey</Text>
              <ChevronRight size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 44 },

  kicker: {
    fontSize: 12,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: 3,
    marginTop: 8,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginTop: 4 },
  subtitle: { fontSize: 15, color: T.muted, marginTop: 8, marginBottom: 20 },

  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.35)',
  },
  avatarOrb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarEmoji: { fontSize: 48 },
  profileLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: T.accent,
    letterSpacing: 2,
  },
  profileLevel: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginTop: 2,
  },
  titlePill: {
    backgroundColor: 'rgba(252,211,77,0.15)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.4)',
  },
  titlePillText: { fontSize: 15, fontWeight: '800', color: T.gold },
  profileHint: { fontSize: 11, color: T.mutedDim, marginTop: 6 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginTop: 18,
    marginBottom: 12,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipSel: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderColor: T.primary,
  },
  chipEmoji: { fontSize: 18 },
  chipLabel: { fontSize: 14, fontWeight: '700', color: T.muted },
  chipLabelSel: { color: '#fff' },

  search: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 12,
  },
  noResults: { fontSize: 13, color: T.mutedDim, marginTop: 6 },

  unlocksCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 26,
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    opacity: 0.55,
  },
  unlockEmoji: { fontSize: 20 },
  unlockLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: T.muted },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  // Reveal
  revealBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: T.accent,
    letterSpacing: 3,
    marginTop: 16,
    textAlign: 'center',
  },
  revealTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 36,
  },
  revealSub: {
    fontSize: 14,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 24,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  missionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  missionEmoji: { fontSize: 26 },
  missionTag: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  missionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
  },
  missionText: { fontSize: 13, color: T.muted, lineHeight: 18, marginTop: 2 },
});
