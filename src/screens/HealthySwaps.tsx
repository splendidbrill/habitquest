import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, TrendingDown, Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';
import { loadFamilyProfile } from '../data/familyProfile';

const healthySwaps = [
  {
    id: '1',
    from: 'Fizzy drinks/soda',
    to: 'Water with sliced fruit (lemon, cucumber, berries)',
    why: 'Same refreshment, no sugar, much cheaper',
    savings: 'Save £10-15/month',
    emoji: '🥤➡️💧',
  },
  {
    id: '2',
    from: 'Shop-bought juice',
    to: 'Homemade fruit water or diluted juice (1:3 ratio)',
    why: 'Less sugar, better teeth, costs pennies',
    savings: 'Save £8-12/month',
    emoji: '🧃➡️🍊',
  },
  {
    id: '3',
    from: 'Crisps as snacks',
    to: 'Popcorn (plain, air-popped with a tiny bit of butter)',
    why: 'More filling, fun to make together, 1/3 the price',
    savings: 'Save £5-8/month',
    emoji: '🥔➡️🍿',
  },
  {
    id: '4',
    from: 'Shop-bought biscuits',
    to: 'Homemade chapati with a little jam or cheese',
    why: 'Lower sugar, uses ingredients you have, kids can help make it',
    savings: 'Save £6-10/month',
    emoji: '🍪➡️🫓',
  },
  {
    id: '5',
    from: 'Breakfast cereal (sugary)',
    to: 'Porridge with banana or jam',
    why: 'Fills them up longer, costs less, no mid-morning hunger',
    savings: 'Save £10-15/month',
    emoji: '🥣➡️🍚',
  },
  {
    id: '6',
    from: 'Chicken nuggets (frozen)',
    to: 'Homemade chicken strips (chicken breast, breadcrumbs, mild spices)',
    why: 'Better quality protein, let kids coat them, similar price',
    savings: 'Same cost, better quality',
    emoji: '🍗➡️🍖',
  },
  {
    id: '7',
    from: 'Chocolate bars',
    to: 'Fruit with a small square of chocolate or yogurt',
    why: 'Still feels like a treat, adds vitamins, costs less',
    savings: 'Save £5-8/month',
    emoji: '🍫➡️🍓',
  },
  {
    id: '8',
    from: 'White bread',
    to: '50/50 or wholemeal bread (start gradually)',
    why: 'More filling, more fiber, same price or cheaper',
    savings: 'Same cost, better nutrition',
    emoji: '🍞➡️🍞',
  },
  {
    id: '9',
    from: 'Individual yogurt pots',
    to: 'Large tub of natural yogurt + fruit or jam',
    why: 'Much cheaper per serving, less packaging',
    savings: 'Save £8-12/month',
    emoji: '🥛➡️🫙',
  },
  {
    id: '10',
    from: 'Takeaway pizza',
    to: 'Chapati pizza made at home',
    why: 'Fun to make together, much cheaper, you control the toppings',
    savings: 'Save £15-20/month',
    emoji: '🍕➡️🫓',
  },
];

export function HealthySwaps() {
  const navigation = useNavigation();
  const [sortedSwaps, setSortedSwaps] = useState(healthySwaps);

  useEffect(() => {
    loadFamilyProfile().then(profile => {
      if (!profile) return;
      const cultures = profile.cultures;
      const allergies = profile.dietary;

      // Filter out swaps that conflict with allergies
      const filtered = healthySwaps.filter(swap => {
        const text = `${swap.from} ${swap.to}`.toLowerCase();
        if (
          allergies.includes('Dairy allergy/intolerance') &&
          text.includes('cheese')
        )
          return false;
        if (allergies.includes('Nut allergy') && text.includes('peanut'))
          return false;
        if (
          allergies.includes('Gluten intolerance/coeliac') &&
          (text.includes('bread') || text.includes('chapati'))
        )
          return false;
        return true;
      });

      // Boost culturally relevant swaps to the top
      const isSouthAsian = cultures.some(c => c.includes('South Asian'));
      const boosted = [...filtered].sort((a, b) => {
        const aText = `${a.from} ${a.to}`.toLowerCase();
        const bText = `${b.from} ${b.to}`.toLowerCase();
        const aRelevant =
          isSouthAsian && (aText.includes('chapati') || aText.includes('dal'));
        const bRelevant =
          isSouthAsian && (bText.includes('chapati') || bText.includes('dal'));
        if (aRelevant && !bRelevant) return -1;
        if (bRelevant && !aRelevant) return 1;
        return 0;
      });

      setSortedSwaps(boosted);
    });
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Healthy Swaps</Text>
          <Text style={styles.subtitle}>
            Simple, budget-friendly alternatives
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={[
          withOpacity(colors.secondary, 0.2),
          withOpacity(colors.primary, 0.1),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.savingsCard}
      >
        <View style={styles.savingsInner}>
          <View style={styles.savingsIcon}>
            <TrendingDown size={24} color={colors.secondaryForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.savingsLabel}>Potential Savings</Text>
            <Text style={styles.savingsAmount}>£50-80/month</Text>
            <Text style={styles.savingsSub}>
              If you make just half these swaps consistently
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Card
        style={[
          styles.infoCard,
          { backgroundColor: colors.accent, borderColor: colors.accent },
        ]}
      >
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>💡 Remember:</Text> Make changes
          gradually. Even one or two swaps make a real difference. No need to do
          everything at once!
        </Text>
      </Card>

      <View style={styles.list}>
        {sortedSwaps.map(swap => (
          <Card key={swap.id} style={styles.swapCard}>
            <View style={styles.swapTop}>
              <Text style={styles.swapEmoji}>{swap.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.swapFrom}>{swap.from}</Text>
                <Text style={styles.swapTo}>{swap.to}</Text>
              </View>
            </View>
            <Text style={styles.swapWhy}>{swap.why}</Text>
            <View style={styles.savingsRow}>
              <TrendingDown size={14} color={colors.secondary} />
              <Text style={styles.savingsText}>{swap.savings}</Text>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.ctaCard}>
        <Heart
          size={40}
          color={colors.primary}
          style={{ alignSelf: 'center', marginBottom: 12 }}
        />
        <Text style={styles.ctaTitle}>Every small change counts</Text>
        <Text style={styles.ctaText}>
          You're not expected to be perfect. Pick one or two swaps to try this
          week and see how it goes.
        </Text>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  savingsCard: {
    borderRadius: radius,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: withOpacity(colors.secondary, 0.3),
  },
  savingsInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  savingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: withOpacity(colors.secondary, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  savingsLabel: { ...typography.h4, marginBottom: 4 },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  savingsSub: { fontSize: 12, color: colors.mutedForeground },
  infoCard: { padding: 16, marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
  list: { gap: 12, marginBottom: 16 },
  swapCard: { padding: 20 },
  swapTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  swapEmoji: { fontSize: 28 },
  swapFrom: {
    fontSize: 13,
    color: colors.mutedForeground,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  swapTo: { fontSize: 15, fontWeight: '500', color: colors.primary },
  swapWhy: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 8,
    lineHeight: 18,
  },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  savingsText: { fontSize: 13, fontWeight: '500', color: colors.secondary },
  ctaCard: { padding: 20, alignItems: 'center', marginBottom: 8 },
  ctaTitle: { ...typography.h3, marginBottom: 8, textAlign: 'center' },
  ctaText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
});
