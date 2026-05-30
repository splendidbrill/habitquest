import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';

export function AgePlaceholder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AgePlaceholder'>>();
  const { ageGroup } = route.params;

  return (
    <LinearGradient colors={['#e0e7ff', '#fce7f3', '#ede9fe']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.emoji}>🚧</Text>
          <Text style={styles.title}>Coming Soon!</Text>
          <Text style={styles.subtitle}>
            The {ageGroup} years experience is under construction.
          </Text>
          <Text style={styles.desc}>
            We're working hard to create amazing adventures just for your age group.
            Check back soon! 🌟
          </Text>

          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardEmoji}>🎮 🏆 🌟</Text>
            <Text style={styles.cardTitle}>What's coming:</Text>
            <Text style={styles.cardItem}>• Level-up challenges</Text>
            <Text style={styles.cardItem}>• Advanced food knowledge</Text>
            <Text style={styles.cardItem}>• Team missions with friends</Text>
            <Text style={styles.cardItem}>• Special rewards & badges</Text>
          </LinearGradient>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RoleSelection')}
            style={styles.homeBtn}
          >
            <Text style={styles.homeBtnText}>Go Back Home 🏠</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8 },
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e1b4b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardEmoji: { fontSize: 32, textAlign: 'center', marginBottom: 10 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  cardItem: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    lineHeight: 22,
  },
  homeBtn: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  homeBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
});
