import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

const responses = [
  { situation: 'When encouraging eating', insteadOfSaying: 'Eat your vegetables or no dessert!', trySaying: "The broccoli is here if you'd like to try it. No pressure.", why: 'Rewards/punishments make food about control, not health. Offering choice without pressure works better long-term.' },
  { situation: "When they're feeling full", insteadOfSaying: "Finish your plate - there are starving children!", trySaying: "Listen to your tummy. If you're full, you can stop.", why: 'Teaching them to listen to fullness cues helps prevent overeating. It\'s a life skill.' },
  { situation: "When they're being picky", insteadOfSaying: "You're so fussy! Why can't you just eat normally?", trySaying: "I know you're still learning what foods you like. That's okay.", why: "Labels like 'fussy eater' become part of their identity. Normalizing their exploration helps them stay open." },
  { situation: 'When they want treats', insteadOfSaying: "You've been bad today, so no sweets.", trySaying: "We have treats sometimes, not every day. Let's have some on Saturday.", why: "Linking food to behavior creates guilt. Regular, planned treats reduce obsession and secrecy." },
  { situation: 'When they refuse activity', insteadOfSaying: "You're so lazy! Get off that screen!", trySaying: "Let's pause the screen and go to the park together for 20 minutes.", why: "Shame doesn't motivate. Joining them shows movement is something you do together, not a punishment." },
  { situation: 'About their body', insteadOfSaying: "You need to lose weight / You're getting chubby.", trySaying: "Your body is growing and changing - that's healthy and normal.", why: "Comments about weight harm self-esteem and can trigger disordered eating. Focus on behaviors, not bodies." },
  { situation: "When they're reluctant to try", insteadOfSaying: "Just try it! One tiny bite won't kill you!", trySaying: "You don't have to eat it. Would you like to help me cook it?", why: "Pressure backfires. Involvement (cooking, shopping) builds curiosity without force." },
  { situation: 'When comparing siblings', insteadOfSaying: "Why can't you be like your sister? She eats everything!", trySaying: "Everyone has different tastes. That's what makes us interesting.", why: "Comparisons damage relationships and self-worth. Celebrating differences reduces rivalry." },
  { situation: "When you're frustrated", insteadOfSaying: "I've had enough of this! I'm not cooking for you anymore!", trySaying: "I'm feeling frustrated. Let's take a break and try again tomorrow.", why: "Modeling emotional regulation teaches them it's okay to struggle. Consistency matters more than one meal." },
  { situation: 'When celebrating progress', insteadOfSaying: "Well done for finishing your plate!", trySaying: "I noticed you tried the carrots today - that's brave!", why: "Praising plate-cleaning ignores fullness cues. Praising trying new things builds curiosity." },
];

export function SupportiveResponses() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Supportive Responses</Text>
          <Text style={styles.subtitle}>What to say (and why it helps)</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.introCard}
      >
        <MessageCircle size={40} color={colors.secondaryForeground} style={{ marginBottom: 12 }} />
        <Text style={styles.introTitle}>Language matters</Text>
        <Text style={styles.introText}>
          The way we talk about food, bodies, and movement shapes how children see themselves. These small shifts in language can make a big difference.
        </Text>
      </LinearGradient>

      <View style={styles.list}>
        {responses.map((r, i) => (
          <Card key={i} style={styles.responseCard}>
            <Text style={styles.situation}>{r.situation}</Text>

            <View style={styles.insteadBox}>
              <Text style={styles.insteadLabel}>❌ Instead of:</Text>
              <Text style={styles.insteadText}>"{r.insteadOfSaying}"</Text>
            </View>

            <View style={styles.tryBox}>
              <Text style={styles.tryLabel}>✅ Try saying:</Text>
              <Text style={styles.tryText}>"{r.trySaying}"</Text>
            </View>

            <View style={styles.whyBox}>
              <Text style={styles.whyLabel}>💡 Why this helps:</Text>
              <Text style={styles.whyText}>{r.why}</Text>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.bottomCard}>
        <Heart size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={styles.bottomTitle}>You won't get it perfect</Text>
        <Text style={styles.bottomText}>
          We all slip into old patterns sometimes. What matters is trying, repairing when needed, and being gentle with yourself too.
        </Text>
        <Button variant="outline" onPress={() => (navigation as any).navigate('HandlingResistance')} style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: colors.foreground }}>View handling resistance guide</Text>
        </Button>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  introCard: { borderRadius: radius, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  introTitle: { ...typography.h3, marginBottom: 8 },
  introText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  list: { gap: 12, marginBottom: 16 },
  responseCard: { padding: 20 },
  situation: { fontSize: 11, fontWeight: '600', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  insteadBox: { backgroundColor: withOpacity(colors.destructive, 0.1), borderRadius: radius, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: withOpacity(colors.destructive, 0.2) },
  insteadLabel: { fontSize: 11, fontWeight: '600', color: colors.destructive, marginBottom: 4 },
  insteadText: { fontSize: 13, color: colors.foreground },
  tryBox: { backgroundColor: withOpacity(colors.secondary, 0.1), borderRadius: radius, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.2) },
  tryLabel: { fontSize: 11, fontWeight: '600', color: colors.secondary, marginBottom: 4 },
  tryText: { fontSize: 13, color: colors.foreground },
  whyBox: { backgroundColor: withOpacity(colors.accent, 0.5), borderRadius: radius, padding: 12 },
  whyLabel: { fontSize: 11, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
  whyText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
  bottomCard: { padding: 20, alignItems: 'center' },
  bottomTitle: { ...typography.h3, marginBottom: 8 },
  bottomText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
});
