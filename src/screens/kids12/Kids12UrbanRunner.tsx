import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Play, Zap } from 'lucide-react-native';

type Obstacle = { id: number; lane: number; pos: number };
type Collectible = { id: number; lane: number; pos: number; icon: string; points: number };

const GAME_HEIGHT = 480;
const LANES = 3;
const OBSTACLE_SPEED = 6;
const TICK_MS = 80;

const collectibleTypes = [
  { icon: '💧', points: 10 },
  { icon: '🥜', points: 15 },
  { icon: '🎵', points: 20 },
];

export function Kids12UrbanRunner() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [highScore, setHighScore] = useState(0);

  const obstacleId    = useRef(0);
  const collectibleId = useRef(0);
  const scoreRef      = useRef(0);
  const distanceRef   = useRef(0);
  const playerLaneRef = useRef(1);
  const gameRef       = useRef(false);
  const obsRef        = useRef<Obstacle[]>([]);
  const colRef        = useRef<Collectible[]>([]);

  useEffect(() => {
    storage.getItem('kids12UrbanRunnerHighScore').then(v => setHighScore(parseInt(v || '0')));
  }, []);

  const startGame = () => {
    obstacleId.current    = 0;
    collectibleId.current = 0;
    scoreRef.current      = 0;
    distanceRef.current   = 0;
    playerLaneRef.current = 1;
    obsRef.current        = [];
    colRef.current        = [];
    setScore(0);
    setDistance(0);
    setPlayerLane(1);
    setObstacles([]);
    setCollectibles([]);
    setGameOver(false);
    gameRef.current = true;
    setIsPlaying(true);
  };

  const endGame = async () => {
    gameRef.current = false;
    setIsPlaying(false);
    setGameOver(true);
    const hs = parseInt((await storage.getItem('kids12UrbanRunnerHighScore')) || '0');
    const newHigh = Math.max(scoreRef.current, hs);
    await storage.setItem('kids12UrbanRunnerHighScore', newHigh.toString());
    setHighScore(newHigh);
    const xpRaw = await storage.getItem('kids12PlayerXP');
    const xp = parseInt(xpRaw || '0');
    await storage.setItem('kids12PlayerXP', (xp + Math.floor(scoreRef.current / 10)).toString());
  };

  const moveLane = (direction: 'left' | 'right') => {
    if (!gameRef.current) return;
    const prev = playerLaneRef.current;
    let next = prev;
    if (direction === 'left' && prev > 0) next = prev - 1;
    if (direction === 'right' && prev < LANES - 1) next = prev + 1;
    playerLaneRef.current = next;
    setPlayerLane(next);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const tick = setInterval(() => {
      if (!gameRef.current) return;

      distanceRef.current += 1;
      setDistance(distanceRef.current);

      const playerPos = GAME_HEIGHT - 80;

      // Spawn obstacles
      if (Math.random() < 0.15) {
        obsRef.current = [
          ...obsRef.current,
          { id: obstacleId.current++, lane: Math.floor(Math.random() * LANES), pos: 0 },
        ];
      }

      // Spawn collectibles
      if (Math.random() < 0.18) {
        const ct = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
        colRef.current = [
          ...colRef.current,
          { id: collectibleId.current++, lane: Math.floor(Math.random() * LANES), pos: 0, icon: ct.icon, points: ct.points },
        ];
      }

      // Move obstacles
      const movedObs = obsRef.current.map(o => ({ ...o, pos: o.pos + OBSTACLE_SPEED }));

      // Collision — checked OUTSIDE setState
      const collided = movedObs.some(
        o => o.lane === playerLaneRef.current &&
             o.pos > playerPos - 30 &&
             o.pos < playerPos + 30,
      );

      if (collided) {
        obsRef.current = [];
        colRef.current = [];
        setObstacles([]);
        setCollectibles([]);
        endGame();
        return;
      }

      obsRef.current = movedObs.filter(o => o.pos < GAME_HEIGHT);
      setObstacles([...obsRef.current]);

      // Move collectibles & check pickup
      const movedCol = colRef.current.map(c => ({ ...c, pos: c.pos + OBSTACLE_SPEED }));
      const remaining: Collectible[] = [];
      movedCol.forEach(c => {
        if (c.lane === playerLaneRef.current && c.pos > playerPos - 40 && c.pos < playerPos + 40) {
          scoreRef.current += c.points;
          setScore(scoreRef.current);
        } else if (c.pos < GAME_HEIGHT) {
          remaining.push(c);
        }
      });
      colRef.current = remaining;
      setCollectibles([...remaining]);
    }, TICK_MS);

    return () => clearInterval(tick);
  }, [isPlaying]);

  const laneWidth = 100 / LANES;

  if (gameOver) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Zap size={64} color="#a855f7" />
            <Text style={styles.gameOverTitle}>Run Complete!</Text>
            <Text style={styles.gameOverSub}>You showed up — that counts.</Text>
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statLabel}>Distance</Text>
                  <Text style={styles.statValue}>{distance}m</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={[styles.statValue, { color: '#a855f7' }]}>{score}</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>High Score</Text>
              <Text style={[styles.statValue, { color: '#22d3ee' }]}>{Math.max(score, highScore)}</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity activeOpacity={0.85} onPress={startGame} style={styles.flex1}>
                <LinearGradient
                  colors={['#a855f7', '#22d3ee']}
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
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
            </View>
            <View style={styles.startCenter}>
              <Zap size={80} color="#a855f7" />
              <Text style={styles.gameTitle}>Urban Runner</Text>
              <Text style={styles.gameSubtitle}>Quick reflexes, urban vibes</Text>
              <Text style={styles.gameTip}>Collect hydration 💧, snacks 🥜, and beats 🎵</Text>
              {highScore > 0 && (
                <View style={styles.highScoreCard}>
                  <Text style={styles.hsLabel}>Your Best</Text>
                  <Text style={styles.hsValue}>{highScore}</Text>
                </View>
              )}
              <TouchableOpacity activeOpacity={0.85} onPress={startGame} style={styles.btnWrap}>
                <LinearGradient
                  colors={['#a855f7', '#22d3ee']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <Play size={22} color="#fff" />
                  <Text style={styles.btnText}>Start Run</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.tipSmall}>Tap Left / Right to dodge</Text>
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
              <Text style={[styles.scoreValue, { color: '#a855f7' }]}>{score}</Text>
            </View>
            <View>
              <Text style={styles.scoreLabel}>Distance</Text>
              <Text style={[styles.scoreValue, { color: '#22d3ee' }]}>{distance}m</Text>
            </View>
          </View>

          {/* Game area */}
          <View style={[styles.gameArea, { height: GAME_HEIGHT }]}>
            {/* Lane dividers */}
            <View style={styles.laneDiv1} />
            <View style={styles.laneDiv2} />

            {/* Obstacles */}
            {obstacles.map(o => (
              <View
                key={o.id}
                style={[
                  styles.obstacle,
                  {
                    left: `${o.lane * laneWidth + laneWidth / 4}%` as any,
                    top: o.pos,
                    width: `${laneWidth / 2}%` as any,
                  },
                ]}
              >
                <Text style={styles.obstacleText}>🚧</Text>
              </View>
            ))}

            {/* Collectibles */}
            {collectibles.map(c => (
              <View
                key={c.id}
                style={[
                  styles.collectible,
                  {
                    left: `${c.lane * laneWidth + laneWidth / 4}%` as any,
                    top: c.pos,
                  },
                ]}
              >
                <Text style={styles.collectibleText}>{c.icon}</Text>
              </View>
            ))}

            {/* Player */}
            <View
              style={[
                styles.player,
                { left: `${playerLane * laneWidth + laneWidth / 4}%` as any },
              ]}
            >
              <Text style={styles.playerText}>🏃‍♀️</Text>
            </View>

            <Text style={styles.runHint}>Power steps! 💪</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => moveLane('left')}
              style={styles.controlLeft}
            >
              <Text style={styles.controlText}>← Left</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => moveLane('right')}
              style={styles.controlRight}
            >
              <Text style={styles.controlTextRight}>Right →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, padding: 20 },
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
  scoreDisplay: { alignItems: 'flex-end' },
  scoreLabel: { fontSize: 11, color: '#9ca3af' },
  scoreValue: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  startCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  gameTitle: { fontSize: 36, fontWeight: '800', color: '#a855f7', marginTop: 16 },
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
  btnWrap: { width: '100%', marginTop: 8 },
  btn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  tipSmall: { fontSize: 11, color: '#6b7280', marginTop: 8 },
  gameArea: {
    backgroundColor: '#1a1a24',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 14,
  },
  laneDiv1: {
    position: 'absolute', top: 0, bottom: 0,
    left: '33.33%', width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  laneDiv2: {
    position: 'absolute', top: 0, bottom: 0,
    left: '66.66%', width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  obstacle: { position: 'absolute', alignItems: 'center' },
  obstacleText: { fontSize: 28 },
  collectible: { position: 'absolute', alignItems: 'center' },
  collectibleText: { fontSize: 24 },
  player: { position: 'absolute', bottom: 32, alignItems: 'center' },
  playerText: { fontSize: 36 },
  runHint: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#22d3ee',
  },
  controls: { flexDirection: 'row', gap: 12 },
  controlLeft: {
    flex: 1,
    backgroundColor: 'rgba(168,85,247,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  controlRight: {
    flex: 1,
    backgroundColor: 'rgba(34,211,238,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
  },
  controlText: { fontSize: 17, fontWeight: '700', color: '#c084fc' },
  controlTextRight: { fontSize: 17, fontWeight: '700', color: '#67e8f9' },
  // Game Over
  gameOverTitle: { fontSize: 28, fontWeight: '800', color: '#a855f7', marginTop: 16, marginBottom: 8 },
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
  flex1: { flex: 1 },
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
