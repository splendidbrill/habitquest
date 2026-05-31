import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Lock, Star, ChevronRight, Zap, Flame } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useChild } from '../context/ChildContext';
import { calculatePillarScores } from '../services/pillarScore';
import { getCurrentFocusPillar } from '../services/pillarScore';

// ─── Types ────────────────────────────────────────────────────────────────────
type Pillar = 'nutrition' | 'movement' | 'sleep' | 'confidence';
type AgeGroup = '6-8' | '8-10' | '10-12';

type AreaConfig = {
  pillar: Pillar;
  emoji: string;
  name: string;
  description: string;
  levels: string[];
  screen: keyof RootStackParamList;
  colors: [string, string];
};

// ─── Age-specific area configs ────────────────────────────────────────────────
const AREA_CONFIGS: Record<AgeGroup, AreaConfig[]> = {
  '6-8': [
    {
      pillar: 'nutrition',
      emoji: '🥕',
      name: 'Nutrition Forest',
      description: 'Help the forest animals find healthy foods',
      levels: ['Seed Planter', 'Sprout Keeper', 'Forest Explorer', 'Nature Guardian'],
      screen: 'KidsDinnerChoice',
      colors: ['#22c55e', '#16a34a'],
    },
    {
      pillar: 'movement',
      emoji: '⚽',
      name: 'Activity Arena',
      description: 'Train your buddy to become stronger',
      levels: ['Warm-Up Star', 'Active Explorer', 'Sports Champ', 'Arena Legend'],
      screen: 'KidsDailyMission',
      colors: ['#f97316', '#ea580c'],
    },
    {
      pillar: 'sleep',
      emoji: '😴',
      name: 'Sleep Mountain',
      description: 'Help your buddy recover energy',
      levels: ['Cosy Beginner', 'Dream Walker', 'Cloud Climber', 'Summit Sleeper'],
      screen: 'KidsAvatarStatus',
      colors: ['#8b5cf6', '#7c3aed'],
    },
    {
      pillar: 'confidence',
      emoji: '🧠',
      name: 'Confidence Castle',
      description: 'Collect bravery stars and build courage',
      levels: ['Brave Beginner', 'Star Collector', 'Castle Knight', 'Royal Champion'],
      screen: 'KidsRewardsScreen',
      colors: ['#ec4899', '#db2777'],
    },
  ],
  '8-10': [
    {
      pillar: 'nutrition',
      emoji: '🥕',
      name: 'Nutrition Forest',
      description: 'Unlock food knowledge and fuel your performance',
      levels: ['Explorer', 'Ranger', 'Guardian', 'Forest Master'],
      screen: 'Kids8FuelStation',
      colors: ['#22c55e', '#16a34a'],
    },
    {
      pillar: 'movement',
      emoji: '⚽',
      name: 'Activity Arena',
      description: 'Level up your athletic skills and endurance',
      levels: ['Rookie', 'Starter', 'Pro', 'All-Star'],
      screen: 'Kids8TrainingDashboard',
      colors: ['#f97316', '#ea580c'],
    },
    {
      pillar: 'sleep',
      emoji: '⛰️',
      name: 'Sleep Mountain',
      description: 'Build recovery habits like a pro athlete',
      levels: ['Base Camp', 'Midway', 'Near Summit', 'Peak Performer'],
      screen: 'Kids8AskCoach',
      colors: ['#8b5cf6', '#7c3aed'],
    },
    {
      pillar: 'confidence',
      emoji: '🏰',
      name: 'Confidence Castle',
      description: 'Unlock achievements and build mental strength',
      levels: ['Recruit', 'Contender', 'Competitor', 'Champion'],
      screen: 'Kids8Achievements',
      colors: ['#ec4899', '#db2777'],
    },
  ],
  '10-12': [
    {
      pillar: 'nutrition',
      emoji: '🌿',
      name: 'The Wildlands',
      description: 'Master real nutrition — fuel your body right',
      levels: ['Wanderer', 'Scout', 'Pathfinder', 'Wildlands Master'],
      screen: 'Kids12HealthyEating',
      colors: ['#22c55e', '#16a34a'],
    },
    {
      pillar: 'movement',
      emoji: '🏟️',
      name: 'Champions Grounds',
      description: 'Build physical strength and daily movement habits',
      levels: ['Recruit', 'Athlete', 'Competitor', 'Champion'],
      screen: 'Kids12Movement',
      colors: ['#f97316', '#ea580c'],
    },
    {
      pillar: 'sleep',
      emoji: '🗻',
      name: 'The Summit',
      description: 'Conquer recovery — sleep is your superpower',
      levels: ['Base Camp', 'Ascent', 'High Altitude', 'Summit'],
      screen: 'Kids12Reflection',
      colors: ['#8b5cf6', '#7c3aed'],
    },
    {
      pillar: 'confidence',
      emoji: '🏯',
      name: 'The Stronghold',
      description: 'Build your identity, resilience and mental strength',
      levels: ['Initiate', 'Guardian', 'Sentinel', 'Overlord'],
      screen: 'Kids12WellbeingTracker',
      colors: ['#ec4899', '#db2777'],
    },
  ],
};

// ─── Background gradients per age group ──────────────────────────────────────
const BG_GRADIENTS: Record<AgeGroup, [string, string, string]> = {
  '6-8':   ['#bae6fd', '#fed7aa', '#fef9c3'],
  '8-10':  ['#0f172a', '#1e3a8a', '#0f172a'],
  '10-12': ['#0a0a0f', '#1a0a2e', '#0a0a0f'],
};

const HEADER_TEXT_COLOR: Record<AgeGroup, string> = {
  '6-8':   '#1e3a5f',
  '8-10':  '#ffffff',
  '10-12': '#ffffff',
};

// ─── Score → level index (0-3) ────────────────────────────────────────────────
function scoreToLevel(score: number): number {
  if (score >= 80) return 3;
  if (score >= 55) return 2;
  if (score >= 30) return 1;
  return 0;
}

function scoreToUnlocked(score: number): boolean {
  return score >= 20;
}

// ─── Phase labels ─────────────────────────────────────────────────────────────
const PHASE_LABELS: Record<number, string> = {
  1: 'Phase 1 — Build Foundations',
  2: 'Phase 2 — Build Confidence',
  3: 'Phase 3 — Master Habits',
};

const PILLAR_LABELS: Record<Pillar, string> = {
  nutrition:  '🥕 Nutrition Week',
  movement:   '⚽ Movement Week',
  sleep:      '😴 Sleep Week',
  confidence: '🧠 Confidence Week',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function WorldMap() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeChild } = useChild();
  const ageGroup = (activeChild?.age_group ?? '6-8') as AgeGroup;

  const [scores, setScores] = useState<Record<Pillar, number>>({
    nutrition: 0, movement: 0, sleep: 0, confidence: 0,
  });
  const [loading, setLoading] = useState(true);
  const [focusPillar, setFocusPillar] = useState<Pillar>('nutrition');

  const bgColors = BG_GRADIENTS[ageGroup];
  const textColor = HEADER_TEXT_COLOR[ageGroup];
  const areas = AREA_CONFIGS[ageGroup];
  const isDark = ageGroup !== '6-8';

  useEffect(() => {
    if (!activeChild?.id) { setLoading(false); return; }

    calculatePillarScores(activeChild.id).then(s => {
      setScores(s);
      setLoading(false);
    });

    // Use profile creation date as family start date for focus rotation
    const startDate = activeChild.last_active_date ?? new Date().toISOString().split('T')[0];
    setFocusPillar(getCurrentFocusPillar(startDate));
  }, [activeChild]);

  const totalScore = Math.round(
    (scores.nutrition + scores.movement + scores.sleep + scores.confidence) / 4,
  );

  if (loading) {
    return (
      <LinearGradient colors={bgColors} style={styles.centered}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#f97316'} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={bgColors} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[
              styles.backBtn,
              isDark && styles.backBtnDark,
            ]}>
              <ArrowLeft size={22} color={isDark ? '#fff' : '#374151'} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerName, { color: textColor }]}>
                {activeChild?.name ?? 'Explorer'}'s World
              </Text>
              <Text style={[styles.headerSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280' }]}>
                Overall score: {totalScore}/100
              </Text>
            </View>
            <View style={[styles.xpBadge, isDark && styles.xpBadgeDark]}>
              <Zap size={14} color="#f97316" />
              <Text style={styles.xpText}>{activeChild?.xp ?? 0}</Text>
            </View>
          </View>

          {/* Home Village */}
          <View style={[styles.homeVillage, isDark && styles.homeVillageDark]}>
            <Text style={styles.homeEmoji}>🏠</Text>
            <View>
              <Text style={[styles.homeName, { color: textColor }]}>Home Village</Text>
              <Text style={[styles.homeSub, { color: isDark ? 'rgba(255,255,255,0.55)' : '#6b7280' }]}>
                {activeChild?.level ?? 'Rookie'} · {activeChild?.streak ?? 0} day streak 🔥
              </Text>
            </View>
          </View>

          {/* Current focus week */}
          <View style={[styles.focusBanner, isDark && styles.focusBannerDark]}>
            <Flame size={16} color="#f97316" />
            <Text style={[styles.focusText, { color: isDark ? '#fff' : '#374151' }]}>
              This week: {PILLAR_LABELS[focusPillar]}
            </Text>
          </View>

          {/* Path connector */}
          <View style={styles.pathLine} />

          {/* Area cards — top row */}
          <View style={styles.row}>
            {areas.slice(0, 2).map(area => (
              <AreaCard
                key={area.pillar}
                area={area}
                score={scores[area.pillar]}
                isFocus={area.pillar === focusPillar}
                isDark={isDark}
                textColor={textColor}
                onPress={() => navigation.navigate(area.screen as any)}
              />
            ))}
          </View>

          {/* Path connector */}
          <View style={styles.pathLine} />

          {/* Area cards — bottom row */}
          <View style={styles.row}>
            {areas.slice(2, 4).map(area => (
              <AreaCard
                key={area.pillar}
                area={area}
                score={scores[area.pillar]}
                isFocus={area.pillar === focusPillar}
                isDark={isDark}
                textColor={textColor}
                onPress={() => navigation.navigate(area.screen as any)}
              />
            ))}
          </View>

          {/* Overall progress bar */}
          <View style={[styles.overallCard, isDark && styles.overallCardDark]}>
            <View style={styles.overallHeader}>
              <Star size={16} color="#f97316" />
              <Text style={[styles.overallTitle, { color: textColor }]}>World Progress</Text>
              <Text style={[styles.overallPct, { color: isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af' }]}>
                {totalScore}%
              </Text>
            </View>
            <View style={[styles.progressTrack, isDark && styles.progressTrackDark]}>
              <LinearGradient
                colors={['#f97316', '#fbbf24']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${totalScore}%` }]}
              />
            </View>
            <View style={styles.pillarRow}>
              {(['nutrition', 'movement', 'sleep', 'confidence'] as Pillar[]).map(p => (
                <View key={p} style={styles.pillarDot}>
                  <View style={[
                    styles.dot,
                    { backgroundColor: scores[p] >= 30 ? '#22c55e' : (isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb') },
                  ]} />
                  <Text style={[styles.dotLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af' }]}>
                    {p.slice(0, 3)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Area Card ────────────────────────────────────────────────────────────────
function AreaCard({
  area, score, isFocus, isDark, textColor, onPress,
}: {
  area: AreaConfig;
  score: number;
  isFocus: boolean;
  isDark: boolean;
  textColor: string;
  onPress: () => void;
}) {
  const unlocked = scoreToUnlocked(score);
  const levelIdx = scoreToLevel(score);
  const levelName = area.levels[levelIdx];

  return (
    <TouchableOpacity
      activeOpacity={unlocked ? 0.85 : 1}
      onPress={unlocked ? onPress : undefined}
      style={styles.areaWrapper}
    >
      <LinearGradient
        colors={unlocked ? area.colors : (isDark ? ['#1e293b', '#0f172a'] : ['#e5e7eb', '#d1d5db'])}
        style={[styles.areaCard, isFocus && styles.areaCardFocus]}
      >
        {/* Focus badge */}
        {isFocus && unlocked && (
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>THIS WEEK</Text>
          </View>
        )}

        {/* Lock overlay */}
        {!unlocked && (
          <View style={styles.lockOverlay}>
            <Lock size={28} color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
            <Text style={[styles.lockText, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }]}>
              Complete more missions
            </Text>
          </View>
        )}

        <Text style={styles.areaEmoji}>{area.emoji}</Text>
        <Text style={[
          styles.areaName,
          { color: unlocked ? '#fff' : (isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af') },
        ]}>
          {area.name}
        </Text>

        {unlocked ? (
          <>
            <Text style={styles.areaLevel}>{levelName}</Text>
            {/* Score bar */}
            <View style={styles.scoreTrack}>
              <View style={[styles.scoreFill, { width: `${score}%` }]} />
            </View>
            <View style={styles.areaFooter}>
              <Text style={styles.areaScore}>{score}/100</Text>
              <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
            </View>
          </>
        ) : (
          <Text style={[styles.areaDesc, { color: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }]}>
            {area.description}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  backBtnDark: { backgroundColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0 },
  headerCenter: { alignItems: 'center' },
  headerName: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 2 },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  xpBadgeDark: { backgroundColor: 'rgba(255,255,255,0.1)' },
  xpText: { fontSize: 14, fontWeight: '800', color: '#f97316' },

  // Home Village
  homeVillage: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 20, padding: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  homeVillageDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  homeEmoji: { fontSize: 40 },
  homeName: { fontSize: 18, fontWeight: '800' },
  homeSub: { fontSize: 13, marginTop: 2 },

  // Focus banner
  focusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    marginBottom: 16, borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)',
  },
  focusBannerDark: { backgroundColor: 'rgba(249,115,22,0.15)' },
  focusText: { fontSize: 14, fontWeight: '600' },

  // Path
  pathLine: {
    height: 20, width: 3, backgroundColor: 'rgba(249,115,22,0.4)',
    alignSelf: 'center', borderRadius: 2, marginVertical: 2,
  },

  // Area grid
  row: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  areaWrapper: { flex: 1 },
  areaCard: {
    borderRadius: 22, padding: 16, minHeight: 170,
    position: 'relative', overflow: 'hidden',
  },
  areaCardFocus: {
    borderWidth: 2, borderColor: 'rgba(249,115,22,0.7)',
  },
  focusBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: '#f97316', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  focusBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2, gap: 6,
  },
  lockText: { fontSize: 11, fontWeight: '600', textAlign: 'center', paddingHorizontal: 8 },
  areaEmoji: { fontSize: 40, marginBottom: 8 },
  areaName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  areaLevel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  areaDesc: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  scoreTrack: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3, overflow: 'hidden', marginBottom: 8,
  },
  scoreFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  areaFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  areaScore: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // Overall progress
  overallCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 20,
    marginTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  overallCardDark: { backgroundColor: 'rgba(255,255,255,0.07)' },
  overallHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  overallTitle: { flex: 1, fontSize: 15, fontWeight: '700' },
  overallPct: { fontSize: 14, fontWeight: '700' },
  progressTrack: {
    height: 10, backgroundColor: '#e5e7eb',
    borderRadius: 5, overflow: 'hidden', marginBottom: 16,
  },
  progressTrackDark: { backgroundColor: 'rgba(255,255,255,0.1)' },
  progressFill: { height: '100%', borderRadius: 5 },
  pillarRow: { flexDirection: 'row', justifyContent: 'space-around' },
  pillarDot: { alignItems: 'center', gap: 4 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotLabel: { fontSize: 11, fontWeight: '600' },
});
