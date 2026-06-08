import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Trophy, Sparkles, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { colors, typography, radius, withOpacity } from '../theme';
import { useParentData } from '../hooks/useParentData';
import { useFocusEffect } from '@react-navigation/native';

const STREAK_MILESTONES = [7, 30, 100];

function nextMilestone(streak: number): number {
  return STREAK_MILESTONES.find(m => m > streak) ?? 100;
}

export function Progress() {
  const { children, loading, reload } = useParentData();

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!children.length) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your progress</Text>
          <Text style={styles.subtitle}>Celebrating the small wins that matter</Text>
        </View>
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No children added yet</Text>
          <Text style={styles.emptyText}>Add your child's profile to start tracking progress.</Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your progress</Text>
        <Text style={styles.subtitle}>Celebrating the small wins that matter</Text>
      </View>

      {children.map(child => {
        const recentMissions = child.recentMissions ?? [];
        const streak = child.streak ?? 0;
        const next = nextMilestone(streak);
        const pillars = child.pillarScores;
        const badges = child.badges ?? [];

        const totalMissions = recentMissions.length;
        const thisWeekMissions = recentMissions.filter(m => {
          const d = new Date(m.completed_at);
          const now = new Date();
          const dayAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return d >= dayAgo;
        }).length;

        return (
          <View key={child.id} style={styles.childSection}>
            {/* Child header */}
            <View style={styles.childHeader}>
              <View style={styles.childAvatar}>
                <Text style={styles.childAvatarText}>{child.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childLevel}>{child.level} · {child.xp} XP</Text>
              </View>
            </View>

            {/* Celebration card — only show if there's real activity */}
            {thisWeekMissions > 0 && (
              <LinearGradient
                colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.2)]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.celebCard}
              >
                <View style={styles.trophyCircle}>
                  <Trophy size={28} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.celebTitle}>Great work! 🎉</Text>
                  <Text style={styles.celebSub}>
                    {child.name} completed {thisWeekMissions} mission{thisWeekMissions !== 1 ? 's' : ''} this week. Every step counts!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {/* Streak + milestone bar */}
            <Card style={styles.streakCard}>
              <View style={styles.streakRow}>
                <View style={styles.streakIcon}>
                  <Flame size={20} color="#f97316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streakTitle}>{streak} day streak 🔥</Text>
                  <Text style={styles.streakSub}>
                    {streak === 0
                      ? 'Complete a mission today to start your streak!'
                      : `${next - streak} more day${next - streak !== 1 ? 's' : ''} to reach the ${next}-day milestone`}
                  </Text>
                </View>
                {child.streak_freezes > 0 && (
                  <View style={styles.freezeBadge}>
                    <Text style={styles.freezeText}>🧊 {child.streak_freezes}</Text>
                  </View>
                )}
              </View>
              {/* Milestone progress bar */}
              <View style={styles.milestoneRow}>
                {STREAK_MILESTONES.map(m => {
                  const reached = streak >= m;
                  return (
                    <View key={m} style={styles.milestone}>
                      <View style={[styles.milestoneDot, reached && styles.milestoneDotDone]}>
                        <Text style={styles.milestoneDotText}>{reached ? '✓' : m}</Text>
                      </View>
                      <Text style={styles.milestoneLabel}>{m}d</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.streakTrack}>
                <View style={[styles.streakFill, { width: `${Math.min((streak / next) * 100, 100)}%` as any }]} />
              </View>
            </Card>

            {/* Pillar scores */}
            {Object.values(pillars).some(v => v > 0) && (
              <Card style={styles.patternCard}>
                <Text style={styles.sectionTitle}>Health pillar scores</Text>
                <View style={styles.bars}>
                  {[
                    { label: 'Nutrition 🥕', key: 'nutrition', color: '#22c55e' },
                    { label: 'Movement ⚽', key: 'movement', color: '#f97316' },
                    { label: 'Sleep 😴',    key: 'sleep',     color: '#8b5cf6' },
                    { label: 'Confidence 🧠', key: 'confidence', color: '#ec4899' },
                  ].map(({ label, key, color }) => {
                    const val = pillars[key as keyof typeof pillars] ?? 0;
                    return (
                      <View key={key}>
                        <View style={styles.barLabel}>
                          <Text style={styles.barText}>{label}</Text>
                          <Text style={[styles.barValue, { color }]}>{val}</Text>
                        </View>
                        <ProgressBar value={val} total={100} color={color} />
                      </View>
                    );
                  })}
                </View>
              </Card>
            )}

            {/* Recent missions */}
            {recentMissions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recent missions</Text>
                <View style={styles.list}>
                  {recentMissions.slice(0, 3).map((m, i) => (
                    <Card key={i} style={styles.achievCard}>
                      <View style={styles.achievRow}>
                        <View style={[styles.achievIcon, { backgroundColor: withOpacity(colors.primary, 0.1) }]}>
                          <Trophy size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.achievTitle}>{m.mission_title}</Text>
                          <Text style={styles.achievDesc}>+{m.xp_earned} XP · {m.pillar}</Text>
                          <Text style={styles.achievDate}>
                            {new Date(m.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  ))}
                </View>
              </>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <Card style={styles.badgesCard}>
                <View style={styles.badgesTitleRow}>
                  <Sparkles size={16} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Badges earned ({badges.length})</Text>
                </View>
                <View style={styles.badgesRow}>
                  {badges.slice(0, 6).map((b, i) => (
                    <View key={i} style={styles.badgeChip}>
                      <Text style={styles.badgeText}>🏅 {b.badge_name}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Nothing yet */}
            {totalMissions === 0 && streak === 0 && badges.length === 0 && (
              <Card style={[styles.emptyCard, { backgroundColor: colors.accent }]}>
                <Text style={styles.emptyEmoji}>🌱</Text>
                <Text style={styles.emptyTitle}>Just getting started!</Text>
                <Text style={styles.emptyText}>
                  {child.name}'s progress will appear here once they start completing missions.
                </Text>
              </Card>
            )}
          </View>
        );
      })}

      <Card style={[styles.rememberCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.rememberTitle}>Remember</Text>
        <Text style={styles.rememberText}>
          We track behaviours and habits, not numbers on a scale. Every small positive change is worth celebrating. 💚
        </Text>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: { marginBottom: 20 },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground },

  childSection: { marginBottom: 8 },
  childHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  childAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  childAvatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  childName: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  childLevel: { fontSize: 13, color: colors.mutedForeground },

  celebCard: { borderRadius: radius, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 14, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  trophyCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: withOpacity(colors.primary, 0.2), alignItems: 'center', justifyContent: 'center' },
  celebTitle: { ...typography.h3, marginBottom: 4 },
  celebSub: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },

  streakCard: { padding: 18, marginBottom: 14 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  streakIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' },
  streakTitle: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  streakSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  freezeBadge: { backgroundColor: '#e0f2fe', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  freezeText: { fontSize: 13, fontWeight: '700', color: '#0369a1' },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  milestone: { alignItems: 'center', gap: 4 },
  milestoneDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  milestoneDotDone: { backgroundColor: '#22c55e' },
  milestoneDotText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  milestoneLabel: { fontSize: 10, color: colors.mutedForeground, fontWeight: '600' },
  streakTrack: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  streakFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 4 },

  patternCard: { padding: 20, marginBottom: 14 },
  bars: { gap: 14 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barText: { fontSize: 14, color: colors.foreground },
  barValue: { fontSize: 14, fontWeight: '700' },

  sectionTitle: { ...typography.h3, marginBottom: 12 },
  list: { gap: 10, marginBottom: 16 },
  achievCard: { padding: 16 },
  achievRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  achievIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  achievTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 2 },
  achievDesc: { fontSize: 12, color: colors.mutedForeground, marginBottom: 2 },
  achievDate: { fontSize: 11, color: colors.mutedForeground },

  badgesCard: { padding: 18, marginBottom: 14 },
  badgesTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeChip: { backgroundColor: withOpacity(colors.primary, 0.08), borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.primary },

  emptyCard: { padding: 28, alignItems: 'center', marginBottom: 16 },
  emptyEmoji: { fontSize: 48, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 6 },
  emptyText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 },

  rememberCard: { padding: 20, marginTop: 4 },
  rememberTitle: { ...typography.h3, marginBottom: 8 },
  rememberText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
});
