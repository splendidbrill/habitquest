import React, { useState, useEffect } from 'react';
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

const buddyEmojis: Record<string, string> = {
  lion: '🦁', tiger: '🐯', elephant: '🐘', monkey: '🐵',
};

export function KidsBuddyHome() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [buddyName, setBuddyName] = useState('Explorer');
  const [selectedBuddy, setSelectedBuddy] = useState('tiger');
  const [missionDone, setMissionDone] = useState(false);
  const [greetingTime, setGreetingTime] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime('Good Morning');
    else if (hour < 17) setGreetingTime('Good Afternoon');
    else setGreetingTime('Good Evening');

    storage.getItem('kidsBuddyName').then(v => { if (v) setBuddyName(v); });
    storage.getItem('kidsSelectedBuddy').then(v => { if (v) setSelectedBuddy(v); });
    storage.getItem('kidsMissionCompleted').then(v => { setMissionDone(v === 'true'); });
  }, []);

  const emoji = buddyEmojis[selectedBuddy] ?? '🦁';

  const navBtn = (
    emoji: string, title: string, desc: string, colors: [string, string], screen: keyof RootStackParamList
  ) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate(screen as any)}
    >
      <LinearGradient colors={colors} style={styles.navCard}>
        <Text style={styles.navEmoji}>{emoji}</Text>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navDesc}>{desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#bae6fd', '#fed7aa', '#fef9c3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.buddyEmoji}>{emoji}</Text>
          <Text style={styles.greeting}>{greetingTime} {buddyName}! 👋</Text>
          <Text style={styles.subGreet}>Ready for today's mission?</Text>

          {!missionDone ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('KidsDailyMission')}
            >
              <LinearGradient colors={['#fb923c', '#ef4444', '#ec4899']} style={styles.missionCard}>
                <Text style={styles.missionEmoji}>🎯</Text>
                <Text style={styles.missionTitle}>Start Mission!</Text>
                <Text style={styles.missionDesc}>Let's go on an adventure!</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.missionDoneCard}>
              <Text style={styles.missionEmoji}>🎉</Text>
              <Text style={styles.missionDoneTitle}>Mission Complete!</Text>
              <Text style={styles.missionDoneDesc}>Come back tomorrow! 🌟</Text>
            </View>
          )}

          {navBtn('🍎', 'Food Discovery!', 'Tap and explore yummy foods', ['#4ade80', '#10b981'], 'KidsFoodDiscovery')}
          {navBtn('🍽️', 'Choose Dinner!', 'Pick what sounds yummy', ['#fb923c', '#f59e0b'], 'KidsDinnerChoice')}
          {navBtn('🥦', 'Veggie Explorer', 'Try new veggies this week', ['#22c55e', '#16a34a'], 'KidsVeggieSelector')}
          {navBtn('👨‍🍳', 'Kitchen Helper', 'Help with cooking tasks', ['#fbbf24', '#f97316'], 'KidsKitchenHelper')}
          {navBtn('🎮', 'Play Games!', 'Fun healthy games to play', ['#38bdf8', '#06b6d4'], 'KidsGameHub')}
          {navBtn('⭐', 'My Rewards!', 'See your stars and badges', ['#c084fc', '#ec4899'], 'KidsRewardsScreen')}
          {navBtn('🎁', 'My Collection!', 'See all your cool items', ['#fbbf24', '#fb923c'], 'KidsCollectiblesViewer')}
          {navBtn('🗺️', 'Adventure Map', 'See how far you\'ve explored', ['#60a5fa', '#818cf8'], 'KidsProgressMap')}
          {navBtn('🦸', 'My Buddy Status', 'Check your buddy\'s level', ['#a78bfa', '#818cf8'], 'KidsAvatarStatus')}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
  buddyEmoji: { fontSize: 96, marginBottom: 8 },
  greeting: { fontSize: 32, fontWeight: '800', color: '#1f2937', marginBottom: 4, textAlign: 'center' },
  subGreet: { fontSize: 22, color: '#374151', marginBottom: 24, textAlign: 'center' },
  missionCard: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  missionEmoji: { fontSize: 64, marginBottom: 10 },
  missionTitle: { fontSize: 30, fontWeight: '800', color: '#fff', marginBottom: 6 },
  missionDesc: { fontSize: 18, color: 'rgba(255,255,255,0.9)' },
  missionDoneCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  missionDoneTitle: { fontSize: 24, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  missionDoneDesc: { fontSize: 18, color: '#6b7280' },
  navCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  navEmoji: { fontSize: 60, marginBottom: 8 },
  navTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  navDesc: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
});
