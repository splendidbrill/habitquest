import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, TrendingUp, Target, Zap, Award, Flame } from 'lucide-react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Kids8ProgressTracker() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState('Rookie');
  const [nextLevel, setNextLevel] = useState('Starter');
  const [pointsToNext, setPointsToNext] = useState(50);
  const [levelProgress, setLevelProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([3, 5, 4, 6, 8, 7, 0]);

  useEffect(() => {
    storage.getItem('kids8UserXP').then(v => {
      const points = parseInt(v || '0');
      setTotalPoints(points);
      if (points >= 500) {
        setLevel('All-Star'); setNextLevel('Legend'); setPointsToNext(1000 - points);
        setLevelProgress(((points - 500) / 500) * 100);
      } else if (points >= 200) {
        setLevel('Pro'); setNextLevel('All-Star'); setPointsToNext(500 - points);
        setLevelProgress(((points - 200) / 300) * 100);
      } else if (points >= 50) {
        setLevel('Starter'); setNextLevel('Pro'); setPointsToNext(200 - points);
        setLevelProgress(((points - 50) / 150) * 100);
      } else {
        setLevel('Rookie'); setNextLevel('Starter'); setPointsToNext(50 - points);
        setLevelProgress((points / 50) * 100);
      }
      setWeeklyProgress([3, 5, 4, 6, 8, 7, points % 10]);
    });
    storage.getItem('kids8CurrentStreak').then(v => { if (v) setStreak(parseInt(v)); });
  }, []);

  const maxWeekly = Math.max(...weeklyProgress, 1);

  return (
    <LinearGradient colors={['#0f172a', '#064e3b', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Progress Tracker 📊</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#059669', '#0d9488']} style={styles.levelCard}>
            <View style={styles.levelRow}>
              <View>
                <Text style={styles.levelLabel}>Current Level</Text>
                <Text style={styles.levelValue}>{level}</Text>
              </View>
              <Target size={48} color="#fde68a" />
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(levelProgress, 100)}%` }]} />
            </View>
            <View style={styles.levelFooter}>
              <Text style={styles.levelFooterText}>{totalPoints} points</Text>
              <Text style={styles.levelFooterText}>{pointsToNext} to {nextLevel}</Text>
            </View>
          </LinearGradient>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 44, marginBottom: 4 }}>🔥</Text>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Zap size={44} color="#facc15" />
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Award size={20} color="#60a5fa" />
              <Text style={styles.chartTitle}>This Week's Activity</Text>
            </View>
            <View style={styles.bars}>
              {weeklyProgress.map((pts, index) => {
                const height = Math.max((pts / maxWeekly) * 100, 4);
                return (
                  <View key={index} style={styles.barCol}>
                    <View style={[styles.barTrack]}>
                      <LinearGradient
                        colors={index === 6 ? ['#059669', '#4ade80'] : ['#2563eb', '#0891b2']}
                        style={[styles.barFill, { height: `${height}%` }]}
                      />
                    </View>
                    <Text style={styles.barDay}>{days[index]}</Text>
                    <Text style={styles.barVal}>{pts}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterText}>💪 Consistent effort builds champions!</Text>
            </View>
          </View>

          <View style={styles.recordsCard}>
            <View style={styles.recordsHeader}>
              <Award size={20} color="#c084fc" />
              <Text style={styles.recordsTitle}>Personal Records</Text>
            </View>
            <View style={styles.recordRow}>
              <Flame size={24} color="#f97316" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.recordName}>Best Streak</Text>
                <Text style={styles.recordSub}>Longest active days</Text>
              </View>
              <Text style={styles.recordVal}>{Math.max(streak, 0)} days</Text>
            </View>
            <View style={styles.recordRow}>
              <TrendingUp size={24} color="#4ade80" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.recordName}>Best Week</Text>
                <Text style={styles.recordSub}>Highest weekly points</Text>
              </View>
              <Text style={styles.recordVal}>{Math.max(...weeklyProgress)} pts</Text>
            </View>
          </View>

          <View style={styles.quoteCard}>
            <Target size={22} color="#c084fc" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.quoteTitle}>Keep Climbing! 🚀</Text>
              <Text style={styles.quoteText}>
                You're building habits that last a lifetime. Every point represents progress toward your goals!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  levelCard: { borderRadius: 24, padding: 20, marginBottom: 16 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  levelLabel: { fontSize: 11, fontWeight: '700', color: '#d1fae5', textTransform: 'uppercase', letterSpacing: 1 },
  levelValue: { fontSize: 28, fontWeight: '800', color: '#fff' },
  progressTrack: { height: 14, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 7, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#fbbf24', borderRadius: 7 },
  levelFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  levelFooterText: { fontSize: 13, color: '#d1fae5' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#93c5fd', marginTop: 2 },
  chartCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4, marginBottom: 12 },
  barCol: { flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: '100%', height: '80%', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4 },
  barDay: { fontSize: 10, color: '#93c5fd', fontWeight: '700' },
  barVal: { fontSize: 10, color: '#fff', fontWeight: '700' },
  chartFooter: { backgroundColor: 'rgba(22,163,74,0.2)', borderRadius: 12, padding: 10, alignItems: 'center' },
  chartFooterText: { fontSize: 13, fontWeight: '700', color: '#4ade80' },
  recordsCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  recordsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  recordsTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  recordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, marginBottom: 8 },
  recordName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  recordSub: { fontSize: 11, color: '#93c5fd', marginTop: 2 },
  recordVal: { fontSize: 20, fontWeight: '800', color: '#fff' },
  quoteCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)' },
  quoteTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  quoteText: { fontSize: 13, color: '#e9d5ff', lineHeight: 18 },
});
