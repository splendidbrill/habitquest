import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Apple, Footprints, Droplets, Check, Zap, Lightbulb } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RecipeCard } from '../components/RecipeCard';
import { indianRecipes, Recipe } from '../data/recipes';
import { getOnboardingData, getActivityLevel, hasEquipment, hasSpace, needsQuickMeals } from '../utils/personalization';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const coachingTips = [
  'Children copy what parents eat. Try eating fruit together.',
  'Keep healthy snacks visible and junk food out of sight.',
  'Offer water before sugary drinks.',
  "Let children help in the kitchen - they're more likely to try foods they've helped prepare.",
  'It can take 10-15 tries before a child accepts a new food. Keep offering without pressure.',
  'Make mealtimes screen-free zones for the whole family.',
  'Offer new foods alongside familiar favorites to reduce anxiety.',
  'Use small plates and let children ask for more if still hungry.',
  "Avoid using dessert as a reward - it makes sweet foods seem more special.",
  'Regular family meals are linked to better nutrition and mental health in children.',
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [todaysRecipe, setTodaysRecipe] = useState<Recipe | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState('Good morning! 👋');
  const [weeklyFocus, setWeeklyFocus] = useState({
    title: "This week's focus",
    description: 'Adding colour to meals – no pressure, just exploring new foods together',
  });
  const [coachingTip, setCoachingTip] = useState('');
  const [personalizedTasks, setPersonalizedTasks] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const data = await getOnboardingData();
      const hour = new Date().getHours();
      let greeting = 'Good morning! 👋';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon! 👋';
      if (hour >= 17) greeting = 'Good evening! 👋';
      setWelcomeMessage(greeting);

      const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 10;
      setCoachingTip(coachingTips[weekNum]);

      if (data?.['2']) {
        const goals = data['2'] as string[];
        if (goals.includes('Create more balanced family meals')) {
          setWeeklyFocus({ title: "This week's focus", description: 'Building balanced plates – adding protein, veg, and grains to meals you already love' });
        } else if (goals.includes('Support my child to be more active')) {
          setWeeklyFocus({ title: "This week's focus", description: 'Moving more as a family – finding fun ways to be active together' });
        } else if (goals.includes('Encourage my child to eat more variety')) {
          setWeeklyFocus({ title: "This week's focus", description: 'Trying new foods – exploring one new ingredient this week, no pressure' });
        }
      }

      let pool = indianRecipes;
      if (data && needsQuickMeals(data)) {
        const quick = pool.filter(r => r.prepTime.includes('10') || r.prepTime.includes('15') || r.prepTime.includes('20'));
        if (quick.length > 0) pool = quick;
      }
      const dayIdx = new Date().getDate() % pool.length;
      const recipe = pool[dayIdx];
      setTodaysRecipe(recipe);

      const tasks: any[] = [];
      tasks.push({ id: 1, icon: Apple, title: recipe.title, subtitle: 'Tap to see the full recipe', hasRecipe: true });

      let movementTask = { id: 2, icon: Footprints, title: '30 minutes of active play', subtitle: 'Any movement counts!' };
      if (data) {
        const level = getActivityLevel(data);
        if (hasSpace(data, 'Local park') && hasEquipment(data, 'Ball')) {
          movementTask = { id: 2, icon: Footprints, title: 'Park football session', subtitle: 'Head to the park with a ball - 30 minutes' };
        } else if (hasEquipment(data, 'Bike')) {
          movementTask = { id: 2, icon: Footprints, title: 'Bike ride around the block', subtitle: 'Even 15 minutes counts as great exercise' };
        } else if (level === 'low') {
          movementTask = { id: 2, icon: Footprints, title: 'Gentle 15 minute walk', subtitle: 'Start small - to the shops or around the block' };
        }
      }
      tasks.push(movementTask);
      tasks.push({ id: 3, icon: Droplets, title: 'Water with meals today', subtitle: 'Keep a jug on the table at dinner' });
      setPersonalizedTasks(tasks);
    };
    init();
  }, []);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.greeting}>{welcomeMessage}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Heart size={20} color={colors.secondaryForeground} />
        </View>
      </View>

      {/* Dinner Rescue */}
      <Pressable onPress={() => navigation.navigate('DinnerRescue')}>
        <LinearGradient
          colors={[withOpacity(colors.destructive, 0.1), withOpacity(colors.primary, 0.1)]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.rescueCard}
        >
          <View style={styles.rescueIcon}>
            <Zap size={28} color={colors.destructive} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rescueTitle}>What do I cook tonight? 🚨</Text>
            <Text style={styles.rescueSubtitle}>Get instant meal ideas based on what you have at home</Text>
          </View>
        </LinearGradient>
      </Pressable>

      {/* Coaching tip */}
      <Card style={styles.tipCard}>
        <View style={styles.tipRow}>
          <Lightbulb size={18} color={colors.accentForeground} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>This week's coaching tip:</Text>
            <Text style={styles.tipText}>{coachingTip}</Text>
          </View>
        </View>
      </Card>

      {/* Weekly focus */}
      <LinearGradient
        colors={[withOpacity(colors.primary, 0.1), withOpacity(colors.secondary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.focusCard}
      >
        <View style={styles.focusIcon}>
          <Apple size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.focusTitle}>{weeklyFocus.title}</Text>
          <Text style={styles.focusDesc}>{weeklyFocus.description}</Text>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day 4 of 7</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Encouragement */}
      <Card style={[styles.encourageCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.encourageText}>
          <Text style={{ fontWeight: '600' }}>Brilliant!</Text> You've ticked off activities this week. Remember, every small step counts and you're doing great.
        </Text>
      </Card>

      {/* Today's plan */}
      <Text style={styles.sectionTitle}>Today's plan</Text>
      <View style={styles.tasks}>
        {personalizedTasks.map(task => (
          <Card key={task.id} style={styles.taskCard}>
            {task.hasRecipe && todaysRecipe ? (
              <RecipeCard recipe={todaysRecipe} compact />
            ) : (
              <View style={styles.taskRow}>
                <View style={styles.taskIcon}>
                  <task.icon size={20} color={colors.mutedForeground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                </View>
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipCardTitle}>💡 Today's tip</Text>
        <Text style={styles.tipCardDesc}>
          Let your child help in the kitchen - even small tasks like washing vegetables or stirring makes them more likely to try new foods.
        </Text>
        <Button variant="outline" size="sm" onPress={() => navigation.navigate('Recipes')} style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: colors.foreground }}>View recipe library</Text>
        </Button>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  date: { fontSize: 13, color: colors.mutedForeground, marginBottom: 2 },
  greeting: { ...typography.h1 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  rescueCard: { borderRadius: radius, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.destructive, 0.2) },
  rescueIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: withOpacity(colors.destructive, 0.2), alignItems: 'center', justifyContent: 'center' },
  rescueTitle: { ...typography.h3, marginBottom: 4 },
  rescueSubtitle: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  tipCard: { padding: 16, marginBottom: 16, backgroundColor: colors.accent, borderColor: colors.accent },
  tipRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tipLabel: { fontSize: 11, fontWeight: '600', color: colors.accentForeground, marginBottom: 4 },
  tipText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
  focusCard: { borderRadius: radius, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.primary, 0.2) },
  focusIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: withOpacity(colors.primary, 0.2), alignItems: 'center', justifyContent: 'center' },
  focusTitle: { ...typography.h3, marginBottom: 4 },
  focusDesc: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 10 },
  dayBadge: { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  dayBadgeText: { fontSize: 11, color: colors.foreground },
  encourageCard: { padding: 16, marginBottom: 20 },
  encourageText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
  sectionTitle: { ...typography.h2, marginBottom: 12 },
  tasks: { gap: 10, marginBottom: 20 },
  taskCard: { padding: 16 },
  taskRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  taskIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { ...typography.h4, marginBottom: 4 },
  taskSubtitle: { fontSize: 13, color: colors.mutedForeground },
  tipsCard: { padding: 20 },
  tipCardTitle: { ...typography.h3, marginBottom: 8 },
  tipCardDesc: { fontSize: 14, color: colors.mutedForeground, lineHeight: 20 },
});
