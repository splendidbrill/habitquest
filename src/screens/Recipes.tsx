import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipeCard } from '../components/RecipeCard';
import { indianRecipes } from '../data/recipes';
import { colors, typography, radius } from '../theme';

export function Recipes() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = indianRecipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Button>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Recipe Library</Text>
          <Text style={styles.subtitle}>Indian-inspired family meals</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Search size={16} color={colors.mutedForeground} style={styles.searchIcon} />
        <Input
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search recipes..."
          style={styles.searchInput}
        />
      </View>

      <Card style={[styles.infoCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' }}>🍛 About these recipes:</Text> All meals are designed for families with children aged 7-11, using familiar Indian ingredients and mild spices.
        </Text>
      </Card>

      <View style={styles.list}>
        {filtered.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </View>

      {filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No recipes found. Try a different search term.</Text>
        </Card>
      )}

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
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, position: 'relative' },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  searchInput: { flex: 1, paddingLeft: 40 },
  infoCard: { padding: 14, marginBottom: 16 },
  infoText: { fontSize: 13, color: colors.accentForeground, lineHeight: 18 },
  list: { gap: 12 },
  emptyCard: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
});
