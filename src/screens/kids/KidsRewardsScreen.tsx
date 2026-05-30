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
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const allBadges = [
  { id: 'fruit-explorer', emoji: '🍎', name: 'Fruit Explorer', colors: ['#ef4444', '#ec4899'] as [string, string], description: 'Tried new fruits!' },
  { id: 'dance-champion', emoji: '💃', name: 'Dance Champion', colors: ['#c084fc', '#ec4899'] as [string, string], description: 'Danced 5 times!' },
  { id: 'super-jumper', emoji: '🦘', name: 'Super Jumper', colors: ['#fb923c', '#fbbf24'] as [string, string], description: 'Jumped like animals!' },
  { id: 'dinner-helper', emoji: '🍽️', name: 'Dinner Helper', colors: ['#60a5fa', '#06b6d4'] as [string, string], description: 'Chose healthy dinner!' },
  { id: 'veggie-explorer', emoji: '🥦', name: 'Veggie Explorer', colors: ['#4ade80', '#10b981'] as [string, string], description: 'Tried veggies twice!' },
  { id: 'kitchen-champion', emoji: '👨‍🍳', name: 'Kitchen Champion', colors: ['#fbbf24', '#fb923c'] as [string, string], description: 'Helped in the kitchen!' },
  { id: 'adventure-star', emoji: '🌟', name: 'Adventure Star', colors: ['#818cf8', '#c084fc'] as [string, string], description: 'Completed missions!' },
  { id: 'playground-hero', emoji: '⚽', name: 'Playground Hero', colors: ['#2dd4bf', '#06b6d4'] as [string, string], description: 'Played outside!' },
  { id: 'superhero-trainer', emoji: '🦸', name: 'Superhero Trainer', colors: ['#c084fc', '#ec4899'] as [string, string], description: 'Completed superhero training!' },
];

export function KidsRewardsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [adventures, setAdventures] = useState(0);

  useEffect(() => {
    storage.getItem('kidsEarnedBadges').then(v => { if (v) setEarnedBadges(JSON.parse(v)); });
    storage.getItem('kidsTotalStars').then(v => setTotalStars(parseInt(v ?? '0')));
    storage.getItem('kidsAdventuresCompleted').then(v => setAdventures(parseInt(v ?? '0')));
  }, []);

  return (
    <LinearGradient colors={['#ede9fe', '#fce7f3', '#fce7f3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          <Text style={styles.title}>My Rewards! 🏆</Text>
          <Text style={styles.subtitle}>Look what you earned!</Text>

          {/* Stars */}
          <View style={styles.starsCard}>
            <Text style={styles.starEmoji}>⭐</Text>
            <Text style={styles.starCount}>{totalStars}</Text>
            <Text style={styles.starsLabel}>Stars Collected!</Text>
          </View>

          {/* Adventures */}
          <LinearGradient colors={['#fb923c', '#ec4899']} style={styles.adventuresCard}>
            <Text style={styles.adventuresEmoji}>🎯</Text>
            <Text style={styles.adventuresCount}>{adventures}</Text>
            <Text style={styles.adventuresLabel}>Adventures Complete!</Text>
          </LinearGradient>

          <Text style={styles.badgesTitle}>My Badges! 🎖️</Text>

          {/* Badge Grid */}
          <View style={styles.badgeGrid}>
            {allBadges.map((badge, index) => {
              const isEarned = earnedBadges.includes(badge.id);
              return isEarned ? (
                <LinearGradient key={badge.id} colors={badge.colors} style={styles.badgeCard}>
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                  <Text style={styles.sparkle}>✨</Text>
                </LinearGradient>
              ) : (
                <View key={badge.id} style={styles.lockedBadge}>
                  <Text style={styles.lockedEmoji}>🔒</Text>
                  <Text style={styles.lockedName}>{badge.name}</Text>
                  <Text style={styles.lockedHint}>Keep exploring!</Text>
                </View>
              );
            })}
          </View>

          {/* Encouragement */}
          <View style={styles.encourageCard}>
            <Sparkles size={32} color="#9333ea" />
            <Text style={styles.encourageTitle}>You're Amazing! 🌟</Text>
            <Text style={styles.encourageDesc}>Keep going on adventures to earn more badges and stars!</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerEmoji: { fontSize: 52 },
  title: { fontSize: 36, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 20, color: '#374151', textAlign: 'center', marginBottom: 20 },
  starsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  starEmoji: { fontSize: 64, marginBottom: 4 },
  starCount: { fontSize: 48, fontWeight: '800', color: '#d97706', marginBottom: 4 },
  starsLabel: { fontSize: 20, color: '#374151' },
  adventuresCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  adventuresEmoji: { fontSize: 48, marginBottom: 4 },
  adventuresCount: { fontSize: 40, fontWeight: '800', color: '#fff', marginBottom: 4 },
  adventuresLabel: { fontSize: 18, color: 'rgba(255,255,255,0.9)' },
  badgesTitle: { fontSize: 30, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 20 },
  badgeCard: {
    width: '47%',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  badgeEmoji: { fontSize: 52, marginBottom: 6 },
  badgeName: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 2 },
  badgeDesc: { fontSize: 11, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  sparkle: { position: 'absolute', top: 6, right: 8, fontSize: 18 },
  lockedBadge: {
    width: '47%',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  lockedEmoji: { fontSize: 52, opacity: 0.3, marginBottom: 6 },
  lockedName: { fontSize: 13, fontWeight: '700', color: '#6b7280', textAlign: 'center', marginBottom: 2 },
  lockedHint: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  encourageCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  encourageTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginVertical: 8 },
  encourageDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 24 },
});
