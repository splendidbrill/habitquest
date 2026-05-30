import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Lightbulb } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

const behaviourTips = [
  { id: '1', scenario: 'Child refusing vegetables?', tip: 'Serve a very small portion alongside familiar foods. No pressure to eat it.', emoji: '🥦', why: 'Small portions feel less overwhelming. Seeing it regularly builds familiarity without force.' },
  { id: '2', scenario: 'Child demanding sugary snacks?', tip: 'Offer a structured snack time (e.g., 3pm) rather than constant grazing.', emoji: '🍪', why: 'Predictable snack times reduce pestering and help them learn to wait.' },
  { id: '3', scenario: 'Child refusing dinner?', tip: 'Avoid making a second meal. Offer the same meal again later if they\'re hungry.', emoji: '🍽️', why: 'Making alternatives teaches them refusal = special treatment. Stay calm and consistent.' },
  { id: '4', scenario: 'Child eating too fast?', tip: 'Put cutlery down between bites. Make mealtimes relaxed, not rushed.', emoji: '⏱️', why: 'It takes 20 minutes for fullness signals to reach the brain. Slowing down prevents overeating.' },
  { id: '5', scenario: "Child won't try new foods?", tip: 'Let them explore without eating: touch it, smell it, help cook it.', emoji: '👀', why: 'Interaction builds curiosity. No pressure = more likely to eventually try it.' },
  { id: '6', scenario: 'Child wants dessert first?', tip: "Say 'Dessert comes after dinner, but you choose what to eat from your plate.'", emoji: '🍰', why: 'Gives them control without making dessert a reward. Keeps it neutral.' },
  { id: '7', scenario: "Child says 'I'm full' immediately?", tip: "Say 'That's fine. Stay at the table with us for a few minutes.'", emoji: '😌', why: "They learn mealtimes are social, not battles. Often they'll nibble once pressure is off." },
  { id: '8', scenario: 'Child comparing food to friends?', tip: "Say 'Different families eat different foods. Both are okay.'", emoji: '🤝', why: 'Validates their feelings without changing your approach. Normalizes variety.' },
  { id: '9', scenario: 'Child sneaking food?', tip: "Don't punish. Say 'You don't need to hide food. If you're hungry, just ask.'", emoji: '🙈', why: 'Sneaking means they feel restricted. Making food predictable stops the behavior.' },
  { id: '10', scenario: 'Child complaining about packed lunch?', tip: "Let them choose 1-2 items to pack. Give options: 'Apple or banana?'", emoji: '🎒', why: 'Involvement increases acceptance. Bounded choice (not unlimited) works best.' },
  { id: '11', scenario: 'Child drinking too much juice?', tip: 'Dilute juice 50/50 with water. Gradually increase water ratio over weeks.', emoji: '🧃', why: 'Gradual change is less noticeable. Reduces sugar without battles.' },
  { id: '12', scenario: 'Child refusing breakfast?', tip: 'Offer something small and portable: banana, toast, yogurt.', emoji: '🌅', why: "Some kids aren't hungry early. Something small is better than nothing." },
];

export function FoodBehaviourTips() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Food Behaviour Tips</Text>
          <Text style={styles.subtitle}>Quick, actionable advice</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.introCard}
      >
        <Lightbulb size={40} color={colors.secondaryForeground} style={{ marginBottom: 12 }} />
        <Text style={styles.introTitle}>One tip at a time</Text>
        <Text style={styles.introText}>
          You don't need to tackle everything at once. Pick one tip to try this week and see how it goes. Small changes add up.
        </Text>
      </LinearGradient>

      <View style={styles.list}>
        {behaviourTips.map(tip => (
          <Card key={tip.id} style={styles.tipCard}>
            <View style={styles.tipTop}>
              <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              <Text style={styles.tipScenario}>{tip.scenario}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>💡 {tip.tip}</Text>
            </View>

            <View style={styles.whyBox}>
              <Text style={styles.whyText}>
                <Text style={{ fontWeight: '600' }}>Why this works: </Text>
                {tip.why}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Need more in-depth support?</Text>
        <Text style={styles.ctaText}>
          Check out our comprehensive guides for handling resistance and difficult behaviors.
        </Text>
        <View style={styles.ctaBtns}>
          <Button variant="outline" onPress={() => (navigation as any).navigate('HandlingResistance')} style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>Handling resistance</Text>
          </Button>
          <Button variant="outline" onPress={() => (navigation as any).navigate('DifficultBehaviors')} style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>Difficult behaviors</Text>
          </Button>
        </View>
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
  tipCard: { padding: 20 },
  tipTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  tipEmoji: { fontSize: 32 },
  tipScenario: { flex: 1, ...typography.h4, color: colors.primary, paddingTop: 4 },
  tipBox: { backgroundColor: withOpacity(colors.secondary, 0.1), borderRadius: radius, padding: 14, borderLeftWidth: 4, borderLeftColor: colors.secondary, marginBottom: 10 },
  tipText: { fontSize: 13, fontWeight: '500', color: colors.foreground, lineHeight: 18 },
  whyBox: { backgroundColor: withOpacity(colors.accent, 0.5), borderRadius: radius, padding: 12 },
  whyText: { fontSize: 12, color: colors.mutedForeground, lineHeight: 18 },
  ctaCard: { padding: 20, alignItems: 'center' },
  ctaTitle: { ...typography.h3, marginBottom: 8 },
  ctaText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  ctaBtns: { flexDirection: 'row', gap: 8, width: '100%' },
  ctaBtn: { flex: 1 },
  ctaBtnText: { fontSize: 13, color: colors.foreground },
});
