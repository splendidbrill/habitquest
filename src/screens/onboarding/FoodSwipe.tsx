import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '../../components/ui/Card';
import { mealArchetypes, type MealArchetype } from '../../data/mealArchetypes';
import {
  recordMealReactions,
  type Reaction,
} from '../../services/preferenceSignals';
import { loadFamilyProfile, syncFamilyProfile } from '../../data/familyProfile';
import { colors, typography, radius, withOpacity } from '../../theme';
import type { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PREP_LABEL: Record<MealArchetype['prepBand'], string> = {
  under15: 'Under 15 min',
  '15-30': '15–30 min',
  '30-45': '30–45 min',
  '45plus': '45+ min',
};

const BUDGET_LABEL: Record<MealArchetype['budget'], string> = {
  low: 'Budget-friendly',
  medium: 'Mid-range',
  high: 'Treat',
};

export function FoodSwipe() {
  const navigation = useNavigation<Nav>();
  const [index, setIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  const finish = async (collected: Record<string, Reaction>) => {
    if (Object.keys(collected).length > 0) {
      await recordMealReactions(collected);
      const profile = await loadFamilyProfile();
      if (profile) await syncFamilyProfile(profile);
    }
    navigation.replace('ActivitySwipe');
  };

  const react = (reaction: Reaction) => {
    const meal = mealArchetypes[index];
    const next = { ...reactions, [meal.id]: reaction };
    setReactions(next);
    if (index + 1 >= mealArchetypes.length) {
      finish(next);
    } else {
      setIndex(index + 1);
    }
  };

  const meal = mealArchetypes[index];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Quick taste check</Text>
        <Text style={styles.title}>Which meals feel like your family?</Text>
        <Text style={styles.subtitle}>
          Tap how you feel — there are no wrong answers. This shapes your plan.
        </Text>
      </View>

      <View style={styles.progressRow}>
        {mealArchetypes.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i <= index ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.cardWrap}>
        <Card style={styles.card}>
          <Text style={styles.emoji}>{meal.emoji}</Text>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealMeta}>{meal.cuisine}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>{PREP_LABEL[meal.prepBand]}</Text>
            <Text style={styles.tag}>{BUDGET_LABEL[meal.budget]}</Text>
          </View>
        </Card>
      </View>

      <View style={styles.reactions}>
        <Pressable
          style={[styles.reactBtn, styles.reactNo]}
          onPress={() => react('not_for_us')}
        >
          <Text style={styles.reactEmoji}>🔴</Text>
          <Text style={styles.reactLabel}>Not for us</Text>
        </Pressable>
        <Pressable
          style={[styles.reactBtn, styles.reactOkay]}
          onPress={() => react('okay')}
        >
          <Text style={styles.reactEmoji}>🟡</Text>
          <Text style={styles.reactLabel}>It's okay</Text>
        </Pressable>
        <Pressable
          style={[styles.reactBtn, styles.reactLove]}
          onPress={() => react('loved')}
        >
          <Text style={styles.reactEmoji}>🟢</Text>
          <Text style={styles.reactLabel}>Love it</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => finish(reactions)} style={styles.skip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>

      <Text style={styles.counter}>
        {index + 1} of {mealArchetypes.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  header: { marginBottom: 16 },
  kicker: {
    ...typography.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: { ...typography.h1, marginBottom: 6 },
  subtitle: { ...typography.sm, color: colors.mutedForeground, lineHeight: 20 },
  progressRow: { flexDirection: 'row', gap: 3, marginBottom: 20 },
  progressDot: { flex: 1, height: 4, borderRadius: 2 },
  progressActive: { backgroundColor: colors.primary },
  progressInactive: { backgroundColor: colors.border },
  cardWrap: { flex: 1, justifyContent: 'center' },
  card: { padding: 32, alignItems: 'center' },
  emoji: { fontSize: 72, marginBottom: 16 },
  mealTitle: { ...typography.h2, textAlign: 'center', marginBottom: 6 },
  mealMeta: { fontSize: 15, color: colors.mutedForeground, marginBottom: 14 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    fontSize: 12,
    color: colors.foreground,
    backgroundColor: withOpacity(colors.primary, 0.08),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius,
    overflow: 'hidden',
  },
  reactions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  reactBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: radius,
    borderWidth: 1,
    backgroundColor: colors.card,
  },
  reactNo: { borderColor: withOpacity('#ef4444', 0.4) },
  reactOkay: { borderColor: withOpacity('#eab308', 0.5) },
  reactLove: { borderColor: withOpacity('#22c55e', 0.5) },
  reactEmoji: { fontSize: 22 },
  reactLabel: { fontSize: 13, fontWeight: '500', color: colors.foreground },
  skip: { alignSelf: 'center', paddingVertical: 14 },
  skipText: {
    fontSize: 14,
    color: colors.mutedForeground,
    textDecorationLine: 'underline',
  },
  counter: {
    textAlign: 'center',
    color: colors.mutedForeground,
    fontSize: 13,
    paddingBottom: 12,
  },
});
