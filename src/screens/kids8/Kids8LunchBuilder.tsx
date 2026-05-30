import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Zap, TrendingUp, CheckCircle2, X } from 'lucide-react-native';

interface FoodItem { id: string; name: string; emoji: string; category: 'energy' | 'protein' | 'fresh'; colors: [string,string]; quality: 'great' | 'okay' | 'poor'; }

const foodItems: FoodItem[] = [
  { id: 'sandwich', name: 'Sandwich', emoji: '🥪', category: 'energy', colors: ['#f59e0b', '#f97316'], quality: 'great' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'energy', colors: ['#f59e0b', '#f97316'], quality: 'great' },
  { id: 'rice', name: 'Rice Bowl', emoji: '🍚', category: 'energy', colors: ['#f59e0b', '#f97316'], quality: 'great' },
  { id: 'wrap', name: 'Wrap', emoji: '🌯', category: 'energy', colors: ['#f59e0b', '#f97316'], quality: 'great' },
  { id: 'crackers', name: 'Crackers', emoji: '🍘', category: 'energy', colors: ['#f59e0b', '#f97316'], quality: 'okay' },
  { id: 'chips', name: 'Chips', emoji: '🍟', category: 'energy', colors: ['#ef4444', '#f43f5e'], quality: 'poor' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'protein', colors: ['#ef4444', '#f43f5e'], quality: 'great' },
  { id: 'eggs', name: 'Boiled Eggs', emoji: '🥚', category: 'protein', colors: ['#ef4444', '#f43f5e'], quality: 'great' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'protein', colors: ['#ef4444', '#f43f5e'], quality: 'great' },
  { id: 'yogurt', name: 'Yogurt', emoji: '🥛', category: 'protein', colors: ['#ef4444', '#f43f5e'], quality: 'great' },
  { id: 'nuts', name: 'Nuts', emoji: '🥜', category: 'protein', colors: ['#ef4444', '#f43f5e'], quality: 'great' },
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'carrot', name: 'Carrot Sticks', emoji: '🥕', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'tomato', name: 'Cherry Tomatoes', emoji: '🍅', category: 'fresh', colors: ['#16a34a', '#059669'], quality: 'great' },
  { id: 'candy', name: 'Candy', emoji: '🍬', category: 'fresh', colors: ['#ef4444', '#f43f5e'], quality: 'poor' },
];

export function Kids8LunchBuilder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [lunchbox, setLunchbox] = useState<FoodItem[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<'great' | 'okay' | 'improve'>('okay');
  const [tips, setTips] = useState<string[]>([]);

  const isBalanced = () => ({
    energy: lunchbox.some(i => i.category === 'energy'),
    protein: lunchbox.some(i => i.category === 'protein'),
    fresh: lunchbox.some(i => i.category === 'fresh'),
  });

  const calculateRating = async () => {
    if (lunchbox.length === 0) return;
    const greatItems = lunchbox.filter(i => i.quality === 'great').length;
    const poorItems = lunchbox.filter(i => i.quality === 'poor').length;
    const bal = isBalanced();
    const balanced = bal.energy && bal.protein && bal.fresh;
    const newTips: string[] = [];
    if (balanced && greatItems >= 3 && poorItems === 0) {
      setRating('great'); newTips.push('Perfect fuel for peak performance'); newTips.push('Midday energy comes from balanced carbs + protein');
    } else if (poorItems > 1 || !balanced) {
      setRating('improve');
      if (!balanced) newTips.push('Try adding items from all three groups');
      if (lunchbox.some(i => i.id === 'chips')) newTips.push('Chips → Popcorn (more energy, less oil)');
      if (lunchbox.some(i => i.id === 'candy')) newTips.push('Candy → Fresh fruit + yogurt');
      newTips.push('Athletes need balanced meals for training');
    } else {
      setRating('okay'); newTips.push('Good start! A few small upgrades would help');
      if (!bal.fresh) newTips.push('Add some fresh fruit or veg for vitamins');
    }
    setTips(newTips);
    setShowRating(true);
    const xp = rating === 'great' ? 10 : rating === 'okay' ? 5 : 3;
    const current = await storage.getItem('kids8UserXP');
    await storage.setItem('kids8UserXP', String(parseInt(current || '0') + xp));
  };

  const bal = isBalanced();
  const energyFoods = foodItems.filter(f => f.category === 'energy');
  const proteinFoods = foodItems.filter(f => f.category === 'protein');
  const freshFoods = foodItems.filter(f => f.category === 'fresh');

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>School Lunch Coach</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => { setLunchbox([]); setShowRating(false); }} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['#16a34a', '#059669']} style={styles.infoCard}>
            <Text style={{ fontSize: 36, marginRight: 10 }}>🍱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Rate & Improve Your Meals</Text>
              <Text style={styles.infoText}>Add what you're eating for lunch, and get tips to fuel your performance.</Text>
            </View>
          </LinearGradient>

          {/* Progress indicators */}
          <View style={styles.progressRow}>
            {[{ key: 'energy', emoji: '⚡', label: 'Energy', done: bal.energy, colors: ['#f59e0b', '#f97316'] as [string,string] }, { key: 'protein', emoji: '💪', label: 'Protein', done: bal.protein, colors: ['#ef4444', '#f43f5e'] as [string,string] }, { key: 'fresh', emoji: '🥗', label: 'Fresh', done: bal.fresh, colors: ['#16a34a', '#059669'] as [string,string] }].map(item => (
              <View key={item.key} style={[styles.progressItem, item.done && styles.progressDone]}>
                {item.done ? (
                  <LinearGradient colors={item.colors} style={styles.progressInner}>
                    <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                    <Text style={styles.progressLabel}>{item.label}</Text>
                    <CheckCircle2 size={14} color="#fff" />
                  </LinearGradient>
                ) : (
                  <View style={styles.progressInnerEmpty}>
                    <Text style={{ fontSize: 24, opacity: 0.4 }}>{item.emoji}</Text>
                    <Text style={[styles.progressLabel, { color: 'rgba(255,255,255,0.4)' }]}>{item.label}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Lunchbox */}
          <View style={styles.lunchbox}>
            <Text style={styles.lunchboxTitle}>🍱 My Lunchbox ({lunchbox.length}/6)</Text>
            {lunchbox.length === 0 ? (
              <Text style={styles.lunchboxEmpty}>Tap foods below to add them!</Text>
            ) : (
              <>
                <View style={styles.foodGrid}>
                  {lunchbox.map(item => (
                    <View key={item.id} style={{ position: 'relative', width: '30%' }}>
                      <LinearGradient colors={item.colors} style={styles.foodInBox}>
                        <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                        <Text style={styles.foodInBoxName}>{item.name}</Text>
                      </LinearGradient>
                      <TouchableOpacity activeOpacity={0.85} onPress={() => { setLunchbox(lunchbox.filter(i => i.id !== item.id)); setShowRating(false); }} style={styles.removeBtn}>
                        <X size={12} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {lunchbox.length >= 2 && !showRating && (
                  <TouchableOpacity activeOpacity={0.85} onPress={calculateRating}>
                    <LinearGradient colors={['#2563eb', '#0891b2']} style={styles.rateBtn}>
                      <TrendingUp size={18} color="#fff" />
                      <Text style={styles.rateBtnText}>Rate My Lunch</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Food categories */}
          {[{ label: '⚡ ENERGY FOODS', items: energyFoods }, { label: '💪 PROTEIN FOODS', items: proteinFoods }, { label: '🥗 FRESH FOODS', items: freshFoods }].map(cat => (
            <View key={cat.label} style={{ marginBottom: 16 }}>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <View style={styles.itemsRow}>
                {cat.items.map(item => {
                  const inBox = !!lunchbox.find(i => i.id === item.id);
                  return (
                    <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => { if (!inBox && lunchbox.length < 6) setLunchbox([...lunchbox, item]); }} disabled={inBox || lunchbox.length >= 6} style={[styles.foodItem, inBox && styles.foodItemUsed]}>
                      <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal visible={showRating} transparent animationType="slide" onRequestClose={() => setShowRating(false)}>
          <View style={styles.modalOverlay}>
            <LinearGradient colors={['#16a34a', '#059669']} style={styles.ratingModal}>
              <Text style={{ fontSize: 72, textAlign: 'center', marginBottom: 12 }}>🏆</Text>
              <Text style={styles.ratingTitle}>{rating === 'great' ? 'Awesome Lunch!' : rating === 'okay' ? 'Good Start!' : 'Could Be Better!'}</Text>
              <Text style={styles.ratingMsg}>{rating === 'great' ? 'Great fuel for your training! That balanced meal will power you through the whole day! 💪⚽' : 'Here are some tips to fuel better:'}</Text>
              {tips.map((tip, i) => <Text key={i} style={styles.ratingTip}>• {tip}</Text>)}
              <View style={styles.xpBox}>
                <Zap size={22} color="#fde68a" />
                <Text style={styles.xpText}>+{rating === 'great' ? 10 : rating === 'okay' ? 5 : 3} Points</Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setShowRating(false)} style={styles.keepBuildingBtn}>
                <Text style={styles.keepBuildingText}>Keep Building! 🍱</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.dashBtn}>
                <Text style={styles.dashBtnText}>Back to Dashboard</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
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
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  resetBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  resetText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#bbf7d0', lineHeight: 17 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  progressItem: { flex: 1 },
  progressDone: {},
  progressInner: { borderRadius: 14, padding: 10, alignItems: 'center', gap: 2 },
  progressInnerEmpty: { borderRadius: 14, padding: 10, alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  progressLabel: { fontSize: 11, fontWeight: '700', color: '#fff' },
  lunchbox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)', borderStyle: 'dashed', padding: 16, marginBottom: 16, minHeight: 100 },
  lunchboxTitle: { fontSize: 15, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  lunchboxEmpty: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, paddingVertical: 16 },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  foodInBox: { borderRadius: 14, padding: 8, alignItems: 'center', width: '100%' },
  foodInBoxName: { fontSize: 9, color: '#fff', fontWeight: '700', textAlign: 'center', marginTop: 2 },
  removeBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#ef4444', borderRadius: 50, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  rateBtn: { borderRadius: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  rateBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  catLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodItem: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', width: '18%' },
  foodItemUsed: { opacity: 0.3, backgroundColor: 'rgba(255,255,255,0.05)' },
  foodItemName: { fontSize: 9, color: '#fff', fontWeight: '700', textAlign: 'center', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  ratingModal: { borderRadius: 32, padding: 24, margin: 0 },
  ratingTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  ratingMsg: { fontSize: 14, color: '#bbf7d0', textAlign: 'center', marginBottom: 10, lineHeight: 20 },
  ratingTip: { fontSize: 13, color: '#fff', marginBottom: 4, paddingHorizontal: 8 },
  xpBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, marginVertical: 12 },
  xpText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  keepBuildingBtn: { backgroundColor: '#fff', borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  keepBuildingText: { fontSize: 16, fontWeight: '800', color: '#16a34a' },
  dashBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingVertical: 12, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  dashBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
