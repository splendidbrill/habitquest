import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, X } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { RecipeCard } from '../components/RecipeCard';
import { indianRecipes } from '../data/recipes';
import { colors, typography, radius, withOpacity } from '../theme';

const commonIngredients = [
  'Rice', 'Pasta', 'Potatoes', 'Onions', 'Garlic', 'Tomatoes',
  'Eggs', 'Chicken', 'Lentils', 'Peas', 'Carrots', 'Beans',
  'Cheese', 'Yogurt', 'Bread', 'Flour', 'Spices',
];

export function PantryMode() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<typeof indianRecipes>([]);

  const toggle = (ing: string) => {
    setSelected(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  };

  const findRecipes = () => {
    const results = indianRecipes.filter(recipe => {
      const text = recipe.ingredients.join(' ').toLowerCase();
      return selected.some(ing => text.includes(ing.toLowerCase()));
    });
    setMatched(results);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Pantry Mode</Text>
          <Text style={styles.subtitle}>Find meals using what you have</Text>
        </View>
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>💡 How it works:</Text> Select the ingredients you have at home, and we'll suggest recipes you can make right now.
        </Text>
      </Card>

      {selected.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>Your ingredients ({selected.length})</Text>
          <View style={styles.chips}>
            {selected.map(ing => (
              <Pressable key={ing} onPress={() => toggle(ing)} style={styles.chip}>
                <Text style={styles.chipText}>{ing}</Text>
                <X size={14} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={styles.ingredientsSection}>
        <Text style={styles.sectionTitle}>Common ingredients</Text>
        <View style={styles.grid}>
          {commonIngredients.map(ing => (
            <Pressable key={ing} onPress={() => toggle(ing)} style={styles.gridItem}>
              <Card style={[styles.ingCard, selected.includes(ing) ? styles.ingCardSelected : null]}>
                <Checkbox checked={selected.includes(ing)} onPress={() => toggle(ing)} />
                <Text style={styles.ingText}>{ing}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>

      <Button size="lg" onPress={findRecipes} disabled={selected.length === 0} style={styles.findBtn}>
        <Text style={styles.findBtnText}>Find recipes</Text>
      </Button>

      {matched.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.sectionTitle}>
            We found {matched.length} recipe{matched.length !== 1 ? 's' : ''}
          </Text>
          {matched.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </View>
      )}

      {matched.length === 0 && selected.length > 0 && (
        <Card style={styles.noMatchCard}>
          <Text style={styles.noMatchText}>No exact matches yet, but you might be close!</Text>
          <Button variant="outline" onPress={() => (navigation as any).navigate('Recipes')} style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 14, color: colors.foreground }}>Browse all recipes</Text>
          </Button>
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
  infoCard: { padding: 16, marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
  selectedSection: { marginBottom: 16 },
  sectionTitle: { ...typography.h3, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: withOpacity(colors.primary, 0.1), paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 13, color: colors.primary },
  ingredientsSection: { marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '48%' },
  ingCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  ingCardSelected: { backgroundColor: withOpacity(colors.primary, 0.1), borderColor: colors.primary },
  ingText: { fontSize: 13, color: colors.foreground },
  findBtn: { marginBottom: 16, backgroundColor: colors.primary },
  findBtnText: { fontSize: 15, fontWeight: '600', color: colors.primaryForeground },
  results: { gap: 12, marginBottom: 8 },
  noMatchCard: { padding: 24, alignItems: 'center' },
  noMatchText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
});
