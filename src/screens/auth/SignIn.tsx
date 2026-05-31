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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation';
import { useAuth } from '../../context/AuthContext';

export function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) setError(error);
  };

  return (
    <LinearGradient colors={['#e0f2fe', '#fef9c3', '#dcfce7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <Text style={styles.logo}>🌟</Text>
            <Text style={styles.appName}>HabitQuest</Text>
            <Text style={styles.tagline}>Building healthy families, one habit at a time</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back</Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSignIn}
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
                    : <Text style={styles.btnText}>Sign In</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.switchLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.switchText}>
                New to HabitQuest?{' '}
                <Text style={styles.switchTextBold}>Create an account</Text>
              </Text>
            </TouchableOpacity>

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
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: { fontSize: 72, marginBottom: 8 },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 18,
  },
  error: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  switchLink: { marginTop: 8 },
  switchText: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
  },
  switchTextBold: {
    fontWeight: '700',
    color: '#f97316',
  },
});
