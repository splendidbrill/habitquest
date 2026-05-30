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
import { ArrowLeft, Sparkles, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const mealOptions = [
  { id: 'dal-rice', name: 'Dal & Rice Bowl', emoji: '🍚', description: 'Warm dal with fluffy rice', colors: ['#fbbf24', '#fb923c'] as [string, string], benefits: ['💪 Protein helps your muscles grow strong!', '⚡ Rice gives you energy that lasts all day!', '🧠 Dal has iron that helps your brain think!'] },
  { id: 'veggie-curry', name: 'Veggie Curry', emoji: '🍛', description: 'Colourful mixed vegetables', colors: ['#4ade80', '#10b981'] as [string, string], benefits: ['👀 Carrots help you see better!', '🦴 Potatoes keep your bones super strong!', '❤️ Peas help your heart stay healthy!'] },
  { id: 'roti-sabzi', name: 'Roti & Sabzi', emoji: '🫓', description: 'Fresh roti with tasty sabzi', colors: ['#2dd4bf', '#06b6d4'] as [string, string], benefits: ['🏃 Whole wheat gives you lasting energy!', '🦷 Paneer makes your teeth super strong!', '🌟 Fibre keeps your tummy happy all day!'] },
  { id: 'biryani', name: 'Veggie Biryani', emoji: '🍲', description: 'Fragrant rice with vegetables', colors: ['#fb923c', '#ef4444'] as [string, string], benefits: ['🧠 Spices help your brain work faster!', '🛡️ Vegetables protect you from getting sick!', '⚡ Rice gives you quick energy to play!'] },
];

export function KidsDinnerChoice() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [mealEaten, setMealEaten] = useState(false);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    storage.getItem('kidsTodaysDinnerVote').then(v => { if (v) { setHasVoted(true); setSelectedMeal(v); } });
    storage.getItem('kidsTodaysDinnerEaten').then(v => setMealEaten(v === 'true'));
  }, []);

  const handleVote = (mealId: string) => {
    setSelectedMeal(mealId);
    setShowModal(true);
  };

  const confirmVote = async () => {
    if (!selectedMeal) return;
    await storage.setItem('kidsTodaysDinnerVote', selectedMeal);
    const pts = parseInt((await storage.getItem('kidsFamilyPoints')) ?? '0');
    await storage.setItem('kidsFamilyPoints', String(pts + 1));
    setHasVoted(true);
    setShowModal(false);
  };

  const handlePinSubmit = async () => {
    if (pin === '1234' || pin === '👍') {
      await storage.setItem('kidsTodaysDinnerEaten', 'true');
      const pts = parseInt((await storage.getItem('kidsFamilyPoints')) ?? '0');
      await storage.setItem('kidsFamilyPoints', String(pts + 2));
      setMealEaten(true);
      setShowPinModal(false);
      setPin('');
      setShowSuccess(true);
    } else {
      setPin('');
    }
  };

  const currentMeal = mealOptions.find(m => m.id === selectedMeal);

  return (
    <LinearGradient colors={['#fef3c7', '#fed7aa', '#d1fae5']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Dinner!</Text>
            <View style={{ width: 44 }} />
          </View>

          {!showSuccess ? (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoEmoji}>👨‍🍳</Text>
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>Your Choice Helps the Team!</Text>
                  <Text style={styles.infoDesc}>Pick what sounds yummy and learn why it's great for you</Text>
                </View>
              </View>

              {hasVoted && !mealEaten && currentMeal && (
                <View style={styles.votedBox}>
                  <Text style={styles.votedEmoji}>{currentMeal.emoji}</Text>
                  <View>
                    <Text style={styles.votedText}>You chose: {currentMeal.name}</Text>
                    <Text style={styles.votedSub}>Did you eat it well?</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.ateBtn}
                    onPress={() => setShowPinModal(true)}
                  >
                    <Text style={styles.ateBtnText}>🔒 Ask Parent: I Ate Well! +2</Text>
                  </TouchableOpacity>
                </View>
              )}

              {mealEaten && (
                <View style={styles.eatenBadge}>
                  <Text style={styles.eatenText}>✓ Amazing! You ate well today!</Text>
                </View>
              )}

              <View style={styles.mealList}>
                {mealOptions.map(meal => (
                  <TouchableOpacity
                    key={meal.id}
                    activeOpacity={hasVoted ? 1 : 0.85}
                    onPress={() => !hasVoted && handleVote(meal.id)}
                  >
                    <LinearGradient
                      colors={meal.colors}
                      style={[styles.mealCard, hasVoted && { opacity: 0.5 }]}
                    >
                      <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                      <View style={styles.mealInfo}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealDesc}>{meal.description}</Text>
                        <Text style={styles.mealHint}>💡 Tap to learn why this is amazing!</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.successView}>
              <Text style={styles.successEmoji}>💪</Text>
              <Text style={styles.successTitle}>You're Getting Stronger!</Text>
              <Text style={styles.successDesc}>Every healthy meal gives your body superpowers for playing, learning, and having fun! 🌟</Text>
              <View style={styles.pointsBox}>
                <Users size={20} color="#ea580c" />
                <Text style={styles.pointsText}>+2 Family Points!</Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('KidsBuddyHome')}>
                <LinearGradient colors={['#f97316', '#f59e0b', '#14b8a6']} style={styles.homeBtn}>
                  <Text style={styles.homeBtnText}>Back to Home 🏠</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Meal info modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          {selectedMeal && (() => {
            const meal = mealOptions.find(m => m.id === selectedMeal)!;
            return (
              <TouchableOpacity activeOpacity={1} style={styles.modalCard} onPress={() => {}}>
                <Text style={styles.modalEmoji}>{meal.emoji}</Text>
                <Text style={styles.modalName}>{meal.name}</Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitsHeader}>
                    <Sparkles size={18} color="#9333ea" />
                    <Text style={styles.benefitsTitle}> Why This is Amazing For You:</Text>
                  </View>
                  {meal.benefits.map((b, i) => (
                    <View key={i} style={styles.benefitItem}>
                      <Text style={styles.benefitText}>{b}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.chooseBtn} onPress={confirmVote}>
                  <Users size={18} color="#fff" />
                  <Text style={styles.chooseBtnText}> I Choose This! +1 Point</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelBtnText}>Look at Other Options</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })()}
        </TouchableOpacity>
      </Modal>

      {/* PIN modal */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowPinModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.pinCard} onPress={() => {}}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.pinTitle}>Ask a Parent!</Text>
            <Text style={styles.pinDesc}>Did you eat your meal well?</Text>
            <TouchableOpacity style={styles.approveBtn} onPress={() => handlePinSubmit()}>
              <Text style={styles.approveBtnText}>👍 Child Ate Well</Text>
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
            <TouchableOpacity onPress={() => { setShowPinModal(false); setPin(''); }}>
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoEmoji: { fontSize: 40 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  infoDesc: { fontSize: 13, color: '#6b7280' },
  votedBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  votedEmoji: { fontSize: 32, marginBottom: 4 },
  votedText: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 2 },
  votedSub: { fontSize: 13, color: '#1d4ed8', marginBottom: 10 },
  ateBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ateBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  eatenBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  eatenText: { fontSize: 14, fontWeight: '700', color: '#14532d' },
  mealList: { gap: 14 },
  mealCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
  },
  mealEmoji: { fontSize: 52 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  mealDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 6 },
  mealHint: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  successView: { alignItems: 'center', paddingTop: 16 },
  successEmoji: { fontSize: 72, marginBottom: 12 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 10 },
  successDesc: { fontSize: 16, color: '#374151', textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  pointsText: { fontSize: 22, fontWeight: '700', color: '#ea580c' },
  homeBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  homeBtnText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 64, marginBottom: 8 },
  modalName: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 16 },
  benefitsList: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  benefitsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  benefitsTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af' },
  benefitItem: { marginBottom: 6 },
  benefitText: { fontSize: 13, color: '#1e3a8a', lineHeight: 18 },
  chooseBtn: {
    flexDirection: 'row',
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  chooseBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 50,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
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
