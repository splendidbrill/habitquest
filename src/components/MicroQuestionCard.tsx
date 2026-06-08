// ============================================================
// MicroQuestionCard (Phase 8) — progressive profiling.
//
// Surfaces AT MOST one micro-question every few days on the parent
// dashboard. Answers feed `preference_signals` (source='micro_q') so the
// preference model keeps improving. Fully dismissible, never blocks the UI,
// and rate-limited via AsyncStorage so parents are never nagged.
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
import { storage } from '../utils/storage';
import { recordPreferenceSignal } from '../services/preferenceEngine';
import {
  microQuestions,
  type MicroQuestion,
  type MicroQuestionOption,
} from '../data/microQuestions';
import { colors, withOpacity } from '../theme';

const LAST_ASKED_KEY = 'microQ:lastAsked';
const ANSWERED_KEY = 'microQ:answered';
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // ≤1 every 3 days

async function readAnswered(): Promise<string[]> {
  const raw = await storage.getItem(ANSWERED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function MicroQuestionCard({ childId }: { childId?: string | null }) {
  const [question, setQuestion] = useState<MicroQuestion | null>(null);
  const [thanked, setThanked] = useState(false);

  useEffect(() => {
    if (!childId) return;
    let active = true;
    (async () => {
      const lastRaw = await storage.getItem(LAST_ASKED_KEY);
      const last = lastRaw ? parseInt(lastRaw, 10) : 0;
      if (Date.now() - last < COOLDOWN_MS) return; // rate-limited

      const answered = await readAnswered();
      const next = microQuestions.find(q => !answered.includes(q.id));
      if (active && next) setQuestion(next);
    })();
    return () => {
      active = false;
    };
  }, [childId]);

  if (!question || !childId) return null;

  const answer = async (opt: MicroQuestionOption) => {
    await recordPreferenceSignal(childId, {
      kind: question.kind,
      attribute: question.attribute,
      value: opt.value,
      weight: opt.weight ?? 1,
      source: 'micro_q',
      refId: question.id,
    });
    const answered = await readAnswered();
    await storage.setItem(
      ANSWERED_KEY,
      JSON.stringify([...answered, question.id]),
    );
    await storage.setItem(LAST_ASKED_KEY, String(Date.now()));
    setThanked(true);
    setTimeout(() => setQuestion(null), 1200);
  };

  const dismiss = async () => {
    // Re-surfaces after the cooldown; not marked answered.
    await storage.setItem(LAST_ASKED_KEY, String(Date.now()));
    setQuestion(null);
  };

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Sparkles size={15} color={colors.primary} />
        <Text style={s.tag}>Quick question</Text>
        <TouchableOpacity
          onPress={dismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={s.closeBtn}
        >
          <X size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {thanked ? (
        <Text style={s.thanks}>Thanks! That helps us tune your plan 🙌</Text>
      ) : (
        <>
          <Text style={s.prompt}>{question.prompt}</Text>
          <View style={s.options}>
            {question.options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.8}
                onPress={() => answer(opt)}
                style={s.option}
              >
                <Text style={s.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.helper}>
            One tap — your answer personalises next week's plan.
          </Text>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.25),
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  closeBtn: { padding: 2 },
  prompt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    marginBottom: 12,
    lineHeight: 21,
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    backgroundColor: withOpacity(colors.primary, 0.08),
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.18),
  },
  optionText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  helper: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 10,
  },
  thanks: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
});
