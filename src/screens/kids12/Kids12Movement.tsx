import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Play, Check } from 'lucide-react-native';

const movementOptions = [
  { id: 'stretch', title: 'Stretch', subtitle: '5-10 minutes of gentle stretching', duration: 5 },
  { id: 'walk-music', title: 'Walk with music', subtitle: 'As long as you want', duration: 15 },
  { id: 'dance', title: 'Dance alone', subtitle: 'Your room, your moves', duration: 10 },
  { id: 'yoga', title: 'Gentle yoga', subtitle: 'Follow along or just do what feels good', duration: 10 },
  { id: 'rest', title: 'Rest day', subtitle: 'Recovery is part of progress', duration: 0 },
];

export function Kids12Movement() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSelect = (activityId: string) => {
    setSelectedActivity(activityId);
    const activity = movementOptions.find(a => a.id === activityId);
    if (activity && activity.duration > 0) {
      setTimer(activity.duration * 60);
    } else {
      setTimer(null);
    }
  };

  const handleStart = () => {
    setIsTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev !== null && prev > 0) return prev - 1;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTimerRunning(false);
        return 0;
      });
    }, 1000);
  };

  const handleComplete = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const raw = await storage.getItem('kids12MovementHistory');
    const movementHistory = raw ? JSON.parse(raw) : [];
    movementHistory.push({
      date: new Date().toISOString(),
      activity: selectedActivity,
    });
    await storage.setItem('kids12MovementHistory', JSON.stringify(movementHistory));
    setIsComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Check size={64} color="#22d3ee" />
            <Text style={styles.completeTitle}>That counts.</Text>
            <Text style={styles.completeSub}>You showed up for yourself today.</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.btnWrap}
            >
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Back to today</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (selectedActivity && timer !== null) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <View style={styles.topHeader}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedActivity(null)}
                style={styles.backBtn}
              >
                <ArrowLeft size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.timerCenter}>
              <Text style={styles.timerActivityName}>
                {movementOptions.find(a => a.id === selectedActivity)?.title}
              </Text>
              <Text style={styles.timerDisplay}>{formatTime(timer)}</Text>
              {!isTimerRunning && timer > 0 ? (
                <TouchableOpacity activeOpacity={0.85} onPress={handleStart} style={styles.startBtn}>
                  <LinearGradient
                    colors={['#a855f7', '#22d3ee']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startBtnGrad}
                  >
                    <Play size={20} color="#fff" />
                    <Text style={styles.btnText}>Start</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : timer === 0 ? (
                <TouchableOpacity activeOpacity={0.85} onPress={handleComplete} style={styles.startBtn}>
                  <LinearGradient
                    colors={['#a855f7', '#22d3ee']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startBtnGrad}
                  >
                    <Text style={styles.btnText}>Done</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerRunningHint}>Take your time. No rush.</Text>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleComplete}
              style={styles.noTimerBtn}
            >
              <Text style={styles.noTimerText}>I'll do this without the timer</Text>
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
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Pick what feels right today</Text>
          <Text style={styles.subtitle}>Movement is for you, not anyone else.</Text>

          {movementOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.85}
              onPress={() => handleSelect(option.id)}
              style={styles.optionCard}
            >
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSub}>{option.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40, flex: 1 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { fontSize: 14, color: '#9ca3af' },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 24 },
  optionCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionTitle: { fontSize: 17, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  optionSub: { fontSize: 13, color: '#9ca3af' },
  timerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  timerActivityName: { fontSize: 20, fontWeight: '600', color: '#ffffff', marginBottom: 24 },
  timerDisplay: { fontSize: 72, fontWeight: '300', color: '#ffffff', marginBottom: 32 },
  timerRunningHint: { fontSize: 14, color: '#9ca3af' },
  startBtn: { width: '70%' },
  startBtnGrad: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  noTimerBtn: { alignItems: 'center', paddingVertical: 16 },
  noTimerText: { fontSize: 13, color: '#6b7280' },
  completeTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center', marginTop: 20 },
  completeSub: { fontSize: 15, color: '#9ca3af', marginBottom: 32, textAlign: 'center' },
  btnWrap: { width: '100%' },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
});
