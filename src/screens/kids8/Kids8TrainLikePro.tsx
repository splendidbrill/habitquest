import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Play, Timer, Zap } from 'lucide-react-native';

interface Exercise { name: string; duration: number; description: string; emoji: string; }
interface Workout { id: string; name: string; subtitle: string; athlete: string; duration: number; emoji: string; colors: [string,string]; exercises: Exercise[]; }

const workouts: Workout[] = [
  { id: 'winger-warmup', name: 'Winger Warm-Up', subtitle: 'Speed & Agility', athlete: 'Footballers use this before matches', duration: 60, emoji: '⚽', colors: ['#16a34a', '#059669'], exercises: [{ name: 'High Knees', duration: 15, description: 'Run in place, knees high', emoji: '🏃' }, { name: 'Side Shuffles', duration: 15, description: 'Quick side-to-side steps', emoji: '↔️' }, { name: 'Butt Kicks', duration: 15, description: 'Kick heels to glutes', emoji: '🦵' }, { name: 'Arm Circles', duration: 15, description: 'Big arm rotations', emoji: '💪' }] },
  { id: 'boxer-footwork', name: 'Boxer Footwork', subtitle: 'Balance & Coordination', athlete: 'This is how boxers train reflexes', duration: 60, emoji: '🥊', colors: ['#ef4444', '#f43f5e'], exercises: [{ name: 'Quick Feet', duration: 15, description: 'Light, fast steps on toes', emoji: '👣' }, { name: 'Shadow Boxing', duration: 15, description: 'Punch combinations in the air', emoji: '🥊' }, { name: 'Lateral Hops', duration: 15, description: 'Jump side to side', emoji: '↔️' }, { name: 'Skip Rope (Air)', duration: 15, description: 'Pretend to skip rope', emoji: '➰' }] },
  { id: 'basketball-jump', name: 'Basketball Jump Set', subtitle: 'Explosive Power', athlete: 'NBA players do this before games', duration: 60, emoji: '🏀', colors: ['#ea580c', '#d97706'], exercises: [{ name: 'Jump Squats', duration: 15, description: 'Squat then explode upward', emoji: '⬆️' }, { name: 'Lateral Lunges', duration: 15, description: 'Lunge to the side', emoji: '↔️' }, { name: 'Ankle Bounces', duration: 15, description: 'Quick, small jumps', emoji: '⚡' }, { name: 'Reach Jumps', duration: 15, description: 'Jump and reach for the sky', emoji: '🌟' }] },
  { id: 'swimmer-stretch', name: "Swimmer's Stretch", subtitle: 'Flexibility & Core', athlete: 'Swimmers prepare shoulders like this', duration: 60, emoji: '🏊', colors: ['#0891b2', '#2563eb'], exercises: [{ name: 'Arm Swings', duration: 15, description: 'Swing arms in circles', emoji: '💪' }, { name: 'Torso Twists', duration: 15, description: 'Rotate your upper body', emoji: '🔄' }, { name: 'Leg Swings', duration: 15, description: 'Swing legs forward and back', emoji: '🦵' }, { name: 'Standing Pike', duration: 15, description: 'Reach down to your toes', emoji: '🤸' }] },
  { id: 'sprinter-power', name: 'Sprinter Power-Up', subtitle: 'Acceleration & Speed', athlete: 'This is how sprinters warm up', duration: 60, emoji: '🏃', colors: ['#2563eb', '#9333ea'], exercises: [{ name: 'A-Skips', duration: 15, description: 'Skip with high knees', emoji: '⬆️' }, { name: 'Power Steps', duration: 15, description: 'Explosive running motion', emoji: '💥' }, { name: 'Ankle Hops', duration: 15, description: 'Quick bounces on toes', emoji: '⚡' }, { name: 'Drive Steps', duration: 15, description: 'Push forward powerfully', emoji: '🚀' }] },
  { id: 'tennis-agility', name: 'Tennis Agility', subtitle: 'Court Movement', athlete: 'Pro tennis players use these drills', duration: 60, emoji: '🎾', colors: ['#ca8a04', '#65a30d'], exercises: [{ name: 'Split Steps', duration: 15, description: 'Quick ready position hops', emoji: '👟' }, { name: 'Crossover Steps', duration: 15, description: 'Step across your body', emoji: '↔️' }, { name: 'Quick Pivots', duration: 15, description: 'Turn fast on one foot', emoji: '🔄' }, { name: 'Forward Lunges', duration: 15, description: 'Big steps forward', emoji: '➡️' }] },
];

export function Kids8TrainLikePro() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutState, setWorkoutState] = useState<'ready' | 'active' | 'complete'>('ready');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (workoutState === 'active' && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (workoutState === 'active' && timeLeft === 0 && selectedWorkout) {
      if (currentExercise < selectedWorkout.exercises.length - 1) {
        const next = currentExercise + 1;
        setCurrentExercise(next);
        setTimeLeft(selectedWorkout.exercises[next].duration);
      } else {
        completeWorkout();
      }
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [workoutState, timeLeft, isPaused, currentExercise]);

  const beginWorkout = () => {
    if (!selectedWorkout) return;
    setWorkoutState('active');
    setCurrentExercise(0);
    setTimeLeft(selectedWorkout.exercises[0].duration);
    setIsPaused(false);
  };

  const completeWorkout = async () => {
    setWorkoutState('complete');
    if (selectedWorkout) {
      const current = await storage.getItem('kids8UserXP');
      await storage.setItem('kids8UserXP', String(parseInt(current || '0') + selectedWorkout.duration));
    }
  };

  if (!selectedWorkout) {
    return (
      <LinearGradient colors={['#0f172a', '#3b0764', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Train Like a Pro</Text>
              <View style={{ width: 44 }} />
            </View>

            <LinearGradient colors={['#9333ea', '#db2777']} style={styles.infoCard}>
              <Text style={{ fontSize: 44, marginRight: 12 }}>💪</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Professional Workouts</Text>
                <Text style={styles.infoText}>60-second guided workouts based on how elite athletes train. Build strength, speed, and coordination.</Text>
              </View>
            </LinearGradient>

            {workouts.map(workout => (
              <TouchableOpacity key={workout.id} activeOpacity={0.85} onPress={() => { setSelectedWorkout(workout); setWorkoutState('ready'); }} style={{ marginBottom: 12 }}>
                <LinearGradient colors={workout.colors} style={styles.workoutCard}>
                  <View style={styles.workoutCardTop}>
                    <Text style={{ fontSize: 44, marginRight: 12 }}>{workout.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutSub}>{workout.subtitle}</Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Timer size={14} color="#fff" />
                      <Text style={styles.durationText}>{workout.duration}s</Text>
                    </View>
                  </View>
                  <Text style={styles.workoutRef}>💡 {workout.athlete}</Text>
                  <View style={styles.exerciseTags}>
                    {workout.exercises.map(ex => (
                      <View key={ex.name} style={styles.exerciseTag}>
                        <Text style={styles.exerciseTagText}>{ex.emoji} {ex.name}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (workoutState === 'ready') {
    return (
      <LinearGradient colors={selectedWorkout.colors} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedWorkout(null)} style={styles.backBtnLight}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>{selectedWorkout.name}</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.readyCard}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>{selectedWorkout.emoji}</Text>
              <Text style={styles.readyTitle}>Ready to Train?</Text>
              <Text style={styles.readyAthleteText}>{selectedWorkout.athlete}</Text>
              <View style={styles.totalTimeBox}>
                <Text style={styles.totalTimeLabel}>TOTAL TIME</Text>
                <Text style={styles.totalTimeVal}>{selectedWorkout.duration}s</Text>
              </View>
            </View>

            <View style={styles.planCard}>
              <Text style={styles.planTitle}>Workout Plan</Text>
              {selectedWorkout.exercises.map((ex, i) => (
                <View key={i} style={styles.planRow}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>{ex.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planExName}>{ex.name}</Text>
                    <Text style={styles.planExDesc}>{ex.description}</Text>
                  </View>
                  <View style={styles.exTimeBadge}><Text style={styles.exTimeText}>{ex.duration}s</Text></View>
                </View>
              ))}
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={beginWorkout} style={styles.startBtn}>
              <Play size={24} color="#0f172a" />
              <Text style={styles.startBtnText}>Start Workout</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (workoutState === 'complete') {
    return (
      <LinearGradient colors={['#0f172a', '#064e3b', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.completeContent}>
            <LinearGradient colors={['#16a34a', '#059669']} style={styles.completeCard}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>🏆</Text>
              <Text style={styles.completeTitle}>Workout Complete!</Text>
              <Text style={styles.completeSub}>Nice work — that's consistency. Pro athletes build habits like this.</Text>
              <View style={styles.completeStats}>
                <Text style={styles.completeLabel}>EXERCISES COMPLETED</Text>
                <Text style={styles.completeNum}>{selectedWorkout?.exercises.length}</Text>
                <Text style={styles.completeXpLabel}>XP EARNED</Text>
                <Text style={styles.completeXp}>+{selectedWorkout?.duration} XP</Text>
              </View>
              <View style={styles.completeBtns}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => { setSelectedWorkout(null); setWorkoutState('ready'); }} style={styles.moreBtn}>
                  <Text style={styles.moreBtnText}>More Workouts</Text>
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

  // Active workout
  const exercise = selectedWorkout.exercises[currentExercise];
  const progress = ((currentExercise + (1 - timeLeft / exercise.duration)) / selectedWorkout.exercises.length) * 100;

  return (
    <LinearGradient colors={selectedWorkout.colors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.activeProgressBar}>
          <View style={[styles.activeProgressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.activeHeader}>
          <View style={styles.activeStatPill}><Text style={styles.activeStatText}>{currentExercise + 1}/{selectedWorkout.exercises.length}</Text></View>
          <View style={styles.activeStatPill}>
            <Timer size={18} color="#fff" />
            <Text style={[styles.activeStatText, { fontSize: 22 }]}>{timeLeft}s</Text>
          </View>
        </View>

        <View style={styles.activeContent}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>{exercise.emoji}</Text>
          <Text style={styles.activeExName}>{exercise.name}</Text>
          <Text style={styles.activeExDesc}>{exercise.description}</Text>
          {currentExercise < selectedWorkout.exercises.length - 1 && (
            <View style={styles.nextBox}>
              <Text style={styles.nextLabel}>UP NEXT</Text>
              <Text style={styles.nextName}>{selectedWorkout.exercises[currentExercise + 1].emoji} {selectedWorkout.exercises[currentExercise + 1].name}</Text>
            </View>
          )}
        </View>

        <View style={styles.activeBtns}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsPaused(!isPaused)} style={styles.pauseBtn}>
            <Text style={styles.pauseBtnText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={completeWorkout} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>
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
  backBtnLight: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  infoTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#f5d0fe', lineHeight: 17 },
  workoutCard: { borderRadius: 20, padding: 18 },
  workoutCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  workoutName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  workoutSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingHorizontal: 8, paddingVertical: 4 },
  durationText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  workoutRef: { fontSize: 11, color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 10, alignSelf: 'flex-start' },
  exerciseTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  exerciseTag: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  exerciseTagText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  readyCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  readyTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  readyAthleteText: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 16 },
  totalTimeBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 14, alignItems: 'center' },
  totalTimeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '800', marginBottom: 2 },
  totalTimeVal: { fontSize: 36, fontWeight: '800', color: '#fff' },
  planCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  planTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
  planRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 8 },
  planExName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  planExDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  exTimeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingHorizontal: 8, paddingVertical: 4 },
  exTimeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  startBtn: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startBtnText: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  completeContent: { flex: 1, justifyContent: 'center', padding: 24 },
  completeCard: { borderRadius: 24, padding: 28, alignItems: 'center' },
  completeTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  completeSub: { fontSize: 14, color: '#bbf7d0', textAlign: 'center', marginBottom: 16 },
  completeStats: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 20, alignItems: 'center', width: '100%', marginBottom: 16 },
  completeLabel: { fontSize: 11, color: '#fde68a', fontWeight: '800', marginBottom: 4 },
  completeNum: { fontSize: 44, fontWeight: '800', color: '#fff', marginBottom: 8 },
  completeXpLabel: { fontSize: 11, color: '#93c5fd', fontWeight: '800', marginBottom: 4 },
  completeXp: { fontSize: 22, fontWeight: '800', color: '#fff' },
  completeBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  moreBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  moreBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  dashBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  dashBtnText: { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  activeProgressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', position: 'absolute', top: 0, left: 0, right: 0 },
  activeProgressFill: { height: '100%', backgroundColor: '#fff' },
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 12, marginTop: 4 },
  activeStatPill: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  activeStatText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  activeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  activeExName: { fontSize: 36, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  activeExDesc: { fontSize: 20, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 24 },
  nextBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  nextLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '800', marginBottom: 4 },
  nextName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  activeBtns: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 32 },
  pauseBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, borderWidth: 2, borderColor: '#fff' },
  pauseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  skipBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, borderWidth: 2, borderColor: '#fff' },
  skipBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
