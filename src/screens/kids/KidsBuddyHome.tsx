import React, { useState, useEffect, useRef } from 'react';
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
import { Flame, Star, MapPin } from 'lucide-react-native';
import { storage } from '../../utils/storage';
import { useChild } from '../../context/ChildContext';
import {
  getBuddyMood,
  checkAndGrantWeeklyFreeze,
  loadFreezeStatus,
} from '../../services/streakService';
import { RecommendedMissions } from '../../components/RecommendedMissions';
import { DailySpin, useDailySpin } from '../../components/DailySpin';
import { ParentReactionBanner } from '../../components/ParentReactionBanner';
import {
  loadFamilyProfile,
  type FamilyProfile,
} from '../../data/familyProfile';
import {
  selectDailyMovementQuest,
  type MovementQuest,
} from '../../data/movementQuests';
import {
  kids6Theme as T,
  KIDS6_BG_GRADIENT,
  KIDS6_GRADIENTS,
} from './kids6Theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const buddyEmojis: Record<string, string> = {
  lion: '🦁',
  tiger: '🐯',
  elephant: '🐘',
  monkey: '🐵',
};

const MOOD_EMOJI: Record<string, string> = {
  happy: '',
  worried: '😟',
  sad: '😢',
};

const MOOD_MESSAGE: Record<string, string> = {
  happy: '',
  worried: 'Your buddy misses you! Come back today to keep your streak! 🔥',
  sad: 'Your buddy is sad… Your streak broke. Start a new one today! 💪',
};

type Tile = {
  icon: string;
  label: string;
  desc: string;
  colors: [string, string];
  screen: keyof RootStackParamList;
};

const FOOD_TILES: Tile[] = [
  {
    icon: '🍓',
    label: 'Food & Veggie Discovery',
    desc: '5 new foods to try',
    colors: KIDS6_GRADIENTS.discovery,
    screen: 'KidsFoodDiscovery',
  },
  {
    icon: '🍽️',
    label: 'Choose Dinner',
    desc: 'Pick what sounds yummy',
    colors: KIDS6_GRADIENTS.dinner,
    screen: 'KidsDinnerChoice',
  },
  {
    icon: '👨‍🍳',
    label: 'Kitchen Helper',
    desc: 'Help with cooking',
    colors: KIDS6_GRADIENTS.kitchen,
    screen: 'KidsKitchenHelper',
  },
];

const GAME_TILES: Tile[] = [
  {
    icon: '🎮',
    label: 'Play Games',
    desc: 'Fun healthy games',
    colors: KIDS6_GRADIENTS.games,
    screen: 'KidsGameHub',
  },
  {
    icon: '🦸',
    label: 'Superhero Workout',
    desc: 'Be a hero!',
    colors: KIDS6_GRADIENTS.superhero,
    screen: 'KidsSuperheroWorkout',
  },
];

const EXPLORE_TILES: Tile[] = [
  {
    icon: '⭐',
    label: 'My Rewards',
    desc: 'Stars & badges',
    colors: KIDS6_GRADIENTS.rewards,
    screen: 'KidsRewardsScreen',
  },
  {
    icon: '🎁',
    label: 'My Collection',
    desc: 'Your cool items',
    colors: KIDS6_GRADIENTS.collection,
    screen: 'KidsCollectiblesViewer',
  },
  {
    icon: '🗺️',
    label: 'Adventure Map',
    desc: "How far you've gone",
    colors: KIDS6_GRADIENTS.map,
    screen: 'KidsProgressMap',
  },
  {
    icon: '🦸',
    label: 'Buddy Status',
    desc: "Your buddy's level",
    colors: KIDS6_GRADIENTS.superhero,
    screen: 'KidsAvatarStatus',
  },
  {
    icon: '📊',
    label: 'Weekly Check-in',
    desc: 'Update your world',
    colors: KIDS6_GRADIENTS.checkin,
    screen: 'PillarCheckIn',
  },
  {
    icon: '🤝',
    label: 'Family Challenges',
    desc: 'Earn XP together',
    colors: KIDS6_GRADIENTS.family,
    screen: 'KidsFamilyChallenges',
  },
];

export function KidsBuddyHome() {
  const navigation = useNavigation<Nav>();
  const { activeChild } = useChild();
  const { showSpin, dismissSpin } = useDailySpin();
  const [buddyName, setBuddyName] = useState('Explorer');
  const [selectedBuddy, setSelectedBuddy] = useState('tiger');
  const [missionDone, setMissionDone] = useState(false);
  const [greetingTime, setGreetingTime] = useState('Hello');
  const [buddyMood, setBuddyMood] = useState<'happy' | 'worried' | 'sad'>(
    'happy',
  );
  const [freezesAvailable, setFreezesAvailable] = useState(0);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);

  // Phase A.2: reaching home means avatar creation is done — flag it so
  // ProfileSelector skips the avatar flow next time.
  useEffect(() => {
    if (activeChild?.id) storage.setItem('avatarReady:' + activeChild.id, '1');
  }, [activeChild?.id]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime('Good Morning');
    else if (hour < 17) setGreetingTime('Good Afternoon');
    else setGreetingTime('Good Evening');

    loadFamilyProfile().then(setProfile);
    storage.getItem('kidsBuddyName').then(v => v && setBuddyName(v));
    storage.getItem('kidsSelectedBuddy').then(v => v && setSelectedBuddy(v));
    // Mission is "done" only if completed TODAY (Phase D.1 dead-end fix).
    storage.getItem('kidsMissionCompletedDate').then(v => {
      setMissionDone(v === new Date().toDateString());
    });

    if (activeChild?.id) {
      checkAndGrantWeeklyFreeze(activeChild.id);
      getBuddyMood(activeChild.id).then(setBuddyMood);
      loadFreezeStatus(activeChild.id).then(s =>
        setFreezesAvailable(s.freezesAvailable),
      );
    }
  }, [activeChild?.id]);

  // Floating buddy animation.
  const floatY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [floatY]);

  const baseEmoji = buddyEmojis[selectedBuddy] ?? '🦁';
  const emoji = buddyMood !== 'happy' ? MOOD_EMOJI[buddyMood] : baseEmoji;
  const streak = activeChild?.streak ?? 0;
  const xp = activeChild?.xp ?? 0;

  const quest: MovementQuest = selectDailyMovementQuest('6-8', profile);

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
            <Text style={styles.tileDesc}>{t.desc}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={KIDS6_BG_GRADIENT} style={styles.container}>
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
                onPress={() => go('KidsAvatarStatus')}
              >
                <LinearGradient
                  colors={KIDS6_GRADIENTS.buddy}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarEmoji}>{baseEmoji}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View>
                <Text style={styles.hello}>{greetingTime}!</Text>
                <Text style={styles.name}>{buddyName} 👋</Text>
              </View>
            </View>
            <View style={styles.pills}>
              <View style={styles.pill}>
                <Flame size={15} color="#F97316" />
                <Text style={styles.pillText}>{streak}</Text>
              </View>
              <View style={styles.pill}>
                <Star size={15} color={T.sunshine} />
                <Text style={styles.pillText}>{xp}</Text>
              </View>
            </View>
          </View>

          {freezesAvailable > 0 && (
            <View style={styles.freezeBadge}>
              <Text style={styles.freezeText}>
                🧊 {freezesAvailable} streak freeze
              </Text>
            </View>
          )}

          {/* Animated buddy */}
          <Animated.View style={{ transform: [{ translateY: floatY }] }}>
            <LinearGradient
              colors={KIDS6_GRADIENTS.buddy}
              style={styles.buddyCard}
            >
              <Text style={styles.buddyEmoji}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.buddyTitle}>Your buddy is ready!</Text>
                <Text style={styles.buddySub}>Let's go on an adventure!</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Mood banner */}
          {buddyMood !== 'happy' && (
            <View
              style={[
                styles.moodBanner,
                buddyMood === 'sad' ? styles.moodSad : styles.moodWorried,
              ]}
            >
              <Text style={styles.moodText}>{MOOD_MESSAGE[buddyMood]}</Text>
            </View>
          )}

          {/* Daily mission hero (D.1 date logic) */}
          {!missionDone ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => go('KidsDailyMission')}
            >
              <View style={styles.questCard}>
                <Text style={styles.questEmoji}>{quest.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.questKicker}>TODAY'S ADVENTURE</Text>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questSub} numberOfLines={2}>
                    {quest.challenge}
                  </Text>
                  <View style={styles.startPill}>
                    <Text style={styles.startPillText}>
                      Start! 🚀 +{quest.xp} XP
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.doneCard}>
              <Text style={styles.doneEmoji}>🎉</Text>
              <Text style={styles.doneTitle}>Mission Complete!</Text>
              <Text style={styles.doneSub}>
                Come back tomorrow for a new one! 🌟
              </Text>
            </View>
          )}

          {/* Personalised recommendations */}
          <RecommendedMissions isDark={false} />

          {/* Sections */}
          <Text style={styles.groupTitle}>🍎 Food Adventures</Text>
          {renderTiles(FOOD_TILES)}

          <Text style={styles.groupTitle}>🎮 Games</Text>
          {renderTiles(GAME_TILES)}

          <Text style={styles.groupTitle}>🗺️ Explore</Text>
          {renderTiles(EXPLORE_TILES)}

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => go('WorldMap')}>
            <LinearGradient colors={KIDS6_GRADIENTS.cta} style={styles.cta}>
              <MapPin size={22} color="#fff" />
              <Text style={styles.ctaText}>See My World!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          {[
            { icon: '🏠', label: 'Home', screen: undefined },
            { icon: '🗺️', label: 'Map', screen: 'KidsProgressMap' as const },
            { icon: '🎮', label: 'Games', screen: 'KidsGameHub' as const },
            { icon: '🍎', label: 'Food', screen: 'KidsFoodDiscovery' as const },
            {
              icon: '⭐',
              label: 'Rewards',
              screen: 'KidsRewardsScreen' as const,
            },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              disabled={!item.screen}
              onPress={() => item.screen && go(item.screen)}
              style={styles.navItem}
            >
              <View style={styles.navIconWrap}>
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
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: { fontSize: 32 },
  hello: { fontSize: 15, fontWeight: '600', color: T.muted },
  name: { fontSize: 22, fontWeight: '800', color: T.foreground },
  pills: { gap: 6, alignItems: 'flex-end' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: { fontSize: 14, fontWeight: '800', color: T.foreground },

  freezeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  freezeText: { fontSize: 13, fontWeight: '700', color: '#0369A1' },

  buddyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: T.radius,
    padding: 20,
    marginBottom: 16,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buddyEmoji: { fontSize: 56 },
  buddyTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  buddySub: { fontSize: 15, color: 'rgba(255,255,255,0.95)', marginTop: 2 },

  moodBanner: { borderRadius: 18, padding: 14, marginBottom: 16 },
  moodWorried: {
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  moodSad: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  moodText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },

  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.card,
    borderRadius: T.radius,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  questEmoji: { fontSize: 52 },
  questKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: T.accent,
    letterSpacing: 0.6,
  },
  questTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: T.foreground,
    marginTop: 2,
  },
  questSub: { fontSize: 14, color: T.muted, lineHeight: 19, marginTop: 2 },
  startPill: {
    alignSelf: 'flex-start',
    backgroundColor: T.primary,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 10,
  },
  startPillText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  doneCard: {
    backgroundColor: T.card,
    borderRadius: T.radius,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  doneEmoji: { fontSize: 56, marginBottom: 6 },
  doneTitle: { fontSize: 22, fontWeight: '800', color: T.foreground },
  doneSub: { fontSize: 15, color: T.muted, marginTop: 4, textAlign: 'center' },

  groupTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: T.foreground,
    marginBottom: 10,
    marginTop: 4,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  tileWrap: { width: '47%' },
  tile: {
    borderRadius: T.radius,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tileIcon: { fontSize: 40, marginBottom: 6 },
  tileLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  tileDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 2,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: T.radius,
    paddingVertical: 18,
    marginTop: 4,
    shadowColor: T.sky,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: { fontSize: 19, fontWeight: '800', color: '#fff' },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: T.cardBorder,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: { alignItems: 'center', gap: 2 },
  navIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 11, fontWeight: '700', color: T.muted },
});
