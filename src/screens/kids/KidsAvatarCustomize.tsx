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

const avatarEmojis: Record<string, string> = { tiger: '🐯', monkey: '🐵', elephant: '🐘' };

const colorOptions = [
  { id: 'orange', name: 'Sunset', hex: '#f97316' },
  { id: 'teal', name: 'Ocean', hex: '#14b8a6' },
  { id: 'purple', name: 'Sky', hex: '#a855f7' },
  { id: 'red', name: 'Fire', hex: '#ef4444' },
  { id: 'green', name: 'Forest', hex: '#22c55e' },
  { id: 'blue', name: 'River', hex: '#3b82f6' },
];

const accessories = [
  { id: 'cape', emoji: '🦸', name: 'Super Cape' },
  { id: 'backpack', emoji: '🎒', name: 'Explorer Pack' },
  { id: 'hat', emoji: '🧢', name: 'Cool Hat' },
  { id: 'trainers', emoji: '👟', name: 'Fast Trainers' },
  { id: 'sunglasses', emoji: '😎', name: 'Sun Shades' },
  { id: 'cricket', emoji: '🏏', name: 'Cricket Bat' },
];

export function KidsAvatarCustomize() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedColor, setSelectedColor] = useState('orange');
  const [selectedAcc, setSelectedAcc] = useState<string[]>([]);
  const [avatarId] = useState('tiger');

  const toggleAcc = (id: string) => {
    setSelectedAcc(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    await storage.setItem('kidsAvatarColor', selectedColor);
    await storage.setItem('kidsAvatarAccessories', JSON.stringify(selectedAcc));
    navigation.navigate('KidsBuddyHome');
  };

  const bgColor = colorOptions.find(c => c.id === selectedColor)?.hex ?? '#f97316';

  return (
    <LinearGradient colors={['#bae6fd', '#fef9c3', '#fed7aa']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Make Your Buddy Special!</Text>
          <Text style={styles.subtitle}>Choose colours and gear</Text>

          <View style={[styles.avatarCircle, { backgroundColor: bgColor }]}>
            <Text style={styles.avatarEmoji}>{avatarEmojis[avatarId] || '🐯'}</Text>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨  Choose a Colour</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color.hex },
                    selectedColor === color.id && styles.colorBtnSelected,
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                >
                  {selectedColor === color.id && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Accessories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color="#0d9488" />
              <Text style={styles.sectionTitle}> Add Some Gear</Text>
            </View>
            <View style={styles.accGrid}>
              {accessories.map(acc => {
                const isSelected = selectedAcc.includes(acc.id);
                return (
                  <TouchableOpacity
                    key={acc.id}
                    style={[styles.accBtn, isSelected && styles.accBtnSelected]}
                    onPress={() => toggleAcc(acc.id)}
                  >
                    <Text style={styles.accEmoji}>{acc.emoji}</Text>
                    <Text style={[styles.accName, isSelected && styles.accNameSelected]}>
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={handleContinue}>
            <LinearGradient
              colors={['#f97316', '#f59e0b', '#14b8a6']}
              style={styles.continueBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueBtnText}>Start My Adventure! 🚀</Text>
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
  content: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 28 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#78350f',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: { fontSize: 16, color: '#92400e', marginBottom: 24 },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarEmoji: { fontSize: 80 },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 14,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorBtn: {
    width: 68,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBtnSelected: {
    borderWidth: 3,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  colorCheck: { fontSize: 24, color: '#fff', fontWeight: '700' },
  accGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  accBtn: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  accBtnSelected: {
    backgroundColor: '#f97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  accEmoji: { fontSize: 36, marginBottom: 4 },
  accName: { fontSize: 11, fontWeight: '600', color: '#6b7280', textAlign: 'center' },
  accNameSelected: { color: '#fff' },
  continueBtn: {
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  continueBtnText: { fontSize: 22, fontWeight: '800', color: '#fff' },
});
