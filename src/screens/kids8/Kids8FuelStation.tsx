import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Zap, TrendingUp, Award, Target, Flame, Brain, Dumbbell } from 'lucide-react-native';

const fuelOptions = [
  {
    id: 'protein-power', emoji: '🥚', name: 'Protein Power', category: 'Muscle Builder',
    colors: ['#ef4444', '#f97316'] as [string, string],
    foods: ['Eggs', 'Chicken', 'Paneer', 'Dal', 'Fish'],
    performance: [
      { icon: '💪', benefit: 'Builds muscle faster after training' },
      { icon: '⚡', benefit: 'Repairs your body after hard workouts' },
      { icon: '🏃', benefit: 'Helps you recover quicker for next match' },
    ],
    sportsImpact: 'Football players need protein to sprint faster and tackle stronger. Your muscles grow when you rest - protein helps that happen!',
    vsJunk: 'A chicken sandwich keeps you full for 3-4 hours. Chips? 30 minutes, then you\'re hungry and tired.',
    performanceTip: 'Eat protein within 30 minutes after training for maximum muscle growth!',
  },
  {
    id: 'energy-carbs', emoji: '🍚', name: 'Energy Fuel', category: 'Performance Boost',
    colors: ['#f59e0b', '#eab308'] as [string, string],
    foods: ['Rice', 'Roti', 'Oats', 'Sweet Potato', 'Whole Wheat Pasta'],
    performance: [
      { icon: '⚡', benefit: 'Energy that lasts the whole match' },
      { icon: '🧠', benefit: 'Keeps your brain sharp for game strategy' },
      { icon: '🏃', benefit: 'Fuel for running and explosive movements' },
    ],
    sportsImpact: 'Carbs = Energy! Athletes eat rice and pasta before big games because it gives steady power.',
    vsJunk: 'Rice gives you 2-3 hours of steady energy. Chocolate bar? Quick spike, then you crash hard after 20 minutes.',
    performanceTip: 'Eat complex carbs 2-3 hours before training - you\'ll feel the difference in your stamina!',
  },
  {
    id: 'hydration-hero', emoji: '💧', name: 'Hydration Station', category: 'Performance Essential',
    colors: ['#3b82f6', '#0891b2'] as [string, string],
    foods: ['Water', 'Coconut Water', 'Cucumber', 'Watermelon', 'Buttermilk'],
    performance: [
      { icon: '🏃', benefit: 'Run faster when properly hydrated' },
      { icon: '🧠', benefit: 'Think clearer during games' },
      { icon: '❤️', benefit: 'Your heart works better when hydrated' },
    ],
    sportsImpact: 'Just 2% dehydration = 10% drop in performance! Pro athletes drink water constantly.',
    vsJunk: 'Water keeps you performing at 100%. Soda has sugar that makes you thirsty, slows you down, and crashes your energy.',
    performanceTip: 'Drink water before you\'re thirsty! By the time you feel thirsty, you\'re already dehydrated.',
  },
  {
    id: 'vitamin-boost', emoji: '🥬', name: 'Recovery Greens', category: 'Health & Defense',
    colors: ['#16a34a', '#059669'] as [string, string],
    foods: ['Spinach', 'Broccoli', 'Peppers', 'Carrots', 'Tomatoes'],
    performance: [
      { icon: '🛡️', benefit: 'Protects from getting sick before big matches' },
      { icon: '⚡', benefit: 'Vitamins help convert food to energy faster' },
      { icon: '💪', benefit: 'Helps muscles recover and grow stronger' },
    ],
    sportsImpact: 'Vegetables have vitamins that help your body use protein and carbs better. Top athletes eat tons of veggies for recovery!',
    vsJunk: 'Veggies give you nutrients that help you play better. Junk food gives you calories but no performance benefits.',
    performanceTip: 'Eat rainbow colors - different colors = different vitamins your body needs to perform!',
  },
];

export function Kids8FuelStation() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectFuel = (fuelId: string) => {
    setSelectedFuel(fuelId);
    setShowModal(true);
  };

  const handleLogFuel = async () => {
    setShowModal(false);
    const pts = await storage.getItem('kids8FamilyPoints');
    await storage.setItem('kids8FamilyPoints', String(parseInt(pts || '0') + 2));
    const badgesStr = await storage.getItem('kids8EarnedBadges');
    const badges: string[] = badgesStr ? JSON.parse(badgesStr) : [];
    if (!badges.includes('fuel-master')) {
      badges.push('fuel-master');
      await storage.setItem('kids8EarnedBadges', JSON.stringify(badges));
    }
  };

  const selectedFuelData = fuelOptions.find(f => f.id === selectedFuel);

  return (
    <LinearGradient colors={['#0f172a', '#1e3a8a', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Fuel Station ⚡</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#2563eb', '#0891b2']} style={styles.infoCard}>
            <Flame size={32} color="#fde68a" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Fuel Like a Pro Athlete</Text>
              <Text style={styles.infoText}>
                Your body is a high-performance machine. What you eat directly affects how fast you run, how strong you are, and how long you can play!
              </Text>
            </View>
          </LinearGradient>

          {fuelOptions.map(fuel => (
            <TouchableOpacity key={fuel.id} activeOpacity={0.85} onPress={() => handleSelectFuel(fuel.id)} style={{ marginBottom: 14 }}>
              <LinearGradient colors={fuel.colors} style={styles.fuelCard}>
                <Text style={styles.fuelEmoji}>{fuel.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fuelCategory}>{fuel.category}</Text>
                  <Text style={styles.fuelName}>{fuel.name}</Text>
                  <View style={styles.foodTags}>
                    {fuel.foods.slice(0, 3).map((food, i) => (
                      <View key={i} style={styles.foodTag}><Text style={styles.foodTagText}>{food}</Text></View>
                    ))}
                    {fuel.foods.length > 3 && (
                      <View style={styles.foodTag}><Text style={styles.foodTagText}>+{fuel.foods.length - 3} more</Text></View>
                    )}
                  </View>
                </View>
                <Target size={22} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <View style={styles.proTip}>
            <Brain size={22} color="#c084fc" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.proTipTitle}>Pro Tip</Text>
              <Text style={styles.proTipText}>
                Professional athletes track their nutrition like training. Smart fuel choices = Better performance on the field! 🏆
              </Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            {selectedFuelData && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={{ textAlign: 'center', fontSize: 80, marginBottom: 8 }}>{selectedFuelData.emoji}</Text>
                <Text style={styles.modalCategory}>{selectedFuelData.category}</Text>
                <Text style={styles.modalName}>{selectedFuelData.name}</Text>

                <View style={styles.foodTagsRow}>
                  {selectedFuelData.foods.map((food, i) => (
                    <LinearGradient key={i} colors={selectedFuelData.colors} style={styles.modalFoodTag}>
                      <Text style={styles.modalFoodTagText}>{food}</Text>
                    </LinearGradient>
                  ))}
                </View>

                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Dumbbell size={18} color="#60a5fa" />
                    <Text style={styles.modalSectionTitle}>Performance Benefits:</Text>
                  </View>
                  {selectedFuelData.performance.map((perf, i) => (
                    <View key={i} style={styles.perfItem}>
                      <Text style={{ fontSize: 28, marginRight: 10 }}>{perf.icon}</Text>
                      <Text style={styles.perfText}>{perf.benefit}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.impactBox}>
                  <TrendingUp size={18} color="#4ade80" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.impactTitle}>Sports Impact</Text>
                    <Text style={styles.impactText}>{selectedFuelData.sportsImpact}</Text>
                  </View>
                </View>

                <View style={styles.junkBox}>
                  <Zap size={18} color="#fb923c" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.junkTitle}>Smart Choice vs Junk</Text>
                    <Text style={styles.junkText}>{selectedFuelData.vsJunk}</Text>
                  </View>
                </View>

                <View style={styles.tipBox}>
                  <Award size={18} color="#c084fc" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.tipTitle}>Pro Athlete Tip</Text>
                    <Text style={styles.tipText}>{selectedFuelData.performanceTip}</Text>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.85} onPress={handleLogFuel} style={{ marginBottom: 12 }}>
                  <LinearGradient colors={selectedFuelData.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logBtn}>
                    <Zap size={20} color="#fff" />
                    <Text style={styles.logBtnText}>I'm Fueling Smart! +2 Points</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.85} onPress={() => setShowModal(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Explore More Options</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
              </ScrollView>
            )}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  infoCard: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  fuelCard: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  fuelEmoji: { fontSize: 52 },
  fuelCategory: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  fuelName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  foodTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  foodTag: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  foodTagText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  proTip: { flexDirection: 'row', backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(147,51,234,0.3)', alignItems: 'flex-start' },
  proTipTitle: { fontSize: 14, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  proTipText: { fontSize: 13, color: '#e9d5ff', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 32, padding: 24, maxHeight: '90%' },
  modalCategory: { fontSize: 11, fontWeight: '800', color: '#60a5fa', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  modalName: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 14 },
  foodTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 },
  modalFoodTag: { borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8 },
  modalFoodTagText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  modalSection: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, marginBottom: 12 },
  modalSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  modalSectionTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  perfItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  perfText: { flex: 1, fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  impactBox: { flexDirection: 'row', backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', marginBottom: 10 },
  impactTitle: { fontSize: 13, fontWeight: '800', color: '#4ade80', marginBottom: 4 },
  impactText: { fontSize: 13, color: '#bbf7d0', lineHeight: 18 },
  junkBox: { flexDirection: 'row', backgroundColor: 'rgba(234,88,12,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(251,146,60,0.3)', marginBottom: 10 },
  junkTitle: { fontSize: 13, fontWeight: '800', color: '#fb923c', marginBottom: 4 },
  junkText: { fontSize: 13, color: '#fed7aa', lineHeight: 18 },
  tipBox: { flexDirection: 'row', backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)', marginBottom: 16 },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#c084fc', marginBottom: 4 },
  tipText: { fontSize: 13, color: '#e9d5ff', lineHeight: 18 },
  logBtn: { borderRadius: 50, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
