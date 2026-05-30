import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const workoutMoves = [
  { id: 'fly-stretch', emoji: '🦅', name: 'Fly & Stretch', description: 'Spread your arms wide like wings and reach for the sky!', duration: 5, colors: ['#60a5fa', '#06b6d4'] as [string, string] },
  { id: 'power-punch', emoji: '👊', name: 'Power Punches', description: 'Punch forward like a superhero! Left, right, left, right!', duration: 5, colors: ['#ef4444', '#fb923c'] as [string, string] },
  { id: 'dodge-boulders', emoji: '🦘', name: 'Dodge & Jump', description: 'Jump side to side like you\'re dodging boulders!', duration: 5, colors: ['#4ade80', '#10b981'] as [string, string] },
  { id: 'super-run', emoji: '🏃', name: 'Super Speed Run', description: 'Run in place as fast as you can - zoom zoom!', duration: 5, colors: ['#c084fc', '#ec4899'] as [string, string] },
];

export function KidsSuperheroWorkout() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [moveDuration, setMoveDuration] = useState(0);
  const [phase, setPhase] = useState<'countdown' | 'move' | 'rest' | 'done'>('countdown');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!gameStarted) return;
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentMove(0);
    setCountdown(3);
    setPhase('countdown');
    startCountdown();
  };

  const startCountdown = () => {
    let cd = 3;
    timerRef.current = setInterval(() => {
      cd--;
      setCountdown(cd);
      if (cd <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        startMove(0);
      }
    }, 1000);
  };

  const startMove = (moveIdx: number) => {
    setCurrentMove(moveIdx);
    setPhase('move');
    const dur = workoutMoves[moveIdx].duration;
    setMoveDuration(dur);
    let t = dur;
    timerRef.current = setInterval(() => {
      t--;
      setMoveDuration(t);
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (moveIdx < workoutMoves.length - 1) {
          setPhase('rest');
          let rest = 2;
          timerRef.current = setInterval(() => {
            rest--;
            if (rest <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              startMove(moveIdx + 1);
            }
          }, 1000);
        } else {
          setPhase('done');
          saveCompletion();
        }
      }
    }, 1000);
  };

  const saveCompletion = async () => {
    const badges = JSON.parse((await storage.getItem('kidsEarnedBadges')) ?? '[]');
    if (!badges.includes('superhero-trainer')) {
      badges.push('superhero-trainer');
      await storage.setItem('kidsEarnedBadges', JSON.stringify(badges));
    }
    const stars = parseInt((await storage.getItem('kidsTotalStars')) ?? '0');
    await storage.setItem('kidsTotalStars', String(stars + 5));
    // Unlock a superhero accessory
    const acc = JSON.parse((await storage.getItem('kidsSuperheroAccessories')) ?? '[]');
    if (!acc.includes('⚡')) {
      acc.push('⚡');
      await storage.setItem('kidsSuperheroAccessories', JSON.stringify(acc));
    }
  };

  const move = workoutMoves[currentMove];

  return (
    <LinearGradient colors={['#ede9fe', '#fce7f3', '#ede9fe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Superhero Training 🦸</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {!gameStarted ? (
            <View style={styles.introArea}>
              <Text style={styles.bigEmoji}>🦸</Text>
              <Text style={styles.introTitle}>Superhero Training!</Text>
              <Text style={styles.introDesc}>Complete 4 superhero moves to earn your badge and unlock collectibles!</Text>
              <View style={styles.movePreviewList}>
                {workoutMoves.map((m, i) => (
                  <LinearGradient key={m.id} colors={m.colors} style={styles.movePreview}>
                    <Text style={styles.movePreviewEmoji}>{m.emoji}</Text>
                    <Text style={styles.movePreviewName}>{m.name}</Text>
                    <Text style={styles.movePreviewDuration}>{m.duration}s</Text>
                  </LinearGradient>
                ))}
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
                <LinearGradient colors={['#c084fc', '#ec4899']} style={styles.startBtn}>
                  <Text style={styles.startBtnText}>Start Training! 💪</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : phase === 'countdown' ? (
            <View style={styles.countdownArea}>
              <Text style={styles.getReadyText}>Get Ready!</Text>
              <Text style={styles.countdownNum}>{countdown}</Text>
              <Text style={styles.countdownSub}>Your training starts soon! 🦸</Text>
            </View>
          ) : phase === 'done' ? (
            <View style={styles.doneArea}>
              <Text style={styles.doneEmoji}>🏆</Text>
              <Text style={styles.doneTitle}>SUPERHERO! 🦸</Text>
              <Text style={styles.doneDesc}>You completed all the moves! You earned 5 stars and unlocked a collectible!</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardItem}>⭐ +5 Stars</Text>
                <Text style={styles.rewardItem}>⚡ Collectible!</Text>
                <Text style={styles.rewardItem}>🦸 Badge!</Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('KidsBuddyHome')}>
                <LinearGradient colors={['#c084fc', '#ec4899']} style={styles.homeBtn}>
                  <Text style={styles.homeBtnText}>Back to Home! 🏠</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : phase === 'rest' ? (
            <View style={styles.restArea}>
              <Text style={styles.restEmoji}>😮‍💨</Text>
              <Text style={styles.restTitle}>REST!</Text>
              <Text style={styles.restSub}>Catch your breath! Next move coming...</Text>
              <Text style={styles.moveProgress}>{currentMove + 1} / {workoutMoves.length} moves done</Text>
            </View>
          ) : (
            <View style={styles.moveArea}>
              <LinearGradient colors={move.colors} style={styles.moveCard}>
                <Text style={styles.moveEmoji}>{move.emoji}</Text>
                <Text style={styles.moveName}>{move.name}</Text>
                <Text style={styles.moveDesc}>{move.description}</Text>
                <View style={styles.timerCircle}>
                  <Text style={styles.timerNum}>{moveDuration}</Text>
                  <Text style={styles.timerSec}>sec</Text>
                </View>
              </LinearGradient>
              <Text style={styles.moveProgress}>{currentMove + 1} / {workoutMoves.length} moves</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 8,
    gap: 12,
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
  title: { fontSize: 20, fontWeight: '800', color: '#1f2937' },
  content: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
  introArea: { alignItems: 'center', width: '100%' },
  bigEmoji: { fontSize: 80, marginBottom: 8 },
  introTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  introDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  movePreviewList: { width: '100%', gap: 10, marginBottom: 24 },
  movePreview: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  movePreviewEmoji: { fontSize: 36 },
  movePreviewName: { flex: 1, fontSize: 18, fontWeight: '700', color: '#fff' },
  movePreviewDuration: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  startBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  countdownArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  getReadyText: { fontSize: 28, fontWeight: '700', color: '#374151', marginBottom: 16 },
  countdownNum: { fontSize: 120, fontWeight: '900', color: '#9333ea' },
  countdownSub: { fontSize: 18, color: '#6b7280', marginTop: 8 },
  moveArea: { width: '100%', alignItems: 'center' },
  moveCard: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  moveEmoji: { fontSize: 80, marginBottom: 8 },
  moveName: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6, textAlign: 'center' },
  moveDesc: { fontSize: 17, color: 'rgba(255,255,255,0.92)', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  timerNum: { fontSize: 44, fontWeight: '900', color: '#fff' },
  timerSec: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: -4 },
  moveProgress: { fontSize: 16, fontWeight: '600', color: '#374151' },
  restArea: { alignItems: 'center', paddingTop: 60 },
  restEmoji: { fontSize: 80, marginBottom: 8 },
  restTitle: { fontSize: 48, fontWeight: '900', color: '#9333ea', marginBottom: 8 },
  restSub: { fontSize: 18, color: '#6b7280', marginBottom: 16 },
  doneArea: { alignItems: 'center', paddingTop: 20 },
  doneEmoji: { fontSize: 80, marginBottom: 8 },
  doneTitle: { fontSize: 36, fontWeight: '900', color: '#9333ea', marginBottom: 10 },
  doneDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  rewardRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  rewardItem: { fontSize: 16, fontWeight: '700', color: '#374151' },
  homeBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  homeBtnText: { fontSize: 20, fontWeight: '800', color: '#fff' },
});
