import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, typography, radius, withOpacity } from '../theme';

interface LunchItem {
  id: string;
  name: string;
  category: 'protein' | 'carb' | 'fruit' | 'veg' | 'dairy';
  eaten: boolean | null;
}

export function SchoolLunchTracker() {
  const navigation = useNavigation();
  const [todayLunch, setTodayLunch] = useState<LunchItem[]>([
    { id: '1', name: 'Sandwich', category: 'carb', eaten: true },
    { id: '2', name: 'Apple', category: 'fruit', eaten: true },
    { id: '3', name: 'Yogurt', category: 'dairy', eaten: false },
    { id: '4', name: 'Carrot sticks', category: 'veg', eaten: null },
  ]);

  const toggleEaten = (id: string, status: boolean) => {
    setTodayLunch(prev => prev.map(item => item.id === id ? { ...item, eaten: status } : item));
  };

  const getSuggestions = () => {
    const eaten = todayLunch.filter(i => i.eaten === true);
    const missing = [];
    if (!eaten.some(i => i.category === 'protein')) missing.push({ issue: 'Your child skipped protein today', suggestion: 'Consider adding cheese, egg, or chicken to tomorrow\'s lunch', emoji: '🥚' });
    if (!eaten.some(i => i.category === 'veg')) missing.push({ issue: 'No vegetables eaten today', suggestion: 'Try cucumber sticks, cherry tomatoes, or peppers tomorrow', emoji: '🥕' });
    if (!eaten.some(i => i.category === 'fruit')) missing.push({ issue: 'No fruit eaten today', suggestion: 'Pack easy options: banana, grapes, or apple slices', emoji: '🍎' });
    if (missing.length === 0) missing.push({ issue: 'Balanced lunch today! 🎉', suggestion: 'Your child ate from all the main food groups. Well done!', emoji: '✅' });
    return missing;
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>School Lunch Tracker</Text>
          <Text style={styles.subtitle}>What did they actually eat?</Text>
        </View>
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>💡 For parents:</Text> Ask your child to tap what they ate at lunch. This helps you plan better dinners and snacks.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Today's lunch</Text>
      <View style={styles.lunchList}>
        {todayLunch.map(item => (
          <Card key={item.id} style={styles.lunchItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lunchName}>{item.name}</Text>
              <Text style={styles.lunchCat}>{item.category}</Text>
            </View>
            <View style={styles.eatBtns}>
              <Button
                size="sm"
                variant={item.eaten === true ? 'default' : 'outline'}
                onPress={() => toggleEaten(item.id, true)}
                style={[styles.eatBtn, item.eaten === true ? { backgroundColor: colors.primary } : null]}
              >
                <CheckCircle size={14} color={item.eaten === true ? colors.primaryForeground : colors.foreground} />
                <Text style={[styles.eatBtnText, item.eaten === true ? { color: colors.primaryForeground } : null]}>Ate it</Text>
              </Button>
              <Button
                size="sm"
                variant={item.eaten === false ? 'destructive' : 'outline'}
                onPress={() => toggleEaten(item.id, false)}
                style={[styles.eatBtn, item.eaten === false ? { backgroundColor: colors.destructive } : null]}
              >
                <XCircle size={14} color={item.eaten === false ? colors.primaryForeground : colors.foreground} />
                <Text style={[styles.eatBtnText, item.eaten === false ? { color: colors.primaryForeground } : null]}>Left it</Text>
              </Button>
            </View>
          </Card>
        ))}
      </View>

      <LinearGradient
        colors={[withOpacity(colors.secondary, 0.2), withOpacity(colors.primary, 0.1)]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryTitle}>Lunch summary</Text>
        {todayLunch.map(item => (
          item.eaten !== null ? (
            <View key={item.id} style={styles.summaryRow}>
              {item.eaten ? (
                <CheckCircle size={16} color={colors.secondary} />
              ) : (
                <XCircle size={16} color={colors.destructive} />
              )}
              <Text style={[styles.summaryText, !item.eaten && styles.summaryTextDone]}>
                {item.name}
              </Text>
            </View>
          ) : null
        ))}
      </LinearGradient>

      <View style={styles.suggestions}>
        <View style={styles.suggestHeader}>
          <Lightbulb size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Suggestions for tomorrow</Text>
        </View>
        {getSuggestions().map((s, i) => (
          <Card key={i} style={styles.suggestCard}>
            <View style={styles.suggestRow}>
              <Text style={styles.suggestEmoji}>{s.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestIssue}>{s.issue}</Text>
                <Text style={styles.suggestText}>{s.suggestion}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.comingSoonCard}>
        <Text style={styles.comingSoonTitle}>Child view coming soon</Text>
        <Text style={styles.comingSoonText}>
          Your child will be able to log their own lunch with simple taps, making it fun and easy to track.
        </Text>
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
  infoCard: { padding: 14, marginBottom: 16 },
  infoText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
  sectionTitle: { ...typography.h3, marginBottom: 12 },
  lunchList: { gap: 8, marginBottom: 16 },
  lunchItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  lunchName: { fontSize: 15, fontWeight: '500', color: colors.foreground, marginBottom: 2 },
  lunchCat: { fontSize: 11, color: colors.mutedForeground, textTransform: 'capitalize' },
  eatBtns: { flexDirection: 'row', gap: 6 },
  eatBtn: { flexDirection: 'row', gap: 4, paddingHorizontal: 10 },
  eatBtnText: { fontSize: 12, color: colors.foreground },
  summaryCard: { borderRadius: radius, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: withOpacity(colors.secondary, 0.3) },
  summaryTitle: { ...typography.h4, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  summaryText: { fontSize: 14, color: colors.foreground },
  summaryTextDone: { textDecorationLine: 'line-through', color: colors.mutedForeground },
  suggestions: { marginBottom: 16 },
  suggestHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  suggestCard: { padding: 14, marginBottom: 8 },
  suggestRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  suggestEmoji: { fontSize: 22 },
  suggestIssue: { fontSize: 14, fontWeight: '500', color: colors.primary, marginBottom: 4 },
  suggestText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  comingSoonCard: { padding: 20, alignItems: 'center' },
  comingSoonTitle: { ...typography.h3, marginBottom: 8 },
  comingSoonText: { fontSize: 13, color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 },
});
