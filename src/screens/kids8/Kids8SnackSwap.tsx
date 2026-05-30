import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { ArrowLeft, ArrowRight, Zap, TrendingUp } from 'lucide-react-native';

const snackSwaps = [
  { id: 'crisps-popcorn', junkFood: { name: 'Crisps', emoji: '🍟' }, athleteUpgrade: { name: 'Air-Popped Popcorn', emoji: '🍿' }, benefit: 'Same crunch, 60% less fat, more fiber for steady energy!', sportsImpact: 'Keeps you full longer without the grease that slows you down' },
  { id: 'chocolate-banana', junkFood: { name: 'Chocolate Bar', emoji: '🍫' }, athleteUpgrade: { name: 'Banana + Peanut Butter', emoji: '🍌🥜' }, benefit: 'Natural sugars + protein = sustained energy, not a sugar crash!', sportsImpact: 'Pro tennis players eat this before matches for long-lasting power' },
  { id: 'fizzy-water', junkFood: { name: 'Fizzy Drink', emoji: '🥤' }, athleteUpgrade: { name: 'Flavoured Water', emoji: '💧🍋' }, benefit: 'Hydration without sugar crash. Add lemon, cucumber, or berries!', sportsImpact: 'Athletes hydrate with water. Soda = dehydration + energy crash' },
  { id: 'sweets-fruit', junkFood: { name: 'Gummy Sweets', emoji: '🍬' }, athleteUpgrade: { name: 'Fresh Grapes', emoji: '🍇' }, benefit: 'Natural sweetness + vitamins that help you recover faster!', sportsImpact: 'Fruits have antioxidants that reduce muscle soreness' },
  { id: 'cookies-oatcakes', junkFood: { name: 'Cookies', emoji: '🍪' }, athleteUpgrade: { name: 'Oatcakes + Cheese', emoji: '🧀🌾' }, benefit: 'Complex carbs + protein = energy that lasts for hours!', sportsImpact: 'Oats are what marathon runners eat before races' },
  { id: 'ice-cream-yogurt', junkFood: { name: 'Ice Cream', emoji: '🍦' }, athleteUpgrade: { name: 'Greek Yogurt + Berries', emoji: '🥛🫐' }, benefit: 'Protein for muscle recovery + probiotics for gut health!', sportsImpact: 'Bodybuilders eat Greek yogurt after training for muscle growth' },
  { id: 'cereal-oats', junkFood: { name: 'Sugary Cereal', emoji: '🥣' }, athleteUpgrade: { name: 'Porridge + Banana', emoji: '🥣🍌' }, benefit: 'Slow-release energy that powers you through the whole morning!', sportsImpact: 'Olympic athletes fuel up with oats before competition' },
  { id: 'juice-smoothie', junkFood: { name: 'Fruit Juice', emoji: '🧃' }, athleteUpgrade: { name: 'Fruit Smoothie', emoji: '🥤🍓' }, benefit: 'Whole fruit = fiber + nutrients, not just sugar water!', sportsImpact: 'Keeps blood sugar stable so you don\'t crash mid-game' },
];

export function Kids8SnackSwap() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedSwap, setSelectedSwap] = useState<typeof snackSwaps[0] | null>(null);

  return (
    <LinearGradient colors={['#0f172a', '#431407', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Fuel for the Game ⚽</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#ea580c', '#d97706']} style={styles.infoCard}>
            <Text style={{ fontSize: 44, marginRight: 12 }}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Athlete Upgrades</Text>
              <Text style={styles.infoText}>Swap everyday snacks for athlete upgrades! These smart choices will boost your performance on the field.</Text>
            </View>
          </LinearGradient>

          <View style={styles.swapGrid}>
            {snackSwaps.map(swap => (
              <TouchableOpacity key={swap.id} activeOpacity={0.85} onPress={() => setSelectedSwap(swap)} style={styles.swapCard}>
                <View style={styles.swapEmojis}>
                  <Text style={{ fontSize: 32 }}>{swap.junkFood.emoji}</Text>
                  <ArrowRight size={20} color="#fb923c" />
                  <Text style={{ fontSize: 32 }}>{swap.athleteUpgrade.emoji}</Text>
                </View>
                <Text style={styles.swapJunkName}>{swap.junkFood.name}</Text>
                <Text style={styles.swapUpgradeName}>{swap.athleteUpgrade.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.proTip}>
            <Zap size={22} color="#4ade80" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.proTipTitle}>Smart Swapping</Text>
              <Text style={styles.proTipText}>You don't have to give up treats forever! Smart athletes make better choices most of the time. 80/20 rule! 💪</Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={!!selectedSwap} transparent animationType="slide" onRequestClose={() => setSelectedSwap(null)}>
          <View style={styles.modalOverlay}>
            {selectedSwap && (
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Athlete Upgrade</Text>
                <View style={styles.swapDetailRow}>
                  <View style={styles.swapSide}>
                    <Text style={{ fontSize: 52, marginBottom: 6 }}>{selectedSwap.junkFood.emoji}</Text>
                    <Text style={styles.swapSideName}>{selectedSwap.junkFood.name}</Text>
                  </View>
                  <ArrowRight size={36} color="#fb923c" />
                  <View style={styles.swapSide}>
                    <Text style={{ fontSize: 52, marginBottom: 6 }}>{selectedSwap.athleteUpgrade.emoji}</Text>
                    <Text style={[styles.swapSideName, { fontWeight: '800', color: '#fff' }]}>{selectedSwap.athleteUpgrade.name}</Text>
                  </View>
                </View>

                <View style={styles.benefitBox}>
                  <Zap size={18} color="#4ade80" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.benefitTitle}>Why It's Better</Text>
                    <Text style={styles.benefitText}>{selectedSwap.benefit}</Text>
                  </View>
                </View>

                <View style={styles.impactBox}>
                  <TrendingUp size={18} color="#60a5fa" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.impactTitle}>Performance Boost</Text>
                    <Text style={styles.impactText}>{selectedSwap.sportsImpact}</Text>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedSwap(null)}>
                  <LinearGradient colors={['#ea580c', '#d97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gotItBtn}>
                    <Text style={styles.gotItText}>Got It! 💪</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  infoTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#fed7aa', lineHeight: 17 },
  swapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  swapCard: { width: '46%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  swapEmojis: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 },
  swapJunkName: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 2 },
  swapUpgradeName: { fontSize: 12, fontWeight: '800', color: '#fff', textAlign: 'center' },
  proTip: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  proTipTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  proTipText: { fontSize: 13, color: '#bbf7d0', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  modalLabel: { fontSize: 11, fontWeight: '800', color: '#fb923c', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 16 },
  swapDetailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 },
  swapSide: { alignItems: 'center' },
  swapSideName: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  benefitBox: { flexDirection: 'row', backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', marginBottom: 10 },
  benefitTitle: { fontSize: 13, fontWeight: '800', color: '#4ade80', marginBottom: 2 },
  benefitText: { fontSize: 13, color: '#bbf7d0', lineHeight: 18 },
  impactBox: { flexDirection: 'row', backgroundColor: 'rgba(37,99,235,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', marginBottom: 16 },
  impactTitle: { fontSize: 13, fontWeight: '800', color: '#60a5fa', marginBottom: 2 },
  impactText: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  gotItBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  gotItText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
