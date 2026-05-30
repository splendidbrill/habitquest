import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const { width } = Dimensions.get('window');

const targets = [
  { emoji: '🥦', name: 'Broccoli', isHealthy: true, points: 3 },
  { emoji: '🍎', name: 'Apple', isHealthy: true, points: 3 },
  { emoji: '🥕', name: 'Carrot', isHealthy: true, points: 3 },
  { emoji: '🍩', name: 'Donut', isHealthy: false, points: -2 },
  { emoji: '🍔', name: 'Burger', isHealthy: false, points: -2 },
  { emoji: '🍓', name: 'Strawberry', isHealthy: true, points: 3 },
  { emoji: '🍟', name: 'Fries', isHealthy: false, points: -2 },
  { emoji: '🍌', name: 'Banana', isHealthy: true, points: 3 },
];

type Target = { id: number; target: typeof targets[0]; x: number; y: number; alive: boolean };

export function KidsArcheryFoodGame() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeTargets, setActiveTargets] = useState<Target[]>([]);
  const [lastHit, setLastHit] = useState<{ msg: string; good: boolean } | null>(null);
  const idRef = useRef(0);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);

  const startGame = () => {
    gameOverRef.current = false;
    scoreRef.current = 0;
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setActiveTargets([]);
    setLastHit(null);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          gameOverRef.current = true;
          setGameOver(true);
          saveScore(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const spawn = setInterval(() => {
      if (gameOverRef.current) return;
      const target = targets[Math.floor(Math.random() * targets.length)];
      const newTarget: Target = {
        id: idRef.current++,
        target,
        x: 20 + Math.random() * (width - 80),
        y: 100 + Math.random() * 180,
        alive: true,
      };
      setActiveTargets(prev => [...prev.slice(-8), newTarget]);
    }, 800);
    return () => clearInterval(spawn);
  }, [gameStarted, gameOver]);

  const hitTarget = (id: number, target: typeof targets[0]) => {
    setActiveTargets(prev => prev.filter(t => t.id !== id));
    const newScore = scoreRef.current + target.points;
    scoreRef.current = Math.max(0, newScore);
    setScore(scoreRef.current);
    setLastHit({
      msg: target.isHealthy ? `+${target.points} ⭐ ${target.name}!` : `${target.points} 😬 ${target.name}`,
      good: target.isHealthy,
    });
    setTimeout(() => setLastHit(null), 800);
  };

  const saveScore = async (sc: number) => {
    const stars = parseInt((await storage.getItem('kidsTotalStars')) ?? '0');
    await storage.setItem('kidsTotalStars', String(stars + sc));
  };

  return (
    <LinearGradient colors={['#dbeafe', '#ede9fe', '#dbeafe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Food Archery 🏹</Text>
          {gameStarted && !gameOver && (
            <View style={styles.hud}>
              <Text style={styles.hudText}>⏰{timeLeft}s  ⭐{score}</Text>
            </View>
          )}
        </View>

        {!gameStarted ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🏹</Text>
            <Text style={styles.startTitle}>Healthy Food Archery!</Text>
            <Text style={styles.startDesc}>TAP the healthy foods to score points! Avoid the junk food or you'll lose points!</Text>
            <View style={styles.legendBlock}>
              <Text style={styles.legend}>✅ Healthy: 🥦🍎🥕🍓🍌 (+3 each)</Text>
              <Text style={styles.legend}>❌ Junk: 🍩🍔🍟 (-2 each)</Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
              <LinearGradient colors={['#60a5fa', '#818cf8']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start! 🏹</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : gameOver ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🏆</Text>
            <Text style={styles.startTitle}>Time's Up!</Text>
            <Text style={styles.finalScore}>Final Score: {score} ⭐</Text>
            <Text style={styles.startDesc}>
              {score >= 15 ? 'Amazing! You\'re a food archery champion! 🏆' :
               score >= 8 ? 'Great job! You know your healthy foods! 🌟' :
               'Keep practising - you\'ll get better! 💪'}
            </Text>
            <Text style={styles.starsEarned}>+{score} stars added to your collection!</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
              <LinearGradient colors={['#60a5fa', '#818cf8']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Play Again! 🏹</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameArea}>
            {lastHit && (
              <View style={[styles.hitMsg, lastHit.good ? styles.hitGood : styles.hitBad]}>
                <Text style={styles.hitMsgText}>{lastHit.msg}</Text>
              </View>
            )}
            <Text style={styles.tapHint}>Tap the healthy foods! 🎯</Text>
            {activeTargets.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.target, { left: t.x, top: t.y }]}
                onPress={() => hitTarget(t.id, t.target)}
                activeOpacity={0.7}
              >
                <View style={[styles.targetCircle, t.target.isHealthy ? styles.targetHealthy : styles.targetJunk]}>
                  <Text style={styles.targetEmoji}>{t.target.emoji}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 4,
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
  hud: {
    backgroundColor: '#fbbf24',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hudText: { fontSize: 14, fontWeight: '700', color: '#78350f' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  bigEmoji: { fontSize: 80, marginBottom: 12 },
  startTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  startDesc: { fontSize: 15, color: '#4b5563', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  legendBlock: { gap: 6, marginBottom: 24, alignItems: 'flex-start' },
  legend: { fontSize: 15, fontWeight: '600', color: '#374151' },
  finalScore: { fontSize: 32, fontWeight: '800', color: '#d97706', marginBottom: 8 },
  starsEarned: { fontSize: 16, color: '#16a34a', fontWeight: '600', marginBottom: 20 },
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
  gameArea: { flex: 1, position: 'relative' },
  tapHint: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
    paddingVertical: 4,
  },
  target: { position: 'absolute' },
  targetCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  targetHealthy: { backgroundColor: '#dcfce7', borderWidth: 2, borderColor: '#16a34a' },
  targetJunk: { backgroundColor: '#fee2e2', borderWidth: 2, borderColor: '#dc2626' },
  targetEmoji: { fontSize: 32 },
  hitMsg: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    zIndex: 100,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hitGood: { backgroundColor: '#dcfce7' },
  hitBad: { backgroundColor: '#fee2e2' },
  hitMsgText: { fontSize: 18, fontWeight: '800', color: '#374151' },
});
