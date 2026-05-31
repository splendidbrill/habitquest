import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertTriangle, Info, ChevronRight, Flame, Key } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation';
import { useParentData, ChildSummary } from '../hooks/useParentData';
import type { Pillar } from '../services/syncService';
import { useCallback } from 'react';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Pillar circle config ─────────────────────────────────────────────────────
const PILLAR_CONFIG: Record<Pillar, { emoji: string; label: string; color: string }> = {
  nutrition:  { emoji: '🥕', label: 'Nutrition',  color: '#22c55e' },
  movement:   { emoji: '⚽', label: 'Movement',   color: '#f97316' },
  sleep:      { emoji: '😴', label: 'Sleep',      color: '#8b5cf6' },
  confidence: { emoji: '🧠', label: 'Confidence', color: '#ec4899' },
};

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

// ─── SVG progress circle ──────────────────────────────────────────────────────
function PillarCircle({ pillar, score, isFocus }: { pillar: Pillar; score: number; isFocus: boolean }) {
  const cfg = PILLAR_CONFIG[pillar];
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <View style={[s.pillarCircleWrap, isFocus && s.pillarCircleFocus]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={s.pillarCircleInner}>
        <Text style={s.pillarEmoji}>{cfg.emoji}</Text>
        <Text style={[s.pillarScore, { color }]}>{score}</Text>
      </View>
      <Text style={s.pillarLabel}>{cfg.label}</Text>
      {isFocus && <View style={s.focusDot} />}
    </View>
  );
}

// ─── Child tab selector ───────────────────────────────────────────────────────
function ChildTabs({ children, selected, onSelect }: {
  children: ChildSummary[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll}>
      <View style={s.tabs}>
        {children.map(c => (
          <TouchableOpacity
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[s.tab, selected === c.id && s.tabActive]}
          >
            <Text style={[s.tabText, selected === c.id && s.tabTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ParentHome() {
  const navigation = useNavigation<Nav>();
  const { children, journey, parentName, familyCode, loading, alerts, reload } = useParentData();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const child = selectedChildId
    ? children.find(c => c.id === selectedChildId)
    : children[0];

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!children.length) {
    return (
      <View style={s.centered}>
        <Text style={s.emptyEmoji}>👶</Text>
        <Text style={s.emptyTitle}>No children yet</Text>
        <Text style={s.emptySub}>Add a child profile to start tracking their progress</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddChild')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#f97316', '#fbbf24']} style={s.emptyBtn}>
            <Text style={s.emptyBtnText}>Add Child Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const pillars: Pillar[] = ['nutrition', 'movement', 'sleep', 'confidence'];
  const focusPillar = journey?.focusPillar ?? 'nutrition';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>
              Good {getGreeting()}, {parentName.split(' ')[0] || 'there'} 👋
            </Text>
            <Text style={s.headerSub}>Family health dashboard</Text>
          </View>
          <TouchableOpacity
            style={s.codeBtn}
            onPress={() => navigation.navigate('FamilyCode')}
          >
            <Key size={14} color="#6b7280" />
            <Text style={s.codeBtnText}>{familyCode}</Text>
          </TouchableOpacity>
        </View>

        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={s.alertsBox}>
            {alerts.slice(0, 2).map((alert, i) => {
              const isStreakRisk = alert.type === 'warning' && alert.message.includes('streak');
              const alertChild = children.find(c => c.name === alert.childName);
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={isStreakRisk ? 0.85 : 1}
                  onPress={() => {
                    if (isStreakRisk && alertChild) {
                      navigation.navigate('BarrierSolver', {
                        childName: alertChild.name,
                        pillar: journey?.focusPillar ?? 'movement',
                      });
                    }
                  }}
                >
                  <View style={[s.alertRow, alert.type === 'warning' ? s.alertWarning : s.alertInfo]}>
                    {alert.type === 'warning'
                      ? <AlertTriangle size={15} color="#d97706" />
                      : <Info size={15} color="#3b82f6" />
                    }
                    <Text style={[s.alertText, alert.type === 'warning' ? s.alertTextWarning : s.alertTextInfo]}>
                      {alert.message}
                    </Text>
                    {isStreakRisk && (
                      <Text style={s.alertActionText}>Fix it →</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Child tabs */}
        {children.length > 1 && (
          <ChildTabs
            children={children}
            selected={selectedChildId ?? children[0].id}
            onSelect={setSelectedChildId}
          />
        )}

        {child && (
          <>
            {/* Child summary strip */}
            <View style={s.childStrip}>
              <View>
                <Text style={s.childName}>{child.name}</Text>
                <Text style={s.childMeta}>{child.level} · {child.xp} XP</Text>
              </View>
              <View style={s.streakBadge}>
                <Flame size={14} color="#f97316" />
                <Text style={s.streakText}>{child.streak} day streak</Text>
              </View>
            </View>

            {/* Four pillar circles */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Health Pillars</Text>
              <View style={s.pillarsRow}>
                {pillars.map(p => (
                  <PillarCircle
                    key={p}
                    pillar={p}
                    score={child.pillarScores[p]}
                    isFocus={p === focusPillar}
                  />
                ))}
              </View>
              <View style={s.focusNote}>
                <Text style={s.focusNoteText}>
                  🎯 This week's focus: <Text style={s.focusNoteStrong}>{PILLAR_CONFIG[focusPillar].label}</Text>
                </Text>
              </View>
            </View>

            {/* Check-in nudge */}
            {!child.checkinDoneThisWeek && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('PillarCheckIn')}
              >
                <LinearGradient
                  colors={['#fffbeb', '#fef3c7']}
                  style={s.checkinNudge}
                >
                  <Text style={s.checkinNudgeEmoji}>📊</Text>
                  <View style={s.checkinNudgeText}>
                    <Text style={s.checkinNudgeTitle}>Weekly check-in needed</Text>
                    <Text style={s.checkinNudgeSub}>Update {child.name}'s scores — takes 2 minutes</Text>
                  </View>
                  <ChevronRight size={18} color="#d97706" />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Family Journey View */}
            {journey && (
              <View style={s.journeyCard}>
                <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={s.journeyHeader}>
                  <View>
                    <Text style={s.journeyPhaseLabel}>Phase {journey.phase}</Text>
                    <Text style={s.journeyPhaseName}>{journey.phaseLabel}</Text>
                  </View>
                  <View style={s.journeyWeekBadge}>
                    <Text style={s.journeyWeekText}>Week {journey.weekNumber}</Text>
                  </View>
                </LinearGradient>
                <View style={s.journeyGoals}>
                  <Text style={s.journeyGoalsTitle}>Phase goals</Text>
                  {PHASE_GOALS[journey.phase].map((goal, i) => (
                    <View key={i} style={s.goalRow}>
                      <View style={s.goalDot} />
                      <Text style={s.goalText}>{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recent activity */}
            {child.recentMissions.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Recent Activity</Text>
                {child.recentMissions.map((m, i) => {
                  const pillarCfg = PILLAR_CONFIG[m.pillar];
                  return (
                    <View key={i} style={s.activityRow}>
                      <Text style={s.activityEmoji}>{pillarCfg.emoji}</Text>
                      <View style={s.activityText}>
                        <Text style={s.activityTitle}>{m.mission_title}</Text>
                        <Text style={s.activityMeta}>
                          {pillarCfg.label} · +{m.xp_earned} XP · {formatDate(m.completed_at)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Recent badges */}
            {child.badges.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Latest Badges</Text>
                <View style={s.badgesRow}>
                  {child.badges.slice(0, 6).map((b, i) => (
                    <View key={i} style={s.badgeChip}>
                      <Text style={s.badgeChipText}>{b.badge_name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Family challenges shortcut */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FamilyChallengesManager')}
          style={s.challengesBtn}
        >
          <Text style={s.challengesBtnEmoji}>🤝</Text>
          <View style={s.challengesBtnText}>
            <Text style={s.challengesBtnTitle}>Family Challenges</Text>
            <Text style={s.challengesBtnSub}>Set goals you do together</Text>
          </View>
          <ChevronRight size={18} color="#374151" />
        </TouchableOpacity>

        {/* Link to full dashboard */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ParentDashboard')}
        >
          <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={s.dashBtn}>
            <Text style={s.dashBtnText}>View Full Dashboard & Tools</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Phase goals ──────────────────────────────────────────────────────────────
const PHASE_GOALS: Record<number, string[]> = {
  1: ['Establish breakfast routine', 'Build daily water habit', 'Start activity streak'],
  2: ['Introduce new foods', 'Build family movement habit', 'Encourage independent choices'],
  3: ['Maintain consistency across all pillars', 'Build resilience and self-confidence', 'Long-term habit mastery'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  codeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  codeBtnText: { fontSize: 13, fontWeight: '700', color: '#374151', letterSpacing: 1 },

  alertsBox: { gap: 8, marginBottom: 16 },
  alertRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, padding: 12,
  },
  alertWarning: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fcd34d' },
  alertInfo:    { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
  alertText: { flex: 1, fontSize: 13, lineHeight: 18 },
  alertTextWarning: { color: '#92400e' },
  alertTextInfo:    { color: '#1e40af' },
  alertActionText:  { fontSize: 12, fontWeight: '700', color: '#d97706' },

  tabsScroll: { marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  tabActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#fff' },

  childStrip: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  childName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  childMeta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff7ed', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#fed7aa',
  },
  streakText: { fontSize: 13, fontWeight: '700', color: '#c2410c' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },

  pillarsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pillarCircleWrap: { alignItems: 'center', position: 'relative' },
  pillarCircleFocus: {
    backgroundColor: '#fff7ed', borderRadius: 12, padding: 4,
    borderWidth: 1.5, borderColor: '#fed7aa',
  },
  pillarCircleInner: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  pillarEmoji: { fontSize: 18 },
  pillarScore: { fontSize: 13, fontWeight: '800' },
  pillarLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280', marginTop: 4 },
  focusDot: {
    position: 'absolute', top: 2, right: 2,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316',
  },
  focusNote: {
    backgroundColor: '#fff7ed', borderRadius: 10, padding: 10, marginTop: 16,
  },
  focusNoteText: { fontSize: 13, color: '#92400e', textAlign: 'center' },
  focusNoteStrong: { fontWeight: '700' },

  checkinNudge: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#fcd34d',
  },
  checkinNudgeEmoji: { fontSize: 28 },
  checkinNudgeText: { flex: 1 },
  checkinNudgeTitle: { fontSize: 15, fontWeight: '700', color: '#92400e' },
  checkinNudgeSub: { fontSize: 13, color: '#b45309', marginTop: 2 },

  journeyCard: {
    borderRadius: 20, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  journeyHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  journeyPhaseLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  journeyPhaseName: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 2 },
  journeyWeekBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  journeyWeekText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  journeyGoals: { backgroundColor: '#fff', padding: 16 },
  journeyGoalsTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  goalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  goalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginTop: 6 },
  goalText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 20 },

  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  activityEmoji: { fontSize: 28, marginTop: 2 },
  activityText: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  activityMeta: { fontSize: 12, color: '#6b7280' },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeChip: {
    backgroundColor: '#f3f4f6', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  badgeChipText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  challengesBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  challengesBtnEmoji: { fontSize: 32 },
  challengesBtnText: { flex: 1 },
  challengesBtnTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  challengesBtnSub: { fontSize: 13, color: '#6b7280', marginTop: 1 },
  dashBtn: {
    borderRadius: 16, padding: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
  },
  dashBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' },
  emptySub: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  emptyBtn: { borderRadius: 50, paddingVertical: 16, paddingHorizontal: 32 },
  emptyBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
