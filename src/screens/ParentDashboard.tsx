import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Heart, ShoppingCart, Camera, Lightbulb, TrendingUp, Users,
  BookOpen, CheckCircle, Award, Sparkles,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const tools = [
  { label: 'Grocery List', desc: "One-click list for this week's meals", Icon: ShoppingCart, color: withOpacity(colors.primary, 0.1), iconColor: colors.primary, route: 'GroceryList' },
  { label: 'Pantry Mode', desc: 'Meals from what you have', Icon: BookOpen, color: withOpacity(colors.secondary, 0.1), iconColor: colors.secondary, route: 'PantryMode' },
  { label: 'Healthy Swaps', desc: 'Cheap, simple alternatives', Icon: TrendingUp, color: colors.accent, iconColor: colors.accentForeground, route: 'HealthySwaps' },
  { label: 'Photo Rewards', desc: 'Upload & earn vouchers', Icon: Camera, color: withOpacity(colors.primary, 0.1), iconColor: colors.primary, route: 'PhotoRewards' },
  { label: 'Quick Meals', desc: 'Under 15 min & £5', Icon: Lightbulb, color: withOpacity(colors.secondary, 0.1), iconColor: colors.secondary, route: 'QuickMealMode' },
  { label: 'Budget Tracker', desc: 'See money saved', Icon: TrendingUp, color: colors.accent, iconColor: colors.accentForeground, route: 'BudgetTracker' },
  { label: 'Your Rewards', desc: 'Points & prizes', Icon: Award, color: withOpacity(colors.primary, 0.1), iconColor: colors.primary, route: 'ParentRewards' },
  { label: 'Weekly Report', desc: 'Family progress', Icon: TrendingUp, color: withOpacity(colors.secondary, 0.1), iconColor: colors.secondary, route: 'WeeklyReport' },
  { label: 'Lunch Tracker', desc: 'What they ate today', Icon: BookOpen, color: withOpacity(colors.primary, 0.1), iconColor: colors.primary, route: 'SchoolLunchTracker' },
  { label: 'Behaviour Tips', desc: 'Quick advice cards', Icon: Lightbulb, color: colors.accent, iconColor: colors.accentForeground, route: 'FoodBehaviourTips' },
];

export function ParentDashboard() {
  const navigation = useNavigation<Nav>();
  const [parentStreak] = useState(4);
  const [childStreak] = useState(3);
  const [thisWeekMeals] = useState(2);
  const [thisWeekWorkouts] = useState(1);
  const progressToBonus = thisWeekMeals >= 3 && thisWeekWorkouts >= 2;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Parent Dashboard</Text>
        <Text style={styles.subtitle}>Your participation helps the whole family succeed</Text>
      </View>

      {/* Co-Participation */}
      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.participCard}
      >
        <View style={styles.participHeader}>
          <View style={styles.usersCircle}>
            <Users size={20} color={colors.secondaryForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.participTitle}>Family Participation</Text>
            <Text style={styles.participSub}>Your child can see your progress too! Lead by example.</Text>
          </View>
        </View>

        <View style={styles.streaks}>
          <View style={styles.streakItem}>
            <View style={styles.streakLeft}>
              <Text style={{ fontSize: 22 }}>👨‍👩‍👧</Text>
              <Text style={styles.streakLabel}>Your streak</Text>
            </View>
            <Text style={[styles.streakValue, { color: colors.primary }]}>{parentStreak} days</Text>
          </View>
          <View style={styles.streakItem}>
            <View style={styles.streakLeft}>
              <Text style={{ fontSize: 22 }}>🧒</Text>
              <Text style={styles.streakLabel}>Child's streak</Text>
            </View>
            <Text style={[styles.streakValue, { color: colors.secondary }]}>{childStreak} days</Text>
          </View>
        </View>

        <Text style={styles.goalsLabel}>This week's goals:</Text>
        <View style={styles.goalRow}>
          <CheckCircle size={20} color={thisWeekMeals >= 3 ? colors.secondary : colors.mutedForeground} />
          <Text style={styles.goalText}>Home-cooked meals: {thisWeekMeals}/3</Text>
        </View>
        <View style={styles.goalRow}>
          <CheckCircle size={20} color={thisWeekWorkouts >= 2 ? colors.secondary : colors.mutedForeground} />
          <Text style={styles.goalText}>Your workouts: {thisWeekWorkouts}/2</Text>
        </View>

        {progressToBonus ? (
          <View style={styles.bonusBox}>
            <Award size={22} color={colors.secondaryForeground} />
            <Text style={styles.bonusText}>Amazing! Your child has earned a bonus reward this week! 🎉</Text>
          </View>
        ) : (
          <Text style={styles.bonusHint}>Complete your goals this week to unlock a bonus reward for your child</Text>
        )}
      </LinearGradient>

      {/* Quick Actions Grid */}
      <View style={styles.grid}>
        {tools.map((tool, i) => (
          <Pressable
            key={i}
            style={styles.gridItem}
            onPress={() => navigation.navigate(tool.route as any)}
          >
            <Card style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: tool.color }]}>
                <tool.Icon size={24} color={tool.iconColor} />
              </View>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.toolDesc}>{tool.desc}</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* Mood Summary */}
      <Card style={styles.moodCard}>
        <View style={styles.moodHeader}>
          <Sparkles size={18} color={colors.primary} />
          <Text style={styles.moodTitle}>This Week's Mood Summary</Text>
        </View>
        {[{ day: 'Monday', emoji: '😊' }, { day: 'Wednesday', emoji: '😐' }, { day: 'Friday', emoji: '😊' }].map((m, i) => (
          <View key={i} style={styles.moodRow}>
            <Text style={styles.moodDay}>{m.day}</Text>
            <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
          </View>
        ))}
        <Text style={styles.moodNote}>Your child has been mostly happy this week. Keep celebrating the small wins!</Text>
      </Card>

      {/* Support Resources */}
      <Card style={styles.supportCard}>
        <View style={styles.supportHeader}>
          <BookOpen size={18} color={colors.primary} />
          <Text style={styles.supportTitle}>Support & Guidance</Text>
        </View>
        <Button variant="outline" style={styles.supportBtn} onPress={() => navigation.navigate('HandlingResistance')}>
          <Text style={styles.supportBtnText}>Handling resistance to new foods</Text>
          <Lightbulb size={14} color={colors.foreground} />
        </Button>
        <Button variant="outline" style={styles.supportBtn} onPress={() => navigation.navigate('SupportiveResponses')}>
          <Text style={styles.supportBtnText}>Supportive responses guide</Text>
          <Heart size={14} color={colors.foreground} />
        </Button>
        <Button variant="outline" style={styles.supportBtn} onPress={() => navigation.navigate('DifficultBehaviors')}>
          <Text style={styles.supportBtnText}>Dealing with difficult behaviors</Text>
          <BookOpen size={14} color={colors.foreground} />
        </Button>
      </Card>

      {/* Gentle reminder */}
      <View style={styles.reminder}>
        <Text style={styles.reminderText}>
          <Text style={{ fontWeight: '600' }}>💡 Gentle reminder:</Text> It's been 2 days since you logged a family meal together. No pressure – when you're ready, the app is here to support you.
        </Text>
      </View>

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
  participCard: { borderRadius: radius, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  participHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  usersCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: withOpacity(colors.secondary, 0.2), alignItems: 'center', justifyContent: 'center' },
  participTitle: { ...typography.h3, marginBottom: 4 },
  participSub: { fontSize: 13, color: colors.mutedForeground },
  streaks: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: radius, padding: 16, marginBottom: 16, gap: 12 },
  streakItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakLabel: { fontSize: 15, fontWeight: '500', color: colors.foreground },
  streakValue: { fontSize: 22, fontWeight: '700' },
  goalsLabel: { fontSize: 13, fontWeight: '500', marginBottom: 8, color: colors.foreground },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  goalText: { fontSize: 13, color: colors.foreground },
  bonusBox: { backgroundColor: withOpacity(colors.secondary, 0.2), borderRadius: radius, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 8 },
  bonusText: { fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
  bonusHint: { fontSize: 11, color: colors.mutedForeground, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  gridItem: { width: '47%' },
  toolCard: { padding: 16 },
  toolIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  toolLabel: { ...typography.h4, marginBottom: 4 },
  toolDesc: { fontSize: 12, color: colors.mutedForeground, lineHeight: 16 },
  moodCard: { padding: 20, marginBottom: 16 },
  moodHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  moodTitle: { ...typography.h3 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  moodDay: { fontSize: 14, color: colors.foreground },
  moodNote: { fontSize: 12, color: colors.mutedForeground, marginTop: 8, lineHeight: 18 },
  supportCard: { padding: 20, marginBottom: 16 },
  supportHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  supportTitle: { ...typography.h3 },
  supportBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  supportBtnText: { flex: 1, fontSize: 14, color: colors.foreground, textAlign: 'left' },
  reminder: { backgroundColor: withOpacity(colors.accent, 0.5), borderRadius: radius, padding: 16, borderWidth: 1, borderColor: colors.accent },
  reminderText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
});
