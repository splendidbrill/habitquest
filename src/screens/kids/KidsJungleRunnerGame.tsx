import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const { width } = Dimensions.get('window');
const GROUND_Y = 60;
const RUNNER_X = 60;
const OBSTACLE_SPEED = 4;

type Obstacle = { x: number; emoji: string; reward?: string };

const healthyFoods = ['🥦', '🍎', '🥕', '🍌', '🍅'];
const junkFoods = ['🍔', '🍟', '🍩', '🍭'];

export function KidsJungleRunnerGame() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [runnerY, setRunnerY] = useState(GROUND_Y);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const jumpYRef = useRef(GROUND_Y);
  const isJumpingRef = useRef(false);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);

  const jump = () => {
    if (isJumpingRef.current || gameOverRef.current) return;
    isJumpingRef.current = true;
    setJumping(true);
    let y = GROUND_Y;
    const up = setInterval(() => {
      y += 6;
      if (y >= GROUND_Y + 90) {
        clearInterval(up);
        jumpYRef.current = GROUND_Y + 90;
        setRunnerY(GROUND_Y + 90);
        const down = setInterval(() => {
          y -= 5;
          if (y <= GROUND_Y) {
            clearInterval(down);
            y = GROUND_Y;
            jumpYRef.current = GROUND_Y;
            setRunnerY(GROUND_Y);
            isJumpingRef.current = false;
            setJumping(false);
          } else {
            jumpYRef.current = y;
            setRunnerY(y);
          }
        }, 25);
      } else {
        jumpYRef.current = y;
        setRunnerY(y);
      }
    }, 25);
  };

  const startGame = () => {
    gameOverRef.current = false;
    scoreRef.current = 0;
    obstaclesRef.current = [];
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setCollected([]);
    setRunnerY(GROUND_Y);
    jumpYRef.current = GROUND_Y;
    isJumpingRef.current = false;
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // Spawn obstacles
    const spawnInterval = setInterval(() => {
      if (gameOverRef.current) return;
      const isHealthy = Math.random() > 0.5;
      const emoji = isHealthy
        ? healthyFoods[Math.floor(Math.random() * healthyFoods.length)]
        : junkFoods[Math.floor(Math.random() * junkFoods.length)];
      const newObs: Obstacle = { x: width - 40, emoji, reward: isHealthy ? emoji : undefined };
      obstaclesRef.current = [...obstaclesRef.current, newObs];
      setObstacles([...obstaclesRef.current]);
    }, 1500);

    // Move obstacles
    const moveInterval = setInterval(() => {
      if (gameOverRef.current) return;
      obstaclesRef.current = obstaclesRef.current
        .map(o => ({ ...o, x: o.x - OBSTACLE_SPEED }))
        .filter(o => o.x > -40);

      // Collision check
      const runnerTop = jumpYRef.current;
      const runnerBottom = jumpYRef.current - 40;
      obstaclesRef.current.forEach(o => {
        const obstacleX = o.x;
        if (Math.abs(obstacleX - RUNNER_X) < 30 && runnerBottom < 30) {
          if (!o.reward) {
            gameOverRef.current = true;
            setGameOver(true);
            saveScore(scoreRef.current);
          } else {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            if (!collected.includes(o.emoji)) {
              setCollected(prev => [...prev, o.emoji]);
            }
          }
        }
      });

      setObstacles([...obstaclesRef.current]);
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameStarted, gameOver]);

  const saveScore = async (sc: number) => {
    const stars = parseInt((await storage.getItem('kidsTotalStars')) ?? '0');
    await storage.setItem('kidsTotalStars', String(stars + sc));
    if (sc >= 3) {
      const stickers = JSON.parse((await storage.getItem('kidsFruitStickers')) ?? '[]');
      if (!stickers.includes('🌴')) {
        stickers.push('🌴');
        await storage.setItem('kidsFruitStickers', JSON.stringify(stickers));
      }
    }
  };

  return (
    <LinearGradient colors={['#fef9c3', '#d1fae5', '#d1fae5']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Jungle Adventure 🦁</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
          </View>
        </View>

        {!gameStarted ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🦁</Text>
            <Text style={styles.startTitle}>Jungle Adventure!</Text>
            <Text style={styles.startDesc}>Jump to collect healthy foods and avoid junk food obstacles! Tap the JUMP button to jump!</Text>
            <View style={styles.legendRow}>
              <Text style={styles.legendItem}>✅ Collect: 🥦🍎🥕🍌🍅</Text>
              <Text style={styles.legendItem}>❌ Avoid: 🍔🍟🍩🍭</Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
              <LinearGradient colors={['#fb923c', '#fbbf24']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start! 🚀</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : gameOver ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🎉</Text>
            <Text style={styles.startTitle}>Game Over!</Text>
            <Text style={styles.startDesc}>You collected {score} healthy foods! +{score} stars earned!</Text>
            {collected.length > 0 && (
              <Text style={styles.collectedText}>Collected: {collected.join(' ')}</Text>
            )}
            <TouchableOpacity activeOpacity={0.85} onPress={startGame}>
              <LinearGradient colors={['#fb923c', '#fbbf24']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Play Again! 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameWrapper}>
            {/* Game canvas area */}
            <View style={styles.gameCanvas}>
              {/* Sky */}
              <View style={styles.sky}>
                <Text style={styles.sun}>☀️</Text>
                <Text style={styles.cloud}>☁️</Text>
                <Text style={styles.cloud2}>⛅</Text>
              </View>
              {/* Ground */}
              <View style={styles.ground} />
              {/* Trees */}
              <Text style={[styles.tree, { left: 100 }]}>🌴</Text>
              <Text style={[styles.tree, { right: 60 }]}>🌳</Text>
              {/* Runner */}
              <Text style={[styles.runner, { bottom: runnerY - GROUND_Y + 12 }]}>
                {jumping ? '🦁' : '🦁'}
              </Text>
              {/* Obstacles */}
              {obstacles.map((o, i) => (
                <Text
                  key={i}
                  style={[styles.obstacle, { left: o.x, bottom: 14 }]}
                >
                  {o.emoji}
                </Text>
              ))}
            </View>

            <Text style={styles.gameInfo}>
              Jump over junk food! Collect healthy foods! ⭐ {score}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.jumpBtn}
              onPress={jump}
            >
              <LinearGradient colors={['#fb923c', '#fbbf24']} style={styles.jumpBtnGrad}>
                <Text style={styles.jumpBtnText}>JUMP! 🦘</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    marginBottom: 8,
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
  scoreBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#78350f' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  bigEmoji: { fontSize: 80, marginBottom: 12 },
  startTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  startDesc: { fontSize: 15, color: '#4b5563', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  legendRow: { gap: 6, marginBottom: 24, alignItems: 'center' },
  legendItem: { fontSize: 15, fontWeight: '600', color: '#374151' },
  collectedText: { fontSize: 20, marginBottom: 16 },
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
  gameWrapper: { flex: 1, paddingHorizontal: 16 },
  gameCanvas: {
    height: 180,
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  sky: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  sun: { position: 'absolute', top: 8, right: 16, fontSize: 28 },
  cloud: { position: 'absolute', top: 6, left: 30, fontSize: 24 },
  cloud2: { position: 'absolute', top: 20, left: 130, fontSize: 22 },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#a3e635',
  },
  tree: { position: 'absolute', bottom: 12, fontSize: 32 },
  runner: { position: 'absolute', left: RUNNER_X - 20, fontSize: 36 },
  obstacle: { position: 'absolute', fontSize: 32 },
  gameInfo: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  jumpBtn: { width: '100%' },
  jumpBtnGrad: {
    borderRadius: 50,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  jumpBtnText: { fontSize: 28, fontWeight: '900', color: '#fff' },
});
