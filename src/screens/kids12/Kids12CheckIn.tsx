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

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', colors: ['#eab308', '#f97316'] as [string, string] },
  { id: 'tired', emoji: '😴', label: 'Tired', colors: ['#3b82f6', '#4f46e5'] as [string, string] },
  { id: 'stressed', emoji: '😰', label: 'Stressed', colors: ['#ef4444', '#ec4899'] as [string, string] },
  { id: 'calm', emoji: '😌', label: 'Calm', colors: ['#22c55e', '#14b8a6'] as [string, string] },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', colors: ['#f97316', '#ef4444'] as [string, string] },
  { id: 'okay', emoji: '😐', label: 'Just okay', colors: ['#6b7280', '#4b5563'] as [string, string] },
];

const copingOptions = [
  { id: 'micro-workout', title: 'Quick movement', subtitle: '30-60 seconds of energy', screen: 'Kids12MicroWorkouts' as keyof RootStackParamList },
  { id: 'game', title: 'Play a game', subtitle: 'Quick dopamine hit', screen: 'Kids12UrbanRunner' as keyof RootStackParamList },
  { id: 'breathe', title: 'Breathing exercise', subtitle: 'Reset your system', screen: 'Kids12Reflection' as keyof RootStackParamList },
  { id: 'walk', title: 'Go for a walk', subtitle: 'Music or silence, your call', screen: 'Kids12Movement' as keyof RootStackParamList },
  { id: 'journal', title: 'Write it out', subtitle: 'Private space, no judgment', screen: 'Kids12Reflection' as keyof RootStackParamList },
  { id: 'rest', title: 'Just rest', subtitle: 'Sometimes that\'s the right move', screen: 'Kids12Today' as keyof RootStackParamList },
];

export function Kids12CheckIn() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCoping, setShowCoping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowCoping(true);
  };

  const handleCopingSelect = async (copingId: string) => {
    await storage.setItem('kids12LastCheckIn', new Date().toDateString());

    const streakRaw = await storage.getItem('kids12CurrentStreak');
    const currentStreak = parseInt(streakRaw || '0');
    const lastCheckIn = await storage.getItem('kids12LastCheckIn');
    if (lastCheckIn !== new Date().toDateString()) {
      await storage.setItem('kids12CurrentStreak', String(currentStreak + 1));
    }

    const raw = await storage.getItem('kids12MoodHistory');
    const moodHistory = raw ? JSON.parse(raw) : [];
    moodHistory.push({
      date: new Date().toISOString(),
      mood: selectedMood,
      coping: copingId,
    });
    await storage.setItem('kids12MoodHistory', JSON.stringify(moodHistory));
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <View style={styles.completePulse}>
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completePulseGrad}
              />
            </View>
            <Text style={styles.completeTitle}>That counted.</Text>
            <Text style={styles.completeSub}>Checking in with yourself matters.</Text>
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

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
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

          {!showCoping ? (
            <View>
              <Text style={styles.title}>How are you feeling?</Text>
              <Text style={styles.subtitle}>No right or wrong answer. Just you.</Text>
              <View style={styles.moodGrid}>
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    activeOpacity={0.85}
                    onPress={() => handleMoodSelect(mood.id)}
                    style={styles.moodBtnWrap}
                  >
                    <LinearGradient colors={mood.colors} style={styles.moodBtn}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>What might help?</Text>
              <Text style={styles.subtitle}>Or nothing. That's fine too.</Text>
              {copingOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.85}
                  onPress={() => handleCopingSelect(option.id)}
                  style={styles.copingCard}
                >
                  <Text style={styles.copingTitle}>{option.title}</Text>
                  <Text style={styles.copingSub}>{option.subtitle}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsComplete(true)}
                style={styles.selfBtn}
              >
                <Text style={styles.selfBtnText}>I'll figure it out myself</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { fontSize: 14, color: '#9ca3af' },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 24 },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodBtnWrap: { width: '47%' },
  moodBtn: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  moodEmoji: { fontSize: 36, marginBottom: 10 },
  moodLabel: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
  copingCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  copingTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  copingSub: { fontSize: 13, color: '#9ca3af' },
  selfBtn: { paddingVertical: 16, alignItems: 'center' },
  selfBtnText: { fontSize: 13, color: '#6b7280' },
  completePulse: { marginBottom: 24, alignItems: 'center' },
  completePulseGrad: { width: 64, height: 64, borderRadius: 32 },
  completeTitle: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  completeSub: { fontSize: 15, color: '#9ca3af', marginBottom: 32, textAlign: 'center' },
  btnWrap: { width: '100%' },
  btn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
});
