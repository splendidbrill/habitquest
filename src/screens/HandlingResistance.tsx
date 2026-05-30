import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

const guides = [
  {
    scenario: 'Child refuses to try new food',
    doThis: [
      'Put it on the table without pressure - just seeing it helps',
      'Eat it yourself and enjoy it (they watch you!)',
      "Say: 'You don't have to try it today. It's here if you're curious'",
      'Let them touch, smell, or play with it - no eating required',
      "Celebrate tiny steps: 'You looked at the broccoli today, well done!'",
    ],
    avoidThis: [
      "Don't force them to try it or say 'just one bite'",
      "Don't use dessert as a reward for eating it",
      "Don't show frustration or disappointment",
      "Don't make separate meals every time",
    ],
  },
  {
    scenario: "Child says 'I hate this' at the table",
    doThis: [
      "Stay calm: 'That's okay, you don't have to eat it'",
      "Offer a simple choice: 'Would you like bread or some fruit instead?'",
      'Keep the atmosphere light - don\'t make it a battle',
      'Remember: It can take 10-15 times before they accept a food',
      "Ask later: 'What would you like for dinner tomorrow?'",
    ],
    avoidThis: [
      "Don't argue or get into power struggles",
      "Don't take it personally - they're learning to express preferences",
      "Don't lecture about nutrition or starving children",
      "Don't ban them from the table",
    ],
  },
  {
    scenario: 'Child wants snacks all day instead of meals',
    doThis: [
      "Set clear meal and snack times: 'We eat together at 5pm'",
      "Offer water between meals if they say they're hungry",
      'Involve them in meal prep so they\'re invested',
      "Say: 'Dinner is in 30 minutes. Would you like an apple now or wait?'",
      'Make sure snacks are actually filling (banana, toast, yogurt)',
    ],
    avoidThis: [
      "Don't ban all snacks - kids need them!",
      "Don't give in to crisps and biscuits every hour",
      "Don't make them wait hours if genuinely hungry",
      "Don't guilt them for being hungry",
    ],
  },
  {
    scenario: "Child won't sit at the table",
    doThis: [
      "Start small: 'Can we sit together for 5 minutes?'",
      "Make it fun: Play 'highs and lows' (best/worst part of day)",
      'Turn off screens - including yours',
      'Let them help set the table or choose the playlist',
      'Build up gradually - consistency matters more than length',
    ],
    avoidThis: [
      "Don't force a full 30-minute sit-down immediately",
      "Don't bring phones or tablets to the table",
      "Don't use mealtimes for difficult conversations or discipline",
      "Don't compare them to siblings who sit still",
    ],
  },
  {
    scenario: 'Child resists being active',
    doThis: [
      "Find what they enjoy - it doesn't have to be 'sport'",
      'Make it social: Invite a friend to the park',
      "Start with 10 minutes: 'Let's just walk to the corner shop'",
      'Join in yourself - they need to see you move too',
      "Focus on fun, not fitness: 'Let's see who can hop the furthest!'",
    ],
    avoidThis: [
      "Don't force them into organized sports if they hate it",
      "Don't make exercise a punishment",
      "Don't comment on their body or appearance",
      "Don't compare them to sporty kids",
    ],
  },
];

export function HandlingResistance() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Handling Resistance</Text>
          <Text style={styles.subtitle}>Gentle, pressure-free approaches</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.introCard}
      >
        <Heart size={40} color={colors.secondaryForeground} style={{ marginBottom: 12 }} />
        <Text style={styles.introTitle}>You're doing your best</Text>
        <Text style={styles.introText}>
          These situations are completely normal. Every parent faces them. The key is patience and consistency, not perfection.
        </Text>
      </LinearGradient>

      <View style={styles.guides}>
        {guides.map((guide, i) => (
          <Card key={i} style={styles.guideCard}>
            <Text style={styles.scenario}>{guide.scenario}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>✅ Try this</Text>
              {guide.doThis.map((item, j) => (
                <Text key={j} style={styles.bullet}>• {item}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>❌ Avoid this</Text>
              {guide.avoidThis.map((item, j) => (
                <Text key={j} style={styles.bullet}>• {item}</Text>
              ))}
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.supportCard}>
        <Text style={styles.supportTitle}>Need more support?</Text>
        <Text style={styles.supportText}>
          Remember: Progress isn't linear. Some weeks will be harder than others, and that's completely okay.
        </Text>
        <Button variant="outline" onPress={() => (navigation as any).navigate('SupportiveResponses')} style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: colors.foreground }}>View supportive responses guide</Text>
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
  guides: { gap: 16, marginBottom: 16 },
  guideCard: { padding: 20 },
  scenario: { ...typography.h4, color: colors.primary, marginBottom: 14 },
  section: { marginBottom: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 8 },
  bullet: { fontSize: 13, color: colors.mutedForeground, paddingLeft: 8, marginBottom: 4, lineHeight: 18 },
  supportCard: { padding: 20, alignItems: 'center' },
  supportTitle: { ...typography.h3, marginBottom: 8 },
  supportText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
});
