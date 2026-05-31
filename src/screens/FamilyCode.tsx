import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Clipboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Copy, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function FamilyCode() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [familyCode, setFamilyCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('family_code')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.family_code) setFamilyCode(data.family_code);
      });
  }, [user]);

  const handleCopy = () => {
    Clipboard.setString(familyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3', '#dcfce7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>🔑</Text>
          <Text style={styles.title}>Your Family Code</Text>
          <Text style={styles.subtitle}>
            Share this code with your child's device to link your family together
          </Text>

          <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={styles.codeCard}>
            <Text style={styles.codeLabel}>Family Code</Text>
            <Text style={styles.codeText}>{familyCode || '------'}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              {copied
                ? <Check size={20} color="#fff" />
                : <Copy size={20} color="#fff" />
              }
              <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy code'}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoItem}>1. Open HabitQuest on your child's device</Text>
            <Text style={styles.infoItem}>2. Sign in with your parent account</Text>
            <Text style={styles.infoItem}>3. Select your child's profile</Text>
            <Text style={styles.infoItem}>4. They're linked and ready to play! 🎉</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e3a5f', marginBottom: 8, textAlign: 'center' },
  subtitle: {
    fontSize: 15, color: '#4b5563', textAlign: 'center',
    lineHeight: 22, marginBottom: 36, paddingHorizontal: 8,
  },
  codeCard: {
    width: '100%', borderRadius: 28, padding: 32,
    alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 8,
  },
  codeLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 12, letterSpacing: 1 },
  codeText: { fontSize: 48, fontWeight: '800', color: '#fff', letterSpacing: 8, marginBottom: 24 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 24,
  },
  copyBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  infoCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24,
    padding: 24, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#1e3a5f', marginBottom: 4 },
  infoItem: { fontSize: 15, color: '#374151', lineHeight: 22 },
});
