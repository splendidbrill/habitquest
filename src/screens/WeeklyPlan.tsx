import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Apple, Footprints, Moon, Plus, Edit, ChevronRight, X } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { RecipeCard } from '../components/RecipeCard';
import { indianRecipes } from '../data/recipes';
import { colors, typography, radius, withOpacity } from '../theme';

interface Activity {
  id: string;
  type: 'food' | 'movement' | 'routine';
  title: string;
  recipeId?: string;
}

interface DayPlan {
  day: string;
  date: string;
  activities: Activity[];
}

const weekPlanData: DayPlan[] = [
  { day: 'Monday', date: '10 Feb', activities: [{ id: '1', type: 'food', title: 'Simple Dal Tadka with Vegetables', recipeId: 'dal-tadka' }, { id: '2', type: 'movement', title: 'Park football - 30 minutes' }] },
  { day: 'Tuesday', date: '11 Feb', activities: [{ id: '3', type: 'food', title: 'Mild Chicken Tikka Wraps', recipeId: 'chicken-tikka-wraps' }, { id: '4', type: 'movement', title: 'Ball skills practice - keepy-uppy challenge' }, { id: '5', type: 'routine', title: 'Water with all meals today' }] },
  { day: 'Wednesday', date: '12 Feb', activities: [{ id: '6', type: 'food', title: 'Colourful Vegetable Pulao', recipeId: 'veggie-pulao' }, { id: '7', type: 'movement', title: 'Walk or cycle to the park' }] },
  { day: 'Thursday', date: '13 Feb', activities: [{ id: '8', type: 'food', title: 'Chapati Pizza with Vegetables', recipeId: 'chapati-pizza' }, { id: '9', type: 'movement', title: 'Park visit - play on equipment then football' }] },
  { day: 'Friday', date: '14 Feb', activities: [{ id: '10', type: 'food', title: 'Aloo Matar (Potato & Pea Curry)', recipeId: 'aloo-matar' }, { id: '11', type: 'movement', title: 'Football with friends after school' }, { id: '12', type: 'routine', title: 'Bedtime at 8:30pm' }] },
  { day: 'Saturday', date: '15 Feb', activities: [{ id: '13', type: 'food', title: 'Make samosa parcels together', recipeId: 'vegetable-samosa-filling' }, { id: '14', type: 'movement', title: 'Park football match - 45 minutes' }] },
  { day: 'Sunday', date: '16 Feb', activities: [{ id: '15', type: 'food', title: 'Masala Omelette for breakfast', recipeId: 'masala-omelette' }, { id: '16', type: 'movement', title: 'Family park visit - football or frisbee' }, { id: '17', type: 'routine', title: 'Prep lunches for the week' }] },
];

const activityIconMap = { food: Apple, movement: Footprints, routine: Moon };

export function WeeklyPlan() {
  const navigation = useNavigation();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [customActivity, setCustomActivity] = useState('');
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(weekPlanData);

  const addActivity = (day: string) => {
    if (!customActivity.trim()) return;
    setWeekPlan(weekPlan.map(d => d.day === day
      ? { ...d, activities: [...d.activities, { id: Date.now().toString(), type: 'food', title: customActivity }] }
      : d
    ));
    setCustomActivity('');
    setEditingDay(null);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your weekly plan</Text>
        <Text style={styles.subtitle}>Indian-inspired meals and park activities</Text>
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>🍛 Tip:</Text> All recipes have been tailored for your family. Tap any meal to see ingredients and instructions.
        </Text>
      </Card>

      <View style={styles.days}>
        {weekPlan.map(day => (
          <Card key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View>
                <Text style={styles.dayName}>{day.day}</Text>
                <Text style={styles.dayDate}>{day.date}</Text>
              </View>
              <Button variant="ghost" size="sm" onPress={() => setEditingDay(day.day)}>
                <Edit size={14} color={colors.mutedForeground} />
                <Text style={styles.editText}>Edit</Text>
              </Button>
            </View>

            <View style={styles.activities}>
              {day.activities.map(act => {
                if (act.type === 'food' && act.recipeId) {
                  const recipe = indianRecipes.find(r => r.id === act.recipeId);
                  if (recipe) return <RecipeCard key={act.id} recipe={recipe} compact />;
                }
                const Icon = activityIconMap[act.type];
                return (
                  <View key={act.id} style={styles.actRow}>
                    <View style={styles.actIcon}>
                      <Icon size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.actTitle}>{act.title}</Text>
                    <ChevronRight size={14} color={colors.mutedForeground} />
                  </View>
                );
              })}

              <Button variant="outline" size="sm" onPress={() => setEditingDay(day.day)} style={styles.addBtn}>
                <Plus size={14} color={colors.foreground} />
                <Text style={styles.addText}>Add your own</Text>
              </Button>
            </View>
          </Card>
        ))}
      </View>

      <Card style={[styles.suggestCard, { borderColor: withOpacity(colors.secondary, 0.2) }]}>
        <Text style={styles.suggestTitle}>⚽ Park activity ideas</Text>
        <Text style={styles.suggestText}>
          <Text style={{ fontWeight: '600' }}>With a ball:</Text> Football dribbling, keepy-uppy challenges, target practice{'\n\n'}
          <Text style={{ fontWeight: '600' }}>Other ideas:</Text> Tag games, races, playground equipment, scavenger hunt
        </Text>
      </Card>

      <View style={{ height: 20 }} />

      {/* Edit Modal */}
      <Modal visible={editingDay !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditingDay(null)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to {editingDay}</Text>
            <Pressable onPress={() => setEditingDay(null)} hitSlop={10}>
              <X size={22} color={colors.foreground} />
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalHint}>What would you like to add to this day?</Text>
            <Textarea
              value={customActivity}
              onChangeText={setCustomActivity}
              placeholder="e.g., Try paneer tikka, Basketball at park, Drink lassi"
              minHeight={96}
            />
            <Button onPress={() => editingDay && addActivity(editingDay)} disabled={!customActivity.trim()} style={{ marginTop: 16 }}>
              <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Add activity</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: { marginBottom: 16 },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.mutedForeground },
  infoCard: { padding: 16, marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
  days: { gap: 12 },
  dayCard: { overflow: 'hidden' },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: withOpacity(colors.muted, 0.5) },
  dayName: { ...typography.h3 },
  dayDate: { fontSize: 13, color: colors.mutedForeground },
  editText: { fontSize: 13, color: colors.mutedForeground },
  activities: { padding: 16, gap: 10 },
  actRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: radius, backgroundColor: colors.background },
  actIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: withOpacity(colors.primary, 0.1), alignItems: 'center', justifyContent: 'center' },
  actTitle: { flex: 1, fontSize: 13, color: colors.foreground },
  addBtn: { flexDirection: 'row', gap: 6 },
  addText: { fontSize: 13, color: colors.foreground },
  suggestCard: { padding: 20, marginTop: 16, backgroundColor: withOpacity(colors.secondary, 0.05) },
  suggestTitle: { ...typography.h3, marginBottom: 8 },
  suggestText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 20 },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { ...typography.h3 },
  modalBody: { padding: 20 },
  modalHint: { fontSize: 14, color: colors.mutedForeground, marginBottom: 12 },
});
