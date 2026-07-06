import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { useChild } from '../../context/ChildContext';
import { Lock } from 'lucide-react-native';

// ============================================================
// "Build Your Quest Hero" — the 8–10 opening screen.
//
// Replaces the old "Welcome Athlete / enter your name" flow with an
// adventure-hero character builder (Pokémon-trainer / light-Roblox vibe):
// pick hero / hair / outfit / sidekick, watch the hero update instantly,
// see the locked worlds + reward counters, then "Start My Adventure".
// ============================================================

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Opt = { id: string; emoji: string; label: string };

const GENDERS: Opt[] = [
  { id: 'boy', emoji: '👦', label: 'Boy' },
  { id: 'girl', emoji: '👧', label: 'Girl' },
  { id: 'neutral', emoji: '🧒', label: 'Neutral' },
];

const HAIRS: { id: string; color: string; label: string }[] = [
  { id: 'black', color: '#1F2937', label: 'Black' },
  { id: 'brown', color: '#92400E', label: 'Brown' },
  { id: 'blonde', color: '#FCD34D', label: 'Blonde' },
  { id: 'red', color: '#EA580C', label: 'Red' },
  { id: 'blue', color: '#3B82F6', label: 'Blue' },
  { id: 'pink', color: '#EC4899', label: 'Pink' },
];

const OUTFITS: Opt[] = [
  { id: 'explorer', emoji: '🧭', label: 'Explorer' },
  { id: 'athlete', emoji: '🏅', label: 'Athlete' },
  { id: 'adventurer', emoji: '🗺️', label: 'Adventurer' },
  { id: 'scientist', emoji: '🔬', label: 'Scientist' },
  { id: 'ninja', emoji: '🥷', label: 'Ninja' },
  { id: 'football', emoji: '⚽', label: 'Football Star' },
];

const SIDEKICKS: Opt[] = [
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon' },
  { id: 'dog', emoji: '🐶', label: 'Dog' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'owl', emoji: '🦉', label: 'Owl' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
];

const WORLDS = [
  { emoji: '🥕', label: 'Nutrition Forest', unlocked: true },
  { emoji: '⚽', label: 'Activity Arena', unlocked: false },
  { emoji: '😴', label: 'Sleep Mountain', unlocked: false },
  { emoji: '🧠', label: 'Confidence Castle', unlocked: false },
];

const REWARD_TEASERS = [
  '124 rewards to discover',
  '52 badges to unlock',
  '4 worlds to explore',
];

export function Kids8AthleteOnboarding() {
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();

  const [gender, setGender] = useState('neutral');
  const [hair, setHair] = useState('black');
  const [outfit, setOutfit] = useState('explorer');
  const [sidekick, setSidekick] = useState('fox');

  const genderEmoji = GENDERS.find(g => g.id === gender)?.emoji ?? '🧒';
  const hairColor = HAIRS.find(h => h.id === hair)?.color ?? '#1F2937';
  const outfitData = OUTFITS.find(o => o.id === outfit) ?? OUTFITS[0];
  const sidekickEmoji = SIDEKICKS.find(s => s.id === sidekick)?.emoji ?? '🦊';

  // Floating hero + glowing start button.
  const floatY = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [floatY, glow]);

  const glowRadius = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 22],
  });

  const handleStart = async () => {
    await storage.setItem(
      'kids8Hero',
      JSON.stringify({ gender, hair, outfit, sidekick }),
    );
    // Keep the greeting on later screens working now the name step is gone —
    // the child's name already exists on their profile.
    await storage.setItem('kids8UserName', activeChild?.name ?? 'Explorer');
    await storage.setItem('kids8UserSport', outfit);
    await storage.setItem('kids8FamilyPoints', '0');
    await storage.setItem('kids8CurrentStreak', '1');
    await storage.setItem('kids8LastActiveDate', new Date().toDateString());
    navigation.navigate('Kids8TrainingDashboard');
  };

  const renderOptions = (
    items: Opt[],
    selected: string,
    onSelect: (id: string) => void,
  ) => (
    <View style={styles.optGrid}>
      {items.map(o => {
        const isSel = o.id === selected;
        return (
          <TouchableOpacity
            key={o.id}
            activeOpacity={0.85}
            onPress={() => onSelect(o.id)}
            style={styles.optWrap}
          >
            <View style={[styles.optCard, isSel && styles.optCardSel]}>
              <Text style={styles.optEmoji}>{o.emoji}</Text>
              <Text style={[styles.optLabel, isSel && styles.optLabelSel]}>
                {o.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <LinearGradient
      colors={['#2D1B4E', '#1E3A8A', '#312E81']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.kicker}>WELCOME TO</Text>
          <Text style={styles.title}>Habit Quest</Text>
          <Text style={styles.subtitle}>
            Build your hero.{'\n'}Complete quests.{'\n'}Unlock new worlds.
          </Text>

          {/* Hero preview standing on the pathway */}
          <Animated.View
            style={[styles.heroStage, { transform: [{ translateY: floatY }] }]}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={[styles.heroRing, { borderColor: hairColor }]}
            >
              <Text style={styles.heroEmoji}>{genderEmoji}</Text>
              <View style={styles.outfitBadge}>
                <Text style={styles.badgeEmoji}>{outfitData.emoji}</Text>
              </View>
              <View style={styles.sidekickBadge}>
                <Text style={styles.badgeEmoji}>{sidekickEmoji}</Text>
              </View>
            </LinearGradient>
            <View style={styles.pathway} />
            <Text style={styles.levelText}>Level 1 {outfitData.label}</Text>
            <Text style={styles.levelSub}>Ready for your first quest.</Text>
          </Animated.View>

          {/* Locked worlds map */}
          <View style={styles.worldsRow}>
            {WORLDS.map(w => (
              <View key={w.label} style={styles.worldItem}>
                <View
                  style={[
                    styles.worldOrb,
                    !w.unlocked && styles.worldOrbLocked,
                  ]}
                >
                  <Text style={styles.worldEmoji}>
                    {w.unlocked ? w.emoji : '☁️'}
                  </Text>
                </View>
                <Text style={styles.worldLabel} numberOfLines={2}>
                  {w.unlocked ? w.label : 'Locked'}
                </Text>
              </View>
            ))}
          </View>

          {/* Selectors */}
          <Text style={styles.sectionTitle}>Choose Your Hero</Text>
          {renderOptions(GENDERS, gender, setGender)}

          <Text style={styles.sectionTitle}>Choose Hair</Text>
          <View style={styles.optGrid}>
            {HAIRS.map(h => {
              const isSel = h.id === hair;
              return (
                <TouchableOpacity
                  key={h.id}
                  activeOpacity={0.85}
                  onPress={() => setHair(h.id)}
                  style={styles.hairWrap}
                >
                  <View
                    style={[
                      styles.hairSwatch,
                      { backgroundColor: h.color },
                      isSel && styles.hairSwatchSel,
                    ]}
                  />
                  <Text style={[styles.optLabel, isSel && styles.optLabelSel]}>
                    {h.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Choose Outfit</Text>
          {renderOptions(OUTFITS, outfit, setOutfit)}

          <Text style={styles.sectionTitle}>Choose Sidekick</Text>
          {renderOptions(SIDEKICKS, sidekick, setSidekick)}

          {/* Reward anticipation */}
          <View style={styles.rewardsCard}>
            {REWARD_TEASERS.map(t => (
              <View key={t} style={styles.rewardRow}>
                <Lock size={16} color="#FCD34D" />
                <Text style={styles.rewardText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Start button (glows) */}
          <Animated.View
            style={{
              shadowColor: '#FCD34D',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.9,
              shadowRadius: glowRadius,
              elevation: 12,
            }}
          >
            <TouchableOpacity activeOpacity={0.9} onPress={handleStart}>
              <LinearGradient
                colors={['#F59E0B', '#EC4899', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Text style={styles.startText}>Start My Adventure ⚔️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 44, alignItems: 'center' },

  kicker: {
    fontSize: 13,
    fontWeight: '800',
    color: '#A78BFA',
    letterSpacing: 3,
    marginTop: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    marginTop: 2,
    textShadowColor: 'rgba(236,72,153,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#DDD6FE',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 8,
    fontWeight: '600',
  },

  heroStage: { alignItems: 'center', marginVertical: 10 },
  heroRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  heroEmoji: { fontSize: 88 },
  outfitBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidekickBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 26 },
  pathway: {
    width: 120,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(252,211,77,0.35)',
    marginTop: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FCD34D',
    marginTop: 12,
  },
  levelSub: { fontSize: 13, color: '#DDD6FE', marginTop: 2 },

  worldsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 18,
  },
  worldItem: { alignItems: 'center', width: '23%' },
  worldOrb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139,92,246,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(252,211,77,0.6)',
  },
  worldOrbLocked: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  worldEmoji: { fontSize: 26 },
  worldLabel: {
    fontSize: 11,
    color: '#DDD6FE',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 10,
  },
  optGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  optWrap: { width: '31%' },
  optCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  optCardSel: {
    backgroundColor: 'rgba(236,72,153,0.25)',
    borderColor: '#FCD34D',
  },
  optEmoji: { fontSize: 34, marginBottom: 4 },
  optLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DDD6FE',
    textAlign: 'center',
  },
  optLabelSel: { color: '#fff' },

  hairWrap: { width: '31%', alignItems: 'center', gap: 6 },
  hairSwatch: {
    width: '100%',
    height: 46,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hairSwatchSel: { borderColor: '#FCD34D', borderWidth: 4 },

  rewardsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginTop: 24,
    marginBottom: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.3)',
  },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rewardText: { fontSize: 15, fontWeight: '700', color: '#FEF3C7' },

  startBtn: {
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { fontSize: 19, fontWeight: '900', color: '#fff' },
});
