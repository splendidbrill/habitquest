import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Lock, Zap } from 'lucide-react-native';

const mealOptions = [
  { id: 'dal-rice', name: 'Dal & Rice Bowl', emoji: '🍚', description: 'Warm dal with fluffy rice', colors: ['#f59e0b', '#f97316'] as [string,string], benefits: [{ icon: '💪', text: 'Protein helps your muscles grow strong!' }, { icon: '⚡', text: 'Rice gives you energy that lasts all day' }, { icon: '🧠', text: 'Dal has iron that helps your brain think' }], funFact: 'Dal and rice together make a "complete protein" - they work as a team to make you super strong!', whyBetterThanJunk: 'Unlike chips that only give quick energy, dal & rice keep you energized for hours of play!' },
  { id: 'veggie-curry', name: 'Veggie Curry', emoji: '🍛', description: 'Colorful mixed vegetables', colors: ['#16a34a', '#059669'] as [string,string], benefits: [{ icon: '👀', text: 'Carrots help you see better, even in the dark!' }, { icon: '🦴', text: 'Potatoes have potassium for strong bones' }, { icon: '❤️', text: 'Peas help your heart so you can run faster' }], funFact: 'Each color vegetable has different superpowers! Orange = eye power, Green = strong muscles!', whyBetterThanJunk: 'Vegetables give you steady energy and don\'t make your tummy hurt like too many chocolates!' },
  { id: 'roti-sabzi', name: 'Roti & Sabzi', emoji: '🫓', description: 'Fresh roti with tasty sabzi', colors: ['#0d9488', '#0891b2'] as [string,string], benefits: [{ icon: '🏃', text: 'Whole wheat gives you energy for playing football!' }, { icon: '🦷', text: 'Paneer has calcium for strong teeth and bones' }, { icon: '🌟', text: 'Fiber in roti keeps your tummy happy all day' }], funFact: 'When you chew roti well, your tummy can grab all the energy from it. Try counting 20 chews!', whyBetterThanJunk: 'Roti keeps you full and energized much longer than biscuits or crisps!' },
  { id: 'biryani', name: 'Veggie Biryani', emoji: '🍲', description: 'Fragrant rice with vegetables', colors: ['#f97316', '#ef4444'] as [string,string], benefits: [{ icon: '🧠', text: 'Spices like turmeric help your brain work faster!' }, { icon: '🛡️', text: 'Vegetables have vitamins that protect you from getting sick' }, { icon: '⚡', text: 'Rice gives you quick energy to play and run around' }], funFact: 'The different spices in biryani don\'t just taste good - they help fight germs!', whyBetterThanJunk: 'Biryani fills you up with good energy, while chips leave you hungry again quickly!' },
];

export function Kids8DinnerChoice() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pin, setPin] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [mealEaten, setMealEaten] = useState(false);

  useEffect(() => {
    storage.getItem('kids8TodaysDinnerVote').then(v => { if (v) { setHasVoted(true); setSelectedMeal(v); } });
    storage.getItem('kids8TodaysDinnerEaten').then(v => { if (v === 'true') setMealEaten(true); });
  }, []);

  const handleVote = (mealId: string) => {
    if (hasVoted) return;
    setSelectedMeal(mealId);
    setShowModal(true);
  };

  const confirmVote = async () => {
    if (selectedMeal) {
      await storage.setItem('kids8TodaysDinnerVote', selectedMeal);
      const pts = await storage.getItem('kids8FamilyPoints');
      await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 1));
      const badgesStr = await storage.getItem('kids8EarnedBadges');
      const badges: string[] = badgesStr ? JSON.parse(badgesStr) : [];
      if (!badges.includes('dinner-helper')) { badges.push('dinner-helper'); await storage.setItem('kids8EarnedBadges', JSON.stringify(badges)); }
      setShowModal(false);
      setHasVoted(true);
    }
  };

  const handlePinSubmit = async () => {
    if (pin === '1234' || pin === '👍') {
      await storage.setItem('kids8TodaysDinnerEaten', 'true');
      const pts = await storage.getItem('kids8FamilyPoints');
      await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 2));
      setMealEaten(true);
      setShowPinModal(false);
      setPin('');
      setShowSuccess(true);
    } else {
      setPin('');
    }
  };

  const selectedMealData = mealOptions.find(m => m.id === selectedMeal);

  if (showSuccess && selectedMealData) {
    return (
      <LinearGradient colors={['#f97316', '#f59e0b', '#14b8a6']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.successContent}>
            <Text style={{ fontSize: 72, marginBottom: 16 }}>💪</Text>
            <Text style={styles.successTitle}>You're Getting Stronger!</Text>
            <Text style={styles.successSub}>Every healthy meal gives your body superpowers! 🌟</Text>
            <View style={styles.mealSummary}>
              <Text style={{ fontSize: 52, marginBottom: 6 }}>{selectedMealData.emoji}</Text>
              <Text style={styles.mealSummaryName}>{selectedMealData.name}</Text>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>You gave your body the nutrients it needs to grow strong, play longer, and think better! 🌟</Text>
              </View>
            </View>
            <View style={styles.pointsCard}>
              <Text style={styles.pointsNum}>+2 Family Points!</Text>
              <Text style={styles.pointsSub}>You helped the team AND ate well! 🎉</Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')}>
              <LinearGradient colors={['#f97316', '#f59e0b', '#14b8a6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                <Text style={styles.btnText}>Back to Dashboard 🏠</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff8f0' }}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Dinner!</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.instructCard}>
            <Text style={{ fontSize: 36, marginRight: 12 }}>👨‍🍳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.instructTitle}>Your Choice Helps the Team!</Text>
              <Text style={styles.instructSub}>Pick what sounds yummy and learn why it's great for you</Text>
            </View>
          </View>

          {hasVoted && !mealEaten && selectedMealData && (
            <View style={styles.votedCard}>
              <Text style={{ fontSize: 28, marginRight: 8 }}>{selectedMealData.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.votedText}>You chose: {selectedMealData.name}</Text>
                <Text style={styles.votedSub}>Did you eat it well?</Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPinModal(true)}>
                <LinearGradient colors={['#16a34a', '#059669']} style={styles.eatBtn}>
                  <Lock size={16} color="#fff" />
                  <Text style={styles.eatBtnText}>Ask Parent: I Ate Well!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {mealEaten && (
            <View style={styles.eatenCard}>
              <Text style={styles.eatenText}>✓ Amazing! You ate well today!</Text>
            </View>
          )}

          {mealOptions.map(meal => (
            <TouchableOpacity
              key={meal.id}
              activeOpacity={0.85}
              onPress={() => handleVote(meal.id)}
              disabled={hasVoted}
              style={{ marginBottom: 14, opacity: hasVoted ? 0.6 : 1 }}
            >
              <LinearGradient colors={meal.colors} style={styles.mealCard}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDesc}>{meal.description}</Text>
                  <Text style={styles.tapHint}>💡 Tap to learn why this is great for you!</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meal Info Modal */}
        <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            {selectedMealData && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={{ textAlign: 'center', fontSize: 72, marginBottom: 8 }}>{selectedMealData.emoji}</Text>
                <Text style={styles.modalName}>{selectedMealData.name}</Text>
                <Text style={styles.modalDesc}>{selectedMealData.description}</Text>

                <Text style={styles.benefitsHeader}>✨ Why This is Amazing For You:</Text>
                {selectedMealData.benefits.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <Text style={{ fontSize: 22, marginRight: 10 }}>{b.icon}</Text>
                    <Text style={styles.benefitText}>{b.text}</Text>
                  </View>
                ))}

                <View style={styles.funFactBox}>
                  <Text style={styles.funFactTitle}>💡 Fun Fact!</Text>
                  <Text style={styles.funFactText}>{selectedMealData.funFact}</Text>
                </View>

                <View style={styles.smartBox}>
                  <Zap size={18} color="#16a34a" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.smartTitle}>Smart Choice!</Text>
                    <Text style={styles.smartText}>{selectedMealData.whyBetterThanJunk}</Text>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.85} onPress={confirmVote} style={{ marginBottom: 10 }}>
                  <LinearGradient colors={selectedMealData.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalBtn}>
                    <Text style={styles.modalBtnText}>I Choose This! +1 Point</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setShowModal(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Look at Other Options</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </Modal>

        {/* PIN Modal */}
        <Modal visible={showPinModal} transparent animationType="slide" onRequestClose={() => setShowPinModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.pinContent}>
              <Text style={{ fontSize: 52, textAlign: 'center', marginBottom: 12 }}>🔒</Text>
              <Text style={styles.pinTitle}>Ask a Parent!</Text>
              <Text style={styles.pinSub}>Did you eat your meal well?</Text>
              <TouchableOpacity activeOpacity={0.85} onPress={() => { setPin('👍'); setTimeout(handlePinSubmit, 100); }}>
                <LinearGradient colors={['#16a34a', '#059669']} style={styles.pinGreenBtn}>
                  <Text style={styles.pinGreenBtnText}>👍 Child Ate Well</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TextInput
                value={pin}
                onChangeText={setPin}
                placeholder="Or type PIN (1234)"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                style={styles.pinInput}
              />
              <TouchableOpacity activeOpacity={0.85} onPress={handlePinSubmit} style={styles.pinSubmitBtn}>
                <Text style={styles.pinSubmitText}>Submit PIN</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={() => { setShowPinModal(false); setPin(''); }} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  instructCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  instructTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  instructSub: { fontSize: 13, color: '#6b7280' },
  votedCard: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  votedText: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  votedSub: { fontSize: 11, color: '#3b82f6' },
  eatBtn: { borderRadius: 50, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  eatBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  eatenCard: { backgroundColor: '#f0fdf4', borderRadius: 16, padding: 12, marginBottom: 14, alignItems: 'center' },
  eatenText: { fontSize: 14, fontWeight: '700', color: '#166534' },
  mealCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  mealEmoji: { fontSize: 52 },
  mealName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  mealDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  tapHint: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  successContent: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 16, color: '#374151', marginBottom: 20, textAlign: 'center' },
  mealSummary: { backgroundColor: '#fff', borderRadius: 24, padding: 20, width: '100%', alignItems: 'center', marginBottom: 16 },
  mealSummaryName: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 10 },
  summaryBox: { backgroundColor: '#f0fdf4', borderRadius: 16, padding: 14 },
  summaryText: { fontSize: 13, color: '#166534', lineHeight: 18 },
  pointsCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%', alignItems: 'center', marginBottom: 20 },
  pointsNum: { fontSize: 22, fontWeight: '800', color: '#c2410c', marginBottom: 4 },
  pointsSub: { fontSize: 14, color: '#b45309' },
  btn: { borderRadius: 50, paddingVertical: 18, paddingHorizontal: 40, alignItems: 'center' },
  btnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderRadius: 32, padding: 24, maxHeight: '90%' },
  modalName: { fontSize: 22, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 4 },
  modalDesc: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  benefitsHeader: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#eff6ff', borderRadius: 14, padding: 12, marginBottom: 8 },
  benefitText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 18 },
  funFactBox: { backgroundColor: '#fffbeb', borderRadius: 14, padding: 12, marginBottom: 10 },
  funFactTitle: { fontSize: 13, fontWeight: '800', color: '#92400e', marginBottom: 4 },
  funFactText: { fontSize: 13, color: '#78350f' },
  smartBox: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 14, padding: 12, marginBottom: 14 },
  smartTitle: { fontSize: 13, fontWeight: '800', color: '#166534', marginBottom: 4 },
  smartText: { fontSize: 13, color: '#166534' },
  modalBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  modalBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  cancelBtn: { backgroundColor: '#f3f4f6', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
  pinContent: { backgroundColor: '#fff', borderRadius: 32, padding: 28, margin: 24 },
  pinTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 6 },
  pinSub: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  pinGreenBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  pinGreenBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  pinInput: { backgroundColor: '#f3f4f6', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 14, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 10, borderWidth: 2, borderColor: '#d1d5db' },
  pinSubmitBtn: { backgroundColor: '#f97316', borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  pinSubmitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
