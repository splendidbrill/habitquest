import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Apple, Footprints, Moon, Trophy, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { colors, typography, radius, withOpacity } from '../theme';

export function Progress() {
  const achievements = [
    { id: 1, title: 'Tried 3 new Indian dishes', description: 'Explored dal with vegetables, chicken tikka wraps, and vegetable pulao', Icon: Apple, bgColor: withOpacity(colors.primary, 0.1), iconColor: colors.primary, date: 'This week' },
    { id: 2, title: '5 park football sessions', description: 'Great active play - building skills and fitness!', Icon: Footprints, bgColor: withOpacity(colors.secondary, 0.1), iconColor: colors.secondary, date: 'This week' },
    { id: 3, title: 'Water with meals', description: 'Chose water instead of juice 6 out of 7 days', Icon: Moon, bgColor: colors.accent, iconColor: colors.accentForeground, date: 'This week' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your progress</Text>
        <Text style={styles.subtitle}>Celebrating the small wins that matter</Text>
      </View>

      {/* Celebration card */}
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
          <Text style={styles.celebSub}>You've completed 14 activities this week. Every step counts!</Text>
        </View>
      </LinearGradient>

      {/* Streak */}
      <Card style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View style={styles.streakIcon}>
            <Sparkles size={20} color={colors.accentForeground} />
          </View>
          <View>
            <Text style={styles.streakTitle}>Weekly streak</Text>
            <Text style={styles.streakSub}>3 weeks in a row</Text>
          </View>
        </View>
        <Text style={styles.streakDesc}>You've been using the app for 3 consecutive weeks. Keep up the momentum!</Text>
      </Card>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>This week's highlights</Text>
      <View style={styles.list}>
        {achievements.map(a => (
          <Card key={a.id} style={styles.achievCard}>
            <View style={styles.achievRow}>
              <View style={[styles.achievIcon, { backgroundColor: a.bgColor }]}>
                <a.Icon size={22} color={a.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.achievTitle}>{a.title}</Text>
                <Text style={styles.achievDesc}>{a.description}</Text>
                <Text style={styles.achievDate}>{a.date}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Behaviour patterns */}
      <Card style={styles.patternCard}>
        <Text style={styles.sectionTitle}>Behaviour patterns</Text>
        <View style={styles.bars}>
          <View>
            <View style={styles.barLabel}>
              <Text style={styles.barText}>New foods tried</Text>
              <Text style={styles.barValue}>3 this week</Text>
            </View>
            <ProgressBar value={3} total={5} color={colors.primary} />
          </View>
          <View>
            <View style={styles.barLabel}>
              <Text style={styles.barText}>Active play sessions</Text>
              <Text style={styles.barValue}>5 this week</Text>
            </View>
            <ProgressBar value={5} total={6} color={colors.secondary} />
          </View>
          <View>
            <View style={styles.barLabel}>
              <Text style={styles.barText}>Routine consistency</Text>
              <Text style={styles.barValue}>6 out of 7 days</Text>
            </View>
            <ProgressBar value={6} total={7} color={colors.accentForeground} />
          </View>
        </View>
      </Card>

      {/* Encouragement */}
      <Card style={[styles.rememberCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.rememberTitle}>Remember</Text>
        <Text style={styles.rememberText}>
          We're tracking behaviours and habits, not numbers on a scale. Every small positive change is worth celebrating. You're doing a great job! 💚
        </Text>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { marginBottom: 20 },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground },
  celebCard: { borderRadius: radius, padding: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  trophyCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: withOpacity(colors.primary, 0.2), alignItems: 'center', justifyContent: 'center' },
  celebTitle: { ...typography.h2, marginBottom: 4 },
  celebSub: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  streakCard: { padding: 20, marginBottom: 20 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  streakIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  streakTitle: { ...typography.h3 },
  streakSub: { fontSize: 13, color: colors.mutedForeground },
  streakDesc: { fontSize: 14, color: colors.mutedForeground, lineHeight: 20 },
  sectionTitle: { ...typography.h2, marginBottom: 12 },
  list: { gap: 10, marginBottom: 20 },
  achievCard: { padding: 16 },
  achievRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  achievIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  achievTitle: { ...typography.h4, marginBottom: 4 },
  achievDesc: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 4 },
  achievDate: { fontSize: 12, color: colors.mutedForeground },
  patternCard: { padding: 20, marginBottom: 16 },
  bars: { gap: 16 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barText: { fontSize: 14, color: colors.foreground },
  barValue: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  rememberCard: { padding: 20 },
  rememberTitle: { ...typography.h3, marginBottom: 8 },
  rememberText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
});
