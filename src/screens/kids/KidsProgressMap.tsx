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
import { ArrowLeft, Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const worlds = [
  { id: 'garden', name: 'Garden World', emoji: '🌻', colors: ['#4ade80', '#10b981'] as [string, string], requiredStars: 0 },
  { id: 'jungle', name: 'Jungle World', emoji: '🌴', colors: ['#fb923c', '#fbbf24'] as [string, string], requiredStars: 10 },
  { id: 'hero', name: 'Hero Training Camp', emoji: '🦸', colors: ['#c084fc', '#ec4899'] as [string, string], requiredStars: 25 },
  { id: 'mountain', name: 'Mountain Peak', emoji: '⛰️', colors: ['#60a5fa', '#06b6d4'] as [string, string], requiredStars: 50 },
  { id: 'space', name: 'Space Station', emoji: '🚀', colors: ['#818cf8', '#c084fc'] as [string, string], requiredStars: 100 },
];

export function KidsProgressMap() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [totalStars, setTotalStars] = useState(0);
  const [adventures, setAdventures] = useState(0);

  useEffect(() => {
    storage.getItem('kidsTotalStars').then(v => setTotalStars(parseInt(v ?? '0')));
    storage.getItem('kidsAdventuresCompleted').then(v => setAdventures(parseInt(v ?? '0')));
  }, []);

  return (
    <LinearGradient colors={['#bae6fd', '#ddd6fe', '#ede9fe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          <Text style={styles.title}>My Adventure Map! 🗺️</Text>
          <Text style={styles.subtitle}>See how far you've explored!</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statNum}>{totalStars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={[styles.statNum, { color: '#2563eb' }]}>{adventures}</Text>
              <Text style={styles.statLabel}>Adventures</Text>
            </View>
          </View>

          {/* World Map */}
          <View style={styles.worldsContainer}>
            <Text style={styles.worldsTitle}>Your Journey 🌟</Text>
            {worlds.map((world, index) => {
              const isUnlocked = totalStars >= world.requiredStars;
              const isCurrent = isUnlocked && (index === worlds.length - 1 || totalStars < worlds[index + 1].requiredStars);
              const nextWorld = worlds[index + 1];
              const progressToNext = nextWorld
                ? Math.min(((totalStars - world.requiredStars) / (nextWorld.requiredStars - world.requiredStars)) * 100, 100)
                : 100;

              return (
                <View key={world.id}>
                  {isUnlocked ? (
                    <LinearGradient colors={world.colors} style={styles.worldCard}>
                      <View style={styles.worldRow}>
                        <Text style={styles.worldEmoji}>{world.emoji}</Text>
                        <View style={styles.worldInfo}>
                          <Text style={styles.worldName}>{world.name}</Text>
                          <View style={styles.unlockedBadge}>
                            <Star size={16} color="#fff" fill="#fff" />
                            <Text style={styles.unlockedText}> Unlocked!</Text>
                          </View>
                          {isUnlocked && nextWorld && (
                            <View style={styles.progressWrap}>
                              <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${progressToNext}%` }]} />
                              </View>
                              <Text style={styles.progressHint}>
                                {nextWorld.requiredStars - totalStars > 0
                                  ? `${nextWorld.requiredStars - totalStars} more stars to next world!`
                                  : 'Next world unlocked!'}
                              </Text>
                            </View>
                          )}
                        </View>
                        {isCurrent && <Text style={styles.currentPointer}>👆</Text>}
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.lockedWorldCard}>
                      <View style={styles.worldRow}>
                        <Text style={styles.lockedEmoji}>🔒</Text>
                        <View style={styles.worldInfo}>
                          <Text style={styles.lockedWorldName}>{world.name}</Text>
                          <Text style={styles.lockedHint}>Need {world.requiredStars} stars</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {index < worlds.length - 1 && (
                    <View style={styles.connector}>
                      <View style={[styles.connectorLine, isUnlocked && totalStars >= worlds[index + 1].requiredStars && styles.connectorLineDone]} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <LinearGradient colors={['#e879f9', '#c084fc']} style={styles.encourageCard}>
            <Text style={styles.encourageEmoji}>🎉</Text>
            <Text style={styles.encourageTitle}>You're Amazing!</Text>
            <Text style={styles.encourageDesc}>Keep exploring to unlock all the worlds! 🌟</Text>
          </LinearGradient>
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
  title: { fontSize: 34, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 18, color: '#374151', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statEmoji: { fontSize: 44, marginBottom: 4 },
  statNum: { fontSize: 34, fontWeight: '800', color: '#d97706', marginBottom: 2 },
  statLabel: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  worldsContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  worldsTitle: { fontSize: 24, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  worldCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  worldRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  worldEmoji: { fontSize: 52 },
  worldInfo: { flex: 1 },
  worldName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  unlockedBadge: { flexDirection: 'row', alignItems: 'center' },
  unlockedText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  progressWrap: { marginTop: 8 },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  progressHint: { fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  currentPointer: { fontSize: 36 },
  lockedWorldCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#e5e7eb',
  },
  lockedEmoji: { fontSize: 44 },
  lockedWorldName: { fontSize: 18, fontWeight: '700', color: '#9ca3af', marginBottom: 2 },
  lockedHint: { fontSize: 14, color: '#6b7280' },
  connector: { alignItems: 'center', paddingVertical: 6 },
  connectorLine: {
    width: 3,
    height: 24,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  connectorLineDone: { backgroundColor: '#4ade80' },
  encourageCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  encourageEmoji: { fontSize: 52, marginBottom: 8 },
  encourageTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  encourageDesc: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
});
