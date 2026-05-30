import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { Trophy, Target, Zap, ChevronRight } from 'lucide-react-native';

const sports = [
  { id: 'football', emoji: '⚽', name: 'Football' },
  { id: 'cricket', emoji: '🏏', name: 'Cricket' },
  { id: 'basketball', emoji: '🏀', name: 'Basketball' },
  { id: 'running', emoji: '🏃', name: 'Running' },
  { id: 'cycling', emoji: '🚴', name: 'Cycling' },
  { id: 'swimming', emoji: '🏊', name: 'Swimming' },
];

export function Kids8AthleteOnboarding() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');

  const handleStart = async () => {
    if (name && sport) {
      await storage.setItem('kids8UserName', name);
      await storage.setItem('kids8UserSport', sport);
      await storage.setItem('kids8FamilyPoints', '0');
      await storage.setItem('kids8CurrentStreak', '1');
      await storage.setItem('kids8LastActiveDate', new Date().toDateString());
      navigation.navigate('Kids8TrainingDashboard');
    }
  };

  if (step === 1) {
    return (
      <LinearGradient colors={['#0f172a', '#1e3a8a', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.heroEmoji}>🏆</Text>
            <Text style={styles.title}>Welcome, Athlete!</Text>
            <Text style={styles.subtitle}>
              Ready to train like a pro? This is your personal sports performance tracker!
            </Text>

            <View style={styles.card}>
              <View style={styles.featureRow}>
                <Target size={24} color="#60a5fa" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Daily Missions</Text>
                  <Text style={styles.featureDesc}>Complete training challenges every day</Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <Zap size={24} color="#facc15" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Fuel Like a Pro</Text>
                  <Text style={styles.featureDesc}>Learn what athletes eat to perform their best</Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <Trophy size={24} color="#c084fc" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Earn Achievements</Text>
                  <Text style={styles.featureDesc}>Unlock badges and level up your status</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(2)} style={styles.btnWrap}>
              <LinearGradient colors={['#2563eb', '#0891b2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                <Text style={styles.btnText}>Let's Start! </Text>
                <ChevronRight size={22} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (step === 2) {
    return (
      <LinearGradient colors={['#0f172a', '#1e3a8a', '#0f172a']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.heroEmoji}>👋</Text>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>We'll use this to personalize your training</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => name && setStep(3)}
              disabled={!name}
              style={styles.btnWrap}
            >
              <LinearGradient
                colors={name ? ['#2563eb', '#0891b2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={[styles.btnText, !name && styles.btnTextDisabled]}>Continue</Text>
                <ChevronRight size={22} color={name ? '#fff' : 'rgba(255,255,255,0.4)'} />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e3a8a', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.heroEmoji, { textAlign: 'center' }]}>⚽</Text>
          <Text style={[styles.title, { textAlign: 'center' }]}>What's your favorite sport?</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>We'll tailor your training to your goals</Text>

          <View style={styles.sportsGrid}>
            {sports.map(s => (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.85}
                onPress={() => setSport(s.id)}
                style={styles.sportBtnWrap}
              >
                <LinearGradient
                  colors={sport === s.id ? ['#2563eb', '#0891b2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                  style={styles.sportBtn}
                >
                  <Text style={styles.sportEmoji}>{s.emoji}</Text>
                  <Text style={styles.sportName}>{s.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStart}
            disabled={!sport}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={sport ? ['#16a34a', '#059669'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={[styles.btnText, !sport && styles.btnTextDisabled]}>Start Training! 💪</Text>
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
  content: { padding: 24, paddingBottom: 40 },
  centerContent: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  heroEmoji: { fontSize: 80, marginBottom: 16, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 17, color: '#bfdbfe', marginBottom: 28, textAlign: 'center', lineHeight: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 2 },
  featureDesc: { fontSize: 13, color: '#bfdbfe' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 50,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
    width: '100%',
  },
  btnWrap: { width: '100%' },
  btn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnText: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  btnTextDisabled: { color: 'rgba(255,255,255,0.4)' },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  sportBtnWrap: { width: '46%' },
  sportBtn: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  sportEmoji: { fontSize: 44, marginBottom: 8 },
  sportName: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});
