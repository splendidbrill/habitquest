import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';

const games = [
  { id: 'fruit-snake', title: 'Fruit Snake Explorer', emoji: '🐍', description: 'Collect yummy fruits!', colors: ['#4ade80', '#10b981'] as [string, string], bgEmoji: '🍎', screen: 'KidsFruitSnakeGame' as keyof RootStackParamList },
  { id: 'jungle-runner', title: 'Jungle Adventure', emoji: '🦁', description: 'Run through the jungle!', colors: ['#fb923c', '#fbbf24'] as [string, string], bgEmoji: '🌴', screen: 'KidsJungleRunnerGame' as keyof RootStackParamList },
  { id: 'superhero-workout', title: 'Superhero Training', emoji: '🦸', description: 'Be a superhero!', colors: ['#c084fc', '#ec4899'] as [string, string], bgEmoji: '⚡', screen: 'KidsSuperheroWorkout' as keyof RootStackParamList },
  { id: 'archery-food', title: 'Healthy Food Archery', emoji: '🏹', description: 'Shoot healthy foods!', colors: ['#60a5fa', '#818cf8'] as [string, string], bgEmoji: '🎯', screen: 'KidsArcheryFoodGame' as keyof RootStackParamList },
];

export function KidsGameHub() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={['#fef9c3', '#d1fae5', '#dbeafe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          <Text style={styles.title}>Game Time! 🎮</Text>
          <Text style={styles.subtitle}>Pick a fun game to play!</Text>

          <View style={styles.gameList}>
            {games.map(game => (
              <TouchableOpacity
                key={game.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(game.screen as any)}
              >
                <LinearGradient colors={game.colors} style={styles.gameCard}>
                  <View style={styles.bgDecor}>
                    <Text style={styles.bgEmoji}>{game.bgEmoji}</Text>
                  </View>
                  <View style={styles.bgDecorLeft}>
                    <Text style={styles.bgEmoji}>{game.bgEmoji}</Text>
                  </View>
                  <View style={styles.gameRow}>
                    <Text style={styles.gameEmoji}>{game.emoji}</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      <Text style={styles.gameDesc}>{game.description}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('KidsProgressMap')}
          >
            <LinearGradient colors={['#60a5fa', '#06b6d4']} style={styles.mapBtn}>
              <Text style={styles.mapEmoji}>🗺️</Text>
              <Text style={styles.mapBtnText}>My Adventure Map</Text>
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
  subtitle: { fontSize: 20, color: '#374151', textAlign: 'center', marginBottom: 24 },
  gameList: { gap: 18, marginBottom: 20 },
  gameCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  bgDecor: { position: 'absolute', top: 8, right: 8, opacity: 0.2 },
  bgDecorLeft: { position: 'absolute', bottom: 8, left: 8, opacity: 0.2 },
  bgEmoji: { fontSize: 52 },
  gameRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  gameEmoji: { fontSize: 64 },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  gameDesc: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
  mapBtn: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  mapEmoji: { fontSize: 44 },
  mapBtnText: { fontSize: 24, fontWeight: '800', color: '#fff' },
});
