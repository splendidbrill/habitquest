import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Alert, Image,
  FlatList, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Camera, Gift, Ticket, CheckCircle, Clock } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import {
  uploadMealPhoto, loadPhotoStats, loadPhotoGallery, loadVoucherWins, claimVoucher,
  type PhotoSubmission, type VoucherWin, type PhotoStats,
} from '../services/photoRewardService';

const REWARD_ODDS = [
  { name: '£5 Tesco voucher',         value: '£5',  odds: '1 in 10', emoji: '🛒' },
  { name: 'Free swimming pass',        value: 'Free swim', odds: '1 in 20', emoji: '🏊' },
  { name: '£10 Sports Direct voucher', value: '£10', odds: '1 in 33', emoji: '⚽' },
];

export function PhotoRewards() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [stats, setStats]         = useState<PhotoStats | null>(null);
  const [gallery, setGallery]     = useState<PhotoSubmission[]>([]);
  const [vouchers, setVouchers]   = useState<VoucherWin[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const [s, g, v] = await Promise.all([
      loadPhotoStats(user.id),
      loadPhotoGallery(user.id),
      loadVoucherWins(user.id),
    ]);
    setStats(s);
    setGallery(g);
    setVouchers(v);
    setLoading(false);
  }, [user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleUpload = async (fromCamera: boolean) => {
    setShowPicker(false);
    if (!user?.id) return;

    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo', quality: 0.7 })
      : await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });

    if (result.didCancel || !result.assets?.[0]) return;

    const asset = result.assets[0];
    if (!asset.uri || !asset.fileName || !asset.type) return;

    setUploading(true);
    try {
      const { win } = await uploadMealPhoto(
        user.id,
        asset.uri,
        asset.fileName,
        asset.type,
      );

      await load();

      if (win) {
        Alert.alert(
          '🎉 You won!',
          `Congratulations! You earned a ${win.rewardName}. Check your vouchers below to claim it.`,
          [{ text: 'Amazing!', style: 'default' }],
        );
      } else {
        Alert.alert(
          'Photo uploaded! 📸',
          'Great effort! You earned a lottery ticket. Keep uploading for more chances to win.',
          [{ text: 'Keep going!', style: 'default' }],
        );
      }
    } catch {
      Alert.alert('Upload failed', 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClaim = async (voucher: VoucherWin) => {
    if (voucher.claimed) return;
    Alert.alert(
      'Claim voucher',
      `Claim your ${voucher.rewardName}? You'll receive a code by email.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim it!',
          onPress: async () => {
            await claimVoucher(voucher.id);
            await load();
            Alert.alert('Claimed! ✓', 'Your voucher code will arrive by email within 24 hours.');
          },
        },
      ],
    );
  };

  const unclaimedCount = vouchers.filter(v => !v.claimed).length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
          <View style={s.headerText}>
            <Text style={s.title}>Photo Rewards</Text>
            <Text style={s.subtitle}>Upload meals & earn vouchers</Text>
          </View>
          {unclaimedCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unclaimedCount}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator size="large" color="#f97316" style={{ marginVertical: 32 }} />
        ) : (
          <>
            <LinearGradient colors={['#f97316', '#fbbf24']} style={s.statsCard}>
              <View style={s.statsRow}>
                <View style={s.statItem}>
                  <Text style={s.statNum}>{stats?.totalSubmissions ?? 0}</Text>
                  <Text style={s.statLabel}>Photos</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={s.statNum}>{stats?.ticketsThisWeek ?? 0}</Text>
                  <Text style={s.statLabel}>This week</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={s.statNum}>{stats?.totalWins ?? 0}</Text>
                  <Text style={s.statLabel}>Vouchers won</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Upload button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowPicker(true)}
              disabled={uploading}
              style={s.uploadBtn}
            >
              {uploading ? (
                <View style={s.uploadBtnInner}>
                  <ActivityIndicator color="#fff" />
                  <Text style={s.uploadBtnText}>Uploading...</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['#1e3a5f', '#3b82f6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.uploadBtnInner}
                >
                  <Camera size={22} color="#fff" />
                  <Text style={s.uploadBtnText}>Upload a photo</Text>
                  <View style={s.ticketPill}>
                    <Ticket size={12} color="#fff" />
                    <Text style={s.ticketPillText}>+1 ticket</Text>
                  </View>
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* How it works */}
            <View style={s.card}>
              <Text style={s.cardTitle}>How it works</Text>
              {[
                { emoji: '📸', text: 'Take a photo of a home-cooked meal or your child being active' },
                { emoji: '🎟️', text: 'Every photo earns one lottery ticket instantly' },
                { emoji: '🎁', text: 'Random chance to win vouchers — like McDonald\'s Monopoly for healthy habits' },
              ].map((step, i) => (
                <View key={i} style={s.stepRow}>
                  <Text style={s.stepEmoji}>{step.emoji}</Text>
                  <Text style={s.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>

            {/* Voucher wins */}
            {vouchers.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Your vouchers 🏆</Text>
                {vouchers.map(v => (
                  <View key={v.id} style={[s.voucherRow, v.claimed && s.voucherRowClaimed]}>
                    <View style={s.voucherLeft}>
                      <Text style={s.voucherEmoji}>
                        {REWARD_ODDS.find(r => r.name === v.rewardName)?.emoji ?? '🎁'}
                      </Text>
                      <View>
                        <Text style={[s.voucherName, v.claimed && s.voucherNameClaimed]}>
                          {v.rewardName}
                        </Text>
                        <Text style={s.voucherDate}>
                          {new Date(v.wonAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                    </View>
                    {v.claimed ? (
                      <View style={s.claimedChip}>
                        <CheckCircle size={14} color="#16a34a" />
                        <Text style={s.claimedText}>Claimed</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={s.claimBtn} onPress={() => handleClaim(v)}>
                        <Text style={s.claimBtnText}>Claim</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Available rewards */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Available rewards</Text>
              {REWARD_ODDS.map((r, i) => (
                <View key={i} style={s.rewardRow}>
                  <Text style={s.rewardEmoji}>{r.emoji}</Text>
                  <View style={s.rewardInfo}>
                    <Text style={s.rewardName}>{r.name}</Text>
                    <Text style={s.rewardOdds}>{r.odds} chance per photo</Text>
                  </View>
                  <View style={s.rewardValue}>
                    <Text style={s.rewardValueText}>{r.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Photo gallery */}
            {gallery.length > 0 && (
              <View>
                <Text style={s.galleryTitle}>Your uploads ({gallery.length})</Text>
                <FlatList
                  data={gallery}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  contentContainerStyle={s.galleryList}
                  renderItem={({ item }) => (
                    <View style={s.galleryItem}>
                      <Image source={{ uri: item.photoUrl }} style={s.galleryImage} />
                      <Text style={s.galleryDate}>
                        {new Date(item.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

            {gallery.length === 0 && (
              <View style={s.emptyGallery}>
                <Text style={s.emptyEmoji}>📷</Text>
                <Text style={s.emptyTitle}>No photos yet</Text>
                <Text style={s.emptySub}>Upload your first meal photo to earn a lottery ticket!</Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Source picker modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowPicker(false)}>
          <TouchableOpacity activeOpacity={1} style={s.pickerSheet}>
            <View style={s.pickerHandle} />
            <Text style={s.pickerTitle}>Add a photo</Text>
            <TouchableOpacity style={s.pickerOption} activeOpacity={0.85} onPress={() => handleUpload(true)}>
              <Camera size={22} color="#f97316" />
              <Text style={s.pickerOptionText}>Take a photo now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.pickerOption} activeOpacity={0.85} onPress={() => handleUpload(false)}>
              <Gift size={22} color="#3b82f6" />
              <Text style={s.pickerOptionText}>Choose from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowPicker(false)}>
              <Text style={s.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 1 },
  badge: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#f97316',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  statsCard: { borderRadius: 20, padding: 24, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },

  uploadBtn: { borderRadius: 18, marginBottom: 16, overflow: 'hidden' },
  uploadBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12, paddingVertical: 20, paddingHorizontal: 24, borderRadius: 18,
    backgroundColor: '#1e3a5f',
  },
  uploadBtnText: { fontSize: 18, fontWeight: '800', color: '#fff', flex: 1 },
  ticketPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  ticketPillText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 14 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepEmoji: { fontSize: 22, width: 30 },
  stepText: { flex: 1, fontSize: 14, color: '#4b5563', lineHeight: 21 },

  voucherRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  voucherRowClaimed: { opacity: 0.55 },
  voucherLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voucherEmoji: { fontSize: 28 },
  voucherName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  voucherNameClaimed: { color: '#9ca3af' },
  voucherDate: { fontSize: 12, color: '#9ca3af' },
  claimedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f0fdf4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  claimedText: { fontSize: 13, fontWeight: '600', color: '#16a34a' },
  claimBtn: { backgroundColor: '#f97316', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  claimBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  rewardEmoji: { fontSize: 28, width: 36 },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  rewardOdds: { fontSize: 12, color: '#6b7280' },
  rewardValue: { backgroundColor: '#f0fdf4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  rewardValueText: { fontSize: 13, fontWeight: '800', color: '#16a34a' },

  galleryTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12 },
  galleryList: { paddingBottom: 4, gap: 10 },
  galleryItem: { alignItems: 'center', gap: 6 },
  galleryImage: { width: 100, height: 100, borderRadius: 14, backgroundColor: '#e5e7eb' },
  galleryDate: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },

  emptyGallery: {
    backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center',
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb',
  },
  emptyEmoji: { fontSize: 48, marginBottom: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 36,
  },
  pickerHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginBottom: 20 },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16 },
  pickerOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  pickerOptionText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  pickerCancel: { paddingVertical: 16, alignItems: 'center' },
  pickerCancelText: { fontSize: 16, color: '#9ca3af', fontWeight: '600' },
});
