import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ChevronRight, Menu, User, TrendingUp, Flame } from 'lucide-react-native';
import { RecommendedMissions } from '../../components/RecommendedMissions';
import { DailySpin, useDailySpin } from '../../components/DailySpin';
import { ParentReactionBanner } from '../../components/ParentReactionBanner';
import { useChild } from '../../context/ChildContext';

const greetings = ['What\'s up', 'Hey', 'Welcome back', 'Good to see you'];

const dailySuggestions = [
  {
    id: 'energy-boost',
    type: 'Energy Boost Activity',
    title: 'Quick power-up?',
    subtitle: '2 minutes can shift your whole vibe',
    action: 'Try a micro-workout',
    screen: 'Kids12MicroWorkouts' as keyof RootStackParamList,
    colors: ['#06b6d4', '#0891b2'] as [string, string],
  },
  {
    id: 'mood-reset',
    type: 'Mood Reset Move',
    title: 'Need a mental break?',
    subtitle: 'Your mind needs movement too',
    action: 'Play Reflex & Rhythm',
    screen: 'Kids12ReflexRhythm' as keyof RootStackParamList,
    colors: ['#a855f7', '#9333ea'] as [string, string],
  },
  {
    id: 'confidence-challenge',
    type: 'Confidence Challenge',
    title: 'Build something today',
    subtitle: 'Small wins = big momentum',
    action: 'Pick your move',
    screen: 'Kids12Movement' as keyof RootStackParamList,
    colors: ['#ec4899', '#be185d'] as [string, string],
  },
  {
    id: 'urban-run',
    type: 'Energy Boost Activity',
    title: 'Quick reflex session?',
    subtitle: 'Athletes train their reactions',
    action: 'Urban Runner',
    screen: 'Kids12UrbanRunner' as keyof RootStackParamList,
    colors: ['#3b82f6', '#1d4ed8'] as [string, string],
  },
];

export function Kids12Today() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeChild } = useChild();
  const [showMenu, setShowMenu] = useState(false);
  const [greeting] = useState(greetings[Math.floor(Math.random() * greetings.length)]);
  const [todaySuggestion] = useState(
    dailySuggestions[Math.floor(Math.random() * dailySuggestions.length)]
  );
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const { showSpin, dismissSpin } = useDailySpin();

  // XP and streak come from Supabase via context — safe across devices
  const playerXP      = activeChild?.xp ?? 0;
  const playerLevel   = Math.floor(playerXP / 100) + 1;
  const currentStreak = activeChild?.streak ?? 0;

  useEffect(() => {
    storage.getItem('kids12LastCheckIn').then(v => {
      setHasCheckedInToday(v === new Date().toDateString());
    });
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const menuItems = [
    { section: 'Your Space', items: [
      { label: '🗺️ World Map', screen: 'WorldMap' as keyof RootStackParamList },
      { label: '📊 Weekly Check-in', screen: 'PillarCheckIn' as keyof RootStackParamList },
      { label: '🤝 Family Challenges', screen: 'KidsFamilyChallenges' as keyof RootStackParamList },
      { label: 'Profile & Identity', screen: 'Kids12ProfileIdentity' as keyof RootStackParamList },
      { label: 'Weekly planner', screen: 'Kids12WeeklyPlanner' as keyof RootStackParamList },
      { label: 'Wellbeing tracker', screen: 'Kids12WellbeingTracker' as keyof RootStackParamList },
    ]},
    { section: 'Games & Moves', items: [
      { label: '🏃 Urban Runner', screen: 'Kids12UrbanRunner' as keyof RootStackParamList },
      { label: '🎯 Reflex & Rhythm', screen: 'Kids12ReflexRhythm' as keyof RootStackParamList },
      { label: '⚡ Micro Workouts', screen: 'Kids12MicroWorkouts' as keyof RootStackParamList },
    ]},
    { section: 'Support', items: [
      { label: 'Food & Energy', screen: 'Kids12FoodSwaps' as keyof RootStackParamList },
      { label: 'Resources & Support', screen: 'Kids12Resources' as keyof RootStackParamList },
      { label: 'Give Feedback', screen: 'Kids12Feedback' as keyof RootStackParamList },
    ]},
  ];

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.dateText}>{today}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Kids12ProfileIdentity')}
                style={styles.profileBtn}
              >
                <LinearGradient
                  colors={['#a855f7', '#22d3ee']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.profileBtnGrad}
                >
                  <User size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowMenu(true)}
                style={styles.menuBtn}
              >
                <Menu size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* XP Progress bar */}
          {playerXP > 0 && (
            <View style={styles.xpCard}>
              <View style={styles.xpRow}>
                <View style={styles.xpLeft}>
                  <TrendingUp size={14} color="#a855f7" />
                  <Text style={styles.xpLevelText}>Level {playerLevel}</Text>
                </View>
                <Text style={styles.xpValue}>{playerXP} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${playerXP % 100}%` as any }]} />
              </View>
            </View>
          )}

          {/* Personalised recommendations */}
          <RecommendedMissions isDark={true} />

          {/* Today's suggestion */}
          <Text style={styles.suggestionType}>{todaySuggestion.type}</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate(todaySuggestion.screen)}
            style={styles.suggestionBtnWrap}
          >
            <LinearGradient
              colors={todaySuggestion.colors}
              style={styles.suggestionCard}
            >
              <Text style={styles.suggestionTitle}>{todaySuggestion.title}</Text>
              <Text style={styles.suggestionSubtitle}>{todaySuggestion.subtitle}</Text>
              <View style={styles.suggestionAction}>
                <Text style={styles.suggestionActionText}>{todaySuggestion.action}</Text>
                <ChevronRight size={18} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Check-in card */}
          {!hasCheckedInToday && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12CheckIn')}
              style={styles.quickCard}
            >
              <View style={styles.quickCardInner}>
                <View>
                  <Text style={styles.quickCardTitle}>Check in with yourself</Text>
                  <Text style={styles.quickCardSub}>How are you feeling today?</Text>
                </View>
                <ChevronRight size={18} color="#6b7280" />
              </View>
            </TouchableOpacity>
          )}

          {/* Private journal */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Kids12Reflection')}
            style={styles.quickCard}
          >
            <View style={styles.quickCardInner}>
              <View>
                <Text style={styles.quickCardTitle}>Private space</Text>
                <Text style={styles.quickCardSub}>Your thoughts, your way</Text>
              </View>
              <ChevronRight size={18} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* Soft streak indicator */}
          {currentStreak > 0 && (
            <View style={styles.streakRow}>
              <Flame size={14} color="#f97316" />
              <Text style={styles.streakText}>
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'} — you're showing up
              </Text>
            </View>
          )}

          <Text style={styles.bottomNote}>
            You're in control. Skip anything that doesn't fit today.
          </Text>
        </ScrollView>

        <DailySpin visible={showSpin} onClose={dismissSpin} />
        <ParentReactionBanner />

        {/* Menu Modal */}
        <Modal
          visible={showMenu}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.menuSheet} onPress={() => {}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {menuItems.map((section, si) => (
                  <View key={si}>
                    <Text style={styles.menuSection}>{section.section}</Text>
                    {section.items.map((item, ii) => (
                      <TouchableOpacity
                        key={ii}
                        activeOpacity={0.85}
                        onPress={() => {
                          setShowMenu(false);
                          navigation.navigate(item.screen);
                        }}
                        style={styles.menuItem}
                      >
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 2 },
  dateText: { fontSize: 13, color: '#9ca3af' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileBtn: { borderRadius: 20 },
  profileBtnGrad: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  menuBtn: { padding: 4 },
  xpCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  xpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  xpLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  xpLevelText: { fontSize: 13, color: '#9ca3af' },
  xpValue: { fontSize: 11, color: '#6b7280' },
  xpTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 3 },
  suggestionType: { fontSize: 11, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  suggestionBtnWrap: { marginBottom: 8 },
  suggestionCard: { borderRadius: 20, padding: 22 },
  suggestionTitle: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  suggestionSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  suggestionAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  suggestionActionText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  quickCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickCardInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickCardTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  quickCardSub: { fontSize: 13, color: '#9ca3af' },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  streakText: { fontSize: 13, color: '#9ca3af' },
  bottomNote: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 16 },
  // Menu modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  menuSheet: {
    backgroundColor: '#1a1a24',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuSection: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemText: { fontSize: 15, color: '#ffffff' },
});
