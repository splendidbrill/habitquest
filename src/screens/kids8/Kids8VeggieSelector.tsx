import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Lock, Zap, Brain } from 'lucide-react-native';

const veggies = [
  { id: 'carrot', emoji: '🥕', name: 'Carrot', colors: ['#f97316', '#ea580c'] as [string,string], funFact: 'Carrots help you see better in the dark! They\'re full of vitamin A that keeps your eyes super strong.', benefits: [{ icon: '👀', text: 'Beta-carotene helps your eyes work better - perfect for seeing the ball when playing cricket!' }, { icon: '💪', text: 'Vitamins make your immune system strong so you don\'t miss playtime' }, { icon: '🦷', text: 'Crunching carrots cleans your teeth naturally - nature\'s toothbrush!' }], sensoryTips: [{ sense: '👀', tip: 'Look at the bright orange color - so cheerful!' }, { sense: '✋', tip: 'Feel how smooth and cool it is in your hand' }, { sense: '👂', tip: 'Listen to the CRUNCH when you bite - so satisfying!' }], whyBetter: 'Carrots give you lasting energy for sports, while candy makes you tired and slow!', challenge: 'Try carrots twice this week - raw with lunch or cooked with dinner!' },
  { id: 'broccoli', emoji: '🥦', name: 'Broccoli', colors: ['#16a34a', '#15803d'] as [string,string], funFact: 'Broccoli looks like tiny trees! It\'s packed with power to help you grow strong and healthy.', benefits: [{ icon: '🧠', text: 'Vitamin K helps your brain remember things better - great for learning at school!' }, { icon: '💪', text: 'Protein builds strong muscles for running, climbing, and playing' }, { icon: '🛡️', text: 'Vitamin C protects you from getting sick - like a shield for your body!' }], sensoryTips: [{ sense: '👀', tip: 'See the tiny tree-like florets - like a mini forest!' }, { sense: '✋', tip: 'Touch the bumpy texture - so interesting!' }, { sense: '👅', tip: 'Taste gets sweeter when cooked - try it with cheese!' }], whyBetter: 'Broccoli fills you up with nutrients that make you smarter and stronger!', challenge: 'Try broccoli twice this week - maybe with some tasty cheese on top!' },
  { id: 'tomato', emoji: '🍅', name: 'Tomato', colors: ['#ef4444', '#dc2626'] as [string,string], funFact: 'Tomatoes are actually fruits, not vegetables! They\'re juicy and full of vitamins.', benefits: [{ icon: '❤️', text: 'Lycopene keeps your heart strong so you can run and play all day!' }, { icon: '☀️', text: 'Vitamins protect your skin from the sun naturally' }, { icon: '💧', text: 'Full of water to keep you hydrated - important for hot days!' }], sensoryTips: [{ sense: '👀', tip: 'Look at the bright red color - shows it\'s ripe and ready!' }, { sense: '✋', tip: 'Feel how firm and smooth the skin is' }, { sense: '👅', tip: 'Taste both sweet and tangy flavors together' }], whyBetter: 'Tomatoes give you vitamins AND water to stay energized, while sodas just give you sugar!', challenge: 'Try tomatoes twice this week - in curry, salad, or just sliced!' },
  { id: 'cucumber', emoji: '🥒', name: 'Cucumber', colors: ['#4ade80', '#0d9488'] as [string,string], funFact: 'Cucumbers are 96% water! They\'re super crunchy and refreshing, especially on hot days.', benefits: [{ icon: '💧', text: 'Keeps you hydrated like drinking water, but with a fun crunch!' }, { icon: '😊', text: 'Cooling effect makes you feel fresh on hot days' }, { icon: '🏃', text: 'Low calories, high energy - perfect snack before playing!' }], sensoryTips: [{ sense: '👀', tip: 'See the cool green color - looks refreshing!' }, { sense: '✋', tip: 'Feel the bumpy skin and cool temperature' }, { sense: '👂', tip: 'CRUNCH! One of the crunchiest veggies!' }], whyBetter: 'Cucumbers refresh you without sugar, while juice boxes have lots of added sugar!', challenge: 'Try cucumber twice this week - perfect for a crunchy snack!' },
  { id: 'bell-pepper', emoji: '🫑', name: 'Bell Pepper', colors: ['#84cc16', '#16a34a'] as [string,string], funFact: 'Bell peppers come in rainbow colors - green, yellow, orange, and red! Each color tastes a bit different.', benefits: [{ icon: '🧠', text: 'More vitamin C than oranges - helps your brain work super fast!' }, { icon: '👀', text: 'Vitamins A and C help your eyes stay healthy' }, { icon: '⚡', text: 'B vitamins give you energy that lasts all day for playing' }], sensoryTips: [{ sense: '👀', tip: 'Spot all the colors - green, red, yellow, orange!' }, { sense: '✋', tip: 'Feel the smooth, shiny skin' }, { sense: '👅', tip: 'Green is earthy, red is sweet - which do you like?' }], whyBetter: 'Bell peppers give you vitamins that help you think clearly and play better!', challenge: 'Try bell peppers twice this week - see which color you like best!' },
];

export function Kids8VeggieSelector() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedVeggie, setSelectedVeggie] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [weekVeggie, setWeekVeggie] = useState<string | null>(null);
  const [pin, setPin] = useState('');

  useEffect(() => {
    storage.getItem('kids8VeggieOfWeek').then(v => { if (v) setWeekVeggie(v); });
    storage.getItem('kids8VeggieAttempts').then(v => { if (v) setAttempts(parseInt(v)); });
  }, []);

  const handleSelectVeggie = (id: string) => { setSelectedVeggie(id); setShowModal(true); };

  const handleAcceptChallenge = async () => {
    if (selectedVeggie) {
      await storage.setItem('kids8VeggieOfWeek', selectedVeggie);
      await storage.setItem('kids8VeggieAttempts', '0');
      setWeekVeggie(selectedVeggie);
      setAttempts(0);
      setShowModal(false);
      const pts = await storage.getItem('kids8FamilyPoints');
      await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 1));
    }
  };

  const handlePinSubmit = async () => {
    if (pin === '1234' || pin === '👍') {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      await storage.setItem('kids8VeggieAttempts', String(newAttempts));
      const pts = await storage.getItem('kids8FamilyPoints');
      await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 1));
      if (newAttempts === 2) {
        const badgesStr = await storage.getItem('kids8EarnedBadges');
        const badges: string[] = badgesStr ? JSON.parse(badgesStr) : [];
        if (!badges.includes('veggie-explorer')) { badges.push('veggie-explorer'); await storage.setItem('kids8EarnedBadges', JSON.stringify(badges)); }
      }
      setShowPinModal(false);
      setPin('');
    } else {
      setPin('');
    }
  };

  const selectedVeggieData = veggies.find(v => v.id === selectedVeggie);
  const currentVeggieData = veggies.find(v => v.id === weekVeggie);
  const progress = (attempts / 2) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.title}>Veggie Explorer</Text>
            <View style={{ width: 44 }} />
          </View>

          {weekVeggie && currentVeggieData && (
            <View style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>✨ Your Veggie This Week</Text>
              <LinearGradient colors={currentVeggieData.colors} style={styles.currentVeggieBox}>
                <Text style={{ fontSize: 60 }}>{currentVeggieData.emoji}</Text>
                <Text style={styles.currentVeggieName}>{currentVeggieData.name}</Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={{ color: '#fff', fontSize: 13, marginTop: 4 }}>{attempts}/2 times tried</Text>
              </LinearGradient>
              {attempts < 2 ? (
                <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPinModal(true)}>
                  <LinearGradient colors={['#16a34a', '#059669']} style={styles.tryBtn}>
                    <Lock size={18} color="#fff" />
                    <Text style={styles.tryBtnText}>Ask Parent: I Tried It! +1</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.completeBox}>
                  <Text style={{ fontSize: 36 }}>🎉</Text>
                  <Text style={styles.completeTxt}>Challenge Complete!</Text>
                  <Text style={styles.completeSub}>You're becoming a veggie explorer! 🌟</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.instructCard}>
            <Text style={{ fontSize: 36, marginRight: 10 }}>🥬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.instructTitle}>Pick Your Veggie Adventure!</Text>
              <Text style={styles.instructSub}>Tap to learn how veggies make you stronger and smarter</Text>
            </View>
          </View>

          <View style={styles.veggieGrid}>
            {veggies.map(veggie => (
              <TouchableOpacity key={veggie.id} activeOpacity={0.85} onPress={() => handleSelectVeggie(veggie.id)} style={styles.veggieBtnWrap}>
                <LinearGradient colors={veggie.colors} style={styles.veggieBtn}>
                  <Text style={{ fontSize: 52, marginBottom: 6 }}>{veggie.emoji}</Text>
                  <Text style={styles.veggieName}>{veggie.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Veggie Info Modal */}
        <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            {selectedVeggieData && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={{ textAlign: 'center', fontSize: 72, marginBottom: 8 }}>{selectedVeggieData.emoji}</Text>
                <Text style={styles.modalName}>{selectedVeggieData.name}</Text>

                <Text style={styles.benefitsHeader}>✨ How This Helps You:</Text>
                {selectedVeggieData.benefits.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <Text style={{ fontSize: 22, marginRight: 10 }}>{b.icon}</Text>
                    <Text style={styles.benefitText}>{b.text}</Text>
                  </View>
                ))}

                <View style={styles.sensoryBox}>
                  <Text style={styles.sensoryTitle}>👀 Use Your Senses!</Text>
                  {selectedVeggieData.sensoryTips.map((tip, i) => (
                    <View key={i} style={styles.sensoryRow}>
                      <Text style={{ fontSize: 22, marginRight: 6 }}>{tip.sense}</Text>
                      <Text style={styles.sensoryText}>{tip.tip}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.funFactBox}>
                  <Brain size={18} color="#92400e" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.funFactTitle}>Fun Fact!</Text>
                    <Text style={styles.funFactText}>{selectedVeggieData.funFact}</Text>
                  </View>
                </View>

                <View style={styles.smartBox}>
                  <Zap size={18} color="#16a34a" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.smartTitle}>Smart Choice!</Text>
                    <Text style={styles.smartText}>{selectedVeggieData.whyBetter}</Text>
                  </View>
                </View>

                <LinearGradient colors={selectedVeggieData.colors} style={styles.challengeInfoBox}>
                  <Text style={{ fontSize: 24, marginRight: 8 }}>🎯</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.challengeInfoTitle}>Your Challenge</Text>
                    <Text style={styles.challengeInfoText}>{selectedVeggieData.challenge}</Text>
                  </View>
                </LinearGradient>

                <TouchableOpacity activeOpacity={0.85} onPress={handleAcceptChallenge} style={{ marginBottom: 10 }}>
                  <LinearGradient colors={['#16a34a', '#059669']} style={styles.acceptBtn}>
                    <Text style={styles.acceptBtnText}>✨ Let's Try It! +1</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setShowModal(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Pick Another Veggie</Text>
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
              <Text style={styles.pinSub}>Did you try the veggie?</Text>
              <TouchableOpacity activeOpacity={0.85} onPress={() => { setPin('👍'); setTimeout(handlePinSubmit, 100); }}>
                <LinearGradient colors={['#16a34a', '#059669']} style={styles.pinGreenBtn}>
                  <Text style={styles.pinGreenBtnText}>👍 Child Tried It</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TextInput value={pin} onChangeText={setPin} placeholder="Or type PIN (1234)" placeholderTextColor="#9ca3af" secureTextEntry keyboardType="numeric" maxLength={4} style={styles.pinInput} />
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
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  challengeCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  challengeTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 12 },
  currentVeggieBox: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14 },
  currentVeggieName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 10 },
  progressBarTrack: { width: '80%', height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: 5 },
  tryBtn: { borderRadius: 50, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  tryBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  completeBox: { backgroundColor: '#fffbeb', borderRadius: 16, padding: 14, alignItems: 'center' },
  completeTxt: { fontSize: 16, fontWeight: '800', color: '#92400e', marginTop: 6 },
  completeSub: { fontSize: 13, color: '#b45309' },
  instructCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  instructTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  instructSub: { fontSize: 12, color: '#6b7280' },
  veggieGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  veggieBtnWrap: { width: '46%' },
  veggieBtn: { borderRadius: 24, padding: 20, alignItems: 'center' },
  veggieName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderRadius: 32, padding: 24, maxHeight: '90%' },
  modalName: { fontSize: 22, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  benefitsHeader: { fontSize: 14, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#eff6ff', borderRadius: 12, padding: 10, marginBottom: 6 },
  benefitText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 18 },
  sensoryBox: { backgroundColor: '#faf5ff', borderRadius: 14, padding: 12, marginBottom: 10 },
  sensoryTitle: { fontSize: 13, fontWeight: '800', color: '#6b21a8', marginBottom: 8 },
  sensoryRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  sensoryText: { flex: 1, fontSize: 12, color: '#581c87' },
  funFactBox: { flexDirection: 'row', backgroundColor: '#fffbeb', borderRadius: 14, padding: 12, marginBottom: 10 },
  funFactTitle: { fontSize: 13, fontWeight: '800', color: '#92400e', marginBottom: 2 },
  funFactText: { fontSize: 13, color: '#78350f' },
  smartBox: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 14, padding: 12, marginBottom: 10 },
  smartTitle: { fontSize: 13, fontWeight: '800', color: '#166534', marginBottom: 2 },
  smartText: { fontSize: 13, color: '#166534' },
  challengeInfoBox: { borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  challengeInfoTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 2 },
  challengeInfoText: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  acceptBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  acceptBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  closeBtn: { backgroundColor: '#f3f4f6', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
  pinContent: { backgroundColor: '#fff', borderRadius: 32, padding: 28, margin: 24 },
  pinTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 6 },
  pinSub: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  pinGreenBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  pinGreenBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  pinInput: { backgroundColor: '#f3f4f6', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 14, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 10, borderWidth: 2, borderColor: '#d1d5db' },
  pinSubmitBtn: { backgroundColor: '#f97316', borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  pinSubmitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  cancelBtn: { backgroundColor: '#f3f4f6', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
});
