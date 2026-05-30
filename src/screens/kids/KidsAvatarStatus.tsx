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
import { ArrowLeft, Award, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const allUnlockables = [
  { id: 1, emoji: '⚽', name: 'Football Star Badge', level: 1 },
  { id: 2, emoji: '🚴', name: 'Cyclist Cape', level: 1 },
  { id: 3, emoji: '🏃', name: 'Running Shoes', level: 1 },
  { id: 4, emoji: '🏏', name: 'Cricket Champion Hat', level: 2 },
  { id: 5, emoji: '🏊', name: 'Swimmer Goggles', level: 2 },
  { id: 6, emoji: '🎒', name: 'Explorer Backpack', level: 3 },
  { id: 7, emoji: '💃', name: 'Dancer Badge', level: 3 },
  { id: 8, emoji: '🏸', name: 'Champion Racket', level: 4 },
  { id: 9, emoji: '🎨', name: 'Creative Star', level: 5 },
  { id: 10, emoji: '🌟', name: 'Super Explorer', level: 7 },
  { id: 11, emoji: '🏆', name: 'Amazing Hero', level: 10 },
  { id: 12, emoji: '👑', name: 'Adventure King', level: 15 },
];

const colorHex: Record<string, string> = {
  orange: '#f97316', teal: '#14b8a6', purple: '#a855f7',
  red: '#ef4444', green: '#22c55e', blue: '#3b82f6',
};

export function KidsAvatarStatus() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [completedCount, setCompletedCount] = useState(0);
  const [avatarId, setAvatarId] = useState('tiger');
  const [avatarColor, setAvatarColor] = useState('orange');

  useEffect(() => {
    storage.getItem('kidsAdventuresCompleted').then(v => setCompletedCount(parseInt(v ?? '0')));
    storage.getItem('kidsSelectedAvatar').then(v => { if (v) setAvatarId(v); });
    storage.getItem('kidsAvatarColor').then(v => { if (v) setAvatarColor(v); });
  }, []);

  const avatarEmojis: Record<string, string> = { tiger: '🐯', monkey: '🐵', elephant: '🐘' };
  const avatarNames: Record<string, string> = { tiger: 'Tiger Cub', monkey: 'Monkey Explorer', elephant: 'Elephant Buddy' };

  const unlocked = allUnlockables.filter(i => completedCount >= i.level);
  const locked = allUnlockables.filter(i => completedCount < i.level);
  const level = Math.min(completedCount, 20);
  const bgColor = colorHex[avatarColor] ?? '#f97316';

  return (
    <LinearGradient colors={['#ede9fe', '#fce7f3', '#fed7aa']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Your Adventure Buddy</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Avatar */}
          <View style={[styles.avatarCircle, { backgroundColor: bgColor }]}>
            <Text style={styles.avatarEmoji}>{avatarEmojis[avatarId] ?? '🐯'}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {level}</Text>
            </View>
          </View>
          <Text style={styles.avatarName}>{avatarNames[avatarId] ?? 'Tiger Cub'}</Text>
          <Text style={styles.avatarSubtitle}>Growing stronger with every adventure!</Text>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Sparkles size={20} color="#ea580c" />
              <Text style={styles.statsTitle}> Your Journey</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{completedCount}</Text>
                <Text style={styles.statLabel}>Adventures Complete</Text>
              </View>
              <View style={[styles.statBox, styles.statBoxTeal]}>
                <Text style={[styles.statNum, { color: '#0d9488' }]}>{unlocked.length}</Text>
                <Text style={styles.statLabel}>Items Unlocked</Text>
              </View>
            </View>
          </View>

          {/* Unlocked */}
          {unlocked.length > 0 && (
            <View style={styles.collectionCard}>
              <View style={styles.statsHeader}>
                <Award size={20} color="#0d9488" />
                <Text style={styles.statsTitle}> Your Collection</Text>
              </View>
              <View style={styles.itemGrid}>
                {unlocked.map(item => (
                  <LinearGradient key={item.id} colors={['#fb923c', '#2dd4bf']} style={styles.itemCard}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </LinearGradient>
                ))}
              </View>
            </View>
          )}

          {/* Locked */}
          {locked.length > 0 && (
            <View style={styles.collectionCard}>
              <View style={styles.statsHeader}>
                <Sparkles size={20} color="#9333ea" />
                <Text style={styles.statsTitle}> Coming Soon!</Text>
              </View>
              <View style={styles.itemGrid}>
                {locked.slice(0, 6).map(item => (
                  <View key={item.id} style={styles.lockedItem}>
                    <Text style={styles.lockedEmoji}>{item.emoji}</Text>
                    <Text style={styles.lockedLevel}>Level {item.level}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('KidsDailyMission')}>
            <LinearGradient colors={['#f97316', '#f59e0b', '#14b8a6']} style={styles.missionBtn}>
              <Text style={styles.missionBtnText}>Back to Adventures! 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  avatarEmoji: { fontSize: 72 },
  levelBadge: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#fb923c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  levelText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  avatarName: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginTop: 20, marginBottom: 4 },
  avatarSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20, textAlign: 'center' },
  statsCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statsTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statBoxTeal: { backgroundColor: '#ccfbf1' },
  statNum: { fontSize: 32, fontWeight: '800', color: '#ea580c', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#374151', textAlign: 'center', fontWeight: '600' },
  collectionCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  itemCard: {
    width: 90,
    height: 90,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  itemEmoji: { fontSize: 32, marginBottom: 4 },
  itemName: { fontSize: 10, fontWeight: '700', color: '#fff', textAlign: 'center' },
  lockedItem: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedEmoji: { fontSize: 32, opacity: 0.3, marginBottom: 4 },
  lockedLevel: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
  missionBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  missionBtnText: { fontSize: 20, fontWeight: '800', color: '#fff' },
});
