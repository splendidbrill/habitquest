import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Zap, Timer } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const drills = [
  { id: 'reaction', name: 'Reaction Time', description: 'Tap the target as fast as you can', emoji: '⚡', colors: ['#ca8a04', '#ea580c'] as [string,string], sportRef: 'Goalkeepers train reflexes like this' },
  { id: 'agility', name: 'Agility Drill', description: 'Follow the direction shown', emoji: '↔️', colors: ['#2563eb', '#0891b2'] as [string,string], sportRef: 'This is how sprinters warm up' },
  { id: 'balance', name: 'Balance Test', description: 'Keep the bar centered', emoji: '⚖️', colors: ['#16a34a', '#059669'] as [string,string], sportRef: 'Surfers and skaters use balance drills' },
  { id: 'shooting', name: 'Target Practice', description: 'Hit the moving targets', emoji: '🎯', colors: ['#ef4444', '#f43f5e'] as [string,string], sportRef: 'Strikers practice accuracy like this' },
];

export function Kids8SkillDrills() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // Reaction game
  const [showTarget, setShowTarget] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const targetTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const shownAtRef = useRef(0);

  // Agility game
  const [agilityDir, setAgilityDir] = useState<'left' | 'right'>('left');
  const [agilityStep, setAgilityStep] = useState(0);

  // Balance game
  const [barPos, setBarPos] = useState(50);
  const barVelRef = useRef(2);
  const balanceIntervalRef = useRef<ReturnType<typeof setInterval>>();

  // Shooting game
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [gameState, timeLeft]);

  const startDrill = (drillId: string) => {
    setSelectedDrill(drillId);
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    if (drillId === 'reaction') { scheduleTarget(); }
    else if (drillId === 'agility') { setAgilityDir(Math.random() > 0.5 ? 'left' : 'right'); setAgilityStep(0); }
    else if (drillId === 'balance') { setBarPos(50); barVelRef.current = 2; startBalance(); }
    else if (drillId === 'shooting') { spawnTargets(); }
  };

  const scheduleTarget = () => {
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    targetTimeoutRef.current = setTimeout(() => {
      setTargetPos({ x: Math.random() * 60 + 15, y: Math.random() * 50 + 15 });
      setShowTarget(true);
      shownAtRef.current = Date.now();
    }, Math.random() * 1500 + 500);
  };

  const hitTarget = () => {
    const reactionTime = Date.now() - shownAtRef.current;
    setScore(s => s + Math.max(Math.floor(100 - reactionTime / 10), 10));
    setShowTarget(false);
    scheduleTarget();
  };

  const handleAgility = (dir: 'left' | 'right') => {
    if (dir === agilityDir) { setScore(s => s + 10); setAgilityDir(Math.random() > 0.5 ? 'left' : 'right'); setAgilityStep(s => s + 1); }
    else { setScore(s => Math.max(0, s - 5)); }
  };

  const startBalance = () => {
    if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
    balanceIntervalRef.current = setInterval(() => {
      setBarPos(prev => {
        let newPos = prev + barVelRef.current;
        if (newPos > 100 || newPos < 0) { barVelRef.current = -barVelRef.current; newPos = Math.max(0, Math.min(100, newPos)); }
        if (newPos > 45 && newPos < 55) { setScore(s => s + 1); }
        return newPos;
      });
    }, 100);
  };

  const adjustBalance = (dir: 'left' | 'right') => {
    barVelRef.current = dir === 'left' ? barVelRef.current - 3 : barVelRef.current + 3;
  };

  const spawnTargets = () => {
    const t = Array.from({ length: 3 }, (_, i) => ({ id: Date.now() + i, x: Math.random() * 60 + 15, y: Math.random() * 50 + 15 }));
    setTargets(t);
  };

  const hitShootTarget = (id: number) => {
    setTargets(prev => { const rest = prev.filter(t => t.id !== id); if (rest.length === 0) { spawnTargets(); } return rest.filter(t => t.id !== id); });
    setScore(s => s + 15);
  };

  const endGame = async () => {
    clearInterval(balanceIntervalRef.current);
    clearTimeout(targetTimeoutRef.current);
    setGameState('complete');
    const xp = Math.floor(score / 5);
    const current = await storage.getItem('kids8UserXP');
    await storage.setItem('kids8UserXP', String(parseInt(current || '0') + xp));
  };

  useEffect(() => {
    return () => {
      clearInterval(balanceIntervalRef.current);
      clearTimeout(targetTimeoutRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (gameState === 'menu') {
    return (
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Skill Drills</Text>
              <View style={{ width: 44 }} />
            </View>

            <LinearGradient colors={['#2563eb', '#0891b2']} style={styles.infoCard}>
              <Text style={{ fontSize: 44, marginRight: 12 }}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Train Your Skills</Text>
                <Text style={styles.infoText}>Quick 30-second drills to sharpen your reflexes, agility, and coordination. Pro athletes use these daily.</Text>
              </View>
            </LinearGradient>

            {drills.map(drill => (
              <TouchableOpacity key={drill.id} activeOpacity={0.85} onPress={() => startDrill(drill.id)} style={{ marginBottom: 12 }}>
                <LinearGradient colors={drill.colors} style={styles.drillCard}>
                  <Text style={{ fontSize: 44, marginRight: 14 }}>{drill.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drillName}>{drill.name}</Text>
                    <Text style={styles.drillDesc}>{drill.description}</Text>
                    <Text style={styles.drillRef}>💡 {drill.sportRef}</Text>
                  </View>
                  <Zap size={22} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (gameState === 'complete') {
    return (
      <LinearGradient colors={['#0f172a', '#064e3b', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.completeContent}>
            <LinearGradient colors={['#16a34a', '#059669']} style={styles.completeCard}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>💪</Text>
              <Text style={styles.completeTitle}>Nice Work!</Text>
              <Text style={styles.completeSub}>That's consistency. Pro athletes build habits like this.</Text>
              <View style={styles.completeStats}>
                <Text style={styles.completeScoreLabel}>SCORE</Text>
                <Text style={styles.completeScore}>{Math.round(score)}</Text>
                <Text style={styles.completeXpLabel}>XP EARNED</Text>
                <Text style={styles.completeXp}>+{Math.floor(score / 5)} XP</Text>
              </View>
              <View style={styles.completeBtns}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setGameState('menu')} style={styles.backDrillBtn}>
                  <Text style={styles.backDrillText}>Back to Drills</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.dashBtn}>
                  <Text style={styles.dashBtnText}>Dashboard</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const drill = drills.find(d => d.id === selectedDrill);

  return (
    <LinearGradient colors={drill?.colors || ['#1e293b', '#334155']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.gameHeader}>
          <View style={styles.gameStatPill}><Text style={styles.gameStatText}>Score: {Math.round(score)}</Text></View>
          <View style={styles.gameStatPill}>
            <Timer size={16} color="#fff" />
            <Text style={styles.gameStatText}>{timeLeft}s</Text>
          </View>
        </View>

        {/* Reaction */}
        {selectedDrill === 'reaction' && (
          <View style={{ flex: 1, position: 'relative' }}>
            {showTarget ? (
              <TouchableOpacity activeOpacity={0.85} onPress={hitTarget} style={[styles.target, { left: `${targetPos.x}%` as any, top: `${targetPos.y}%` as any }]}>
                <Text style={{ fontSize: 36 }}>🎯</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.waitingText}><Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>Get Ready...</Text></View>
            )}
          </View>
        )}

        {/* Agility */}
        {selectedDrill === 'agility' && (
          <View style={styles.gameCenter}>
            <Text style={{ fontSize: 80, marginBottom: 12 }}>{agilityDir === 'left' ? '←' : '→'}</Text>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 32 }}>Step {agilityStep + 1}</Text>
            <View style={{ flexDirection: 'row', gap: 24 }}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => handleAgility('left')} style={styles.gameBtn}><Text style={styles.gameBtnText}>←</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={() => handleAgility('right')} style={styles.gameBtn}><Text style={styles.gameBtnText}>→</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Balance */}
        {selectedDrill === 'balance' && (
          <View style={styles.gameCenter}>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>Keep the bar centered!</Text>
            <View style={styles.balanceTrack}>
              <View style={styles.balanceCenter} />
              <View style={[styles.balanceBar, { left: `${barPos}%` as any }]} />
            </View>
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 32 }}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => adjustBalance('left')} style={styles.gameBtn}><Text style={styles.gameBtnText}>←</Text></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={() => adjustBalance('right')} style={styles.gameBtn}><Text style={styles.gameBtnText}>→</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Shooting */}
        {selectedDrill === 'shooting' && (
          <View style={{ flex: 1, position: 'relative' }}>
            {targets.map(t => (
              <TouchableOpacity key={t.id} activeOpacity={0.85} onPress={() => hitShootTarget(t.id)} style={[styles.shootTarget, { left: `${t.x}%` as any, top: `${t.y}%` as any }]}>
                <Text style={{ fontSize: 36 }}>🎯</Text>
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
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  infoTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#bfdbfe', lineHeight: 17 },
  drillCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },
  drillName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  drillDesc: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  drillRef: { fontSize: 11, color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  completeContent: { flex: 1, justifyContent: 'center', padding: 24 },
  completeCard: { borderRadius: 24, padding: 28, alignItems: 'center' },
  completeTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
  completeSub: { fontSize: 14, color: '#bbf7d0', textAlign: 'center', marginBottom: 20 },
  completeStats: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 20, alignItems: 'center', width: '100%', marginBottom: 16 },
  completeScoreLabel: { fontSize: 11, color: '#fde68a', fontWeight: '800', marginBottom: 4 },
  completeScore: { fontSize: 48, fontWeight: '800', color: '#fff', marginBottom: 8 },
  completeXpLabel: { fontSize: 11, color: '#93c5fd', fontWeight: '800', marginBottom: 4 },
  completeXp: { fontSize: 22, fontWeight: '800', color: '#fff' },
  completeBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  backDrillBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  backDrillText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  dashBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  dashBtnText: { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 8 },
  gameStatPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  gameStatText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  target: { position: 'absolute', width: 70, height: 70, backgroundColor: '#facc15', borderRadius: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  waitingText: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gameCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gameBtn: { width: 88, height: 88, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  gameBtnText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  balanceTrack: { width: '80%', height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, position: 'relative', overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  balanceCenter: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: '#facc15' },
  balanceBar: { position: 'absolute', top: 4, width: 24, height: 24, backgroundColor: '#fff', borderRadius: 12, transform: [{ translateX: -12 }] },
  shootTarget: { position: 'absolute', width: 60, height: 60, backgroundColor: '#facc15', borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
});
