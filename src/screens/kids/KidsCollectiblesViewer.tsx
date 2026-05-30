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

const allFruitStickers = ['🍎', '🍌', '🥕', '🍓', '🍊', '🥦', '🍇', '🍉', '🍑', '🥝'];
const allAnimalBuddies = ['🦁', '🐯', '🐘', '🐵', '🦒', '🐻', '🦘', '🐼'];
const allSuperheroAccessories = ['🦸‍♂️', '🦸‍♀️', '⚡', '💪', '🦅', '🌟', '👊', '🛡️'];

export function KidsCollectiblesViewer() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fruitStickers, setFruitStickers] = useState<string[]>([]);
  const [animalBuddies, setAnimalBuddies] = useState<string[]>([]);
  const [superheroAcc, setSuperheroAcc] = useState<string[]>([]);

  useEffect(() => {
    storage.getItem('kidsFruitStickers').then(v => { if (v) setFruitStickers(JSON.parse(v)); });
    storage.getItem('kidsAnimalBuddies').then(v => { if (v) setAnimalBuddies(JSON.parse(v)); });
    storage.getItem('kidsSuperheroAccessories').then(v => { if (v) setSuperheroAcc(JSON.parse(v)); });
  }, []);

  const totalCollected = fruitStickers.length + animalBuddies.length + superheroAcc.length;
  const totalPossible = allFruitStickers.length + allAnimalBuddies.length + allSuperheroAccessories.length;

  const renderCollection = (
    title: string,
    all: string[],
    owned: string[],
    colors: [string, string]
  ) => (
    <View style={styles.collectionCard}>
      <LinearGradient colors={colors} style={styles.collectionHeader}>
        <Text style={styles.collectionTitle}>{title}</Text>
        <Text style={styles.collectionCount}>{owned.length} / {all.length}</Text>
      </LinearGradient>
      <View style={styles.itemsGrid}>
        {all.map((emoji, i) => {
          const isOwned = owned.includes(emoji);
          return (
            <View key={i} style={[styles.item, isOwned ? styles.itemOwned : styles.itemLocked]}>
              <Text style={[styles.itemEmoji, !isOwned && styles.itemEmojiLocked]}>{isOwned ? emoji : '🔒'}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#fce7f3', '#ede9fe', '#dbeafe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          <Text style={styles.title}>My Collection! 🎁</Text>
          <Text style={styles.subtitle}>See all your cool items!</Text>

          {/* Total Progress */}
          <View style={styles.totalCard}>
            <Text style={styles.totalEmoji}>🏆</Text>
            <View>
              <Text style={styles.totalTitle}>{totalCollected} / {totalPossible} Collected!</Text>
              <Text style={styles.totalSub}>Keep exploring to find more! 🌟</Text>
            </View>
          </View>

          {totalCollected === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyTitle}>Start Your Adventure!</Text>
              <Text style={styles.emptyDesc}>Complete missions, play games and discover foods to earn collectibles!</Text>
            </View>
          )}

          {renderCollection(
            '🍎 Fruit Stickers',
            allFruitStickers,
            fruitStickers,
            ['#fb923c', '#ef4444']
          )}
          {renderCollection(
            '🦁 Animal Buddies',
            allAnimalBuddies,
            animalBuddies,
            ['#fbbf24', '#f97316']
          )}
          {renderCollection(
            '⚡ Superhero Gear',
            allSuperheroAccessories,
            superheroAcc,
            ['#818cf8', '#c084fc']
          )}

          <LinearGradient colors={['#4ade80', '#10b981']} style={styles.tipCard}>
            <Sparkles size={24} color="#fff" />
            <Text style={styles.tipText}> Complete missions and play games to unlock more collectibles!</Text>
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
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalEmoji: { fontSize: 44 },
  totalTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  totalSub: { fontSize: 14, color: '#6b7280' },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  emptyDesc: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  collectionCount: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 14,
  },
  item: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemOwned: { backgroundColor: '#fef9c3' },
  itemLocked: { backgroundColor: '#f3f4f6' },
  itemEmoji: { fontSize: 30 },
  itemEmojiLocked: { opacity: 0.3 },
  tipCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipText: { fontSize: 15, color: '#fff', fontWeight: '600', flex: 1, lineHeight: 22 },
});
