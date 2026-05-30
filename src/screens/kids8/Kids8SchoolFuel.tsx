import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, CheckCircle2, Zap, BookOpen, Target } from 'lucide-react-native';

const schoolMissions = [
  { id: 'water-day', title: 'Water Champion', description: 'Choose water instead of fizzy drinks today', emoji: '💧', examples: ['Water bottle', 'Flavoured water', 'Coconut water'], tip: 'Pro athletes drink 2-3 liters of water daily. Even 2% dehydration drops performance by 10%!' },
  { id: 'fruit-snack', title: 'Fresh Fuel', description: 'Pick fresh fruit for your snack', emoji: '🍎', examples: ['Apple', 'Banana', 'Grapes', 'Orange'], tip: 'Fruit gives you vitamins that help your brain focus in class and energy for sports!' },
  { id: 'veggie-lunch', title: 'Veggie Power', description: 'Add vegetables to your lunch today', emoji: '🥕', examples: ['Carrot sticks', 'Cucumber', 'Tomatoes', 'Peppers'], tip: 'Vegetables have nutrients that help muscles recover after training!' },
  { id: 'protein-choice', title: 'Muscle Builder', description: 'Choose a protein-rich lunch option', emoji: '🍗', examples: ['Chicken', 'Eggs', 'Cheese', 'Yogurt', 'Dal'], tip: 'Protein builds muscle and keeps you full through afternoon classes!' },
  { id: 'smart-breakfast', title: 'Breakfast Champion', description: 'Eat a balanced breakfast before school', emoji: '🥣', examples: ['Porridge', 'Eggs on toast', 'Yogurt & fruit', 'Dosa'], tip: 'Athletes NEVER skip breakfast. It\'s the fuel that starts your engine!' },
];

const smartSwaps = [
  { instead: 'Crisps', choose: 'Popcorn', instEmoji: '🍟', chooseEmoji: '🍿' },
  { instead: 'Fizzy drink', choose: 'Water', instEmoji: '🥤', chooseEmoji: '💧' },
  { instead: 'Chocolate bar', choose: 'Fruit + Yogurt', instEmoji: '🍫', chooseEmoji: '🍎🥛' },
  { instead: 'Sweets', choose: 'Fresh fruit', instEmoji: '🍬', chooseEmoji: '🍇' },
  { instead: 'White bread', choose: 'Whole grain', instEmoji: '🍞', chooseEmoji: '🥖' },
  { instead: 'Cookies', choose: 'Oat bar', instEmoji: '🍪', chooseEmoji: '🌾' },
];

export function Kids8SchoolFuel() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [todaysMission, setTodaysMission] = useState(schoolMissions[0]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const today = new Date().getDate();
    setTodaysMission(schoolMissions[today % schoolMissions.length]);
    storage.getItem('kids8SchoolMissionDate').then(v => {
      if (v === new Date().toDateString()) setCompleted(true);
    });
  }, []);

  const handleComplete = async () => {
    setCompleted(true);
    await storage.setItem('kids8SchoolMissionDate', new Date().toDateString());
    const pts = await storage.getItem('kids8FamilyPoints');
    await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 2));
    const badgesStr = await storage.getItem('kids8EarnedBadges');
    const badges: string[] = badgesStr ? JSON.parse(badgesStr) : [];
    if (!badges.includes('school-smart')) { badges.push('school-smart'); await storage.setItem('kids8EarnedBadges', JSON.stringify(badges)); }
  };

  return (
    <LinearGradient colors={['#0f172a', '#0d3d2d', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Fuel for School 🎒</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#0d9488', '#0891b2']} style={styles.infoCard}>
            <BookOpen size={32} color="#fff" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Smart Choices at School</Text>
              <Text style={styles.infoText}>What you eat at school affects how you perform in class AND on the field. Make choices like a pro athlete!</Text>
            </View>
          </LinearGradient>

          {/* Today's Mission */}
          <View style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Target size={22} color="#facc15" />
              <Text style={styles.missionHeaderText}>Today's School Mission</Text>
            </View>

            <Text style={{ fontSize: 60, textAlign: 'center', marginBottom: 12 }}>{todaysMission.emoji}</Text>
            <Text style={styles.missionTitle}>{todaysMission.title}</Text>
            <Text style={styles.missionDesc}>{todaysMission.description}</Text>

            <View style={styles.examplesBox}>
              <Text style={styles.examplesLabel}>Smart Choices:</Text>
              <View style={styles.examplesRow}>
                {todaysMission.examples.map((ex, i) => (
                  <LinearGradient key={i} colors={['#0d9488', '#0891b2']} style={styles.exampleTag}>
                    <Text style={styles.exampleTagText}>✓ {ex}</Text>
                  </LinearGradient>
                ))}
              </View>
            </View>

            <View style={styles.tipBox}>
              <Zap size={18} color="#fb923c" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.tipLabel}>Pro Tip</Text>
                <Text style={styles.tipText}>{todaysMission.tip}</Text>
              </View>
            </View>

            {!completed ? (
              <TouchableOpacity activeOpacity={0.85} onPress={handleComplete}>
                <LinearGradient colors={['#16a34a', '#059669']} style={styles.completeBtn}>
                  <CheckCircle2 size={20} color="#fff" />
                  <Text style={styles.completeBtnText}>I Did This Today! +2 Points</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <LinearGradient colors={['#16a34a', '#059669']} style={styles.completeBtn}>
                <CheckCircle2 size={20} color="#fff" />
                <Text style={styles.completeBtnText}>Mission Complete! ✅</Text>
              </LinearGradient>
            )}
          </View>

          {/* Smart Swaps */}
          <Text style={styles.swapsTitle}>🔄 Smart Swaps for School</Text>
          {smartSwaps.map((swap, index) => (
            <View key={index} style={styles.swapRow}>
              <Text style={{ fontSize: 28, opacity: 0.5 }}>{swap.instEmoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.swapInstead}>Instead of:</Text>
                <Text style={styles.swapInsteadName}>{swap.instead}</Text>
              </View>
              <Text style={styles.swapArrow}>→</Text>
              <View style={{ flex: 1, marginRight: 10, alignItems: 'flex-end' }}>
                <Text style={styles.swapChooseLabel}>Choose:</Text>
                <Text style={styles.swapChooseName}>{swap.choose}</Text>
              </View>
              <Text style={{ fontSize: 28 }}>{swap.chooseEmoji}</Text>
            </View>
          ))}

          <View style={styles.inControl}>
            <Text style={{ fontSize: 28, marginRight: 10 }}>💪</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.inControlTitle}>You're In Control</Text>
              <Text style={styles.inControlText}>Making smart choices at school shows you're becoming independent and responsible. That's champion mindset! 🏆</Text>
            </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  infoTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#ccfbf1', lineHeight: 17 },
  missionCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  missionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  missionHeaderText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  missionTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  missionDesc: { fontSize: 14, color: '#bfdbfe', textAlign: 'center', marginBottom: 14 },
  examplesBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 12, marginBottom: 12 },
  examplesLabel: { fontSize: 11, fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  examplesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  exampleTag: { borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6 },
  exampleTagText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  tipBox: { flexDirection: 'row', backgroundColor: 'rgba(234,88,12,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(251,146,60,0.3)', marginBottom: 14 },
  tipLabel: { fontSize: 12, fontWeight: '800', color: '#fb923c', marginBottom: 2 },
  tipText: { fontSize: 12, color: '#fed7aa', lineHeight: 17 },
  completeBtn: { borderRadius: 50, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  completeBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  swapsTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 12 },
  swapRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  swapInstead: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  swapInsteadName: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecorationLine: 'line-through' },
  swapArrow: { fontSize: 18, color: '#0d9488', marginHorizontal: 4 },
  swapChooseLabel: { fontSize: 10, color: '#5eead4' },
  swapChooseName: { fontSize: 13, fontWeight: '700', color: '#fff' },
  inControl: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 16, padding: 14, marginTop: 8, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)' },
  inControlTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  inControlText: { fontSize: 13, color: '#e9d5ff', lineHeight: 18 },
});
