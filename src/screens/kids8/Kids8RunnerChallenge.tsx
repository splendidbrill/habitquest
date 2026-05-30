import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Play, RotateCcw, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const LANE_COUNT = 3;
const RUNNER_Y = 0.8; // 80% from top

interface GameItem { type: 'energy' | 'water' | 'gear' | 'obstacle'; emoji: string; lane: number; position: number; id: number; }

let itemIdCounter = 0;

export function Kids8RunnerChallenge() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [items, setItems] = useState<GameItem[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const playerLaneRef = useRef(1);
  const gameStateRef = useRef<'menu' | 'playing' | 'gameover'>('menu');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    storage.getItem('kids8RunnerHighScore').then(v => { if (v) setHighScore(parseInt(v)); });
  }, []);

  useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const startGame = () => {
    itemIdCounter = 0;
    setScore(0); setDistance(0); setPlayerLane(1); playerLaneRef.current = 1;
    setItems([]); setPrompt(null);
    setGameState('playing'); gameStateRef.current = 'playing';

    intervalRef.current = setInterval(() => {
      if (gameStateRef.current !== 'playing') { clearInterval(intervalRef.current); return; }

      setDistance(d => d + 1);

      // Spawn items
      if (Math.random() < 0.15) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        const types: GameItem['type'][] = ['energy', 'water', 'gear', 'obstacle'];
        const type = types[Math.floor(Math.random() * types.length)];
        const emojis = { energy: '⚡', water: '💧', gear: '🏆', obstacle: '🚧' };
        setItems(prev => [...prev, { type, emoji: emojis[type], lane, position: 0, id: itemIdCounter++ }]);
      }

      // Move items
      setItems(prev => {
        const moved = prev.map(i => ({ ...i, position: i.position + 3 })).filter(i => i.position < 110);
        const collisions = moved.filter(i => i.lane === playerLaneRef.current && i.position >= 72 && i.position <= 88);
        let gameOver = false;
        let scoreAdd = 0;
        let newPrompt: string | null = null;
        collisions.forEach(item => {
          if (item.type === 'obstacle') { gameOver = true; }
          else {
            scoreAdd += item.type === 'gear' ? 10 : item.type === 'energy' ? 5 : 3;
            newPrompt = item.type === 'energy' ? 'Power boost! ⚡' : item.type === 'water' ? 'Hydration! 💧' : 'Gear up! 🏆';
          }
        });
        if (scoreAdd > 0) { setScore(s => s + scoreAdd); setPrompt(newPrompt); setTimeout(() => setPrompt(null), 800); }
        if (gameOver) { clearInterval(intervalRef.current); setGameState('gameover'); gameStateRef.current = 'gameover'; }
        return moved.filter(i => !(i.lane === playerLaneRef.current && i.position >= 72 && i.position <= 88));
      });
    }, 80);
  };

  useEffect(() => {
    if (gameState === 'gameover') {
      clearInterval(intervalRef.current);
      const saveHighScore = async () => {
        if (score > highScore) {
          setHighScore(score);
          await storage.setItem('kids8RunnerHighScore', score.toString());
        }
        const xp = await storage.getItem('kids8UserXP');
        await storage.setItem('kids8UserXP', String(parseInt(xp || '0') + Math.floor(score / 10)));
      };
      saveHighScore();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState]);

  const laneWidth = (width - 48) / LANE_COUNT;
  const GAME_HEIGHT = 400;

  if (gameState === 'menu') {
    return (
      <LinearGradient colors={['#0f172a', '#1e3a8a', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Runner Challenge 🏃</Text>
              <View style={{ width: 44 }} />
            </View>

            <LinearGradient colors={['#2563eb', '#0891b2']} style={styles.heroCard}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>🏃</Text>
              <Text style={styles.heroTitle}>Stadium Sprint</Text>
              <Text style={styles.heroSub}>Dodge obstacles, collect power-ups, and run like a pro athlete!</Text>
              {highScore > 0 && (
                <View style={styles.highScoreBox}>
                  <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
                  <Text style={styles.highScoreVal}>{highScore}</Text>
                </View>
              )}
            </LinearGradient>

            <View style={styles.howToPlay}>
              <Text style={styles.howTitle}>How to Play</Text>
              <Text style={styles.howItem}>⬅️➡️  Tap buttons to switch lanes</Text>
              <Text style={styles.howItem}>⚡💧🏆  Collect power-ups for points</Text>
              <Text style={styles.howItem}>🚧  Avoid obstacles!</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
              <LinearGradient colors={['#16a34a', '#059669']} style={styles.startBtn}>
                <Play size={24} color="#fff" />
                <Text style={styles.startBtnText}>Start Running</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (gameState === 'gameover') {
    return (
      <LinearGradient colors={['#0f172a', '#450a0a', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <LinearGradient colors={['#ef4444', '#f97316']} style={styles.gameOverCard}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>💥</Text>
              <Text style={styles.gameOverTitle}>Nice Run!</Text>
              <Text style={styles.gameOverSub}>Showing up matters. That's consistency.</Text>
              <View style={styles.gameOverStats}>
                <View style={styles.gameOverStat}>
                  <Text style={styles.gameOverStatLabel}>SCORE</Text>
                  <Text style={styles.gameOverStatVal}>{score}</Text>
                </View>
                <View style={styles.gameOverStat}>
                  <Text style={styles.gameOverStatLabel}>DISTANCE</Text>
                  <Text style={styles.gameOverStatVal}>{distance}m</Text>
                </View>
              </View>
              {score >= highScore && score > 0 && (
                <View style={styles.newHiBox}>
                  <Trophy size={22} color="#facc15" />
                  <Text style={styles.newHiText}>NEW HIGH SCORE!</Text>
                </View>
              )}
              <View style={styles.xpBox}>
                <Text style={styles.xpLabel}>XP EARNED</Text>
                <Text style={styles.xpVal}>+{Math.floor(score / 10)} XP</Text>
              </View>
              <View style={styles.gameOverBtns}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setGameState('menu')} style={styles.menuBtn}>
                  <Text style={styles.menuBtnText}>Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={startGame} style={styles.retryBtn}>
                  <RotateCcw size={18} color="#0f172a" />
                  <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Playing
  return (
    <View style={{ flex: 1, backgroundColor: '#1e293b' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Stats */}
        <View style={styles.statsBar}>
          <View style={styles.statPill}><Text style={styles.statPillText}>Score: {score}</Text></View>
          <View style={styles.statPill}><Text style={styles.statPillText}>{distance}m</Text></View>
        </View>

        {/* Prompt */}
        {prompt && (
          <View style={styles.promptBanner}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        )}

        {/* Game area */}
        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 24, paddingTop: 60 }}>
          {[0, 1, 2].map(lane => (
            <View key={lane} style={[styles.lane, { width: laneWidth, height: GAME_HEIGHT, backgroundColor: playerLane === lane ? 'rgba(8,145,178,0.2)' : 'rgba(255,255,255,0.05)' }]}>
              {items.filter(i => i.lane === lane).map(item => (
                <View key={item.id} style={[styles.gameItem, { top: `${item.position}%` as any }]}>
                  <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                </View>
              ))}
              {playerLane === lane && (
                <View style={[styles.runner, { top: `${RUNNER_Y * 100}%` as any }]}>
                  <Text style={{ fontSize: 40 }}>🏃</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => { if (playerLane > 0) { setPlayerLane(l => l - 1); playerLaneRef.current = playerLane - 1; } }} disabled={playerLane === 0} style={[styles.ctrlBtn, playerLane === 0 && styles.ctrlDisabled]}>
            <Text style={styles.ctrlBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => { if (playerLane < 2) { setPlayerLane(l => l + 1); playerLaneRef.current = playerLane + 1; } }} disabled={playerLane === 2} style={[styles.ctrlBtn, playerLane === 2 && styles.ctrlDisabled]}>
            <Text style={styles.ctrlBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  heroSub: { fontSize: 15, color: '#bfdbfe', textAlign: 'center', lineHeight: 21, marginBottom: 12 },
  highScoreBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, alignItems: 'center' },
  highScoreLabel: { fontSize: 11, color: '#fde68a', fontWeight: '800', marginBottom: 2 },
  highScoreVal: { fontSize: 32, fontWeight: '800', color: '#fff' },
  howToPlay: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  howTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 10 },
  howItem: { fontSize: 14, color: '#94a3b8', marginBottom: 6 },
  startBtn: { borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  gameOverCard: { borderRadius: 24, padding: 24, alignItems: 'center' },
  gameOverTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
  gameOverSub: { fontSize: 14, color: '#fecaca', marginBottom: 16 },
  gameOverStats: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  gameOverStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, alignItems: 'center' },
  gameOverStatLabel: { fontSize: 11, color: '#fde68a', fontWeight: '800', marginBottom: 4 },
  gameOverStatVal: { fontSize: 28, fontWeight: '800', color: '#fff' },
  newHiBox: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: 'rgba(250,204,21,0.2)', borderRadius: 14, padding: 10, marginBottom: 10 },
  newHiText: { fontSize: 15, fontWeight: '800', color: '#fde68a' },
  xpBox: { backgroundColor: 'rgba(37,99,235,0.2)', borderRadius: 14, padding: 10, alignItems: 'center', marginBottom: 16 },
  xpLabel: { fontSize: 11, color: '#93c5fd', fontWeight: '800', marginBottom: 4 },
  xpVal: { fontSize: 22, fontWeight: '800', color: '#fff' },
  gameOverBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  menuBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  menuBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  retryBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  retryBtnText: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  statsBar: { position: 'absolute', top: 52, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, zIndex: 10 },
  statPill: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statPillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  promptBanner: { position: 'absolute', top: 100, alignSelf: 'center', zIndex: 20, backgroundColor: '#facc15', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 3, borderColor: '#fff' },
  promptText: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  lane: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 10, position: 'relative', overflow: 'hidden' },
  gameItem: { position: 'absolute', alignSelf: 'center' },
  runner: { position: 'absolute', alignSelf: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingBottom: 24, paddingTop: 12 },
  ctrlBtn: { width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  ctrlDisabled: { opacity: 0.3 },
  ctrlBtnText: { fontSize: 24, fontWeight: '800', color: '#fff' },
});
