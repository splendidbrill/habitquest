import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

const { width } = Dimensions.get('window');

export function RoleSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={['#fef3c7', '#fde68a', '#d1fae5']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.title}>HabitQuest</Text>
          <Text style={styles.subtitle}>Healthy habits for the whole family!</Text>

          <View style={styles.cards}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Welcome')}
              style={styles.cardWrap}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.cardTitle}>I'm a Parent</Text>
                <Text style={styles.cardDesc}>Manage meals, track progress{'\n'}and support your child</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AgeGroup')}
              style={styles.cardWrap}
            >
              <LinearGradient
                colors={['#f97316', '#fb923c', '#fbbf24']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardEmoji}>🌟</Text>
                <Text style={styles.cardTitle}>I'm a Kid!</Text>
                <Text style={styles.cardDesc}>Go on food adventures,{'\n'}play games and earn rewards!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Let's build healthy habits together! 💪</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: { fontSize: 72, marginBottom: 8 },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#78350f',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#92400e',
    marginBottom: 48,
    textAlign: 'center',
  },
  cards: { width: '100%', gap: 20 },
  cardWrap: { width: '100%' },
  card: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  cardEmoji: { fontSize: 56, marginBottom: 10 },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    marginTop: 40,
    fontSize: 16,
    color: '#78350f',
    fontWeight: '600',
  },
});
