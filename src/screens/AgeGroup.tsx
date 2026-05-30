import React from 'react';
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
import { ArrowLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

const ageGroups = [
  {
    label: '6 – 8 years',
    emoji: '🐯',
    desc: 'Avatar adventures, food games\nand daily missions!',
    colors: ['#f97316', '#fbbf24'] as [string, string],
    screen: 'KidsAvatarSelection' as keyof RootStackParamList,
  },
  {
    label: '8 – 10 years',
    emoji: '🚀',
    desc: 'Train like a pro athlete!\nMissions, fuel & trophies.',
    colors: ['#8b5cf6', '#ec4899'] as [string, string],
    screen: 'Kids8AthleteOnboarding' as keyof RootStackParamList,
  },
  {
    label: '10 – 12 years',
    emoji: '⚡',
    desc: 'Your space, your vibe.\nWellbeing, movement & more.',
    colors: ['#06b6d4', '#3b82f6'] as [string, string],
    screen: 'Kids12Onboarding' as keyof RootStackParamList,
  },
];

export function AgeGroup() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3', '#dcfce7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>How old are you?</Text>
          <Text style={styles.subtitle}>Pick your age group to get started!</Text>

          <View style={styles.list}>
            {ageGroups.map((ag, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                onPress={() => {
                  if ((ag as any).placeholder) {
                    navigation.navigate('AgePlaceholder', { ageGroup: (ag as any).placeholder });
                  } else {
                    navigation.navigate(ag.screen as 'KidsAvatarSelection');
                  }
                }}
              >
                <LinearGradient
                  colors={ag.colors}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.cardEmoji}>{ag.emoji}</Text>
                  <View style={styles.cardText}>
                    <Text style={styles.cardLabel}>{ag.label}</Text>
                    <Text style={styles.cardDesc}>{ag.desc}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emoji: { fontSize: 64, marginTop: 16, marginBottom: 8 },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#4b5563',
    marginBottom: 36,
    textAlign: 'center',
  },
  list: { width: '100%', gap: 18 },
  card: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardEmoji: { fontSize: 52 },
  cardText: { flex: 1 },
  cardLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
});
