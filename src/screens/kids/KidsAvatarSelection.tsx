import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const avatars = [
  {
    id: 'tiger',
    name: 'Tiger Cub',
    emoji: '🐯',
    description: 'Brave & Strong',
    colors: ['#fb923c', '#f59e0b'] as [string, string],
  },
  {
    id: 'monkey',
    name: 'Monkey Explorer',
    emoji: '🐵',
    description: 'Curious & Quick',
    colors: ['#fbbf24', '#f97316'] as [string, string],
  },
  {
    id: 'elephant',
    name: 'Elephant Buddy',
    emoji: '🐘',
    description: 'Wise & Kind',
    colors: ['#2dd4bf', '#06b6d4'] as [string, string],
  },
];

export function KidsAvatarSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selected) return;
    await storage.setItem('kidsSelectedAvatar', selected);
    await storage.setItem('kidsSelectedBuddy', selected);
    navigation.navigate('KidsAvatarCustomize');
  };

  return (
    <LinearGradient colors={['#fef3c7', '#fed7aa', '#d1fae5']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.kite}>🪁</Text>
          <Text style={styles.title}>Choose Your Adventure Buddy!</Text>
          <Text style={styles.subtitle}>Who will explore with you?</Text>

          <View style={styles.list}>
            {avatars.map(avatar => {
              const isSelected = selected === avatar.id;
              return (
                <TouchableOpacity
                  key={avatar.id}
                  activeOpacity={0.85}
                  onPress={() => setSelected(avatar.id)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={avatar.colors}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                      <View style={styles.avatarInfo}>
                        <Text style={[styles.avatarName, styles.white]}>{avatar.name}</Text>
                        <Text style={[styles.avatarDesc, styles.whiteAlpha]}>{avatar.description}</Text>
                      </View>
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.card, styles.cardWhite]}>
                      <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                      <View style={styles.avatarInfo}>
                        <Text style={styles.avatarName}>{avatar.name}</Text>
                        <Text style={styles.avatarDesc}>{avatar.description}</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={selected ? 0.85 : 1}
            onPress={handleStart}
            disabled={!selected}
          >
            <LinearGradient
              colors={selected ? ['#f97316', '#f59e0b', '#2dd4bf'] : ['#d1d5db', '#d1d5db']}
              style={styles.startBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {selected && <Sparkles size={28} color="#fff" />}
              <Text style={[styles.startBtnText, !selected && styles.disabledText]}>
                Let's Go!
              </Text>
              {selected && <Sparkles size={28} color="#fff" />}
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
  kite: { fontSize: 64, marginBottom: 8 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#78350f',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#92400e',
    marginBottom: 32,
    textAlign: 'center',
  },
  list: { width: '100%', gap: 16, marginBottom: 32 },
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  cardWhite: { backgroundColor: '#fff' },
  avatarEmoji: { fontSize: 56 },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  avatarDesc: { fontSize: 16, color: '#6b7280' },
  white: { color: '#fff' },
  whiteAlpha: { color: 'rgba(255,255,255,0.88)' },
  checkCircle: {
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
  checkMark: { fontSize: 22, color: '#374151' },
  startBtn: {
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  disabledText: { color: '#9ca3af' },
});
