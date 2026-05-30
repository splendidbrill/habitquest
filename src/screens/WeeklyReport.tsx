import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, TrendingUp, Award, Heart, Utensils, Footprints } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

export function WeeklyReport() {
  const navigation = useNavigation();

  const weeklyStats = { activityStreak: 5, healthySnackChoices: 12, missionsCompleted: 8, familyMealsCooked: 8, weekNumber: 3 };
  const achievements = [
    { title: 'Consistent Activity', description: 'Your family stayed active 5 days this week!', Icon: Footprints, color: colors.primary },
    { title: 'Healthy Snacking', description: '12 healthy snack choices - amazing!', Icon: Heart, color: colors.secondary },
    { title: 'Home Cooking Champion', description: '8 home-cooked family meals this week', Icon: Utensils, color: colors.accentForeground },
  ];
  const weekComparison = [
    { week: 'Week 1', meals: 4, activity: 3 },
    { week: 'Week 2', meals: 6, activity: 4 },
    { week: 'Week 3', meals: 8, activity: 5 },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Weekly Family Report</Text>
          <Text style={styles.subtitle}>Week {weeklyStats.weekNumber} Summary</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.bigWinCard}
      >
        <Award size={64} color={colors.secondary} style={{ alignSelf: 'center', marginBottom: 16 }} />
        <Text style={[styles.bigWinTitle, { textAlign: 'center' }]}>Brilliant week!</Text>
        <Text style={styles.bigWinText}>
          Your family completed{' '}
          <Text style={{ fontWeight: '700', color: colors.primary }}>{weeklyStats.familyMealsCooked} healthy meals</Text>
          {' '}this week! 🎉
        </Text>
        <Text style={styles.bigWinSub}>
          That's {weeklyStats.familyMealsCooked - weekComparison[1].meals} more than last week
        </Text>
      </LinearGradient>

      <View style={styles.statsGrid}>
        {[
          { value: weeklyStats.activityStreak, label: 'Activity streak (days)', color: colors.primary },
          { value: weeklyStats.healthySnackChoices, label: 'Healthy snack choices', color: colors.secondary },
          { value: weeklyStats.missionsCompleted, label: 'Missions completed', color: colors.accentForeground },
          { value: weeklyStats.familyMealsCooked, label: 'Family meals cooked', color: colors.primary },
        ].map((stat, i) => (
          <Card key={i} style={styles.statCard}>
            <Text style={[styles.statNum, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>This week's achievements</Text>
      <View style={styles.achievList}>
        {achievements.map((a, i) => (
          <Card key={i} style={styles.achievCard}>
            <View style={styles.achievRow}>
              <View style={[styles.achievIcon, { backgroundColor: withOpacity(colors.secondary, 0.2) }]}>
                <a.Icon size={24} color={a.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.achievTitle}>{a.title}</Text>
                <Text style={styles.achievDesc}>{a.description}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <TrendingUp size={18} color={colors.primary} />
          <Text style={styles.progressTitle}>Your progress over time</Text>
        </View>
        {weekComparison.map((week, i) => (
          <View key={i} style={styles.weekRow}>
            <View style={styles.weekLabelRow}>
              <Text style={styles.weekLabel}>{week.week}</Text>
              <Text style={styles.weekMeta}>{week.meals} meals • {week.activity} active days</Text>
            </View>
            <View style={styles.bars}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(week.meals / 10) * 100}%`, backgroundColor: colors.primary }]} />
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(week.activity / 7) * 100}%`, backgroundColor: colors.secondary }]} />
              </View>
            </View>
          </View>
        ))}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Healthy meals</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
            <Text style={styles.legendText}>Active days</Text>
          </View>
        </View>
      </Card>

      <LinearGradient
        colors={[withOpacity(colors.primary, 0.1), withOpacity(colors.secondary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.encCard}
      >
        <Text style={[styles.encTitle, { textAlign: 'center' }]}>Keep going! 💪</Text>
        <Text style={styles.encText}>
          Every small step counts. You're building healthy habits that will last a lifetime. Your family is doing brilliantly!
        </Text>
        <Button onPress={() => navigation.goBack()} style={[styles.encBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primaryForeground }}>Back to dashboard</Text>
        </Button>
      </LinearGradient>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  bigWinCard: { borderRadius: radius, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  bigWinTitle: { ...typography.h2, marginBottom: 8 },
  bigWinText: { fontSize: 16, color: colors.foreground, textAlign: 'center', marginBottom: 6 },
  bigWinSub: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '47%', padding: 20, alignItems: 'center' },
  statNum: { fontSize: 40, fontWeight: '700', marginBottom: 6 },
  statLabel: { fontSize: 12, color: colors.mutedForeground, textAlign: 'center' },
  sectionTitle: { ...typography.h3, marginBottom: 12 },
  achievList: { gap: 8, marginBottom: 16 },
  achievCard: { padding: 16 },
  achievRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  achievIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  achievTitle: { fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
  achievDesc: { fontSize: 13, color: colors.mutedForeground },
  progressCard: { padding: 20, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  progressTitle: { ...typography.h4 },
  weekRow: { marginBottom: 14 },
  weekLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  weekLabel: { fontSize: 13, fontWeight: '500', color: colors.foreground },
  weekMeta: { fontSize: 11, color: colors.mutedForeground },
  bars: { flexDirection: 'row', gap: 6 },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.accent, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.mutedForeground },
  encCard: { borderRadius: radius, padding: 20, borderWidth: 1, borderColor: withOpacity(colors.primary, 0.2), alignItems: 'center' },
  encTitle: { ...typography.h3, marginBottom: 8 },
  encText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  encBtn: { alignSelf: 'stretch' },
});
