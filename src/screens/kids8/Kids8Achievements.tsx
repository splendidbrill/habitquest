import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Trophy, Award, Star, Lock } from 'lucide-react-native';

const allBadges = [
  { id: 'dinner-helper', emoji: '🍽️', name: 'Meal Master', description: 'Made a smart meal choice', colors: ['#f97316', '#ef4444'] as [string,string], category: 'Nutrition' },
  { id: 'veggie-explorer', emoji: '🥦', name: 'Veggie Champion', description: 'Completed veggie challenge', colors: ['#16a34a', '#059669'] as [string,string], category: 'Nutrition' },
  { id: 'kitchen-champion', emoji: '👨‍🍳', name: 'Kitchen Pro', description: 'Helped with meal prep', colors: ['#f59e0b', '#f97316'] as [string,string], category: 'Teamwork' },
  { id: 'fuel-master', emoji: '⚡', name: 'Fuel Expert', description: 'Learned about performance nutrition', colors: ['#3b82f6', '#0891b2'] as [string,string], category: 'Knowledge' },
  { id: 'lunch-builder', emoji: '🍱', name: 'Lunch Builder', description: 'Created a balanced lunchbox', colors: ['#9333ea', '#db2777'] as [string,string], category: 'Nutrition' },
  { id: 'school-smart', emoji: '🎒', name: 'School Smart', description: 'Made smart choices at school', colors: ['#0d9488', '#0891b2'] as [string,string], category: 'Independence' },
  { id: 'first-mission', emoji: '🎯', name: 'First Mission', description: 'Completed your first training', colors: ['#9333ea', '#db2777'] as [string,string], category: 'Training' },
  { id: 'week-warrior', emoji: '🔥', name: 'Week Warrior', description: '7 day active streak', colors: ['#ef4444', '#f97316'] as [string,string], category: 'Consistency' },
  { id: 'team-player', emoji: '🤝', name: 'Team Player', description: 'Earned 50 family points', colors: ['#0d9488', '#0891b2'] as [string,string], category: 'Teamwork' },
  { id: 'rising-star', emoji: '⭐', name: 'Rising Star', description: 'Reached Rising Star level', colors: ['#eab308', '#f97316'] as [string,string], category: 'Progress' },
  { id: 'swap-master', emoji: '🔄', name: 'Swap Master', description: 'Learning healthy alternatives', colors: ['#f97316', '#f59e0b'] as [string,string], category: 'Knowledge' },
  { id: 'energy-tracker', emoji: '📊', name: 'Energy Tracker', description: 'Tracking daily fuel and activity', colors: ['#059669', '#16a34a'] as [string,string], category: 'Independence' },
];

const categories = ['Training', 'Nutrition', 'Teamwork', 'Knowledge', 'Consistency', 'Progress', 'Independence'];

export function Kids8Achievements() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState('Rookie');

  useEffect(() => {
    storage.getItem('kids8EarnedBadges').then(v => { if (v) setEarnedBadges(JSON.parse(v)); });
    storage.getItem('kids8UserXP').then(v => {
      const points = parseInt(v || '0');
      setTotalPoints(points);
      if (points >= 500) setLevel('All-Star');
      else if (points >= 200) setLevel('Pro');
      else if (points >= 50) setLevel('Starter');
      else setLevel('Rookie');
    });
  }, []);

  const earnedCount = earnedBadges.length;
  const totalCount = allBadges.length;
  const completionPercent = (earnedCount / totalCount) * 100;

  return (
    <LinearGradient colors={['#0f172a', '#3b0764', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Trophy Cabinet 🏆</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#ca8a04', '#ea580c']} style={styles.statsCard}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.levelText}>{level}</Text>
            <Text style={styles.pointsText}>{totalPoints} Total Points</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
            </View>
            <Text style={styles.badgeCount}>{earnedCount} of {totalCount} badges unlocked</Text>
          </LinearGradient>

          {categories.map(category => {
            const categoryBadges = allBadges.filter(b => b.category === category);
            if (categoryBadges.length === 0) return null;
            return (
              <View key={category} style={{ marginBottom: 20 }}>
                <View style={styles.categoryHeader}>
                  <Star size={18} color="#c084fc" />
                  <Text style={styles.categoryTitle}>{category}</Text>
                </View>
                <View style={styles.badgeGrid}>
                  {categoryBadges.map(badge => {
                    const isEarned = earnedBadges.includes(badge.id);
                    return (
                      <View key={badge.id} style={styles.badgeWrap}>
                        {isEarned ? (
                          <LinearGradient colors={badge.colors} style={styles.badgeCard}>
                            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                            <Text style={styles.badgeDesc}>{badge.description}</Text>
                            <View style={styles.earnedIcon}><Award size={16} color="#fde68a" /></View>
                          </LinearGradient>
                        ) : (
                          <View style={styles.lockedCard}>
                            <View style={styles.lockedOverlay}>
                              <Lock size={28} color="rgba(255,255,255,0.5)" />
                            </View>
                            <Text style={[styles.badgeEmoji, { opacity: 0.3 }]}>{badge.emoji}</Text>
                            <Text style={[styles.badgeName, { color: 'rgba(255,255,255,0.3)' }]}>{badge.name}</Text>
                            <Text style={[styles.badgeDesc, { color: 'rgba(255,255,255,0.2)' }]}>{badge.description}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          <View style={styles.motivCard}>
            <Trophy size={22} color="#60a5fa" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.motivTitle}>Keep Going!</Text>
              <Text style={styles.motivText}>
                Every badge represents a step toward becoming your best self. Champions are made one day at a time! 💪
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  statsCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  trophyEmoji: { fontSize: 60, marginBottom: 8 },
  levelText: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  pointsText: { fontSize: 16, color: '#fef9c3', marginBottom: 12 },
  progressTrack: { width: '100%', height: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 6 },
  badgeCount: { fontSize: 13, color: '#fef9c3' },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  categoryTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeWrap: { width: '46%' },
  badgeCard: { borderRadius: 20, padding: 16, alignItems: 'center', position: 'relative' },
  lockedCard: { borderRadius: 20, padding: 16, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
  lockedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  badgeEmoji: { fontSize: 40, marginBottom: 8 },
  badgeName: { fontSize: 13, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  badgeDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  earnedIcon: { position: 'absolute', top: 8, right: 8 },
  motivCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(37,99,235,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)' },
  motivTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  motivText: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
});
