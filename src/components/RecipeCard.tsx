import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { Clock, Users, ExternalLink, ChevronRight, X } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Recipe } from '../data/recipes';
import { colors, radius, typography, spacing } from '../theme';

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  if (compact) {
    return (
      <>
        <Pressable
          style={styles.compactRow}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.compactIcon}>
            <Text style={{ fontSize: 18 }}>🍛</Text>
          </View>
          <Text style={styles.compactTitle} numberOfLines={1}>{recipe.title}</Text>
          <ChevronRight size={16} color={colors.mutedForeground} />
        </Pressable>
        <RecipeModal recipe={recipe} visible={modalVisible} onClose={() => setModalVisible(false)} />
      </>
    );
  }

  return (
    <>
      <Card style={styles.card}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.mutedForeground} />
            <Text style={styles.metaText}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.mutedForeground} />
            <Text style={styles.metaText}>{recipe.servings}</Text>
          </View>
        </View>
        <Button variant="outline" onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>View recipe</Text>
        </Button>
      </Card>
      <RecipeModal recipe={recipe} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

function RecipeModal({
  recipe,
  visible,
  onClose,
}: {
  recipe: Recipe;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle} numberOfLines={2}>{recipe.title}</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <X size={22} color={colors.foreground} />
          </Pressable>
        </View>
        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
          <Text style={styles.description}>{recipe.description}</Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{recipe.prepTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={14} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{recipe.servings}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={styles.listRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{ing}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.listText, { flex: 1 }]}>{step}</Text>
            </View>
          ))}

          {recipe.tips && (
            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Tip for parents</Text>
              <Text style={styles.tipText}>{recipe.tips}</Text>
            </View>
          )}

          {recipe.externalLink && (
            <Button
              variant="outline"
              onPress={() => recipe.externalLink && Linking.openURL(recipe.externalLink)}
              style={styles.externalBtn}
            >
              <ExternalLink size={16} color={colors.foreground} />
              <Text style={styles.btnText}>View full recipe online</Text>
            </Button>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 8,
  },
  title: {
    ...typography.h3,
    marginBottom: 4,
  },
  description: {
    ...typography.sm,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius,
    backgroundColor: colors.background,
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `rgba(74,144,226,0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  modalTitle: {
    ...typography.h3,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  sectionTitle: {
    ...typography.h4,
    marginTop: 16,
    marginBottom: 10,
  },
  listRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
  },
  listText: {
    ...typography.sm,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `rgba(74,144,226,0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  tipBox: {
    backgroundColor: colors.accent,
    borderRadius: radius,
    padding: 16,
    marginTop: 16,
  },
  tipTitle: {
    ...typography.h4,
    marginBottom: 6,
  },
  tipText: {
    ...typography.sm,
    color: colors.accentForeground,
    lineHeight: 20,
  },
  externalBtn: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
});
