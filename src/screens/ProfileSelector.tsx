import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Plus, LogOut, Key } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { useChild, ChildProfile } from '../context/ChildContext';
import { supabase } from '../lib/supabase';

const AGE_GROUP_CONFIG: Record<string, { emoji: string; colors: [string, string]; label: string }> = {
  '6-8':  { emoji: '🐯', colors: ['#f97316', '#fbbf24'], label: '6–8 years' },
  '8-10': { emoji: '🚀', colors: ['#8b5cf6', '#ec4899'], label: '8–10 years' },
  '10-12':{ emoji: '⚡', colors: ['#06b6d4', '#3b82f6'], label: '10–12 years' },
};

const AGE_FIRST_SCREEN: Record<string, keyof RootStackParamList> = {
  '6-8':   'KidsAvatarSelection',
  '8-10':  'Kids8AthleteOnboarding',
  '10-12': 'Kids12Onboarding',
};

export function ProfileSelector() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut } = useAuth();
  const { setActiveChild } = useChild();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState('');

  const loadProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, childrenRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('children').select('*').eq('parent_id', user.id).order('created_at'),
    ]);

    if (profileRes.data?.full_name) setParentName(profileRes.data.full_name);
    if (childrenRes.data) setChildren(childrenRes.data as ChildProfile[]);
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { loadProfiles(); }, [loadProfiles]));

  const handleSelectParent = async () => {
    await setActiveChild(null);
    navigation.navigate('RoleSelection');
  };

  const handleSelectChild = async (child: ChildProfile) => {
    await setActiveChild(child);
    const firstScreen = AGE_FIRST_SCREEN[child.age_group];
    navigation.navigate(firstScreen as any);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3', '#dcfce7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Who's using the app?</Text>
          <Text style={styles.subtitle}>Pick your profile to get started</Text>

          {/* Parent profile card */}
          <TouchableOpacity activeOpacity={0.85} onPress={handleSelectParent}>
            <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={styles.card}>
              <Text style={styles.cardEmoji}>👨‍👩‍👧‍👦</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardName}>{parentName || 'Parent'}</Text>
                <Text style={styles.cardSub}>Family dashboard & settings</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Child profile cards */}
          {children.map(child => {
            const config = AGE_GROUP_CONFIG[child.age_group];
            return (
              <TouchableOpacity
                key={child.id}
                activeOpacity={0.85}
                onPress={() => handleSelectChild(child)}
              >
                <LinearGradient colors={config.colors} style={styles.card}>
                  <Text style={styles.cardEmoji}>{config.emoji}</Text>
                  <View style={styles.cardText}>
                    <Text style={styles.cardName}>{child.name}</Text>
                    <Text style={styles.cardSub}>{config.label} · {child.xp} XP · {child.streak} day streak</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* Add child button */}
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddChild')}
          >
            <Plus size={22} color="#f97316" />
            <Text style={styles.addBtnText}>Add a child profile</Text>
          </TouchableOpacity>

          {/* Bottom actions */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('FamilyCode')}
            >
              <Key size={18} color="#6b7280" />
              <Text style={styles.iconBtnText}>Family Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={signOut}>
              <LogOut size={18} color="#6b7280" />
              <Text style={styles.iconBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#1e3a5f', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4b5563', marginBottom: 32, textAlign: 'center' },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardEmoji: { fontSize: 48 },
  cardText: { flex: 1 },
  cardName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 3 },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f97316',
    borderStyle: 'dashed',
    paddingVertical: 18,
    paddingHorizontal: 28,
    marginTop: 4,
    marginBottom: 32,
    width: '100%',
    justifyContent: 'center',
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: '#f97316' },
  bottomRow: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtnText: { fontSize: 14, color: '#6b7280' },
});
