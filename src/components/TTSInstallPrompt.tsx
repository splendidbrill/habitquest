import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Linking, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Volume2, ExternalLink, X } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

async function openTTSSettings() {
  if (Platform.OS === 'android') {
    try {
      await Linking.openURL('com.android.settings/.TextToSpeechSettings');
    } catch {
      try {
        await Linking.openURL('android.settings.ACCESSIBILITY_SETTINGS');
      } catch {
        Linking.openSettings();
      }
    }
  } else {
    Linking.openSettings();
  }
}

export function TTSInstallPrompt({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <X size={20} color="#9ca3af" />
          </TouchableOpacity>

          <LinearGradient colors={['#1e3a5f', '#3b82f6']} style={s.iconCircle}>
            <Volume2 size={32} color="#fff" />
          </LinearGradient>

          <Text style={s.title}>Enable Voice Reading</Text>
          <Text style={s.body}>
            HabitQuest can read advice, missions, and coach answers aloud — including in a British accent.
          </Text>
          <Text style={s.body}>
            To use this feature, make sure <Text style={s.bold}>Google Text-to-Speech</Text> is installed on your device and the <Text style={s.bold}>English (UK)</Text> voice pack is downloaded.
          </Text>

          <View style={s.steps}>
            {[
              'Open Text-to-Speech settings below',
              'Set engine to Google Text-to-Speech',
              'Tap Settings gear → Install voice data',
              'Download English (United Kingdom)',
            ].map((step, i) => (
              <View key={i} style={s.stepRow}>
                <View style={s.stepNum}>
                  <Text style={s.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={s.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={async () => { await openTTSSettings(); onClose(); }}
          >
            <LinearGradient
              colors={['#f97316', '#fbbf24']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.primaryBtn}
            >
              <ExternalLink size={18} color="#fff" />
              <Text style={s.primaryBtnText}>Open TTS Settings</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={s.skipBtn}>
            <Text style={s.skipText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28,
    width: '100%', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 16,
  },
  closeBtn: { position: 'absolute', top: 16, right: 16, padding: 4 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#4b5563', lineHeight: 22, textAlign: 'center', marginBottom: 8 },
  bold: { fontWeight: '700', color: '#111827' },
  steps: { width: '100%', gap: 10, marginTop: 16, marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1e3a5f', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  stepText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 20 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 50, paddingVertical: 16, paddingHorizontal: 32, width: '100%',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  skipBtn: { marginTop: 14, padding: 8 },
  skipText: { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
});
