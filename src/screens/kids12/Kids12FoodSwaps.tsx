import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react-native';

type FoodSwap = {
  from: string;
  to: string;
  reason: string;
  emoji: string;
};

const swaps: FoodSwap[] = [
  { from: 'Chocolate bar', to: 'Mini-bar + fruit', reason: 'Still get the treat, plus energy boost', emoji: '🍫→🍎' },
  { from: 'Crisps', to: 'Popcorn or savoury mix', reason: 'More volume, same crunch', emoji: '🥔→🍿' },
  { from: 'Energy drink', to: 'Water + piece of fruit', reason: 'No crash later, real energy', emoji: '⚡→💧' },
  { from: 'Skipping breakfast', to: 'Toast or cereal bar', reason: 'Something small > nothing', emoji: '❌→🍞' },
  { from: 'Large sugary drink', to: 'Sparkling water + squash', reason: 'Still refreshing, less sugar spike', emoji: '🥤→🫧' },
  { from: 'Sweets all at once', to: 'Sweets + save some', reason: 'You\'ll still enjoy them later', emoji: '🍬→🍬' },
];

const energyCheck = [
  { time: '9am', question: 'Did you eat breakfast?' },
  { time: '1pm', question: 'Energy level @ lunch?' },
  { time: '3pm', question: 'Did you get something fresh today?' },
  { time: 'Evening', question: 'How do you feel overall?' },
];

export function Kids12FoodSwaps() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedSwaps, setSelectedSwaps] = useState<string[]>([]);
  const [energyNotes, setEnergyNotes] = useState<{ [key: string]: string }>({});

  const toggleSwap = (swapFrom: string) => {
    if (selectedSwaps.includes(swapFrom)) {
      setSelectedSwaps(selectedSwaps.filter(s => s !== swapFrom));
    } else {
      setSelectedSwaps([...selectedSwaps, swapFrom]);
    }
  };

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

          <Text style={styles.title}>Food & Energy</Text>
          <Text style={styles.subtitle}>Realistic swaps that actually work</Text>
          <Text style={styles.subtitleSmall}>Not about restriction — about feeling good</Text>

          {/* Info block */}
          <View style={styles.infoCard}>
            <Zap size={20} color="#a855f7" style={{ marginBottom: 8 }} />
            <Text style={styles.infoText}>
              This isn't about "good" or "bad" foods. It's about noticing how different choices affect your energy, mood, and how you feel in class or after school.
            </Text>
          </View>

          {/* Swaps */}
          <Text style={styles.sectionTitle}>Try These Swaps</Text>
          <Text style={styles.sectionSubtitle}>Pick one or two to experiment with. See what works for you.</Text>

          {swaps.map((swap, index) => {
            const isSelected = selectedSwaps.includes(swap.from);
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => toggleSwap(swap.from)}
                style={[styles.swapCard, isSelected && styles.swapCardActive]}
              >
                <View style={styles.swapRow}>
                  <Text style={styles.swapEmoji}>{swap.emoji}</Text>
                  <View style={styles.swapInfo}>
                    <View style={styles.swapNameRow}>
                      <Text style={styles.swapFrom}>{swap.from}</Text>
                      <ArrowRight size={14} color="#6b7280" />
                      <Text style={styles.swapTo}>{swap.to}</Text>
                    </View>
                    <Text style={styles.swapReason}>{swap.reason}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedDot}>
                      <Zap size={12} color="#fff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Energy check */}
          <Text style={styles.sectionTitle}>Self-Check Throughout Day</Text>
          <Text style={styles.sectionSubtitle}>Quick mental notes to see what helps your energy</Text>

          {energyCheck.map((check, index) => (
            <View key={index} style={styles.checkCard}>
              <Text style={styles.checkTime}>{check.time}</Text>
              <Text style={styles.checkQuestion}>{check.question}</Text>
            </View>
          ))}

          {/* Lunch reflection */}
          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>Lunch Self-Reflection</Text>

            <Text style={styles.reflectionLabel}>Energy level @ 1pm?</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  activeOpacity={0.85}
                  onPress={() => setEnergyNotes({ ...energyNotes, 'lunch-energy': level.toString() })}
                  style={[
                    styles.ratingBtn,
                    energyNotes['lunch-energy'] === level.toString() && styles.ratingBtnActive,
                  ]}
                >
                  <Text style={[
                    styles.ratingText,
                    energyNotes['lunch-energy'] === level.toString() && styles.ratingTextActive,
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingLabels}>
              <Text style={styles.ratingLabel}>Tired</Text>
              <Text style={styles.ratingLabel}>Energised</Text>
            </View>

            <Text style={styles.reflectionLabel}>Did you get something fresh?</Text>
            <View style={styles.freshRow}>
              {['Yes', 'No', 'Trying tomorrow'].map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  onPress={() => setEnergyNotes({ ...energyNotes, 'lunch-fresh': option })}
                  style={[
                    styles.freshBtn,
                    energyNotes['lunch-fresh'] === option && styles.freshBtnActive,
                  ]}
                >
                  <Text style={[
                    styles.freshBtnText,
                    energyNotes['lunch-fresh'] === option && styles.freshBtnTextActive,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.footNote}>
            This is about experimenting and learning what works for YOUR body and YOUR schedule. Not copying what someone else does.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  topHeader: { marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: 36, fontWeight: '800', color: '#a855f7', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 2 },
  subtitleSmall: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  infoCard: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  infoText: { fontSize: 13, color: '#d1d5db', lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: '#9ca3af', marginBottom: 14 },
  swapCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  swapCardActive: { borderColor: 'rgba(34,211,238,0.4)', backgroundColor: 'rgba(34,211,238,0.05)' },
  swapRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  swapEmoji: { fontSize: 28, marginTop: 2 },
  swapInfo: { flex: 1 },
  swapNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  swapFrom: { fontSize: 13, color: '#9ca3af' },
  swapTo: { fontSize: 13, color: '#ffffff', fontWeight: '600' },
  swapReason: { fontSize: 11, color: '#6b7280' },
  selectedDot: { backgroundColor: '#22d3ee', borderRadius: 12, padding: 4 },
  checkCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  checkTime: { fontSize: 11, fontWeight: '700', color: '#a855f7', marginBottom: 2 },
  checkQuestion: { fontSize: 13, color: '#d1d5db' },
  reflectionCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  reflectionTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  reflectionLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  ratingBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ratingBtnActive: { backgroundColor: '#22d3ee' },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  ratingTextActive: { color: '#ffffff' },
  ratingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  ratingLabel: { fontSize: 10, color: '#6b7280' },
  freshRow: { flexDirection: 'row', gap: 6 },
  freshBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  freshBtnActive: { backgroundColor: '#a855f7' },
  freshBtnText: { fontSize: 11, fontWeight: '600', color: '#9ca3af' },
  freshBtnTextActive: { color: '#ffffff' },
  footNote: { fontSize: 11, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
});
