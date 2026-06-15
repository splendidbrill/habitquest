import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { Sparkles, MapPin, Flame, Star, User } from 'lucide-react-native';
import { RecommendedMissions } from '../../components/RecommendedMissions';
import { DailySpin, useDailySpin } from '../../components/DailySpin';
import { ParentReactionBanner } from '../../components/ParentReactionBanner';
import { useChild } from '../../context/ChildContext';
import { loadFamilyProfile, type FamilyProfile } from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import {
  kids12Theme as T,
  KIDS12_BG_GRADIENT,
  KIDS12_GRADIENTS,
} from './kids12Theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tile = {
  icon: string;
  label: string;
  colors: [string, string];
  screen: keyof RootStackParamList;
};

const MOVE_TILES: Tile[] = [
  { icon: '🏃', label: 'Urban Runner', colors: KIDS12_GRADIENTS.runner, screen: 'Kids12UrbanRunner' },
  { icon: '🎯', label: 'Reflex & Rhythm', colors: KIDS12_GRADIENTS.reflex, screen: 'Kids12ReflexRhythm' },
  { icon: '⚡', label: 'Micro Workouts', colors: KIDS12_GRADIENTS.micro, screen: 'Kids12MicroWorkouts' },
  { icon: '🔥', label: 'Movement', colors: KIDS12_GRADIENTS.movement, screen: 'Kids12Movement' },
];

const FOOD_TILES: Tile[] = [
  { icon: '🔄', label: 'Food Swaps', colors: KIDS12_GRADIENTS.foodSwaps, screen: 'Kids12FoodSwaps' },
  { icon: '🥑', label: 'Healthy Eating', colors: KIDS12_GRADIENTS.eating, screen: 'Kids12HealthyEating' },
];

// Teen wellbeing content — surfaced as tiles instead of buried in a menu.
const SPACE_TILES: Tile[] = [
  { icon: '💭', label: 'Check In', colors: KIDS12_GRADIENTS.checkIn, screen: 'Kids12CheckIn' },
  { icon: '📓', label: 'Private Journal', colors: KIDS12_GRADIENTS.reflection, screen: 'Kids12Reflection' },
  { icon: '📈', label: 'Wellbeing Tracker', colors: KIDS12_GRADIENTS.wellbeing, screen: 'Kids12WellbeingTracker' },
  { icon: '🗓️', label: 'Weekly Planner', colors: KIDS12_GRADIENTS.planner, screen: 'Kids12WeeklyPlanner' },
  { icon: '🧭', label: 'Resources', colors: KIDS12_GRADIENTS.resources, screen: 'Kids12Resources' },
];

export function Kids12Today() {
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();
  const { showSpin, dismissSpin } = useDailySpin();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    loadFamilyProfile().then(setProfile);
    storage.getItem('kids12LastCheckIn').then(v => {
      setCheckedInToday(v === new Date().toDateString());
    });
  }, []);

  // Phase A.2: mark avatar/onboarding complete so ProfileSelector can skip it.
  useEffect(() => {
    if (activeChild?.id) storage.setItem('avatarReady:' + activeChild.id, '1');
  }, [activeChild?.id]);

  const xp = activeChild?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const xpIntoLevel = xp % 100;
  const streak = activeChild?.streak ?? 0;
  const userName = activeChild?.name ?? 'Legend';

  const quest: MovementQuest = selectDailyMovementQuest('10-12', profile);

  const go = (screen: keyof RootStackParamList) =>
    navigation.navigate(screen as never);

  const renderTiles = (tiles: Tile[]) => (
    <View style={styles.tileGrid}>
      {tiles.map(t => (
        <TouchableOpacity
          key={t.screen}
          activeOpacity={0.85}
          onPress={() => go(t.screen)}
          style={styles.tileWrap}
        >
          <LinearGradient colors={t.colors} style={styles.tile}>
            <Text style={styles.tileIcon}>{t.icon}</Text>
            <Text style={styles.tileLabel}>{t.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={KIDS12_BG_GRADIENT} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => go('Kids12ProfileIdentity')}
              >
                <LinearGradient
                  colors={KIDS12_GRADIENTS.identity}
                  style={styles.avatar}
                >
                  <User size={22} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <View>
                <Text style={styles.hello}>Hey, {userName}</Text>
                <View style={styles.levelRow}>
                  <Sparkles size={14} color={T.primary} />
                  <Text style={styles.levelText}>Level {level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.pills}>
              <View style={styles.pill}>
                <Flame size={15} color="#F97316" />
                <Text style={styles.pillText}>{streak}</Text>
              </View>
              <View style={styles.pill}>
                <Star size={15} color={T.gold} />
                <Text style={styles.pillText}>{xp} XP</Text>
              </View>
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.xpCard}>
            <View style={styles.xpHead}>
              <Text style={styles.xpLabel}>Level {level}</Text>
              <Text style={styles.xpValue}>{xpIntoLevel}/100 to next</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpIntoLevel}%` }]} />
            </View>
          </View>

          {/* Identity card (epic, less cute) */}
          <LinearGradient colors={KIDS12_GRADIENTS.identity} style={styles.identityCard}>
            <Text style={styles.identityEmoji}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.identityTitle}>Level up your story</Text>
              <Text style={styles.identitySub}>
                You're in control — own today, one move at a time.
              </Text>
            </View>
            <Sparkles size={26} color={T.gold} />
          </LinearGradient>

          {/* Today's Adventure — the daily Movement Quest */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Today's Challenge</Text>
            <TouchableOpacity onPress={() => go('Kids12Movement')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => go('Kids12Movement')}>
            <View style={styles.questCard}>
              <Text style={styles.questEmoji}>{quest.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questSub} numberOfLines={2}>
                  {quest.challenge}
                </Text>
                <View style={styles.questMetaRow}>
                  <Text style={styles.questMeta}>⏱ {quest.durationMin} min</Text>
                  <Text style={styles.questXp}>+{quest.xp} XP</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Personalised recommendations */}
          <RecommendedMissions isDark={true} />

          {/* Grouped sections */}
          <Text style={styles.groupTitle}>🎮 Games & Moves</Text>
          {renderTiles(MOVE_TILES)}

          <Text style={styles.groupTitle}>🍎 Food & Energy</Text>
          {renderTiles(FOOD_TILES)}

          <Text style={styles.groupTitle}>🧠 Your Space</Text>
          {renderTiles(SPACE_TILES)}

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => go('WorldMap')}>
            <LinearGradient colors={KIDS12_GRADIENTS.cta} style={styles.cta}>
              <MapPin size={22} color="#fff" />
              <Text style={styles.ctaText}>Explore Your World</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => go('Kids12Feedback')}>
            <Text style={styles.footerLink}>Give feedback</Text>
          </TouchableOpacity>
          <Text style={styles.bottomNote}>
            You're in control. Skip anything that doesn't fit today.
          </Text>
        </ScrollView>

        {/* Bottom nav (5-item) */}
        <View style={styles.bottomNav}>
          {[
            { icon: '🏠', label: 'Home', screen: undefined },
            { icon: '🗺️', label: 'Map', screen: 'WorldMap' as const },
            { icon: '🔥', label: 'Moves', screen: 'Kids12Movement' as const },
            { icon: '💭', label: 'Mind', screen: 'Kids12CheckIn' as const },
            { icon: '👤', label: 'Profile', screen: 'Kids12ProfileIdentity' as const },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              disabled={!item.screen}
              onPress={() => item.screen && go(item.screen)}
              style={styles.navItem}
            >
              <View
                style={[
                  styles.navIconWrap,
                  item.label === 'Mind' && !checkedInToday && styles.navIconAlert,
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <DailySpin visible={showSpin} onClose={dismissSpin} />
        <ParentReactionBanner />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 110 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hello: { fontSize: 20, fontWeight: '800', color: T.foreground },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  levelText: { fontSize: 13, fontWeight: '700', color: T.primary },
  pills: { gap: 6, alignItems: 'flex-end' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: T.foreground },

  xpCard: {
    backgroundColor: T.card,
    borderRadius: T.radius,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  xpHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: { fontSize: 13, fontWeight: '700', color: T.foreground },
  xpValue: { fontSize: 12, color: T.muted },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: T.xpBar, borderRadius: 4 },

  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: T.radius,
    padding: 18,
    marginBottom: 22,
  },
  identityEmoji: { fontSize: 40 },
  identityTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  identitySub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: T.foreground },
  seeAll: { fontSize: 14, fontWeight: '700', color: T.primary },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.card,
    borderRadius: T.radius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  questEmoji: { fontSize: 40 },
  questTitle: { fontSize: 16, fontWeight: '800', color: T.foreground },
  questSub: { fontSize: 13, color: T.muted, lineHeight: 18, marginTop: 2 },
  questMetaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  questMeta: { fontSize: 12, fontWeight: '700', color: T.primary },
  questXp: { fontSize: 12, fontWeight: '800', color: T.pink },

  groupTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: T.foreground,
    marginBottom: 10,
    marginTop: 4,
  },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  tileWrap: { width: '47%' },
  tile: { borderRadius: T.radius, padding: 18, alignItems: 'center' },
  tileIcon: { fontSize: 34, marginBottom: 8 },
  tileLabel: { fontSize: 13, fontWeight: '700', color: '#fff', textAlign: 'center' },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: T.radius,
    paddingVertical: 18,
    marginTop: 4,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },

  footerLink: {
    fontSize: 13,
    color: T.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  bottomNote: {
    fontSize: 11,
    color: T.mutedDim,
    textAlign: 'center',
    marginTop: 10,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(11,11,20,0.96)',
    borderTopWidth: 1,
    borderTopColor: T.cardBorder,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: { alignItems: 'center', gap: 2 },
  navIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(168,85,247,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconAlert: {
    backgroundColor: 'rgba(236,72,153,0.25)',
    borderWidth: 1,
    borderColor: T.pink,
  },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, fontWeight: '600', color: T.muted },
});
