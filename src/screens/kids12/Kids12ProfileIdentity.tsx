import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Crown, Award } from 'lucide-react-native';

type Theme = {
  id: string;
  name: string;
  colors: [string, string];
  unlockXP: number;
};

type Title = {
  id: string;
  name: string;
  requirement: string;
  icon: string;
  unlocked: boolean;
};

const themes: Theme[] = [
  { id: 'default', name: 'Default', colors: ['#a855f7', '#22d3ee'], unlockXP: 0 },
  { id: 'focused', name: 'Focused', colors: ['#3b82f6', '#4f46e5'], unlockXP: 100 },
  { id: 'resilient', name: 'Resilient', colors: ['#22c55e', '#14b8a6'], unlockXP: 250 },
  { id: 'driven', name: 'Driven', colors: ['#f97316', '#ef4444'], unlockXP: 500 },
  { id: 'consistent', name: 'Consistent', colors: ['#22d3ee', '#9333ea'], unlockXP: 750 },
];

export function Kids12ProfileIdentity() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentXP, setCurrentXP] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    storage.getItem('kids12PlayerXP').then(v => {
      const xp = parseInt(v || '0');
      setCurrentXP(xp);
      setLevel(Math.floor(xp / 100) + 1);
    });
    storage.getItem('kids12PlayerTheme').then(v => {
      if (v) setSelectedTheme(v);
    });
    storage.getItem('kids12PlayerTitle').then(v => {
      if (v) setSelectedTitle(v);
    });
  }, []);

  const applyTheme = async (themeId: string) => {
    setSelectedTheme(themeId);
    await storage.setItem('kids12PlayerTheme', themeId);
  };

  const applyTitle = async (titleName: string) => {
    setSelectedTitle(titleName);
    await storage.setItem('kids12PlayerTitle', titleName);
  };

  const titles: Title[] = [
    { id: 'starter', name: 'Getting Started', requirement: 'Complete onboarding', icon: '🌱', unlocked: true },
    { id: 'consistent', name: 'Consistent', requirement: '7 day streak', icon: '🔥', unlocked: currentXP >= 70 },
    { id: 'focused', name: 'Focused', requirement: 'Complete 10 activities', icon: '🎯', unlocked: currentXP >= 100 },
    { id: 'resilient', name: 'Resilient', requirement: 'Keep going after a miss', icon: '💪', unlocked: currentXP >= 150 },
    { id: 'driven', name: 'Driven', requirement: 'Reach level 5', icon: '⚡', unlocked: level >= 5 },
    { id: 'balanced', name: 'Balanced', requirement: 'Try all activity types', icon: '⚖️', unlocked: currentXP >= 300 },
  ];

  const xpToNextLevel = (level * 100) - currentXP;
  const progressToNextLevel = (currentXP % 100);

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroTitle}>Your Identity</Text>
          <Text style={styles.heroSub}>Build your vibe</Text>

          {/* Stats card */}
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statsLabel}>Level</Text>
                <Text style={styles.statsLevel}>{level}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statsLabel}>Total XP</Text>
                <Text style={styles.statsXP}>{currentXP}</Text>
              </View>
            </View>
            <Text style={styles.xpHint}>{xpToNextLevel} XP to level {level + 1}</Text>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${progressToNextLevel}%` as any }]} />
            </View>
            {selectedTitle ? (
              <View style={styles.currentTitleRow}>
                <Text style={styles.currentTitleLabel}>Current Title</Text>
                <Text style={styles.currentTitleName}>
                  {titles.find(t => t.name === selectedTitle)?.icon} {selectedTitle}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Themes */}
          <Text style={styles.sectionTitle}>Themes</Text>
          <View style={styles.themesGrid}>
            {themes.map((theme) => {
              const isUnlocked = currentXP >= theme.unlockXP;
              const isSelected = selectedTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  activeOpacity={isUnlocked ? 0.85 : 1}
                  onPress={() => isUnlocked && applyTheme(theme.id)}
                  style={[
                    styles.themeCard,
                    isSelected && styles.themeCardSelected,
                    !isUnlocked && styles.themeCardLocked,
                  ]}
                >
                  <LinearGradient
                    colors={theme.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.themePreview}
                  />
                  <Text style={styles.themeName}>{theme.name}</Text>
                  {!isUnlocked && (
                    <View style={styles.lockRow}>
                      <Crown size={10} color="#6b7280" />
                      <Text style={styles.lockText}>{theme.unlockXP} XP</Text>
                    </View>
                  )}
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Award size={12} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Titles */}
          <Text style={styles.sectionTitle}>Titles</Text>
          {titles.map((title) => {
            const isSelected = selectedTitle === title.name;
            return (
              <TouchableOpacity
                key={title.id}
                activeOpacity={title.unlocked ? 0.85 : 1}
                onPress={() => title.unlocked && applyTitle(title.name)}
                style={[
                  styles.titleCard,
                  isSelected && styles.titleCardSelected,
                  !title.unlocked && styles.titleCardLocked,
                ]}
              >
                <View style={styles.titleRow}>
                  <View style={styles.titleLeft}>
                    <Text style={styles.titleIcon}>{title.icon}</Text>
                    <View>
                      <Text style={styles.titleName}>{title.name}</Text>
                      <Text style={styles.titleReq}>{title.requirement}</Text>
                    </View>
                  </View>
                  {isSelected ? (
                    <View style={styles.titleActiveBadge}>
                      <Award size={14} color="#fff" />
                    </View>
                  ) : !title.unlocked ? (
                    <View style={styles.titleLockedBadge}>
                      <Crown size={14} color="#9ca3af" />
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.footNote}>Earn XP by completing activities and games</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  topHeader: { marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTitle: { fontSize: 36, fontWeight: '800', color: '#a855f7', textAlign: 'center', marginBottom: 4 },
  heroSub: { fontSize: 15, color: '#9ca3af', textAlign: 'center', marginBottom: 24 },
  statsCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statsLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 4 },
  statsLevel: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  statsXP: { fontSize: 26, fontWeight: '800', color: '#a855f7' },
  xpHint: { fontSize: 11, color: '#9ca3af', marginBottom: 6 },
  xpTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 4 },
  currentTitleRow: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  currentTitleLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 4 },
  currentTitleName: { fontSize: 16, fontWeight: '700', color: '#22d3ee' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff', marginBottom: 16 },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  themeCard: {
    width: '47%',
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  themeCardSelected: { borderColor: 'rgba(255,255,255,0.5)' },
  themeCardLocked: { opacity: 0.5 },
  themePreview: { width: '100%', height: 60, borderRadius: 12, marginBottom: 10 },
  themeName: { fontSize: 14, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lockText: { fontSize: 11, color: '#6b7280' },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 4,
  },
  titleCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleCardSelected: { borderColor: 'rgba(34,211,238,0.5)', backgroundColor: 'rgba(34,211,238,0.07)' },
  titleCardLocked: { opacity: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleIcon: { fontSize: 28 },
  titleName: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 2 },
  titleReq: { fontSize: 11, color: '#9ca3af' },
  titleActiveBadge: { backgroundColor: '#22d3ee', borderRadius: 16, padding: 6 },
  titleLockedBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 6 },
  footNote: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 16 },
});
