import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

export function KidsSuccessCelebration() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    (async () => {
      const currentStars = parseInt((await storage.getItem('kidsTotalStars')) ?? '0');
      const newStars = currentStars + 3;
      await storage.setItem('kidsTotalStars', String(newStars));
      setStars(newStars);

      const badges = JSON.parse((await storage.getItem('kidsEarnedBadges')) ?? '[]');
      if (!badges.includes('adventure-star')) {
        badges.push('adventure-star');
        await storage.setItem('kidsEarnedBadges', JSON.stringify(badges));
      }
    })();
  }, []);

  return (
    <LinearGradient colors={['#fef9c3', '#fed7aa', '#fce7f3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.buddyEmoji}>🐯</Text>
          <Text style={styles.trophy}>🏆</Text>

          <Text style={styles.title}>Amazing! 🎉</Text>
          <Text style={styles.subtitle}>You Did It!</Text>

          <View style={styles.starsCard}>
            <Text style={styles.starEmoji}>⭐</Text>
            <Text style={styles.starsEarned}>+3 Stars!</Text>
            <Text style={styles.starsTotal}>You now have {stars} stars! 🌟</Text>
          </View>

          <View style={styles.confettiRow}>
            {['🎉', '⭐', '✨', '🌟', '🎊'].map((e, i) => (
              <Text key={i} style={styles.confettiEmoji}>{e}</Text>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MysteryBox', { returnScreen: 'KidsBuddyHome' })}
          >
            <LinearGradient
              colors={['#c084fc', '#ec4899', '#fb7185']}
              style={styles.continueBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueBtnText}>Keep Going! 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  buddyEmoji: { fontSize: 96, marginBottom: 4 },
  trophy: { fontSize: 96, marginBottom: 16 },
  title: { fontSize: 52, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 36, color: '#374151', marginBottom: 28 },
  starsCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  starEmoji: { fontSize: 80, marginBottom: 12 },
  starsEarned: { fontSize: 40, fontWeight: '800', color: '#d97706', marginBottom: 8 },
  starsTotal: { fontSize: 22, color: '#374151' },
  confettiRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  confettiEmoji: { fontSize: 36 },
  continueBtn: {
    borderRadius: 50,
    paddingVertical: 24,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  continueBtnText: { fontSize: 28, fontWeight: '800', color: '#fff' },
});
