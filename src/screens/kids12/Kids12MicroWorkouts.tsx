import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Zap, Check } from 'lucide-react-native';

type Exercise = { name: string; duration: number; icon: string };
type Workout = {
  id: string;
  name: string;
  mood: string;
  duration: number;
  exercises: Exercise[];
  colors: [string, string];
};

const workouts: Workout[] = [
  {
    id: 'de-stress',
    name: 'De-stress Reset',
    mood: 'Overwhelmed or tense',
    duration: 30,
    exercises: [
      { name: 'Deep breathing', duration: 10, icon: '🌬️' },
      { name: 'Shoulder rolls', duration: 10, icon: '💆' },
      { name: 'Gentle stretch', duration: 10, icon: '🧘' },
    ],
    colors: ['#a855f7', '#9333ea'],
  },
  {
    id: 'power-up',
    name: 'Power-Up Warm-Up',
    mood: 'Need energy boost',
    duration: 60,
    exercises: [
      { name: 'Jumping jacks', duration: 15, icon: '🏃' },
      { name: 'High knees', duration: 15, icon: '🦵' },
      { name: 'Arm circles', duration: 15, icon: '💪' },
      { name: 'Quick march', duration: 15, icon: '🚶' },
    ],
    colors: ['#22d3ee', '#0891b2'],
  },
  {
    id: 'after-school',
    name: 'After-School Recharge',
    mood: 'Mentally tired',
    duration: 45,
    exercises: [
      { name: 'Shake it out', duration: 10, icon: '🤸' },
      { name: 'Cat-cow stretch', duration: 15, icon: '🐱' },
      { name: 'Walk in place', duration: 20, icon: '👟' },
    ],
    colors: ['#ec4899', '#be185d'],
  },
  {
    id: 'confidence',
    name: 'Confidence Builder',
    mood: 'Building strength',
    duration: 60,
    exercises: [
      { name: 'Power stance', duration: 15, icon: '🦸' },
      { name: 'Wall push-ups', duration: 15, icon: '💥' },
      { name: 'Squats', duration: 15, icon: '🏋️' },
      { name: 'Plank hold', duration: 15, icon: '🔥' },
    ],
    colors: ['#3b82f6', '#1d4ed8'],
  },
];

export function Kids12MicroWorkouts() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completionCounts, setCompletionCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    storage.getItem('kids12MicroWorkoutCompletions').then(raw => {
      if (raw) setCompletionCounts(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    if (!isActive || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isActive]);

  useEffect(() => {
    if (isActive && countdown === 0 && selectedWorkout) {
      if (currentExercise < selectedWorkout.exercises.length - 1) {
        const next = currentExercise + 1;
        setCurrentExercise(next);
        setCountdown(selectedWorkout.exercises[next].duration);
      } else {
        finishWorkout();
      }
    }
  }, [countdown, isActive]);

  const finishWorkout = async () => {
    if (!selectedWorkout) return;
    setIsActive(false);
    setCompleted(true);
    const xpRaw = await storage.getItem('kids12PlayerXP');
    const xp = parseInt(xpRaw || '0');
    await storage.setItem('kids12PlayerXP', (xp + selectedWorkout.duration).toString());
    const raw = await storage.getItem('kids12MicroWorkoutCompletions');
    const counts: { [k: string]: number } = raw ? JSON.parse(raw) : {};
    counts[selectedWorkout.id] = (counts[selectedWorkout.id] || 0) + 1;
    await storage.setItem('kids12MicroWorkoutCompletions', JSON.stringify(counts));
    setCompletionCounts(counts);
  };

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExercise(0);
    setCountdown(workout.exercises[0].duration);
    setIsActive(true);
    setCompleted(false);
  };

  const resetWorkout = () => {
    setSelectedWorkout(null);
    setCurrentExercise(0);
    setCountdown(0);
    setIsActive(false);
    setCompleted(false);
  };

  const skipExercise = () => {
    if (!selectedWorkout) return;
    if (currentExercise < selectedWorkout.exercises.length - 1) {
      const next = currentExercise + 1;
      setCurrentExercise(next);
      setCountdown(selectedWorkout.exercises[next].duration);
    } else {
      finishWorkout();
    }
  };

  if (completed && selectedWorkout) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Check size={64} color="#22c55e" />
            <Text style={styles.completedTitle}>You showed up!</Text>
            <Text style={styles.completedSub}>That's how athletes stay balanced.</Text>
            <View style={styles.completedCard}>
              <Text style={styles.completedLabel}>Completed</Text>
              <Text style={styles.completedName}>{selectedWorkout.name}</Text>
              <Text style={styles.completedDuration}>{selectedWorkout.duration} seconds</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity activeOpacity={0.85} onPress={resetWorkout} style={styles.flex1}>
                <LinearGradient
                  colors={['#22c55e', '#22d3ee']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Do Another</Text>
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

  if (selectedWorkout && isActive) {
    const exercise = selectedWorkout.exercises[currentExercise];
    const progress = ((currentExercise + 1) / selectedWorkout.exercises.length) * 100;
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.activeContent}>
            {/* Progress bar */}
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
              </View>
              <Text style={styles.progressLabel}>
                Exercise {currentExercise + 1} of {selectedWorkout.exercises.length}
              </Text>
            </View>

            <View style={styles.exerciseCenter}>
              <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={[styles.countdownText, countdown <= 3 && { color: '#ef4444' }]}>
                {countdown}
              </Text>
              <Text style={styles.exerciseHint}>Keep going — you're doing great</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={skipExercise}
              style={styles.skipBtn}
            >
              <Text style={styles.skipBtnText}>Skip Exercise</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Level Up Your Day</Text>
          <Text style={styles.subtitle}>30–60 second mood-based missions</Text>
          <Text style={styles.subtitleSmall}>Pick what fits right now</Text>

          {workouts.map((workout, index) => {
            const times = completionCounts[workout.id] || 0;
            return (
              <TouchableOpacity
                key={workout.id}
                activeOpacity={0.85}
                onPress={() => startWorkout(workout)}
                style={styles.workoutCard}
              >
                <LinearGradient
                  colors={workout.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.workoutTopBar}
                />
                <View style={styles.workoutBody}>
                  <View style={styles.workoutHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutMood}>{workout.mood}</Text>
                      <View style={styles.workoutDurationRow}>
                        <Zap size={13} color="#22d3ee" />
                        <Text style={styles.workoutDuration}>{workout.duration} seconds</Text>
                      </View>
                    </View>
                    {times > 0 && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>✓ {times}x</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.exerciseIconsRow}>
                    {workout.exercises.map((ex, i) => (
                      <Text key={i} style={styles.exerciseIconSmall}>{ex.icon}</Text>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  activeContent: { flex: 1, padding: 24 },
  topHeader: { marginBottom: 16 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: 36, fontWeight: '800', color: '#a855f7', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 2 },
  subtitleSmall: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  workoutCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  workoutTopBar: { height: 4 },
  workoutBody: { padding: 18 },
  workoutHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  workoutName: { fontSize: 19, fontWeight: '800', color: '#ffffff', marginBottom: 2 },
  workoutMood: { fontSize: 13, color: '#9ca3af', marginBottom: 6 },
  workoutDurationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workoutDuration: { fontSize: 12, color: '#9ca3af' },
  completedBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completedBadgeText: { fontSize: 11, color: '#22c55e', fontWeight: '700' },
  exerciseIconsRow: { flexDirection: 'row', gap: 8 },
  exerciseIconSmall: { fontSize: 18 },
  // Active workout
  progressWrap: { marginBottom: 16 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  exerciseCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  exerciseIcon: { fontSize: 80, marginBottom: 16 },
  exerciseName: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 16, textAlign: 'center' },
  countdownText: { fontSize: 72, fontWeight: '800', color: '#22d3ee', marginBottom: 16 },
  exerciseHint: { fontSize: 15, color: '#9ca3af' },
  skipBtn: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipBtnText: { fontSize: 15, fontWeight: '600', color: '#9ca3af' },
  // Completed
  completedTitle: { fontSize: 28, fontWeight: '800', color: '#22c55e', marginTop: 16, marginBottom: 8 },
  completedSub: { fontSize: 15, color: '#9ca3af', marginBottom: 20, textAlign: 'center' },
  completedCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    alignItems: 'center',
  },
  completedLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 6 },
  completedName: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  completedDuration: { fontSize: 13, color: '#9ca3af' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  flex1: { flex: 1 },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
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
