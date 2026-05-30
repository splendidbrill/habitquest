import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, BookOpen, Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

const behaviors = [
  { title: 'Food sneaking or hiding', description: 'Finding wrappers hidden in their room or food stashed away', whatItMeans: "They may feel certain foods are 'forbidden' or worry they won't get enough. This often happens when we're too restrictive.", howToRespond: ["Don't punish or shame them - it will make sneaking worse", "Make previously 'forbidden' foods regular and predictable (e.g., biscuits after dinner on Tuesdays)", "Say: 'You don't need to hide food. If you're hungry, just ask'", "Check if they're genuinely hungry between meals"], longTerm: 'When treats become regular and predictable, the urge to sneak disappears. This can take weeks, so be patient.' },
  { title: 'Meltdowns at mealtimes', description: 'Crying, shouting, or refusing to come to the table', whatItMeans: "Mealtimes may feel stressful or pressured. They might be overtired, overstimulated, or anxious about being forced to eat.", howToRespond: ["Stay calm - your reaction shapes theirs", "Lower expectations temporarily: 'You don't have to eat, just sit with us for 5 minutes'", "Remove pressure: 'I've made dinner. You can eat what you like from the table'", "Look for patterns: Is it always at the same time? Same food? Same family member?"], longTerm: "Once the pressure is off, mealtimes usually become easier. Focus on connection, not consumption." },
  { title: 'Constant negotiating or bargaining', description: "'If I eat this, can I have...?' or 'How many bites for dessert?'", whatItMeans: "They've learned food is transactional. Someone (maybe us!) taught them that eating = rewards.", howToRespond: ["Stop all food bargaining immediately - it backfires", "Say: 'Dessert comes after dinner, but you choose what to eat from your plate'", "Offer choices that don't involve rewards: 'Would you like peas or carrots?'", "Be consistent - if you cave once, negotiations will increase"], longTerm: "Breaking this habit takes 2-3 weeks of absolute consistency. It's hard but worth it." },
  { title: 'Extreme reactions to body comments', description: 'Distress when clothes feel tight or someone mentions their size', whatItMeans: "They're becoming aware of body image messages from us, peers, media, or school. This is serious and needs gentle handling.", howToRespond: ["Never dismiss their feelings: 'I hear you. That sounds really hard'", "Don't reassure with appearance: Instead of 'You're not fat', try 'Your body is exactly right for you'", "Talk about what bodies do, not how they look: 'Your legs are strong for running'", "Monitor who/what is giving them these messages"], longTerm: "This may need professional support. Speak to your GP if concerns persist. Early intervention prevents bigger problems." },
  { title: 'Refusing all vegetables or new foods', description: 'Total shutdown when anything unfamiliar appears', whatItMeans: "This is called food neophobia - fear of new foods. It's developmental and very common in 7-11 year olds.", howToRespond: ["Keep serving them with zero pressure: 'It's here if you're curious'", "Eat them yourself with genuine enjoyment", "Involve them in cooking without expecting them to eat it", "Celebrate tiny steps: 'You touched the broccoli today!'", "It can take 15-20 exposures before they try it"], longTerm: "Most children grow out of this phase by their teens IF we don't pressure them. Patience is key." },
  { title: 'Exercise avoidance or complaints', description: "'My legs hurt', 'I'm too tired', 'I hate PE'", whatItMeans: "They may have had negative experiences (being picked last, feeling watched, comparing themselves to others). Or they're genuinely not interested in structured sport - and that's okay!", howToRespond: ["Don't force organized sport if they hate it", "Find what they DO enjoy: dancing, walking the dog, park play, swimming", "Make it social: 'Shall we invite a friend?'", "Join them: 'Let's go together'", "Focus on fun, not fitness or appearance"], longTerm: "The goal is lifelong movement, not being good at sport. Any joyful movement counts." },
];

export function DifficultBehaviors() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Difficult Behaviors</Text>
          <Text style={styles.subtitle}>Understanding and responding</Text>
        </View>
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.introCard}
      >
        <BookOpen size={40} color={colors.secondaryForeground} style={{ marginBottom: 12 }} />
        <Text style={styles.introTitle}>These behaviors are communication</Text>
        <Text style={styles.introText}>
          Children don't act out for no reason. Their behavior is trying to tell us something. Our job is to listen and respond with compassion, not punishment.
        </Text>
      </LinearGradient>

      <View style={styles.list}>
        {behaviors.map((b, i) => (
          <Card key={i} style={styles.behaviorCard}>
            <Text style={styles.behaviorTitle}>{b.title}</Text>
            <Text style={styles.behaviorDesc}>{b.description}</Text>

            <View style={styles.meansBox}>
              <Text style={styles.meansLabel}>💭 What it might mean:</Text>
              <Text style={styles.meansText}>{b.whatItMeans}</Text>
            </View>

            <View style={styles.respondSection}>
              <Text style={styles.respondLabel}>✅ How to respond:</Text>
              {b.howToRespond.map((r, j) => (
                <Text key={j} style={styles.bullet}>• {r}</Text>
              ))}
            </View>

            <View style={styles.longTermBox}>
              <Text style={styles.longTermLabel}>🕐 Long-term outlook:</Text>
              <Text style={styles.longTermText}>{b.longTerm}</Text>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.warningCard}>
        <Text style={styles.warningTitle}>When to seek professional support</Text>
        <Text style={styles.warningText}>If you notice any of these, please speak to your GP or school nurse:</Text>
        {['Obsessive weighing or body checking', 'Hiding food and lying about eating', 'Severe distress about body or appearance', 'Withdrawing from friends and activities', 'Big changes in mood or behavior'].map((item, i) => (
          <Text key={i} style={styles.warningBullet}>• {item}</Text>
        ))}
        <Text style={styles.warningNote}>Early intervention makes a huge difference. You're not overreacting by asking for help.</Text>
      </Card>

      <Card style={styles.bottomCard}>
        <Heart size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={styles.bottomTitle}>You're not alone</Text>
        <Text style={styles.bottomText}>These challenges are hard, but with the right response, they almost always improve. Take it one day at a time.</Text>
        <View style={styles.bottomBtns}>
          <Button variant="outline" onPress={() => (navigation as any).navigate('HandlingResistance')} style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>Handling resistance</Text>
          </Button>
          <Button variant="outline" onPress={() => (navigation as any).navigate('SupportiveResponses')} style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>Supportive responses</Text>
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
  list: { gap: 16, marginBottom: 16 },
  behaviorCard: { padding: 20 },
  behaviorTitle: { ...typography.h4, color: colors.primary, marginBottom: 6 },
  behaviorDesc: { fontSize: 13, color: colors.mutedForeground, marginBottom: 12, lineHeight: 18 },
  meansBox: { backgroundColor: withOpacity(colors.accent, 0.5), borderRadius: radius, padding: 12, marginBottom: 12 },
  meansLabel: { fontSize: 11, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
  meansText: { fontSize: 13, color: colors.foreground, lineHeight: 18 },
  respondSection: { marginBottom: 12 },
  respondLabel: { fontSize: 11, fontWeight: '600', color: colors.foreground, marginBottom: 6 },
  bullet: { fontSize: 13, color: colors.mutedForeground, paddingLeft: 8, marginBottom: 4, lineHeight: 18 },
  longTermBox: { backgroundColor: withOpacity(colors.secondary, 0.1), borderRadius: radius, padding: 12, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.2) },
  longTermLabel: { fontSize: 11, fontWeight: '600', color: colors.secondary, marginBottom: 4 },
  longTermText: { fontSize: 13, color: colors.foreground, lineHeight: 18 },
  warningCard: { padding: 20, marginBottom: 16, backgroundColor: withOpacity(colors.destructive, 0.1), borderColor: withOpacity(colors.destructive, 0.2) },
  warningTitle: { ...typography.h4, marginBottom: 8 },
  warningText: { fontSize: 13, color: colors.mutedForeground, marginBottom: 10, lineHeight: 18 },
  warningBullet: { fontSize: 13, color: colors.mutedForeground, paddingLeft: 8, marginBottom: 4 },
  warningNote: { fontSize: 11, color: colors.mutedForeground, marginTop: 10, lineHeight: 16 },
  bottomCard: { padding: 20, alignItems: 'center' },
  bottomTitle: { ...typography.h3, marginBottom: 8 },
  bottomText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  bottomBtns: { flexDirection: 'row', gap: 8, width: '100%' },
  bottomBtn: { flex: 1 },
  bottomBtnText: { fontSize: 13, color: colors.foreground },
});
