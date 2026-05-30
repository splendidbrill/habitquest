import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft } from 'lucide-react-native';

const missions = [
  { id: 'football-drills', title: 'Football Skills Training', subtitle: 'Practice dribbling & shooting', emoji: '⚽', bgColors: ['#16a34a', '#059669', '#0d9488'] as [string,string,string], time: '20-30 minutes', unlocks: 'Football Master Badge', description: 'Work on your ball control, dribbling through cones, and taking shots at goal. Focus on technique!', performanceTip: 'Pro footballers practice ball control for 30 mins daily. Even 10 mins makes you better!' },
  { id: 'sprint-training', title: 'Speed & Agility Drills', subtitle: 'Get faster and quicker!', emoji: '🏃', bgColors: ['#2563eb', '#0891b2', '#0284c7'] as [string,string,string], time: '15-20 minutes', unlocks: 'Speed Demon Badge', description: 'Sprint intervals, cone drills, and quick feet exercises to boost your speed and agility.', performanceTip: 'Athletes do sprint training 3x per week. Explosive speed = game changer!' },
  { id: 'basketball-practice', title: 'Basketball Shooting', subtitle: 'Work on your shooting game', emoji: '🏀', bgColors: ['#f97316', '#f59e0b', '#eab308'] as [string,string,string], time: '25 minutes', unlocks: 'Hoops Hero Badge', description: 'Practice free throws, layups, and three-pointers. Track how many you make!', performanceTip: 'NBA players shoot 500+ shots per practice. Start with 50 and build up!' },
  { id: 'cricket-nets', title: 'Cricket Batting Practice', subtitle: 'Hit some sixes!', emoji: '🏏', bgColors: ['#0d9488', '#16a34a', '#65a30d'] as [string,string,string], time: '30 minutes', unlocks: 'Cricket Champion Badge', description: 'Practice your batting technique, footwork, and timing. Bowl to friends or use a wall.', performanceTip: 'Cricketers practice in nets daily. Master your straight drive first!' },
  { id: 'strength-bodyweight', title: 'Bodyweight Strength', subtitle: 'Build functional strength', emoji: '💪', bgColors: ['#ef4444', '#f43f5e', '#ec4899'] as [string,string,string], time: '15 minutes', unlocks: 'Strength Warrior Badge', description: 'Push-ups, planks, squats, and lunges. Build real strength without equipment!', performanceTip: 'Every athlete does bodyweight training. Your body weight is your best gym!' },
  { id: 'cycling-ride', title: 'Cycling Adventure', subtitle: 'Build endurance on wheels', emoji: '🚴', bgColors: ['#6366f1', '#8b5cf6', '#9333ea'] as [string,string,string], time: '30-45 minutes', unlocks: 'Cycling Pro Badge', description: 'Go for a bike ride - build cardio and leg strength while having fun!', performanceTip: 'Cyclists train cardio for hours. Even 30 mins builds serious endurance!' },
  { id: 'swim-training', title: 'Swimming Session', subtitle: 'Full body workout in water', emoji: '🏊', bgColors: ['#0891b2', '#2563eb', '#6366f1'] as [string,string,string], time: '30 minutes', unlocks: 'Swimmer Badge', description: 'Practice different strokes, work on breathing, and build endurance in the pool.', performanceTip: 'Swimming works every muscle! Great for recovery and cardio!' },
  { id: 'jump-rope', title: 'Jump Rope Challenge', subtitle: 'Cardio & coordination', emoji: '🪢', bgColors: ['#eab308', '#f97316', '#ef4444'] as [string,string,string], time: '10-15 minutes', unlocks: 'Jump Master Badge', description: 'Jump rope intervals - great for footwork, cardio, and coordination!', performanceTip: 'Boxers jump rope for 30 mins daily. Start with 2 min rounds!' },
];

export function Kids8DailyMission() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [todaysMission] = useState(missions[Math.floor(Math.random() * missions.length)]);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleComplete = async () => {
    const completed = await storage.getItem('kids8CompletedMissions');
    await storage.setItem('kids8CompletedMissions', String(parseInt(completed || '0') + 1));
    await storage.setItem('kids8LastUnlock', todaysMission.unlocks);
    navigation.navigate('Kids8SuccessCelebration');
  };

  return (
    <LinearGradient colors={todaysMission.bgColors} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Kids8TrainingDashboard')}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <Text style={styles.missionEmoji}>{todaysMission.emoji}</Text>
            <Text style={styles.missionLabel}>Today's Training</Text>
          </View>

          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>{todaysMission.title}</Text>
            <Text style={styles.missionSubtitle}>{todaysMission.subtitle}</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>⏱️ {todaysMission.time}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Training Plan</Text>
              <Text style={styles.infoText}>{todaysMission.description}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={{ fontSize: 18 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipLabel}>Pro Athlete Tip</Text>
                <Text style={styles.tipText}>{todaysMission.performanceTip}</Text>
              </View>
            </View>

            <View style={styles.unlockBox}>
              <Text style={styles.unlockLabel}>Achievement Unlock:</Text>
              <Text style={styles.unlockValue}>✨ {todaysMission.unlocks}</Text>
            </View>

            {!started ? (
              <TouchableOpacity activeOpacity={0.85} onPress={handleStart}>
                <LinearGradient colors={['#2563eb', '#0891b2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Start Training! 💪</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.85} onPress={handleComplete}>
                <LinearGradient colors={['#16a34a', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Training Complete! ✅</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.encouragement}>
            {started ? 'Push yourself! Champions train hard! 🔥' : 'Every rep makes you stronger! 💪'}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  backBtn: { position: 'absolute', top: 52, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 80, paddingHorizontal: 24, paddingBottom: 40 },
  topSection: { alignItems: 'center', marginBottom: 20 },
  missionEmoji: { fontSize: 64, marginBottom: 8 },
  missionLabel: { fontSize: 14, fontWeight: '800', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 2 },
  missionCard: { backgroundColor: 'rgba(15,23,42,0.9)', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  missionTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  missionSubtitle: { fontSize: 15, color: '#bfdbfe', textAlign: 'center', marginBottom: 12 },
  timeBadge: { backgroundColor: 'rgba(37,99,235,0.2)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'center', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', marginBottom: 16 },
  timeText: { fontSize: 13, fontWeight: '700', color: '#93c5fd' },
  infoBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, marginBottom: 12 },
  infoLabel: { fontSize: 11, fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  infoText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 19 },
  tipBox: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(234,88,12,0.15)', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(251,146,60,0.3)' },
  tipLabel: { fontSize: 12, fontWeight: '800', color: '#fb923c', marginBottom: 2 },
  tipText: { fontSize: 13, color: '#fed7aa', lineHeight: 18 },
  unlockBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(147,51,234,0.2)', borderRadius: 14, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)' },
  unlockLabel: { fontSize: 12, fontWeight: '700', color: '#c084fc' },
  unlockValue: { fontSize: 12, fontWeight: '800', color: '#fde68a' },
  actionBtn: { borderRadius: 50, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  encouragement: { textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
});
