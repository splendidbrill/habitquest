import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, X, Sparkles } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { RecipeCard } from '../components/RecipeCard';
import { indianRecipes } from '../data/recipes';
import { colors, typography, radius, withOpacity } from '../theme';
import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';

const commonIngredients = [
  'Rice', 'Pasta', 'Potatoes', 'Onions', 'Garlic', 'Tomatoes',
  'Eggs', 'Chicken', 'Lentils', 'Peas', 'Carrots', 'Beans',
  'Cheese', 'Yogurt', 'Bread', 'Flour', 'Spices',
];

type AIMeal = { name: string; description: string; time: string; ingredients: string[]; steps: string[]; tip: string };

export function PantryMode() {
  const navigation = useNavigation();
  const [selected, setSelected]   = useState<string[]>([]);
  const [matched, setMatched]     = useState<typeof indianRecipes>([]);
  const [aiMeals, setAiMeals]     = useState<AIMeal[]>([]);
  const [loading, setLoading]     = useState(false);
  const [expanded, setExpanded]   = useState<number | null>(null);

  const toggle = (ing: string) => {
    setSelected(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  };

  const findRecipes = async () => {
    setLoading(true);
    setAiMeals([]);
    setMatched([]);

    // Get family context
    const raw = await storage.getItem('onboardingAnswers');
    const answers = raw ? JSON.parse(raw) as Record<number, string | string[]> : {};
    const cultures = [answers[3]].flat().filter(Boolean).join(', ');
    const allergies = [answers[6]].flat().filter(Boolean).join(', ');

    const prompt = `A family has these ingredients in their pantry: ${selected.join(', ')}.
${cultures ? `Their cultural background: ${cultures}.` : ''}
${allergies ? `Dietary requirements: ${allergies}.` : ''}

Suggest 3 simple, child-friendly meals they can make using mainly these ingredients. Add 1-2 extra common items if absolutely needed.

Return ONLY valid JSON array:
[{"name":"...","description":"...","time":"X min","ingredients":["..."],"steps":["..."],"tip":"One helpful tip for getting kids to enjoy this"}]`;

    try {
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: { type: 'recommendations', prompt, maxTokens: 800 },
      });
      if (!error && data?.text) {
        const match = data.text.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]) as AIMeal[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAiMeals(parsed);
            setLoading(false);
            return;
          }
        }
      }
    } catch {}

    // Fallback to recipe database
    const results = indianRecipes.filter(recipe => {
      const text = recipe.ingredients.join(' ').toLowerCase();
      return selected.some(ing => text.includes(ing.toLowerCase()));
    });
    setMatched(results);
    setLoading(false);
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

      <Button size="lg" onPress={findRecipes} disabled={selected.length === 0 || loading} style={styles.findBtn}>
        {loading
          ? <ActivityIndicator color={colors.primaryForeground} />
          : <><Sparkles size={16} color={colors.primaryForeground} /><Text style={styles.findBtnText}>Find meals I can make</Text></>
        }
      </Button>

      {/* AI-generated meals */}
      {aiMeals.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.sectionTitle}>✨ Meals you can make now</Text>
          {aiMeals.map((meal, i) => (
            <Card key={i} style={styles.aiMealCard}>
              <Pressable onPress={() => setExpanded(expanded === i ? null : i)}>
                <View style={styles.aiMealHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiMealName}>{meal.name}</Text>
                    <Text style={styles.aiMealMeta}>⏱ {meal.time}</Text>
                  </View>
                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>{expanded === i ? '▲' : '▼'}</Text>
                </View>
                <Text style={styles.aiMealDesc}>{meal.description}</Text>
              </Pressable>
              {expanded === i && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.aiLabel}>Ingredients</Text>
                  <Text style={styles.aiIngredients}>{meal.ingredients.join(' · ')}</Text>
                  <Text style={styles.aiLabel}>Method</Text>
                  {meal.steps.map((step, j) => (
                    <Text key={j} style={styles.aiStep}>{j + 1}. {step}</Text>
                  ))}
                  <View style={styles.tipBox}>
                    <Text style={styles.tipText}>💡 {meal.tip}</Text>
                  </View>
                </>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Fallback recipe database results */}
      {matched.length > 0 && aiMeals.length === 0 && (
        <View style={styles.results}>
          <Text style={styles.sectionTitle}>
            We found {matched.length} recipe{matched.length !== 1 ? 's' : ''}
          </Text>
          {matched.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </View>
      )}

      {aiMeals.length === 0 && matched.length === 0 && selected.length > 0 && !loading && (
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
  findBtn: { marginBottom: 16, backgroundColor: colors.primary, flexDirection: 'row', gap: 8 },
  findBtnText: { fontSize: 15, fontWeight: '600', color: colors.primaryForeground },
  aiMealCard: { padding: 16, marginBottom: 10 },
  aiMealHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  aiMealName: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  aiMealMeta: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  aiMealDesc: { fontSize: 13, color: colors.mutedForeground, lineHeight: 19 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  aiLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  aiIngredients: { fontSize: 13, color: colors.foreground, lineHeight: 20, marginBottom: 12 },
  aiStep: { fontSize: 13, color: colors.foreground, lineHeight: 22, marginBottom: 2 },
  tipBox: { backgroundColor: withOpacity(colors.primary, 0.07), borderRadius: 10, padding: 12, marginTop: 10 },
  tipText: { fontSize: 13, color: colors.foreground, lineHeight: 19 },
  results: { gap: 12, marginBottom: 8 },
  noMatchCard: { padding: 24, alignItems: 'center' },
  noMatchText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
});
