import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '../../components/ui/Card';
import { activityArchetypes } from '../../data/activityArchetypes';
import {
  recordActivityReactions,
  type Reaction,
} from '../../services/preferenceSignals';
import { loadFamilyProfile, syncFamilyProfile } from '../../data/familyProfile';
import { colors, typography, radius, withOpacity } from '../../theme';
import type { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ActivitySwipe() {
  const navigation = useNavigation<Nav>();
  const [index, setIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  const finish = async (collected: Record<string, Reaction>) => {
    if (Object.keys(collected).length > 0) {
      await recordActivityReactions(collected);
      const profile = await loadFamilyProfile();
      if (profile) await syncFamilyProfile(profile);
    }
    navigation.replace('IntroVideo', { mode: 'endcard' });
  };

  const react = (reaction: Reaction) => {
    const act = activityArchetypes[index];
    const next = { ...reactions, [act.id]: reaction };
    setReactions(next);
    if (index + 1 >= activityArchetypes.length) {
      finish(next);
    } else {
      setIndex(index + 1);
    }
  };

  const act = activityArchetypes[index];
  const where = act.indoor ? 'Indoor' : 'Outdoor';
  const social = act.solo ? 'Solo' : 'Together';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>One more thing</Text>
        <Text style={styles.title}>What would your child enjoy?</Text>
        <Text style={styles.subtitle}>
          Tap how each one feels. We'll build quests around what they love.
        </Text>
      </View>

      <View style={styles.progressRow}>
        {activityArchetypes.map((_, i) => (
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
          <Text style={styles.emoji}>{act.emoji}</Text>
          <Text style={styles.actTitle}>{act.title}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>{where}</Text>
            <Text style={styles.tag}>{social}</Text>
            {act.competitive && <Text style={styles.tag}>Competitive</Text>}
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
        {index + 1} of {activityArchetypes.length}
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
  actTitle: { ...typography.h2, textAlign: 'center', marginBottom: 14 },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
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
