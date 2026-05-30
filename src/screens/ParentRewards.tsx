import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Gift, Star, TrendingUp, Award } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { colors, typography, radius, withOpacity } from '../theme';

const pointsSources = [
  { activity: 'Planning meals', points: 10, earned: 3 },
  { activity: 'Completing shopping lists', points: 15, earned: 2 },
  { activity: 'Child completing missions', points: 5, earned: 6 },
  { activity: 'Logging family meals', points: 5, earned: 5 },
  { activity: 'Weekly consistency bonus', points: 25, earned: 1 },
];

const availableRewards = [
  { id: '1', name: '£10 Tesco Voucher', pointsCost: 300, description: 'Redeem for groceries', category: 'voucher' },
  { id: '2', name: '£5 Tesco Voucher', pointsCost: 150, description: 'Redeem for groceries', category: 'voucher' },
  { id: '3', name: '20% off Sports Equipment', pointsCost: 200, description: 'Decathlon discount code', category: 'discount' },
  { id: '4', name: 'Free Family Swim Pass', pointsCost: 250, description: 'Local leisure center', category: 'activity' },
  { id: '5', name: '£15 Amazon Voucher', pointsCost: 400, description: 'For anything you need', category: 'voucher' },
  { id: '6', name: '10% off Meal Kit Box', pointsCost: 100, description: 'HelloFresh or Gousto', category: 'discount' },
];

export function ParentRewards() {
  const navigation = useNavigation();
  const [currentPoints] = useState(285);
  const [weeklyPoints] = useState(65);

  const nextReward = availableRewards.find(r => r.pointsCost > currentPoints);
  const pointsToNext = nextReward ? nextReward.pointsCost - currentPoints : 0;

  const handleRedeem = (reward: typeof availableRewards[0]) => {
    Alert.alert('Redeem Reward', `Redeem "${reward.name}" for ${reward.pointsCost} points?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem', onPress: () => Alert.alert('Success!', 'Your reward has been redeemed. Check your email for details.') },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Parent Rewards</Text>
          <Text style={styles.subtitle}>Earn points, unlock rewards</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.pointsCard}
      >
        <Star size={48} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={styles.pointsNum}>{currentPoints}</Text>
        <Text style={styles.pointsLabel}>Total points earned</Text>
        <View style={styles.weeklyBox}>
          <Text style={styles.weeklyText}>This week: +{weeklyPoints} points</Text>
          <View style={styles.weeklyRow}>
            <TrendingUp size={12} color={colors.primary} />
            <Text style={styles.weeklyHint}>On track for weekly bonus!</Text>
          </View>
        </View>
      </LinearGradient>

      {nextReward && (
        <Card style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Award size={22} color={colors.secondary} />
            <Text style={styles.nextTitle}>Next reward</Text>
          </View>
          <Text style={styles.nextName}>{nextReward.name}</Text>
          <Text style={styles.nextPoints}>{pointsToNext} points to go</Text>
          <ProgressBar value={currentPoints} total={nextReward.pointsCost} color={colors.secondary} />
        </Card>
      )}

      <Text style={styles.sectionTitle}>How you earn points</Text>
      <View style={styles.sourcesList}>
        {pointsSources.map((source, i) => (
          <Card key={i} style={styles.sourceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sourceName}>{source.activity}</Text>
              <Text style={styles.sourceEarned}>
                Earned {source.earned} time{source.earned !== 1 ? 's' : ''} this week
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sourcePoints}>+{source.points}</Text>
              <Text style={styles.sourcePointsLabel}>points</Text>
            </View>
          </Card>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Available rewards</Text>
      <View style={styles.rewardsList}>
        {availableRewards.map(reward => {
          const canAfford = currentPoints >= reward.pointsCost;
          return (
            <Card key={reward.id} style={[styles.rewardCard, !canAfford ? { opacity: 0.5 } : null]}>
              <View style={styles.rewardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <Text style={styles.rewardDesc}>{reward.description}</Text>
                  <View style={styles.rewardCost}>
                    <Star size={14} color={colors.primary} />
                    <Text style={styles.rewardCostText}>{reward.pointsCost} points</Text>
                  </View>
                </View>
                <Gift size={22} color={colors.secondary} />
              </View>
              <Button
                size="sm"
                variant={canAfford ? 'default' : 'outline'}
                disabled={!canAfford}
                onPress={() => canAfford && handleRedeem(reward)}
                style={canAfford ? { backgroundColor: colors.primary } : undefined}
              >
                <Text style={{ fontSize: 13, fontWeight: '500', color: canAfford ? colors.primaryForeground : colors.mutedForeground }}>
                  {canAfford ? 'Redeem now' : `${reward.pointsCost - currentPoints} more points needed`}
                </Text>
              </Button>
            </Card>
          );
        })}
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>💡 Keep going!</Text> The more consistent you are with planning, shopping, and cooking, the faster you'll earn rewards. Every small action counts!
        </Text>
      </Card>

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
  pointsCard: { borderRadius: radius, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3), alignItems: 'center' },
  pointsNum: { fontSize: 56, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  pointsLabel: { fontSize: 13, color: colors.mutedForeground, marginBottom: 16 },
  weeklyBox: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: radius, padding: 12, width: '100%', alignItems: 'center' },
  weeklyText: { fontSize: 12, color: colors.mutedForeground, marginBottom: 4 },
  weeklyRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weeklyHint: { fontSize: 12, color: colors.primary },
  nextCard: { padding: 20, marginBottom: 16 },
  nextHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  nextTitle: { ...typography.h4 },
  nextName: { fontSize: 15, fontWeight: '500', color: colors.foreground, marginBottom: 4 },
  nextPoints: { fontSize: 13, color: colors.mutedForeground, marginBottom: 10 },
  sectionTitle: { ...typography.h3, marginBottom: 12 },
  sourcesList: { gap: 8, marginBottom: 16 },
  sourceCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  sourceName: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 2 },
  sourceEarned: { fontSize: 12, color: colors.mutedForeground },
  sourcePoints: { fontSize: 20, fontWeight: '700', color: colors.primary },
  sourcePointsLabel: { fontSize: 11, color: colors.mutedForeground },
  rewardsList: { gap: 10, marginBottom: 16 },
  rewardCard: { padding: 16 },
  rewardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  rewardName: { fontSize: 15, fontWeight: '500', color: colors.foreground, marginBottom: 4 },
  rewardDesc: { fontSize: 13, color: colors.mutedForeground, marginBottom: 8 },
  rewardCost: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardCostText: { fontSize: 13, fontWeight: '500', color: colors.foreground },
  infoCard: { padding: 14 },
  infoText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
});
