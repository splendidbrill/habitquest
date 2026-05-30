import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Clock, ShoppingCart, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

interface DinnerOption {
  id: string;
  name: string;
  time: number;
  ingredients: string[];
  missingIngredients: string[];
  instructions: string[];
}

const dinnerOptions: DinnerOption[] = [
  { id: '1', name: '15-Minute Vegetable Pasta', time: 15, ingredients: ['Pasta', 'Frozen vegetables', 'Garlic', 'Olive oil', 'Parmesan'], missingIngredients: [], instructions: ['Boil pasta according to packet instructions', 'In the last 3 minutes, add frozen vegetables to the pasta water', 'Drain and toss with olive oil and crushed garlic', 'Top with grated parmesan and serve'] },
  { id: '2', name: 'Egg Fried Rice', time: 12, ingredients: ['Cooked rice', '2 eggs', 'Frozen peas', 'Soy sauce'], missingIngredients: ['Soy sauce'], instructions: ['Heat oil in a pan, scramble eggs and set aside', 'Add rice and frozen peas, stir-fry for 5 minutes', 'Add eggs back in with soy sauce', 'Stir well and serve hot'] },
  { id: '3', name: 'Bean Tacos', time: 10, ingredients: ['Tortillas', 'Tin of beans', 'Cheese', 'Lettuce', 'Salsa'], missingIngredients: ['Salsa'], instructions: ['Heat beans in a pan and mash slightly', 'Warm tortillas in a dry pan', 'Fill with beans, cheese, and shredded lettuce', 'Top with salsa and serve'] },
];

export function DinnerRescue() {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addedToList, setAddedToList] = useState<string[]>([]);

  const handleAddToList = (mealId: string) => {
    setAddedToList(prev => [...prev, mealId]);
    Alert.alert('Added!', 'Missing items added to your shopping list.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Dinner Rescue 🚨</Text>
          <Text style={styles.subtitle}>Quick ideas for tonight</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.primary, 0.1), withOpacity(colors.secondary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.infoCard}
      >
        <View style={styles.infoInner}>
          <Sparkles size={22} color={colors.primary} style={{ flexShrink: 0 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Based on what you have at home...</Text>
            <Text style={styles.infoText}>
              Here are 3 quick meals you can make right now (or with just 1-2 missing items)
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.list}>
        {dinnerOptions.map(option => (
          <Card key={option.id} style={styles.optionCard}>
            <View style={styles.optionTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionName}>{option.name}</Text>
                <View style={styles.optionTime}>
                  <Clock size={14} color={colors.mutedForeground} />
                  <Text style={styles.optionTimeText}>{option.time} minutes</Text>
                </View>
              </View>
              {option.missingIngredients.length === 0 && (
                <View style={styles.readyBadge}>
                  <Text style={styles.readyText}>Ready to cook!</Text>
                </View>
              )}
            </View>

            <View style={styles.haveSection}>
              <Text style={styles.haveLabel}>✅ You have:</Text>
              <View style={styles.chips}>
                {option.ingredients
                  .filter(ing => !option.missingIngredients.includes(ing))
                  .map((ing, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{ing}</Text>
                    </View>
                  ))}
              </View>
            </View>

            {option.missingIngredients.length > 0 && (
              <View style={styles.missingSection}>
                <Text style={styles.missingLabel}>Missing:</Text>
                <View style={styles.chips}>
                  {option.missingIngredients.map((ing, i) => (
                    <View key={i} style={styles.missingChip}>
                      <Text style={styles.missingChipText}>{ing}</Text>
                    </View>
                  ))}
                </View>
                {addedToList.includes(option.id) ? (
                  <View style={styles.addedRow}>
                    <Check size={16} color={colors.secondary} />
                    <Text style={styles.addedText}>Added to shopping list</Text>
                  </View>
                ) : (
                  <Button variant="outline" size="sm" onPress={() => handleAddToList(option.id)} style={styles.addBtn}>
                    <ShoppingCart size={14} color={colors.foreground} />
                    <Text style={styles.addBtnText}>Add missing items to shopping list</Text>
                  </Button>
                )}
              </View>
            )}

            {selectedId === option.id && (
              <View style={styles.instructions}>
                <View style={styles.divider} />
                <Text style={styles.instructionsLabel}>Quick instructions:</Text>
                {option.instructions.map((step, i) => (
                  <Text key={i} style={styles.instructionStep}>{i + 1}. {step}</Text>
                ))}
              </View>
            )}

            <Button
              onPress={() => setSelectedId(selectedId === option.id ? null : option.id)}
              style={styles.toggleBtn}
            >
              <Text style={styles.toggleBtnText}>
                {selectedId === option.id ? 'Hide instructions' : 'Show instructions'}
              </Text>
            </Button>
          </Card>
        ))}
      </View>

      <Card style={styles.ctaCard}>
        <Text style={styles.ctaText}>Need more ideas? Check out Quick Meal Mode for even more options</Text>
        <Button variant="outline" onPress={() => (navigation as any).navigate('QuickMealMode')} style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: colors.foreground }}>View Quick Meal Mode</Text>
        </Button>
      </Card>

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
  infoCard: { borderRadius: radius, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.primary, 0.2) },
  infoInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoTitle: { ...typography.h4, marginBottom: 4 },
  infoText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  list: { gap: 12, marginBottom: 16 },
  optionCard: { padding: 20 },
  optionTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  optionName: { ...typography.h4, marginBottom: 6 },
  optionTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  optionTimeText: { fontSize: 13, color: colors.mutedForeground },
  readyBadge: { backgroundColor: withOpacity(colors.secondary, 0.2), borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  readyText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  haveSection: { marginBottom: 10 },
  haveLabel: { fontSize: 11, fontWeight: '500', color: colors.mutedForeground, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.accent, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: colors.accentForeground },
  missingSection: { backgroundColor: withOpacity(colors.destructive, 0.1), borderRadius: radius, padding: 12, marginBottom: 10 },
  missingLabel: { fontSize: 11, fontWeight: '600', color: colors.destructive, marginBottom: 6 },
  missingChip: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: withOpacity(colors.destructive, 0.2) },
  missingChipText: { fontSize: 11, color: colors.foreground },
  addedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  addedText: { fontSize: 13, color: colors.secondary },
  addBtn: { flexDirection: 'row', gap: 6, marginTop: 8 },
  addBtnText: { fontSize: 13, color: colors.foreground },
  instructions: { marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  instructionsLabel: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 8 },
  instructionStep: { fontSize: 13, color: colors.mutedForeground, paddingLeft: 4, marginBottom: 4, lineHeight: 18 },
  toggleBtn: { marginTop: 12, backgroundColor: colors.primary },
  toggleBtnText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
  ctaCard: { padding: 20, alignItems: 'center' },
  ctaText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
});
