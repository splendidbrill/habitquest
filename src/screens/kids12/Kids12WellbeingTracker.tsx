import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Moon, Smile, Heart } from 'lucide-react-native';

export function Kids12WellbeingTracker() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [happinessRating, setHappinessRating] = useState<number | null>(null);
  const [wellbeingRating, setWellbeingRating] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const hasData = sleepQuality !== null || happinessRating !== null || wellbeingRating !== null;

  const handleSave = async () => {
    if (hasData) {
      const raw = await storage.getItem('kids12WellbeingTracking');
      const tracking = raw ? JSON.parse(raw) : [];
      tracking.push({
        date: new Date().toISOString(),
        sleep: sleepQuality,
        happiness: happinessRating,
        wellbeing: wellbeingRating,
      });
      await storage.setItem('kids12WellbeingTracking', JSON.stringify(tracking));
      setSaved(true);
    }
  };

  if (saved) {
    return (
      <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.centerContent}>
            <Text style={styles.savedTitle}>Noted.</Text>
            <Text style={styles.savedSub}>You're paying attention to yourself. That matters.</Text>
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

  const renderRatingRow = (
    value: number | null,
    setter: (v: number) => void,
    low: string,
    high: string,
  ) => (
    <View>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((v) => (
          <TouchableOpacity
            key={v}
            activeOpacity={0.85}
            onPress={() => setter(v)}
            style={[styles.ratingBtn, value === v && styles.ratingBtnActive]}
          >
            <Text style={[styles.ratingBtnText, value === v && styles.ratingBtnTextActive]}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.ratingLabels}>
        <Text style={styles.ratingLabelText}>{low}</Text>
        <Text style={styles.ratingLabelText}>{high}</Text>
      </View>
    </View>
  );

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

          <Text style={styles.title}>Check in with your wellbeing</Text>
          <Text style={styles.subtitle}>Just noticing patterns can help.</Text>

          {/* Sleep */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Moon size={18} color="#a855f7" />
              <Text style={styles.sectionLabel}>How was your sleep?</Text>
            </View>
            {renderRatingRow(sleepQuality, setSleepQuality, 'Not great', 'Really good')}
          </View>

          {/* Happiness */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Smile size={18} color="#22d3ee" />
              <Text style={styles.sectionLabel}>How happy are you feeling?</Text>
            </View>
            {renderRatingRow(happinessRating, setHappinessRating, 'Low', 'High')}
          </View>

          {/* Wellbeing */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={18} color="#ec4899" />
              <Text style={styles.sectionLabel}>How are you doing overall?</Text>
            </View>
            {renderRatingRow(wellbeingRating, setWellbeingRating, 'Struggling', 'Doing well')}
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              These ratings are just for you. Over time, you might notice patterns about what helps or what doesn't.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={hasData ? 0.85 : 1}
            onPress={hasData ? handleSave : undefined}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={hasData ? ['#a855f7', '#22d3ee'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={[styles.btnText, !hasData && { color: 'rgba(255,255,255,0.3)' }]}>
                Save
              </Text>
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
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { fontSize: 14, color: '#9ca3af' },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 28 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionLabel: { fontSize: 15, color: '#ffffff' },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ratingBtnActive: { backgroundColor: '#a855f7', borderColor: '#a855f7' },
  ratingBtnText: { fontSize: 15, fontWeight: '600', color: '#9ca3af' },
  ratingBtnTextActive: { color: '#ffffff' },
  ratingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  ratingLabelText: { fontSize: 11, color: '#6b7280' },
  infoCard: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  infoText: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  btnWrap: { width: '100%' },
  btn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  savedTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  savedSub: { fontSize: 15, color: '#9ca3af', marginBottom: 32, textAlign: 'center' },
});
