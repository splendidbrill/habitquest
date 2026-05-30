import React, { useState, useEffect, useCallback, useRef } from 'react';
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
const GRID = 10;
const CELL = Math.floor((width - 40) / GRID);

const fruits = [
  { emoji: '🍎', name: 'Apple', fact: 'Apples give you energy to play for hours!' },
  { emoji: '🍌', name: 'Banana', fact: 'Bananas help you run super fast!' },
  { emoji: '🥕', name: 'Carrot', fact: 'Carrots boost your superhero vision!' },
  { emoji: '🍓', name: 'Strawberry', fact: 'Strawberries make your heart strong and happy!' },
  { emoji: '🍊', name: 'Orange', fact: 'Oranges protect you from getting sick!' },
];

type Pos = { x: number; y: number };

export function KidsFruitSnakeGame() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [snake, setSnake] = useState<Pos[]>([{ x: 5, y: 5 }]);
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [fruit, setFruit] = useState<Pos & { fruit: typeof fruits[0] }>({ x: 3, y: 3, fruit: fruits[0] });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastFruit, setLastFruit] = useState<typeof fruits[0] | null>(null);
  const [showFact, setShowFact] = useState(false);
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);

  dirRef.current = dir;
  snakeRef.current = snake;

  const randomFruit = useCallback((): Pos & { fruit: typeof fruits[0] } => ({
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID),
    fruit: fruits[Math.floor(Math.random() * fruits.length)],
  }), []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      const d = dirRef.current;
      const s = snakeRef.current;
      const newHead = { x: (s[0].x + d.x + GRID) % GRID, y: (s[0].y + d.y + GRID) % GRID };
      if (s.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setGameOver(true);
        return;
      }
      const hitFruit = newHead.x === fruit.x && newHead.y === fruit.y;
      const newSnake = hitFruit ? [newHead, ...s] : [newHead, ...s.slice(0, -1)];
      setSnake(newSnake);
      if (hitFruit) {
        setScore(sc => sc + 1);
        setLastFruit(fruit.fruit);
        setShowFact(true);
        setFruit(randomFruit());
        setTimeout(() => setShowFact(false), 2000);
        storage.getItem('kidsTotalStars').then(v => {
          storage.setItem('kidsTotalStars', String(parseInt(v ?? '0') + 1));
        });
      }
    }, 250);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, fruit]);

  const move = (dx: number, dy: number) => {
    if (dx === -dirRef.current.x && dy === -dirRef.current.y) return;
    setDir({ x: dx, y: dy });
  };

  const restart = () => {
    setSnake([{ x: 5, y: 5 }]);
    setDir({ x: 1, y: 0 });
    setFruit(randomFruit());
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setShowFact(false);
  };

  return (
    <LinearGradient colors={['#d1fae5', '#bbf7d0', '#d1fae5']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Fruit Snake 🐍</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
          </View>
        </View>

        {!gameStarted ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🐍</Text>
            <Text style={styles.startTitle}>Collect the fruits!</Text>
            <Text style={styles.startDesc}>Use the arrow buttons to move the snake and collect as many fruits as you can!</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={restart}>
              <LinearGradient colors={['#4ade80', '#10b981']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start Game! 🚀</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : gameOver ? (
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>🎉</Text>
            <Text style={styles.startTitle}>Game Over!</Text>
            <Text style={styles.gameOverScore}>Score: {score} fruits! ⭐</Text>
            <Text style={styles.startDesc}>Amazing job! Every fruit you collect gives you superpowers!</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={restart}>
              <LinearGradient colors={['#4ade80', '#10b981']} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Play Again! 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameArea}>
            {/* Game Grid */}
            <View style={[styles.grid, { width: GRID * CELL, height: GRID * CELL }]}>
              {snake.map((pos, i) => (
                <View
                  key={i}
                  style={[
                    styles.snakeCell,
                    { left: pos.x * CELL, top: pos.y * CELL, width: CELL - 2, height: CELL - 2, backgroundColor: i === 0 ? '#16a34a' : '#4ade80' }
                  ]}
                />
              ))}
              <View style={[styles.fruitCell, { left: fruit.x * CELL, top: fruit.y * CELL, width: CELL - 2, height: CELL - 2 }]}>
                <Text style={{ fontSize: CELL * 0.65 }}>{fruit.fruit.emoji}</Text>
              </View>
            </View>

            {showFact && lastFruit && (
              <View style={styles.factBubble}>
                <Text style={styles.factText}>{lastFruit.emoji} {lastFruit.fact}</Text>
              </View>
            )}

            {/* Controls */}
            <View style={styles.controls}>
              <View style={styles.ctrlRow}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(0, -1)}>
                  <Text style={styles.ctrlArrow}>↑</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ctrlRow}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(-1, 0)}>
                  <Text style={styles.ctrlArrow}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(0, 1)}>
                  <Text style={styles.ctrlArrow}>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(1, 0)}>
                  <Text style={styles.ctrlArrow}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  scoreBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#78350f' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  bigEmoji: { fontSize: 80, marginBottom: 12 },
  startTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  startDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  gameOverScore: { fontSize: 24, fontWeight: '700', color: '#d97706', marginBottom: 8 },
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
  gameArea: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  grid: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#16a34a',
    position: 'relative',
    overflow: 'hidden',
  },
  snakeCell: { position: 'absolute', borderRadius: 4 },
  fruitCell: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  factText: { fontSize: 14, color: '#374151', textAlign: 'center', fontWeight: '600' },
  controls: { marginTop: 20, alignItems: 'center', gap: 4 },
  ctrlRow: { flexDirection: 'row', gap: 4 },
  ctrlBtn: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  ctrlArrow: { fontSize: 28, color: '#fff', fontWeight: '800' },
});
