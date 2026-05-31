import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AGE_GROUPS = [
  { value: '6-8',   emoji: '🐯', label: '6–8 years',   colors: ['#f97316', '#fbbf24'] as [string, string] },
  { value: '8-10',  emoji: '🚀', label: '8–10 years',  colors: ['#8b5cf6', '#ec4899'] as [string, string] },
  { value: '10-12', emoji: '⚡', label: '10–12 years', colors: ['#06b6d4', '#3b82f6'] as [string, string] },
];

export function AddChild() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) { setError('Please enter a name.'); return; }
    if (!ageGroup)     { setError('Please select an age group.'); return; }
    if (!user)         return;

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('children').insert({
      parent_id: user.id,
      name: name.trim(),
      age_group: ageGroup,
    });

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
    } else {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3', '#dcfce7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ArrowLeft size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            <Text style={styles.emoji}>🧒</Text>
            <Text style={styles.title}>Add a child profile</Text>
            <Text style={styles.subtitle}>They'll get their own personalised experience</Text>

            <View style={styles.card}>

              <Text style={styles.label}>Child's name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Oliver"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />

              <Text style={styles.label}>Age group</Text>
              <View style={styles.ageGrid}>
                {AGE_GROUPS.map(ag => (
                  <TouchableOpacity
                    key={ag.value}
                    activeOpacity={0.85}
                    onPress={() => setAgeGroup(ag.value)}
                    style={styles.ageBtnWrapper}
                  >
                    <LinearGradient
                      colors={ageGroup === ag.value ? ag.colors : ['#f3f4f6', '#e5e7eb']}
                      style={styles.ageBtn}
                    >
                      <Text style={styles.ageEmoji}>{ag.emoji}</Text>
                      <Text style={[
                        styles.ageLabel,
                        { color: ageGroup === ag.value ? '#fff' : '#374151' },
                      ]}>
                        {ag.label}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCreate}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#f97316', '#fbbf24']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Create Profile ✨</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { width: '100%', marginBottom: 16 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e3a5f', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#4b5563', marginBottom: 28, textAlign: 'center' },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 28, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  input: {
    backgroundColor: '#f9fafb', borderWidth: 1.5, borderColor: '#e5e7eb',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#111827', marginBottom: 22,
  },
  ageGrid: { gap: 12, marginBottom: 24 },
  ageBtnWrapper: { width: '100%' },
  ageBtn: {
    borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  ageEmoji: { fontSize: 36 },
  ageLabel: { fontSize: 18, fontWeight: '700' },
  error: { fontSize: 14, color: '#ef4444', marginBottom: 12, textAlign: 'center' },
  btn: {
    borderRadius: 50, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
