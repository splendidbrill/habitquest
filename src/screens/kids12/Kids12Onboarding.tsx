import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ChevronRight, Zap, Target, Shield } from 'lucide-react-native';

export function Kids12Onboarding() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);

  const handleStart = async () => {
    await storage.setItem('kids12HasOnboarded', 'true');
    navigation.navigate('Kids12Today');
  };

  if (step === 1) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
            <View style={styles.iconWrap}>
              <Zap size={80} color="#a855f7" />
            </View>

            <Text style={styles.heroTitle}>Your Space</Text>
            <Text style={styles.heroSubtitle}>
              Build your vibe. Your way. No pressure.
            </Text>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(2)} style={styles.btnWrap}>
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Let's go</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (step === 2) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Here's the deal</Text>

            <View style={styles.card}>
              <View style={styles.featureRow}>
                <Shield size={28} color="#a855f7" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>100% Private</Text>
                  <Text style={styles.featureDesc}>
                    Your stuff stays yours. No sharing, no tracking who you are. Just you.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.featureRow}>
                <Target size={28} color="#22d3ee" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>You're in control</Text>
                  <Text style={styles.featureDesc}>
                    Skip anything. Change anything. This adapts to you, not the other way around.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.featureRow}>
                <Zap size={28} color="#ec4899" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Small wins, big confidence</Text>
                  <Text style={styles.featureDesc}>
                    This isn't about fixing you. You're not broken. It's about building momentum.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(3)} style={styles.btnWrap}>
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Continue</Text>
                <ChevronRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (step === 3) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>What's inside</Text>
            <Text style={styles.subtitle}>Try what fits, skip what doesn't</Text>

            <View style={styles.card}>
              <Text style={styles.featureTitle}>🎯 Quick Games</Text>
              <Text style={styles.featureDesc}>Urban Runner, Reflex challenges — dopamine hits, not time sinks</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.featureTitle}>⚡ Micro-Workouts</Text>
              <Text style={styles.featureDesc}>30-60 sec mood boosters. No equipment, no judgment.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.featureTitle}>🍎 Real Food Swaps</Text>
              <Text style={styles.featureDesc}>Not diet advice — just energy tips that actually make sense</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.featureTitle}>🔒 Private Journal</Text>
              <Text style={styles.featureDesc}>Your space. Mood tracking, gratitude, or just venting.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.featureTitle}>👤 Identity Builder</Text>
              <Text style={styles.featureDesc}>Unlock themes, titles, skins. Build your vibe.</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleStart} style={styles.btnWrap}>
              <LinearGradient
                colors={['#a855f7', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Start building</Text>
                <ChevronRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footNote}>You showed up — that counts.</Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  centerContent: { padding: 24, paddingBottom: 40, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  iconWrap: { marginBottom: 32, alignItems: 'center' },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#a855f7',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 24 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 20 },
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  featureDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  btnWrap: { width: '100%', marginTop: 8 },
  btn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  footNote: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 20 },
});
