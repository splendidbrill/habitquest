import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Animated, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Heart, Clock, Lightbulb, Sparkles, ChevronRight,
  ShoppingCart, TrendingUp, Check,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const mealOptions = [
  { id: '1', name: 'Vegetable Pasta', time: 15, cost: 3.0, ingredients: ['Pasta', 'Mixed vegetables', 'Tomato sauce', 'Garlic', 'Olive oil'] },
  { id: '2', name: 'Chicken Wraps', time: 20, cost: 4.0, ingredients: ['Tortilla wraps', 'Chicken breast', 'Lettuce', 'Tomatoes', 'Mayo'] },
  { id: '3', name: 'Bean Tacos', time: 15, cost: 2.0, ingredients: ['Taco shells', 'Black beans', 'Cheese', 'Salsa', 'Lettuce'] },
];

const shoppingList = [
  { category: 'Fruit & Vegetables', items: ['Apples', 'Bananas', 'Carrots', 'Lettuce', 'Tomatoes'] },
  { category: 'Dairy', items: ['Milk', 'Cheese', 'Yogurt', 'Butter'] },
  { category: 'Grains', items: ['Wholegrain bread', 'Pasta', 'Rice', 'Oats'] },
  { category: 'Proteins', items: ['Chicken breast', 'Eggs', 'Black beans', 'Lentils'] },
];

const healthySwaps = [
  { from: 'Sugary cereal', to: 'Oats + fruit' },
  { from: 'Crisps', to: 'Homemade popcorn' },
  { from: 'Fizzy drinks', to: 'Fruit water' },
];

const lunchboxIdeas = ['Wholegrain sandwich', 'Apple slices', 'Yogurt pot', 'Carrot sticks', 'Water bottle'];

const weeklyProgress = {
  familyMeals: { completed: 6, total: 7 },
  activityMissions: { completed: 8, total: 10 },
  healthySwaps: { completed: 5, total: 7 },
};

export function ParentHome() {
  const navigation = useNavigation<Nav>();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const chevronAnims = useRef(
    mealOptions.reduce((acc, m) => {
      acc[m.id] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  const toggleMeal = (id: string) => {
    const wasSelected = selectedMeal === id;
    if (selectedMeal) {
      Animated.spring(chevronAnims[selectedMeal], { toValue: 0, useNativeDriver: true }).start();
    }
    if (!wasSelected) {
      Animated.spring(chevronAnims[id], { toValue: 1, useNativeDriver: true }).start();
    }
    setSelectedMeal(wasSelected ? null : id);
  };

  const totalItems = shoppingList.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Parent Dashboard</Text>
          <Text style={styles.subtitle}>Supporting you every step of the way</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Heart size={20} color={colors.primary} />
        </View>
      </View>

      {/* Daily Coaching Card */}
      <LinearGradient
        colors={[withOpacity(colors.primary, 0.1), withOpacity(colors.secondary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.coachCard}
      >
        <View style={styles.coachRow}>
          <View style={styles.sparkleCircle}>
            <Sparkles size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.coachMsg}>Small habits make big changes.</Text>
            <Text style={styles.coachTip}>
              <Text style={{ fontWeight: '600' }}>Today's tip:</Text> Children are more likely to try new foods if they see parents eating them.
            </Text>
          </View>
        </View>
        <Button style={styles.coachBtn}>
          <Text style={styles.coachBtnText}>Try this today</Text>
        </Button>
      </LinearGradient>

      {/* Tonight's Meal Helper */}
      <Card style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Lightbulb size={18} color={colors.secondary} />
          <Text style={styles.cardTitle}>What could we cook tonight?</Text>
        </View>
        <View style={styles.meals}>
          {mealOptions.map(meal => {
            const isOpen = selectedMeal === meal.id;
            const chevronRotate = chevronAnims[meal.id].interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });
            return (
              <Pressable key={meal.id} style={styles.mealRow} onPress={() => toggleMeal(meal.id)}>
                <View style={styles.mealTop}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                    <ChevronRight size={16} color={colors.mutedForeground} />
                  </Animated.View>
                </View>
                <View style={styles.mealMeta}>
                  <View style={styles.mealMetaItem}>
                    <Clock size={14} color={colors.mutedForeground} />
                    <Text style={styles.mealMetaText}>{meal.time} min</Text>
                  </View>
                  <View style={styles.mealMetaItem}>
                    <Text style={styles.mealMetaText}>£{meal.cost.toFixed(2)}</Text>
                  </View>
                </View>
                {isOpen && (
                  <View style={styles.mealExpand}>
                    <Text style={styles.ingredLabel}>Ingredients:</Text>
                    <View style={styles.ingredWrap}>
                      {meal.ingredients.map((ing, i) => (
                        <View key={i} style={styles.ingredChip}>
                          <Text style={styles.ingredText}>{ing}</Text>
                        </View>
                      ))}
                    </View>
                    <Button variant="outline" size="sm" style={styles.addToListBtn}>
                      <ShoppingCart size={14} color={colors.foreground} />
                      <Text style={styles.addToListText}>Add ingredients to shopping list</Text>
                    </Button>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Smart Shopping List */}
      <Card style={styles.card}>
        <View style={styles.shopHeader}>
          <Text style={styles.cardTitle}>Smart Shopping List</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.shopCount}>{totalItems} items</Text>
            <Text style={styles.shopCost}>~£28.50</Text>
          </View>
        </View>
        <View style={styles.shopCategories}>
          {shoppingList.map((cat, i) => (
            <View key={i} style={styles.shopCat}>
              <Text style={styles.shopCatTitle}>{cat.category}</Text>
              {cat.items.map((item, j) => (
                <View key={j} style={styles.shopItem}>
                  <View style={styles.shopCheckbox} />
                  <Text style={styles.shopItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Healthy swaps */}
        <View style={styles.swapsBox}>
          <View style={styles.swapsTitle}>
            <TrendingUp size={14} color={colors.secondary} />
            <Text style={styles.swapsTitleText}>Healthy swap suggestions</Text>
          </View>
          {healthySwaps.map((s, i) => (
            <View key={i} style={styles.swapRow}>
              <Text style={styles.swapFrom}>{s.from}</Text>
              <Text style={styles.swapArrow}>→</Text>
              <Text style={styles.swapTo}>{s.to}</Text>
            </View>
          ))}
        </View>

        <Button variant="outline" onPress={() => navigation.navigate('GroceryList')} style={styles.viewBtn}>
          <ShoppingCart size={14} color={colors.foreground} />
          <Text style={styles.viewBtnText}>View full shopping list</Text>
        </Button>
      </Card>

      {/* Lunchbox Planner */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Lunchbox Planner</Text>
        <View style={styles.lunchbox}>
          <Text style={styles.lunchLabel}>Today's lunch idea:</Text>
          {lunchboxIdeas.map((item, i) => (
            <View key={i} style={styles.lunchRow}>
              <Check size={14} color={colors.secondary} />
              <Text style={styles.lunchText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.lunchTip}>
          <Text style={styles.lunchTipText}>
            <Text style={{ fontWeight: '600' }}>💡 Quick tip:</Text> Children often need to try foods 10–15 times before liking them. Keep offering without pressure!
          </Text>
        </View>
      </Card>

      {/* Weekly Family Progress */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Family Progress</Text>
        <View style={styles.progressBars}>
          <View>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Family meals cooked</Text>
              <Text style={styles.progressValue}>{weeklyProgress.familyMeals.completed}/{weeklyProgress.familyMeals.total}</Text>
            </View>
            <ProgressBar value={weeklyProgress.familyMeals.completed} total={weeklyProgress.familyMeals.total} color={colors.primary} />
          </View>
          <View>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Activity missions completed</Text>
              <Text style={styles.progressValue}>{weeklyProgress.activityMissions.completed}/{weeklyProgress.activityMissions.total}</Text>
            </View>
            <ProgressBar value={weeklyProgress.activityMissions.completed} total={weeklyProgress.activityMissions.total} color={colors.secondary} />
          </View>
          <View>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Healthy snack swaps</Text>
              <Text style={styles.progressValue}>{weeklyProgress.healthySwaps.completed}/{weeklyProgress.healthySwaps.total}</Text>
            </View>
            <ProgressBar value={weeklyProgress.healthySwaps.completed} total={weeklyProgress.healthySwaps.total} color={colors.accentForeground} />
          </View>
        </View>
        <View style={styles.progressFooter}>
          <Text style={styles.progressFooterText}>
            <Text style={{ fontWeight: '600', color: colors.primary }}>You're building great routines for your family.</Text> Keep going! 💪
          </Text>
        </View>
        <Button variant="outline" onPress={() => navigation.navigate('WeeklyReport')} style={{ marginTop: 12 }}>
          <Text style={styles.viewBtnText}>View full weekly report</Text>
        </Button>
      </Card>

      {/* More tools */}
      <Card style={[styles.card, { alignItems: 'center' }]}>
        <Text style={styles.cardTitle}>Need more tools?</Text>
        <Text style={styles.moreToolsDesc}>Access Quick Meal Mode, Budget Tracker, Photo Rewards, and more</Text>
        <Button variant="outline" onPress={() => (navigation as any).navigate('ParentDashboard')}>
          <Text style={styles.viewBtnText}>View all parent tools</Text>
        </Button>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: withOpacity(colors.primary, 0.1), alignItems: 'center', justifyContent: 'center' },
  coachCard: { borderRadius: radius, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.primary, 0.2) },
  coachRow: { flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'flex-start' },
  sparkleCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: withOpacity(colors.primary, 0.2), alignItems: 'center', justifyContent: 'center' },
  coachMsg: { ...typography.h3, marginBottom: 6 },
  coachTip: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  coachBtn: { backgroundColor: colors.primary },
  coachBtnText: { color: colors.primaryForeground, fontWeight: '600', fontSize: 15 },
  card: { padding: 20, marginBottom: 16 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { ...typography.h3, marginBottom: 0 },
  meals: { gap: 10 },
  mealRow: { borderWidth: 1, borderColor: colors.border, borderRadius: radius, padding: 16 },
  mealTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealName: { ...typography.h4 },
  mealMeta: { flexDirection: 'row', gap: 16 },
  mealMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mealMetaText: { fontSize: 13, color: colors.mutedForeground },
  mealExpand: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  ingredLabel: { fontSize: 11, fontWeight: '600', color: colors.mutedForeground, marginBottom: 8 },
  ingredWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  ingredChip: { backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  ingredText: { fontSize: 12, color: colors.accentForeground },
  addToListBtn: { flexDirection: 'row', gap: 6 },
  addToListText: { fontSize: 13, color: colors.foreground },
  shopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  shopCount: { fontSize: 12, color: colors.mutedForeground },
  shopCost: { fontSize: 14, fontWeight: '600', color: colors.primary },
  shopCategories: { gap: 16, marginBottom: 16 },
  shopCat: { gap: 8 },
  shopCatTitle: { fontSize: 13, fontWeight: '600', color: colors.primary },
  shopItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shopCheckbox: { width: 16, height: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 3 },
  shopItemText: { fontSize: 13, color: colors.mutedForeground },
  swapsBox: { backgroundColor: withOpacity(colors.secondary, 0.1), borderRadius: radius, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.2) },
  swapsTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  swapsTitleText: { ...typography.h4 },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  swapFrom: { fontSize: 13, color: colors.mutedForeground, textDecorationLine: 'line-through' },
  swapArrow: { fontSize: 13, color: colors.mutedForeground },
  swapTo: { fontSize: 13, fontWeight: '500', color: colors.secondary },
  viewBtn: { flexDirection: 'row', gap: 6 },
  viewBtnText: { fontSize: 14, color: colors.foreground },
  lunchbox: { backgroundColor: withOpacity(colors.accent, 0.5), borderRadius: radius, padding: 16, marginBottom: 12 },
  lunchLabel: { fontSize: 13, fontWeight: '500', marginBottom: 10, color: colors.foreground },
  lunchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  lunchText: { fontSize: 13, color: colors.foreground },
  lunchTip: { backgroundColor: colors.accent, borderRadius: radius, padding: 12 },
  lunchTipText: { fontSize: 12, color: colors.accentForeground, lineHeight: 18 },
  progressBars: { gap: 16, marginBottom: 16 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 14, color: colors.foreground },
  progressValue: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  progressFooter: { paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  progressFooterText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
  moreToolsDesc: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', marginBottom: 12, marginTop: 6, lineHeight: 18 },
});
