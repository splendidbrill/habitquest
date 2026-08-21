import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Share,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { getWeeklyPlan } from '../services/weeklyPlanStore';
import {
  buildItems,
  CATEGORY_ORDER,
  type GroceryItem,
} from '../services/groceryLogic';
import { colors, typography, radius, withOpacity } from '../theme';

export function GroceryList() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'list' | 'tesco'>('list');
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Build the list from the current weekly plan, refreshing on focus (so a
  // regenerated plan updates the list), and keep any items already ticked off.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getWeeklyPlan().then(plan => {
        if (!active) return;
        setItems(prev => {
          const checkedKeys = new Set(
            prev.filter(i => i.checked).map(i => i.id),
          );
          return buildItems(plan).map(i =>
            checkedKeys.has(i.id) ? { ...i, checked: true } : i,
          );
        });
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const toggle = (id: string) =>
    setItems(items.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)));
  const categories = CATEGORY_ORDER.filter(c =>
    items.some(i => i.category === c),
  );
  const checked = items.filter(i => i.checked).length;

  const handleShare = async () => {
    const text = items
      .filter(i => !i.checked)
      .map(i => `- ${i.item}`)
      .join('\n');
    await Share.share({ title: 'HabitQuest Grocery List', message: text });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Grocery List</Text>
          <Text style={styles.subtitle}>
            {checked}/{items.length} items checked
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <Check
            size={16}
            color={
              activeTab === 'list'
                ? colors.primaryForeground
                : colors.mutedForeground
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'list' && styles.tabTextActive,
            ]}
          >
            Shopping List
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'tesco' && styles.tabActive]}
          onPress={() => setActiveTab('tesco')}
        >
          <ShoppingCart
            size={16}
            color={
              activeTab === 'tesco'
                ? colors.primaryForeground
                : colors.mutedForeground
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'tesco' && styles.tabTextActive,
            ]}
          >
            Tesco Export
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : items.length === 0 ? (
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            No plan yet — generate a weekly plan on the Plan tab and your
            grocery list will fill in automatically.
          </Text>
        </Card>
      ) : activeTab === 'list' ? (
        <>
          <Card
            style={[
              styles.infoCard,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          >
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '600' }}>🛒 This week's shop:</Text>{' '}
              Everything below is pulled from your current weekly meal plan.
              Regenerate the plan and this list updates too.
            </Text>
          </Card>

          <Button
            variant="outline"
            onPress={handleShare}
            style={styles.shareBtn}
          >
            <Text style={styles.shareBtnText}>Share list</Text>
          </Button>

          {categories.map(cat => (
            <View key={cat} style={styles.catSection}>
              <Text style={styles.catTitle}>{cat}</Text>
              {items
                .filter(i => i.category === cat)
                .map(item => (
                  <Pressable key={item.id} onPress={() => toggle(item.id)}>
                    <Card
                      style={[
                        styles.itemCard,
                        item.checked ? styles.itemChecked : null,
                      ]}
                    >
                      <View style={styles.itemRow}>
                        <Checkbox
                          checked={item.checked}
                          onPress={() => toggle(item.id)}
                        />
                        <Text
                          style={[
                            styles.itemText,
                            item.checked && styles.itemTextDone,
                          ]}
                        >
                          {item.item}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                ))}
            </View>
          ))}

          {checked === items.length && (
            <LinearGradient
              colors={[
                withOpacity(colors.secondary, 0.2),
                withOpacity(colors.primary, 0.1),
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.doneCard}
            >
              <Check size={48} color={colors.secondary} />
              <Text style={styles.doneTitle}>All done! 🎉</Text>
              <Text style={styles.doneSub}>
                You've got everything for this week's meals
              </Text>
            </LinearGradient>
          )}
        </>
      ) : (
        <>
          <LinearGradient
            colors={[
              withOpacity(colors.primary, 0.1),
              withOpacity(colors.secondary, 0.1),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tescoCard}
          >
            <View style={styles.tescoHeader}>
              <View style={styles.tescoIcon}>
                <ShoppingCart size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tescoTitle}>Export to Tesco Online</Text>
                <Text style={styles.tescoDesc}>
                  Send your shopping list directly to your Tesco online basket.
                </Text>
              </View>
            </View>
          </LinearGradient>

          <Card style={styles.howCard}>
            <Text style={styles.howTitle}>How it works:</Text>
            {[
              'Review your items below',
              'Click "Export to Tesco" to add items to your basket',
              'Complete your order on Tesco.com or in the Tesco app',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.exportItemsCard}>
            <Text style={styles.exportItemsTitle}>
              Items to export ({items.filter(i => !i.checked).length}):
            </Text>
            {items
              .filter(i => !i.checked)
              .map(item => (
                <View key={item.id} style={styles.exportItem}>
                  <Check size={14} color={colors.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exportItemName}>{item.item}</Text>
                    <Text style={styles.exportItemCat}>{item.category}</Text>
                  </View>
                </View>
              ))}
          </Card>

          <Button
            size="lg"
            style={styles.exportBtn}
            onPress={() =>
              Alert.alert(
                'Tesco Export',
                'In a production app, this would export your list to Tesco online shopping.',
              )
            }
          >
            <ShoppingCart size={20} color={colors.primaryForeground} />
            <Text style={styles.exportBtnText}>
              Export to Tesco Online Shopping
            </Text>
          </Button>

          <Card
            style={[
              styles.noteCard,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          >
            <Text style={styles.noteText}>
              <Text style={{ fontWeight: '600' }}>Note:</Text> You'll need a
              Tesco online account to complete your order.
            </Text>
          </Card>
        </>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtn: { padding: 8 },
  title: { ...typography.h1 },
  subtitle: { fontSize: 13, color: colors.mutedForeground },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius - 2,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground },
  tabTextActive: { color: colors.primaryForeground },
  loadingBox: { paddingVertical: 40, alignItems: 'center' },
  infoCard: { padding: 16, marginBottom: 16 },
  infoText: { fontSize: 14, color: colors.accentForeground, lineHeight: 20 },
  shareBtn: { marginBottom: 16 },
  shareBtnText: { fontSize: 14, color: colors.foreground },
  catSection: { marginBottom: 20 },
  catTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  itemCard: { padding: 14, marginBottom: 8 },
  itemChecked: {
    backgroundColor: withOpacity(colors.accent, 0.5),
    borderColor: colors.secondary,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemText: { fontSize: 15, color: colors.foreground },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: colors.mutedForeground,
  },
  doneCard: {
    borderRadius: radius,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: withOpacity(colors.secondary, 0.3),
  },
  doneTitle: { ...typography.h2, marginTop: 12, marginBottom: 6 },
  doneSub: { fontSize: 14, color: colors.mutedForeground },
  tescoCard: {
    borderRadius: radius,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.2),
  },
  tescoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tescoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: withOpacity(colors.primary, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tescoTitle: { ...typography.h3, marginBottom: 4 },
  tescoDesc: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  howCard: { padding: 20, marginBottom: 16, gap: 12 },
  howTitle: { ...typography.h4, marginBottom: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: withOpacity(colors.primary, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  exportItemsCard: { padding: 20, marginBottom: 16 },
  exportItemsTitle: { ...typography.h4, marginBottom: 12 },
  exportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: withOpacity(colors.accent, 0.3),
    borderRadius: radius,
    marginBottom: 6,
  },
  exportItemName: { fontSize: 14, color: colors.foreground },
  exportItemCat: { fontSize: 11, color: colors.mutedForeground },
  exportBtn: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    backgroundColor: colors.primary,
  },
  exportBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  noteCard: { padding: 14 },
  noteText: { fontSize: 12, color: colors.accentForeground, lineHeight: 18 },
});
