import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Target, Zap } from 'lucide-react-native';

type Circle = { id: number; x: number; y: number; born: number };
type Difficulty = 'easy' | 'medium' | 'hard';

const { width: SCREEN_W } = Dimensions.get('window');
const GAME_W = SCREEN_W - 48;
const GAME_H = 340;
const CIRCLE_SIZE = 60;
const CIRCLE_LIFETIME_MS = { easy: 1600, medium: 1100, hard: 700 };
const SPAWN_INTERVAL_MS = { easy: 700, medium: 480, hard: 300 };

export function Kids12ReflexRhythm() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScore, setHighScore] = useState(0);

  const circleId = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const gameRef = useRef(false);

  useEffect(() => {
    storage.getItem('kids12ReflexRhythmHighScore').then(v => setHighScore(parseInt(v || '0')));
  }, []);

  const spawnCircle = () => {
    const margin = CIRCLE_SIZE;
    const x = margin + Math.random() * (GAME_W - margin * 2);
    const y = margin + Math.random() * (GAME_H - margin * 2);
    const newCircle: Circle = { id: circleId.current++, x, y, born: Date.now() };
    setCircles(prev => [...prev, newCircle]);
  };

  const startGame = () => {
    circleId.current = 0;
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setCircles([]);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
    gameRef.current = true;
  };

  const endGame = async () => {
    gameRef.current = false;
    setIsPlaying(false);
    setGameOver(true);
    setCircles([]);
    const hs = parseInt((await storage.getItem('kids12ReflexRhythmHighScore')) || '0');
    const newHigh = Math.max(scoreRef.current, hs);
    await storage.setItem('kids12ReflexRhythmHighScore', newHigh.toString());
    setHighScore(newHigh);
    const xpRaw = await storage.getItem('kids12PlayerXP');
    const xp = parseInt(xpRaw || '0');
    await storage.setItem('kids12PlayerXP', (xp + comboRef.current).toString());
  };

  const hitCircle = (id: number) => {
    if (!gameRef.current) return;
    setCircles(prev => {
      const found = prev.find(c => c.id === id);
      if (found) {
        const points = 10 + comboRef.current * 2;
        scoreRef.current += points;
        comboRef.current += 1;
        setScore(scoreRef.current);
        setCombo(comboRef.current);
        return prev.filter(c => c.id !== id);
      }
      return prev;
    });
  };

  // Spawn loop
  useEffect(() => {
    if (!isPlaying) return;
    const spawnTimer = setInterval(() => {
      if (!gameRef.current) return;
      spawnCircle();
    }, SPAWN_INTERVAL_MS[difficulty]);
    return () => clearInterval(spawnTimer);
  }, [isPlaying, difficulty]);

  // Expire circles (missed ones break combo)
  useEffect(() => {
    if (!isPlaying) return;
    const expireTimer = setInterval(() => {
      if (!gameRef.current) return;
      const now = Date.now();
      setCircles(prev => {
        const remaining = prev.filter(c => now - c.born < CIRCLE_LIFETIME_MS[difficulty]);
        if (remaining.length < prev.length) {
          comboRef.current = 0;
          setCombo(0);
        }
        return remaining;
      });
    }, 100);
    return () => clearInterval(expireTimer);
  }, [isPlaying, difficulty]);

  // Countdown
  useEffect(() => {
    if (!isPlaying) return;
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [isPlaying]);

  if (gameOver) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Zap size={64} color="#22d3ee" />
            <Text style={styles.gameOverTitle}>Session Complete!</Text>
            <Text style={styles.gameOverSub}>Small reps build big confidence.</Text>
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={[styles.statValue, { color: '#22d3ee' }]}>{score}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>Best Combo</Text>
                  <Text style={[styles.statValue, { color: '#a855f7' }]}>{combo}x</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>High Score</Text>
              <Text style={[styles.statValue, { color: '#ec4899' }]}>{Math.max(score, highScore)}</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity activeOpacity={0.85} onPress={startGame} style={styles.flex1}>
                <LinearGradient
                  colors={['#22d3ee', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Play Again</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Kids12Today')}
                style={[styles.flex1, styles.homeBtn]}
              >
                <Text style={styles.homeBtnText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!isPlaying) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <View style={styles.topHeader}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Kids12Today')}
                style={styles.backBtn}
              >
                <ArrowLeft size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.startCenter}>
              <Target size={80} color="#22d3ee" />
              <Text style={styles.gameTitle}>Reflex & Rhythm</Text>
              <Text style={styles.gameSubtitle}>Quick taps, clean focus</Text>
              <Text style={styles.gameTip}>30 seconds of flow state</Text>

              {highScore > 0 && (
                <View style={styles.highScoreCard}>
                  <Text style={styles.hsLabel}>Your Best</Text>
                  <Text style={styles.hsValue}>{highScore}</Text>
                </View>
              )}

              <Text style={styles.diffLabel}>Choose intensity</Text>
              <View style={styles.diffRow}>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.85}
                    onPress={() => setDifficulty(d)}
                    style={styles.flex1}
                  >
                    {difficulty === d ? (
                      <LinearGradient
                        colors={['#22d3ee', '#a855f7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.diffBtnActive}
                      >
                        <Text style={styles.diffBtnTextActive}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.diffBtn}>
                        <Text style={styles.diffBtnText}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity activeOpacity={0.85} onPress={startGame} style={styles.btnWrap}>
                <LinearGradient
                  colors={['#22d3ee', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <Zap size={22} color="#fff" />
                  <Text style={styles.btnText}>Start Session</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.tipSmall}>Tap circles before they disappear</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Score bar */}
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={[styles.scoreValue, { color: '#22d3ee' }]}>{score}</Text>
            </View>
            <View style={styles.timerBig}>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.scoreLabel}>Combo</Text>
              <Text style={[styles.scoreValue, { color: '#a855f7' }]}>{combo}x</Text>
            </View>
          </View>

          {/* Game area */}
          <View style={[styles.gameArea, { height: GAME_H }]}>
            {circles.map(c => (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.7}
                onPress={() => hitCircle(c.id)}
                style={[
                  styles.circle,
                  { left: c.x - CIRCLE_SIZE / 2, top: c.y - CIRCLE_SIZE / 2 },
                ]}
              >
                <LinearGradient
                  colors={['#a855f7', '#22d3ee']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.circleGrad}
                >
                  <Zap size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, padding: 24 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  scoreLabel: { fontSize: 11, color: '#9ca3af' },
  scoreValue: { fontSize: 24, fontWeight: '800' },
  timerBig: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  startCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  gameTitle: { fontSize: 36, fontWeight: '800', color: '#22d3ee', marginTop: 16 },
  gameSubtitle: { fontSize: 15, color: '#9ca3af' },
  gameTip: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  highScoreCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
    width: '100%',
  },
  hsLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 4 },
  hsValue: { fontSize: 28, fontWeight: '800', color: '#22d3ee' },
  diffLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 8 },
  diffRow: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 12 },
  diffBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1a1a24',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  diffBtnActive: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  diffBtnText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  diffBtnTextActive: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  btnWrap: { width: '100%', marginTop: 4 },
  btn: {
    borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  tipSmall: { fontSize: 11, color: '#6b7280', marginTop: 8 },
  flex1: { flex: 1 },
  gameArea: {
    backgroundColor: '#1a1a24',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  circleGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_SIZE / 2,
  },
  // Game Over
  gameOverTitle: { fontSize: 28, fontWeight: '800', color: '#22d3ee', marginTop: 16, marginBottom: 8 },
  gameOverSub: { fontSize: 15, color: '#9ca3af', marginBottom: 20 },
  statsCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  statLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#ffffff' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  homeBtn: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  homeBtnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
});
