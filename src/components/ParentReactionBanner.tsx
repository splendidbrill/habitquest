import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useChild } from '../context/ChildContext';
import { getUnseenReactions, markReactionsSeen, type MissionReaction } from '../services/reactionService';

export function ParentReactionBanner() {
  const { activeChild } = useChild();
  const [reactions, setReactions] = useState<MissionReaction[]>([]);
  const [visible, setVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-80))[0];

  useEffect(() => {
    if (!activeChild?.id) return;
    getUnseenReactions(activeChild.id).then(recs => {
      if (recs.length > 0) {
        setReactions(recs);
        setVisible(true);
        Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start();
      }
    });
  }, [activeChild?.id]);

  const handleDismiss = async () => {
    Animated.timing(slideAnim, { toValue: -80, duration: 250, useNativeDriver: true }).start(() => {
      setVisible(false);
    });
    if (activeChild?.id) {
      await markReactionsSeen(activeChild.id);
    }
  };

  if (!visible || reactions.length === 0) return null;

  const latest = reactions[0];
  const allEmojis = reactions.map(r => r.emoji).join(' ');

  return (
    <Animated.View style={[s.banner, { transform: [{ translateY: slideAnim }] }]}>
      <View style={s.content}>
        <Text style={s.emojis}>{allEmojis}</Text>
        <View style={s.text}>
          <Text style={s.headline}>Your parent reacted!</Text>
          <Text style={s.sub} numberOfLines={1}>
            {reactions.length === 1
              ? `"${latest.missionTitle}"`
              : `${reactions.length} missions got reactions`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={s.dismissBtn}>
          <Text style={s.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1, borderBottomColor: '#fed7aa',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 6,
  },
  content: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  emojis: { fontSize: 28 },
  text: { flex: 1 },
  headline: { fontSize: 15, fontWeight: '800', color: '#92400e' },
  sub: { fontSize: 12, color: '#b45309', marginTop: 1 },
  dismissBtn: { padding: 6 },
  dismissText: { fontSize: 16, color: '#d97706', fontWeight: '700' },
});
