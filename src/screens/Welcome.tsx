import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components/ui/Button';
import { storage } from '../utils/storage';
import { colors, typography, radius, withOpacity } from '../theme';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function Welcome() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    storage.getItem('onboardingComplete').then(val => {
      if (val === 'true') {
        navigation.replace('MainApp');
      }
    });
  }, []);

  const benefits = [
    {
      title: 'Weekly plans that fit your life',
      subtitle: 'Simple diet and movement ideas, not rigid rules',
    },
    {
      title: 'Clinically informed, family focused',
      subtitle: 'Evidence-based guidance that reduces overwhelm',
    },
    {
      title: 'Track progress, not weight',
      subtitle: 'Celebrate behaviour changes and small wins',
    },
  ];

  return (
    <LinearGradient
      colors={[withOpacity(colors.primary, 0.1), colors.background, withOpacity(colors.secondary, 0.1)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Heart size={40} color={colors.secondaryForeground} />
          </View>
        </View>

        <Text style={styles.title}>Welcome to HealthySteps</Text>
        <Text style={styles.subtitle}>
          Supporting UK parents with simple, culturally-appropriate meal ideas and fun activities for children aged 7–11
        </Text>

        <View style={styles.benefitsList}>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitSubtitle}>{b.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button size="lg" onPress={() => navigation.navigate('IntroVideo')} style={styles.cta}>
          <Text style={styles.ctaText}>Get started</Text>
        </Button>

        <Text style={styles.footerNote}>Takes about 2 minutes to personalise your plan</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...typography.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  benefitsList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withOpacity(colors.primary, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkMark: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.h4,
    marginBottom: 2,
  },
  benefitSubtitle: {
    ...typography.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  cta: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  ctaText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  footerNote: {
    ...typography.xs,
    color: colors.mutedForeground,
    marginTop: 16,
  },
});
