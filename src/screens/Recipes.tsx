import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipeCard } from '../components/RecipeCard';
import type { Recipe } from '../data/recipes';
import { getWeeklyPlan } from '../services/weeklyPlanStore';
import { planMealToRecipe } from '../services/recipeFromPlan';
import { colors, typography, radius } from '../theme';

export function Recipes() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Build the library from the current weekly plan (single source of truth) and
  // refresh whenever the screen regains focus, so a regenerated plan shows here
  // too. De-duped by meal name so leftover days don't repeat a recipe.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getWeeklyPlan().then(plan => {
        if (!active) return;
        const seen = new Set<string>();
        const list: Recipe[] = [];
        plan.forEach((day, i) => {
          if (!day.meal || seen.has(day.meal.name)) return;
          seen.add(day.meal.name);
          list.push(planMealToRecipe(day.meal, i));
        });
        setRecipes(list);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const filtered = recipes.filter(
    r =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Recipe Library</Text>
          <Text style={styles.subtitle}>Recipes from this week’s plan</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Search
          size={16}
          color={colors.mutedForeground}
          style={styles.searchIcon}
        />
        <Input
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search recipes..."
          style={styles.searchInput}
        />
      </View>

      <Card
        style={[
          styles.infoCard,
          { backgroundColor: colors.accent, borderColor: colors.accent },
        ]}
      >
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>🍽️ About these recipes:</Text>{' '}
          These are the meals from your current weekly plan — built around the
          foods and flavours your family already enjoys. Regenerate the plan on
          the Plan tab and this library updates too.
        </Text>
      </Card>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      )}

      {!loading && filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {recipes.length === 0
              ? 'No plan yet — generate a weekly plan on the Plan tab to fill your library.'
              : 'No recipes found. Try a different search term.'}
          </Text>
        </Card>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: { flex: 1, paddingLeft: 40 },
  infoCard: { padding: 14, marginBottom: 16 },
  infoText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
  list: { gap: 12 },
  loadingBox: { paddingVertical: 40, alignItems: 'center' },
  emptyCard: { padding: 32, alignItems: 'center' },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
});
