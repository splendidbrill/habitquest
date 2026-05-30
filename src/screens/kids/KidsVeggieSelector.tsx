import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const veggies = [
  { id: 'carrot', emoji: '🥕', name: 'Carrot', colors: ['#fb923c', '#ea580c'] as [string, string], funFact: 'Carrots help you see better in the dark! They\'re full of vitamin A.', challenge: 'Try carrots twice this week!', benefits: ['👀 Beta-carotene helps your eyes', '💪 Vitamins make immune system strong', '🦷 Crunching carrots cleans teeth naturally'] },
  { id: 'broccoli', emoji: '🥦', name: 'Broccoli', colors: ['#4ade80', '#16a34a'] as [string, string], funFact: 'Broccoli looks like tiny trees! Packed with power to help you grow strong.', challenge: 'Try broccoli twice this week with cheese on top!', benefits: ['🧠 Vitamin K helps your brain remember', '💪 Protein builds strong muscles', '🛡️ Vitamin C protects you from getting sick'] },
  { id: 'tomato', emoji: '🍅', name: 'Tomato', colors: ['#ef4444', '#dc2626'] as [string, string], funFact: 'Tomatoes are actually fruits! They\'re juicy and full of vitamins.', challenge: 'Try tomatoes twice this week!', benefits: ['❤️ Lycopene keeps your heart strong', '☀️ Vitamins protect your skin', '💧 Full of water to keep you hydrated'] },
  { id: 'cucumber', emoji: '🥒', name: 'Cucumber', colors: ['#86efac', '#0d9488'] as [string, string], funFact: 'Cucumbers are 96% water! Super crunchy and refreshing on hot days.', challenge: 'Try cucumber twice this week as a crunchy snack!', benefits: ['💧 Keeps you hydrated with a fun crunch', '😊 Cooling effect on hot days', '🏃 Low calories, high energy snack'] },
  { id: 'bell-pepper', emoji: '🫑', name: 'Bell Pepper', colors: ['#a3e635', '#16a34a'] as [string, string], funFact: 'Bell peppers come in rainbow colors - green, yellow, orange, and red!', challenge: 'Try bell peppers twice this week!', benefits: ['🧠 More vitamin C than oranges!', '👀 Vitamins A and C help your eyes', '⚡ B vitamins give you lasting energy'] },
];

export function KidsVeggieSelector() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [weekVeggie, setWeekVeggie] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [selectedVeggie, setSelectedVeggie] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    storage.getItem('kidsVeggieOfWeek').then(v => { if (v) setWeekVeggie(v); });
    storage.getItem('kidsVeggieAttempts').then(v => setAttempts(parseInt(v ?? '0')));
  }, []);

  const handleSelect = (veggieId: string) => {
    setSelectedVeggie(veggieId);
    setShowModal(true);
  };

  const handleAccept = async () => {
    if (!selectedVeggie) return;
    await storage.setItem('kidsVeggieOfWeek', selectedVeggie);
    await storage.setItem('kidsVeggieAttempts', '0');
    setWeekVeggie(selectedVeggie);
    setAttempts(0);
    const pts = parseInt((await storage.getItem('kidsFamilyPoints')) ?? '0');
    await storage.setItem('kidsFamilyPoints', String(pts + 1));
    setShowModal(false);
  };

  const handlePinSubmit = async () => {
    if (pin === '1234' || pin === '👍') {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      await storage.setItem('kidsVeggieAttempts', String(newAttempts));
      const pts = parseInt((await storage.getItem('kidsFamilyPoints')) ?? '0');
      await storage.setItem('kidsFamilyPoints', String(pts + 1));
      if (newAttempts >= 2) {
        const badges = JSON.parse((await storage.getItem('kidsEarnedBadges')) ?? '[]');
        if (!badges.includes('veggie-explorer')) {
          badges.push('veggie-explorer');
          await storage.setItem('kidsEarnedBadges', JSON.stringify(badges));
        }
      }
      setShowPin(false);
      setPin('');
    } else {
      setPin('');
    }
  };

  const currentVegData = veggies.find(v => v.id === weekVeggie);
  const selectedVegData = veggies.find(v => v.id === selectedVeggie);
  const progress = Math.min((attempts / 2) * 100, 100);

  return (
    <LinearGradient colors={['#d1fae5', '#ecfdf5', '#f0fdf4']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Veggie Explorer</Text>
            <View style={{ width: 44 }} />
          </View>

          {weekVeggie && currentVegData && (
            <View style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>🥬 Your Veggie This Week</Text>
              <LinearGradient colors={currentVegData.colors} style={styles.currentVegCard}>
                <Text style={styles.currentVegEmoji}>{currentVegData.emoji}</Text>
                <Text style={styles.currentVegName}>{currentVegData.name}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{attempts} / 2 attempts</Text>
              </LinearGradient>
              {attempts < 2 ? (
                <TouchableOpacity style={styles.triedBtn} onPress={() => setShowPin(true)}>
                  <Text style={styles.triedBtnText}>🔒 Ask Parent: I Tried It! +1</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.completeBadge}>
                  <Text style={styles.completeBadgeText}>🎉 Challenge Complete! You're a veggie explorer!</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.instructCard}>
            <Text style={styles.instructEmoji}>🥬</Text>
            <View>
              <Text style={styles.instructTitle}>Pick Your Veggie Adventure!</Text>
              <Text style={styles.instructDesc}>Tap to learn how veggies make you stronger</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {veggies.map((veg, i) => (
              <TouchableOpacity
                key={veg.id}
                activeOpacity={0.85}
                onPress={() => handleSelect(veg.id)}
                style={styles.vegCardWrap}
              >
                <LinearGradient colors={veg.colors} style={styles.vegCard}>
                  <Text style={styles.vegEmoji}>{veg.emoji}</Text>
                  <Text style={styles.vegName}>{veg.name}</Text>
                  <Text style={styles.sparkle}>✨</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          {selectedVegData && (
            <TouchableOpacity activeOpacity={1} style={styles.modalCard} onPress={() => {}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalEmoji}>{selectedVegData.emoji}</Text>
                <Text style={styles.modalName}>{selectedVegData.name}</Text>
                <Text style={styles.modalFunFact}>💡 {selectedVegData.funFact}</Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitsHeader}>
                    <Sparkles size={16} color="#9333ea" />
                    <Text style={styles.benefitsTitle}> How This Helps You:</Text>
                  </View>
                  {selectedVegData.benefits.map((b, i) => (
                    <Text key={i} style={styles.benefitItem}>{b}</Text>
                  ))}
                </View>
                <LinearGradient colors={selectedVegData.colors} style={styles.challengeBox}>
                  <Text style={styles.challengeBoxEmoji}>🎯</Text>
                  <Text style={styles.challengeBoxText}>{selectedVegData.challenge}</Text>
                </LinearGradient>
                <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                  <Text style={styles.acceptBtnText}>Let's Try It! +1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelBtnText}>Pick Another Veggie</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>

      <Modal visible={showPin} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowPin(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.pinCard} onPress={() => {}}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.pinTitle}>Ask a Parent!</Text>
            <Text style={styles.pinDesc}>Did you try the veggie?</Text>
            <TouchableOpacity style={styles.approveBtn} onPress={() => { setPin('👍'); setTimeout(handlePinSubmit, 100); }}>
              <Text style={styles.approveBtnText}>👍 Child Tried It</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.pinInput}
              placeholder="Or type PIN (1234)"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
            />
            <TouchableOpacity style={styles.submitPin} onPress={handlePinSubmit}>
              <Text style={styles.submitPinText}>Submit PIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowPin(false); setPin(''); }}>
              <Text style={styles.cancelPinText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  challengeTitle: { fontSize: 16, fontWeight: '700', color: '#15803d', marginBottom: 12 },
  currentVegCard: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  currentVegEmoji: { fontSize: 48, marginBottom: 4 },
  currentVegName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 10 },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 5 },
  progressText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  triedBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  triedBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  completeBadge: {
    backgroundColor: '#fef9c3',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  completeBadgeText: { fontSize: 14, fontWeight: '600', color: '#713f12' },
  instructCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  instructEmoji: { fontSize: 36 },
  instructTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  instructDesc: { fontSize: 12, color: '#6b7280' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  vegCardWrap: { width: '47%' },
  vegCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  vegEmoji: { fontSize: 52, marginBottom: 6 },
  vegName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  sparkle: { position: 'absolute', top: 6, right: 8, fontSize: 18, opacity: 0.3 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    maxHeight: '85%',
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 64, marginBottom: 4, textAlign: 'center' },
  modalName: { fontSize: 24, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  modalFunFact: { fontSize: 14, color: '#4b5563', textAlign: 'center', marginBottom: 12, lineHeight: 20 },
  benefitsList: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  benefitsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  benefitsTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af' },
  benefitItem: { fontSize: 13, color: '#1e3a8a', marginBottom: 4, lineHeight: 18 },
  challengeBox: {
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeBoxEmoji: { fontSize: 24 },
  challengeBoxText: { fontSize: 13, color: '#fff', flex: 1, lineHeight: 18 },
  acceptBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  acceptBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 50,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  pinCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  lockEmoji: { fontSize: 52, marginBottom: 8 },
  pinTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  pinDesc: { fontSize: 15, color: '#6b7280', marginBottom: 16 },
  approveBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  approveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  pinInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    width: '100%',
    marginBottom: 10,
  },
  submitPin: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitPinText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cancelPinText: { fontSize: 15, color: '#6b7280', fontWeight: '600', paddingVertical: 6 },
});
