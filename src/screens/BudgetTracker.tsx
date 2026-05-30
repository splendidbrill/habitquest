import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, TrendingDown, PiggyBank, CheckCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

const swapsMade = [
  { from: 'Fizzy drinks', to: 'Fruit water', savedPerWeek: 3.2, timesUsed: 4 },
  { from: 'Shop-bought juice', to: 'Diluted juice', savedPerWeek: 2.4, timesUsed: 3 },
  { from: 'Crisps', to: 'Homemade popcorn', savedPerWeek: 1.8, timesUsed: 2 },
];

export function BudgetTracker() {
  const navigation = useNavigation();

  const weeklyGroceryCost = 45.2;
  const previousWeekCost = 52.8;
  const monthlySavings = 28.6;
  const totalSavedThisWeek = swapsMade.reduce((t, s) => t + s.savedPerWeek, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Healthy Budget Tracker</Text>
          <Text style={styles.subtitle}>Save money, eat better</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.savedCard}
      >
        <TrendingDown size={48} color={colors.secondary} style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={[styles.savedTitle, { textAlign: 'center' }]}>Money saved this week</Text>
        <Text style={styles.savedAmount}>£{totalSavedThisWeek.toFixed(2)}</Text>
        <Text style={styles.savedSub}>Through healthier swaps</Text>
      </LinearGradient>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <PiggyBank size={18} color={colors.primary} />
            <Text style={styles.statLabel}>This week</Text>
          </View>
          <Text style={[styles.statNum, { color: colors.primary }]}>£{weeklyGroceryCost.toFixed(2)}</Text>
          <Text style={styles.statSub}>Estimated grocery cost</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingDown size={18} color={colors.secondary} />
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <Text style={[styles.statNum, { color: colors.secondary }]}>£{(previousWeekCost - weeklyGroceryCost).toFixed(2)}</Text>
          <Text style={styles.statSub}>vs. last week</Text>
        </Card>
      </View>

      <Card style={styles.projectionCard}>
        <View style={styles.projectionRow}>
          <View>
            <Text style={styles.projectionTitle}>Monthly savings projection</Text>
            <Text style={styles.projectionSub}>Based on current swaps</Text>
          </View>
          <Text style={styles.projectionAmount}>£{monthlySavings.toFixed(2)}</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Your healthy swaps this week</Text>
      <View style={styles.swapsList}>
        {swapsMade.map((swap, i) => (
          <Card key={i} style={styles.swapCard}>
            <View style={styles.swapRow}>
              <CheckCircle size={20} color={colors.secondary} style={{ flexShrink: 0, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <View style={styles.swapNames}>
                  <Text style={styles.swapFrom}>{swap.from}</Text>
                  <Text style={styles.swapArrow}>→</Text>
                  <Text style={styles.swapTo}>{swap.to}</Text>
                </View>
                <Text style={styles.swapUsed}>
                  Used {swap.timesUsed} time{swap.timesUsed !== 1 ? 's' : ''} this week
                </Text>
                <View style={styles.swapSavings}>
                  <TrendingDown size={14} color={colors.secondary} />
                  <Text style={styles.swapSavingsText}>Saved £{swap.savedPerWeek.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Want to save even more?</Text>
        <Text style={styles.ctaText}>
          Check out our full list of healthy swaps to find more ways to save money while eating better.
        </Text>
        <Button onPress={() => (navigation as any).navigate('HealthySwaps')} style={[styles.ctaBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primaryForeground }}>View all healthy swaps</Text>
        </Button>
      </Card>

      <LinearGradient
        colors={[withOpacity(colors.primary, 0.1), withOpacity(colors.secondary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.annualCard}
      >
        <Text style={styles.annualSub}>If you keep this up for a year:</Text>
        <Text style={styles.annualAmount}>£{(monthlySavings * 12).toFixed(2)}</Text>
        <Text style={styles.annualNote}>saved annually - that's money for family treats, holidays, or savings!</Text>
      </LinearGradient>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  savedCard: { borderRadius: radius, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  savedTitle: { ...typography.h3, marginBottom: 6 },
  savedAmount: { fontSize: 56, fontWeight: '700', color: colors.secondary, textAlign: 'center', marginBottom: 4 },
  savedSub: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: { flex: 1, padding: 20 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  statLabel: { fontSize: 13, fontWeight: '500', color: colors.foreground },
  statNum: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  statSub: { fontSize: 11, color: colors.mutedForeground },
  projectionCard: { padding: 20, marginBottom: 16, backgroundColor: withOpacity(colors.accent, 0.5), borderColor: colors.accent },
  projectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectionTitle: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 4 },
  projectionSub: { fontSize: 12, color: colors.mutedForeground },
  projectionAmount: { fontSize: 28, fontWeight: '700', color: colors.accentForeground },
  sectionTitle: { ...typography.h3, marginBottom: 12 },
  swapsList: { gap: 8, marginBottom: 16 },
  swapCard: { padding: 16 },
  swapRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  swapNames: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  swapFrom: { fontSize: 13, color: colors.mutedForeground, textDecorationLine: 'line-through' },
  swapArrow: { fontSize: 11, color: colors.mutedForeground },
  swapTo: { fontSize: 13, fontWeight: '500', color: colors.primary },
  swapUsed: { fontSize: 12, color: colors.mutedForeground, marginBottom: 6 },
  swapSavings: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swapSavingsText: { fontSize: 13, fontWeight: '500', color: colors.secondary },
  ctaCard: { padding: 20, alignItems: 'center', marginBottom: 14 },
  ctaTitle: { ...typography.h3, marginBottom: 8 },
  ctaText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  ctaBtn: { alignSelf: 'stretch' },
  annualCard: { borderRadius: radius, padding: 20, borderWidth: 1, borderColor: withOpacity(colors.primary, 0.2), alignItems: 'center' },
  annualSub: { fontSize: 13, color: colors.mutedForeground, marginBottom: 8 },
  annualAmount: { fontSize: 40, fontWeight: '700', color: colors.primary, marginBottom: 8 },
  annualNote: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
});
