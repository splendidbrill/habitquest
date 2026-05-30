import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera, Gift, Upload, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

export function PhotoRewards() {
  const navigation = useNavigation();
  const [uploadedPhotos, setUploadedPhotos] = useState(2);
  const [vouchersEarned, setVouchersEarned] = useState(1);
  const [ticketsThisWeek, setTicketsThisWeek] = useState(2);

  const handlePhotoUpload = () => {
    setUploadedPhotos(p => p + 1);
    setTicketsThisWeek(t => t + 1);
    const won = Math.random() > 0.7;
    if (won) {
      setVouchersEarned(v => v + 1);
      Alert.alert('🎉 You won!', 'Congratulations! You earned a voucher!');
    } else {
      Alert.alert('Photo uploaded!', 'Great! You earned a lottery ticket. Keep going!');
    }
  };

  const rewards = [
    { name: '£5 Tesco voucher', odds: '1 in 10 chance', bg: withOpacity(colors.primary, 0.1), iconColor: colors.primary, tickets: '🎟️' },
    { name: 'Free swimming pass', odds: '1 in 20 chance', bg: withOpacity(colors.secondary, 0.1), iconColor: colors.secondaryForeground, tickets: '🎟️🎟️' },
    { name: '£10 Sports Direct voucher', odds: '1 in 30 chance', bg: colors.accent, iconColor: colors.accentForeground, tickets: '🎟️🎟️🎟️' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Photo Rewards</Text>
          <Text style={styles.subtitle}>Upload meals, earn vouchers</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{uploadedPhotos}</Text>
            <Text style={styles.statLabel}>Photos uploaded</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.secondary }]}>{ticketsThisWeek}</Text>
            <Text style={styles.statLabel}>Tickets this week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{vouchersEarned}</Text>
            <Text style={styles.statLabel}>Vouchers won</Text>
          </View>
        </View>
      </LinearGradient>

      <Card style={styles.howCard}>
        <View style={styles.howHeader}>
          <Sparkles size={18} color={colors.primary} />
          <Text style={styles.howTitle}>How it works</Text>
        </View>
        {[
          'Take a photo of a home-cooked family meal or your child being active',
          'Upload it here - every photo earns you one lottery-style ticket',
          "Random chance to win vouchers for local shops, activities, or healthy food stores (like McDonald's Monopoly!)",
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.uploadCard}>
        <Camera size={48} color={colors.mutedForeground} style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={styles.uploadTitle}>Upload a photo</Text>
        <Text style={styles.uploadSub}>Tap here to take or choose a photo</Text>
        <Button size="lg" onPress={handlePhotoUpload} style={styles.uploadBtn}>
          <Upload size={20} color={colors.primaryForeground} />
          <Text style={styles.uploadBtnText}>Choose photo</Text>
        </Button>
      </Card>

      <Text style={styles.rewardsTitle}>Available rewards</Text>
      <View style={styles.rewardsList}>
        {rewards.map((r, i) => (
          <Card key={i} style={styles.rewardCard}>
            <View style={[styles.rewardIcon, { backgroundColor: r.bg }]}>
              <Gift size={20} color={r.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardName}>{r.name}</Text>
              <Text style={styles.rewardOdds}>{r.odds}</Text>
            </View>
            <Text style={styles.rewardTickets}>{r.tickets}</Text>
          </Card>
        ))}
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>💡 Remember:</Text> This is about celebrating your efforts! Even if you don't win, you're building healthy habits with your family.
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
  statsCard: { borderRadius: radius, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 32, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 11, color: colors.mutedForeground, textAlign: 'center' },
  howCard: { padding: 20, marginBottom: 16 },
  howHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  howTitle: { ...typography.h3 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: withOpacity(colors.primary, 0.1), alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  stepText: { flex: 1, fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  uploadCard: { padding: 24, alignItems: 'center', marginBottom: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.border },
  uploadTitle: { ...typography.h3, marginBottom: 6 },
  uploadSub: { fontSize: 13, color: colors.mutedForeground, marginBottom: 16 },
  uploadBtn: { flexDirection: 'row', gap: 8, backgroundColor: colors.primary, width: '100%' },
  uploadBtnText: { fontSize: 15, fontWeight: '600', color: colors.primaryForeground },
  rewardsTitle: { ...typography.h3, marginBottom: 12 },
  rewardsList: { gap: 10, marginBottom: 16 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rewardName: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 2 },
  rewardOdds: { fontSize: 11, color: colors.mutedForeground },
  rewardTickets: { fontSize: 16 },
  infoCard: { padding: 14 },
  infoText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
});
