import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Clock, ChefHat } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { colors, typography, radius, withOpacity } from '../theme';

interface QuickMeal {
  id: string;
  name: string;
  prepTime: number;
  cost: number;
  ingredients: string[];
  usesCommonIngredients: boolean;
  instructions: string[];
}

const quickMeals: QuickMeal[] = [
  { id: '1', name: 'Egg Fried Rice with Vegetables', prepTime: 12, cost: 2.5, usesCommonIngredients: true, ingredients: ['Cooked rice', '2 eggs', 'Frozen peas', 'Carrots', 'Soy sauce', 'Oil'], instructions: ['Heat oil in a pan or wok', 'Scramble the eggs and set aside', 'Stir-fry frozen peas and diced carrots for 3 minutes', 'Add cooked rice and eggs, stir well', 'Add a splash of soy sauce and serve'] },
  { id: '2', name: 'Wraps with Hummus and Salad', prepTime: 8, cost: 3.0, usesCommonIngredients: true, ingredients: ['Tortilla wraps', 'Hummus', 'Lettuce', 'Tomatoes', 'Cucumber', 'Grated cheese'], instructions: ['Lay out wraps on plates', 'Spread hummus on each wrap', 'Add chopped lettuce, tomatoes, cucumber', 'Sprinkle grated cheese', 'Roll up and serve'] },
  { id: '3', name: 'Pasta with Tomato Sauce and Beans', prepTime: 15, cost: 2.8, usesCommonIngredients: true, ingredients: ['Pasta', 'Tin of chopped tomatoes', 'Tin of beans', 'Garlic', 'Mixed herbs'], instructions: ['Cook pasta according to packet instructions', 'Heat chopped tomatoes in a pan', 'Add drained beans and crushed garlic', 'Season with mixed herbs', 'Drain pasta and mix with sauce'] },
  { id: '4', name: 'Cheese and Bean Quesadillas', prepTime: 10, cost: 2.2, usesCommonIngredients: true, ingredients: ['Tortillas', 'Grated cheese', 'Tin of beans', 'Optional: peppers'], instructions: ['Mash beans slightly with a fork', 'Spread beans on half of each tortilla', 'Add grated cheese', 'Fold tortilla in half', 'Toast in a dry pan for 2 minutes each side'] },
  { id: '5', name: 'Omelette with Toast and Veg', prepTime: 10, cost: 1.8, usesCommonIngredients: true, ingredients: ['3 eggs', 'Milk', 'Grated cheese', 'Frozen peas or spinach', 'Bread'], instructions: ['Beat eggs with a splash of milk', 'Heat a little oil in a pan', 'Pour in eggs, add frozen peas', 'When nearly set, add cheese and fold', 'Serve with buttered toast'] },
  { id: '6', name: 'Simple Chicken Stir-Fry', prepTime: 15, cost: 4.2, usesCommonIngredients: false, ingredients: ['Chicken breast', 'Frozen mixed vegetables', 'Soy sauce', 'Rice or noodles'], instructions: ['Cook rice or noodles according to packet', 'Cut chicken into small pieces', 'Stir-fry chicken until cooked through', 'Add frozen vegetables and cook for 5 minutes', 'Add soy sauce and serve with rice/noodles'] },
  { id: '7', name: 'Tomato Soup with Cheese Sandwiches', prepTime: 8, cost: 2.0, usesCommonIngredients: true, ingredients: ['Tin of tomato soup', 'Bread', 'Cheese', 'Butter'], instructions: ['Heat soup in a pan according to instructions', 'Butter bread slices', 'Make cheese sandwiches', 'Toast in a pan until golden (optional)', 'Serve soup with sandwiches for dipping'] },
  { id: '8', name: 'Baked Beans on Toast with Egg', prepTime: 8, cost: 1.5, usesCommonIngredients: true, ingredients: ['Tin of baked beans', 'Bread', '2 eggs', 'Butter'], instructions: ['Heat baked beans in a pan', 'Toast bread', 'Poach or fry eggs', 'Place egg on toast', 'Spoon beans around and serve'] },
];

export function QuickMealMode() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState({ under15min: false, under5pounds: false, commonIngredients: false });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = quickMeals.filter(m => {
    if (filters.under15min && m.prepTime > 15) return false;
    if (filters.under5pounds && m.cost > 5) return false;
    if (filters.commonIngredients && !m.usesCommonIngredients) return false;
    return true;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Quick Meal Mode</Text>
          <Text style={styles.subtitle}>Fast, budget-friendly meals</Text>
        </View>
      </View>

      <Card style={styles.filtersCard}>
        <Text style={styles.filtersTitle}>Filter by:</Text>
        <Pressable style={styles.filterRow} onPress={() => setFilters({ ...filters, under15min: !filters.under15min })}>
          <Checkbox checked={filters.under15min} onPress={() => setFilters({ ...filters, under15min: !filters.under15min })} />
          <Clock size={16} color={colors.primary} />
          <Text style={styles.filterText}>Under 15 minutes</Text>
        </Pressable>
        <Pressable style={styles.filterRow} onPress={() => setFilters({ ...filters, under5pounds: !filters.under5pounds })}>
          <Checkbox checked={filters.under5pounds} onPress={() => setFilters({ ...filters, under5pounds: !filters.under5pounds })} />
          <Text style={styles.poundIcon}>£</Text>
          <Text style={styles.filterText}>Under £5 per meal</Text>
        </Pressable>
        <Pressable style={styles.filterRow} onPress={() => setFilters({ ...filters, commonIngredients: !filters.commonIngredients })}>
          <Checkbox checked={filters.commonIngredients} onPress={() => setFilters({ ...filters, commonIngredients: !filters.commonIngredients })} />
          <Text style={styles.homeIcon}>🏠</Text>
          <Text style={styles.filterText}>Uses ingredients I already have</Text>
        </Pressable>
      </Card>

      <Text style={styles.resultCount}>
        Showing {filtered.length} meal{filtered.length !== 1 ? 's' : ''}
      </Text>

      <View style={styles.list}>
        {filtered.map(meal => (
          <Card key={meal.id} style={styles.mealCard}>
            <Pressable onPress={() => setExpandedId(expandedId === meal.id ? null : meal.id)}>
              <View style={styles.mealTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealMeta}>
                    <Clock size={14} color={colors.mutedForeground} />
                    <Text style={styles.mealMetaText}>{meal.prepTime} min</Text>
                    <Text style={styles.mealMetaDot}>•</Text>
                    <Text style={styles.mealMetaText}>£{meal.cost.toFixed(2)}</Text>
                  </View>
                </View>
                <ChefHat size={22} color={colors.primary} />
              </View>
            </Pressable>

            {expandedId === meal.id && (
              <View style={styles.expanded}>
                <View style={styles.divider} />
                <Text style={styles.expandedLabel}>Ingredients:</Text>
                {meal.ingredients.map((ing, i) => (
                  <Text key={i} style={styles.expandedBullet}>• {ing}</Text>
                ))}
                <Text style={[styles.expandedLabel, { marginTop: 12 }]}>Instructions:</Text>
                {meal.instructions.map((step, i) => (
                  <Text key={i} style={styles.expandedBullet}>{i + 1}. {step}</Text>
                ))}
                <View style={styles.expandedBtns}>
                  <Button size="sm" style={{ flex: 1, backgroundColor: colors.primary }}>
                    <Text style={{ fontSize: 12, color: colors.primaryForeground, fontWeight: '600' }}>Add to this week's plan</Text>
                  </Button>
                  <Button size="sm" variant="outline" style={{ flexShrink: 0 }}>
                    <Text style={{ fontSize: 12, color: colors.foreground }}>Add to list</Text>
                  </Button>
                </View>
              </View>
            )}
          </Card>
        ))}
      </View>

      {filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No meals match your filters. Try adjusting your criteria.</Text>
        </Card>
      )}

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
  filtersCard: { padding: 16, marginBottom: 16 },
  filtersTitle: { ...typography.h4, marginBottom: 12 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  filterText: { fontSize: 14, color: colors.foreground },
  poundIcon: { fontSize: 14, color: colors.secondary, fontWeight: '600' },
  homeIcon: { fontSize: 14 },
  resultCount: { fontSize: 13, color: colors.mutedForeground, marginBottom: 12 },
  list: { gap: 12 },
  mealCard: { padding: 20 },
  mealTop: { flexDirection: 'row', alignItems: 'flex-start' },
  mealName: { ...typography.h4, marginBottom: 6 },
  mealMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mealMetaText: { fontSize: 13, color: colors.mutedForeground },
  mealMetaDot: { fontSize: 13, color: colors.mutedForeground, marginHorizontal: 4 },
  expanded: { marginTop: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  expandedLabel: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 6 },
  expandedBullet: { fontSize: 13, color: colors.mutedForeground, paddingLeft: 8, marginBottom: 4, lineHeight: 18 },
  expandedBtns: { flexDirection: 'row', gap: 8, marginTop: 12 },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
});
