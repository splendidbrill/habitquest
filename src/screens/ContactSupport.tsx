import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Category = 'bug' | 'feature' | 'feedback';

const CATEGORIES: { label: string; value: Category; emoji: string }[] = [
  { label: '🐛 Bug Report', value: 'bug', emoji: '🐛' },
  { label: '✨ Feature Request', value: 'feature', emoji: '✨' },
  { label: '💬 General Feedback', value: 'feedback', emoji: '💬' },
];

export function ContactSupport() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [category, setCategory] = useState<Category>('bug');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be signed in');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('user_feedback').insert({
        parent_id: user.id,
        name: name.trim(),
        email: email.trim(),
        category,
        message: message.trim(),
      });

      if (error) {
        Alert.alert('Error', 'Failed to submit feedback. Please try again.');
        return;
      }

      Alert.alert(
        'Thanks! 🎉',
        'Your message was sent. We read every feedback!',
        [{ text: 'Got it', onPress: () => navigation.goBack() }],
      );

      setName('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color="#1e3a5f" />
          </TouchableOpacity>
          <Text style={styles.title}>Contact & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro */}
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              We'd love to hear from you! 👋
            </Text>
            <Text style={styles.introSub}>
              Report bugs, suggest features, or share feedback to help us make
              HabitQuest better
            </Text>
          </View>

          {/* Category Picker */}
          <View style={styles.section}>
            <Text style={styles.label}>What's this about?</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  activeOpacity={0.85}
                  onPress={() => setCategory(cat.value)}
                  style={[
                    styles.categoryBtn,
                    category === cat.value && styles.categoryBtnActive,
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      category === cat.value && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Sarah"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              editable={!submitting}
            />
          </View>

          {/* Email */}
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!submitting}
            />
          </View>

          {/* Message */}
          <View style={styles.section}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Tell us what's on your mind..."
              placeholderTextColor="#9ca3af"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!submitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submitBtnWrap}
          >
            <LinearGradient
              colors={
                submitting ? ['#d1d5db', '#9ca3af'] : ['#3b82f6', '#2563eb']
              }
              style={styles.submitBtn}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>Send Feedback</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpBox}>
            <Text style={styles.helpText}>
              📧 We read every message and respond as quickly as we can. For
              urgent issues, email us at{' '}
              <Text style={styles.helpEmail}>habitquest247@gmail.com</Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backBtn: { padding: 8 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e3a5f',
  },
  placeholder: { width: 40 },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  intro: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 6,
  },
  introSub: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },

  section: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 10,
  },

  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryBtnActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  categoryEmoji: { fontSize: 24, marginBottom: 4 },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#3b82f6',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  messageInput: {
    paddingVertical: 12,
    minHeight: 120,
  },

  submitBtnWrap: {
    marginBottom: 20,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    paddingVertical: 16,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },

  helpBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  helpText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 19,
  },
  helpEmail: {
    fontWeight: '700',
    color: '#d97706',
  },
});
