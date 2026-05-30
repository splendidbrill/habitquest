import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Info, Heart } from 'lucide-react-native';

const eatingPrinciples = [
  {
    title: 'Listen to your body',
    description: 'Eat when you\'re hungry, stop when you\'re comfortable. Your body knows what it needs.',
    icon: '👂',
  },
  {
    title: 'All foods fit',
    description: 'No food is \'bad\'. Balance and variety matter more than restriction.',
    icon: '🍽️',
  },
  {
    title: 'Eat with others when you can',
    description: 'Food is social. Sharing meals can be as important as what you eat.',
    icon: '👥',
  },
  {
    title: 'Notice how food makes you feel',
    description: 'Some foods give you energy, some make you sleepy. Pay attention.',
    icon: '💭',
  },
];

const simpleHabits = [
  'Drink water when you\'re thirsty',
  'Try to eat breakfast most days',
  'Include vegetables you actually like',
  'Don\'t skip meals to \'make up\' for eating',
  'Eat slowly enough to taste your food',
  'Keep some healthy snacks handy',
];

const redFlags = [
  'Skipping meals regularly',
  'Exercising to \'burn off\' food',
  'Feeling anxious about eating with others',
  'Comparing what you eat to others',
  'Restricting certain food groups completely',
];

export function Kids12HealthyEating() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = async (habit: string) => {
    const newHabits = selectedHabits.includes(habit)
      ? selectedHabits.filter(h => h !== habit)
      : [...selectedHabits, habit];
    setSelectedHabits(newHabits);
    await storage.setItem('kids12EatingHabits', JSON.stringify(newHabits));
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

          <Text style={styles.title}>Food & eating</Text>
          <Text style={styles.subtitle}>No rules, no restrictions. Just what actually helps.</Text>

          {/* Important note */}
          <View style={styles.noteCard}>
            <Info size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
            <Text style={styles.noteText}>
              This isn't about losing weight or looking different. It's about feeling good and having energy for your life.
            </Text>
          </View>

          {/* Principles */}
          <Text style={styles.sectionTitle}>Basic principles</Text>
          {eatingPrinciples.map((principle, index) => (
            <View key={index} style={styles.principleCard}>
              <View style={styles.principleRow}>
                <Text style={styles.principleIcon}>{principle.icon}</Text>
                <View style={styles.principleText}>
                  <Text style={styles.principleTitle}>{principle.title}</Text>
                  <Text style={styles.principleDesc}>{principle.description}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Simple habits */}
          <Text style={styles.sectionTitle}>Pick habits that work for you</Text>
          <Text style={styles.sectionSubtitle}>Choose what feels doable. You don't need to do everything.</Text>
          {simpleHabits.map((habit, index) => {
            const selected = selectedHabits.includes(habit);
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => toggleHabit(habit)}
                style={[styles.habitBtn, selected && styles.habitBtnActive]}
              >
                <View style={styles.habitRow}>
                  <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                    {selected && <View style={styles.checkDot} />}
                  </View>
                  <Text style={[styles.habitText, selected && styles.habitTextActive]}>{habit}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Red flags */}
          <Text style={[styles.sectionTitle, styles.sectionTitleRed]}>When to talk to someone</Text>
          <View style={styles.redFlagsCard}>
            <Text style={styles.redFlagsIntro}>
              If you notice these patterns, it might help to talk to someone you trust:
            </Text>
            {redFlags.map((flag, index) => (
              <View key={index} style={styles.redFlagRow}>
                <Text style={styles.redFlagBullet}>•</Text>
                <Text style={styles.redFlagText}>{flag}</Text>
              </View>
            ))}
          </View>

          {/* Support reminder */}
          <View style={styles.supportCard}>
            <Heart size={20} color="#a855f7" style={{ marginBottom: 10 }} />
            <Text style={styles.supportText}>
              Your relationship with food should feel calm, not stressful. If it doesn't, that's okay—but it might help to talk to someone.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Resources')}
              style={{ marginTop: 12 }}
            >
              <Text style={styles.supportLink}>View support resources →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  topHeader: { marginBottom: 24 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 20 },
  noteCard: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  noteText: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitleRed: { color: '#ef4444', marginTop: 8 },
  sectionSubtitle: { fontSize: 11, color: '#6b7280', marginBottom: 12, marginTop: -8 },
  principleCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  principleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  principleIcon: { fontSize: 28, marginTop: 2 },
  principleText: { flex: 1 },
  principleTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  principleDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  habitBtn: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  habitBtnActive: { backgroundColor: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.4)' },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 2, borderColor: '#6b7280',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.2)' },
  checkDot: { width: 8, height: 8, borderRadius: 2, backgroundColor: '#a855f7' },
  habitText: { fontSize: 13, color: '#9ca3af', flex: 1 },
  habitTextActive: { color: '#ffffff' },
  redFlagsCard: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  redFlagsIntro: { fontSize: 13, color: '#9ca3af', marginBottom: 12, lineHeight: 20 },
  redFlagRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  redFlagBullet: { fontSize: 13, color: '#ef4444', marginTop: 1 },
  redFlagText: { fontSize: 13, color: '#9ca3af', flex: 1 },
  supportCard: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
    borderRadius: 18,
    padding: 20,
  },
  supportText: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  supportLink: { fontSize: 13, color: '#22d3ee', fontWeight: '600' },
});
