import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const motivationalMessages = [
  'Champions aren\'t made in gyms. Champions are made from something they have deep inside them - a desire, a dream, a vision! Keep going!',
  'Great athletes train every single day. You\'re building habits that will make you unstoppable!',
  'You just got 1% better than yesterday. That\'s how pros train - small gains add up to huge results!',
  'Your body is getting stronger, faster, and more skilled. That\'s the power of consistent training!',
  'Every session counts. You\'re not just training your body - you\'re training your mind to never give up!',
  'Professional athletes started exactly where you are now. Keep showing up and you\'ll be amazed at your progress!',
];

export function Kids8SuccessCelebration() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [lastUnlock, setLastUnlock] = useState('Achievement');
  const [completedMissions, setCompletedMissions] = useState(0);
  const [userName, setUserName] = useState('Champion');
  const [message] = useState(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

  useEffect(() => {
    storage.getItem('kids8LastUnlock').then(v => { if (v) setLastUnlock(v); });
    storage.getItem('kids8CompletedMissions').then(v => { if (v) setCompletedMissions(parseInt(v)); });
    storage.getItem('kids8UserName').then(v => { if (v) setUserName(v); });

    const init = async () => {
      const today = new Date().toDateString();
      await storage.setItem('kids8TodaysMission', 'completed');
      const pts = await storage.getItem('kids8FamilyPoints');
      await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 5));
      const lastActive = await storage.getItem('kids8LastActiveDate');
      if (lastActive !== today) {
        const str = await storage.getItem('kids8CurrentStreak');
        await storage.setItem('kids8CurrentStreak', String(parseInt(str || '0') + 1));
        await storage.setItem('kids8LastActiveDate', today);
      }
    };
    init();
  }, []);

  return (
    <LinearGradient colors={['#0f172a', '#3b0764', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.title}>Incredible Work, {userName}!</Text>
          <Text style={styles.subtitle}>Training Complete! 💪</Text>
          <Text style={styles.subSubtitle}>You're getting stronger every day!</Text>

          <LinearGradient colors={['#ca8a04', '#ea580c']} style={styles.achievementCard}>
            <Text style={styles.achieveEmoji}>🎖️</Text>
            <Text style={styles.achieveLabel}>Achievement Unlocked</Text>
            <Text style={styles.achieveName}>{lastUnlock}</Text>
            <Text style={styles.achieveSub}>Added to your trophy cabinet!</Text>
          </LinearGradient>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Today's Gains 🔥</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={{ fontSize: 36, marginBottom: 6 }}>⚡</Text>
                <Text style={styles.statNum}>+5</Text>
                <Text style={styles.statLabel}>Training Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={{ fontSize: 36, marginBottom: 6 }}>🎯</Text>
                <Text style={styles.statNum}>{completedMissions}</Text>
                <Text style={styles.statLabel}>Total Completed</Text>
              </View>
            </View>
          </View>

          <View style={styles.coachCard}>
            <Text style={{ fontSize: 28, marginRight: 10 }}>💪</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachTitle}>Coach Says:</Text>
              <Text style={styles.coachText}>{message}</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('MysteryBox', { returnScreen: 'Kids8TrainingDashboard' })}>
            <LinearGradient colors={['#2563eb', '#0891b2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
              <Text style={styles.btnText}>Back to Dashboard 🏠</Text>
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
  content: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  trophyEmoji: { fontSize: 80, marginBottom: 12, marginTop: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 18, color: '#e9d5ff', textAlign: 'center', marginBottom: 4 },
  subSubtitle: { fontSize: 16, color: '#c084fc', textAlign: 'center', marginBottom: 24 },
  achievementCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', marginBottom: 16 },
  achieveEmoji: { fontSize: 52, marginBottom: 12 },
  achieveLabel: { fontSize: 11, fontWeight: '800', color: '#fef9c3', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  achieveName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  achieveSub: { fontSize: 13, color: '#fef9c3' },
  statsCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, width: '100%', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statsTitle: { fontSize: 16, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14 },
  statNum: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#93c5fd' },
  coachCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', width: '100%', marginBottom: 24 },
  coachTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  coachText: { fontSize: 13, color: '#bbf7d0', lineHeight: 18 },
  btn: { borderRadius: 50, paddingVertical: 20, paddingHorizontal: 48, alignItems: 'center' },
  btnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});
