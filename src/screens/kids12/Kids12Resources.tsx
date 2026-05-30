import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { ArrowLeft, Phone, ExternalLink, Heart } from 'lucide-react-native';

const resources = [
  {
    category: 'Meditation & Mindfulness Apps',
    urgent: false,
    items: [
      { name: 'Calm', description: 'Meditation, sleep stories, and relaxation', url: 'https://www.calm.com', icon: '🧘‍♀️' },
      { name: 'Headspace', description: 'Guided meditation and mindfulness', url: 'https://www.headspace.com', icon: '🎧' },
    ],
  },
  {
    category: 'Mental Health Support (UK)',
    urgent: false,
    items: [
      { name: 'Childline', description: 'Free, confidential support for young people', url: 'https://www.childline.org.uk', phone: '0800 1111', icon: '☎️' },
      { name: 'YoungMinds', description: 'Mental health support and information', url: 'https://www.youngminds.org.uk', icon: '💭' },
      { name: 'The Mix', description: 'Support for under 25s', url: 'https://www.themix.org.uk', phone: '0808 808 4994', icon: '💬' },
      { name: 'Kooth', description: 'Free online counselling for young people', url: 'https://www.kooth.com', icon: '🤝' },
    ],
  },
  {
    category: 'Wellbeing & Self-Care',
    urgent: false,
    items: [
      { name: 'NHS Mental Health', description: 'Trusted advice and resources', url: 'https://www.nhs.uk/mental-health/children-and-young-adults/', icon: '🏥' },
      { name: 'Student Minds', description: 'Student mental health charity', url: 'https://www.studentminds.org.uk', icon: '🎓' },
    ],
  },
  {
    category: 'Crisis Support',
    urgent: true,
    items: [
      { name: 'Emergency Services', description: 'If you\'re in immediate danger', phone: '999', icon: '🚨' },
      { name: 'Samaritans', description: '24/7 listening service', phone: '116 123', url: 'https://www.samaritans.org', icon: '☎️' },
      { name: 'Crisis Text Line', description: 'Text SHOUT to 85258', phone: 'Text: 85258', icon: '💬' },
    ],
  },
];

export function Kids12Resources() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={['#0a0a0f', '#1a1a24']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids12Today')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Support & resources</Text>
          <Text style={styles.subtitle}>You don't have to figure everything out alone.</Text>

          {resources.map((section, si) => (
            <View key={si} style={styles.section}>
              <Text style={[styles.sectionTitle, section.urgent && styles.sectionTitleUrgent]}>
                {section.category}
              </Text>
              {section.items.map((item, ii) => (
                <View
                  key={ii}
                  style={[styles.resourceCard, section.urgent && styles.resourceCardUrgent]}
                >
                  <View style={styles.resourceRow}>
                    <Text style={styles.resourceIcon}>{item.icon}</Text>
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceName}>{item.name}</Text>
                      <Text style={styles.resourceDesc}>{item.description}</Text>
                      {item.phone && (
                        <View style={styles.phoneRow}>
                          <Phone size={13} color="#9ca3af" />
                          <Text style={styles.phoneText}>{item.phone}</Text>
                        </View>
                      )}
                      {item.url && (
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => Linking.openURL(item.url!)}
                          style={styles.urlRow}
                        >
                          <ExternalLink size={13} color="#22d3ee" />
                          <Text style={styles.urlText}>Visit website</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.bottomCard}>
            <Heart size={20} color="#a855f7" style={{ marginBottom: 10 }} />
            <Text style={styles.bottomText}>
              Asking for help isn't weakness. It's actually one of the strongest things you can do.
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
  content: { padding: 24, paddingBottom: 40 },
  topHeader: { marginBottom: 24 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#9ca3af', marginBottom: 28 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#9ca3af', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitleUrgent: { color: '#ef4444' },
  resourceCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resourceCardUrgent: {
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },
  resourceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  resourceIcon: { fontSize: 28, marginTop: 2 },
  resourceInfo: { flex: 1 },
  resourceName: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  resourceDesc: { fontSize: 13, color: '#9ca3af', marginBottom: 8 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  phoneText: { fontSize: 13, color: '#ffffff', fontWeight: '600' },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  urlText: { fontSize: 13, color: '#22d3ee' },
  bottomCard: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
  },
  bottomText: { fontSize: 13, color: '#9ca3af', lineHeight: 20 },
});
