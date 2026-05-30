import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { Trophy, Flame, Zap, TrendingUp, Award, Menu } from 'lucide-react-native';

export function Kids8TrainingDashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('Athlete');
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState('Rookie');
  const [xpToNext, setXpToNext] = useState(50);
  const [xpProgress, setXpProgress] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [favoriteAthlete, setFavoriteAthlete] = useState('');

  useEffect(() => {
    storage.getItem('kids8UserName').then(v => { if (v) setUserName(v); });
    storage.getItem('kids8FavoriteAthlete').then(v => { if (v) setFavoriteAthlete(v); });
    storage.getItem('kids8EarnedBadges').then(v => {
      if (v) {
        const badges = JSON.parse(v);
        setBadgeCount(badges.length);
      }
    });
    storage.getItem('kids8UserXP').then(v => {
      const userXP = parseInt(v || '0');
      setXP(userXP);
      if (userXP >= 500) {
        setLevel('All-Star'); setXpToNext(1000 - userXP);
        setXpProgress(((userXP - 500) / 500) * 100);
      } else if (userXP >= 200) {
        setLevel('Pro'); setXpToNext(500 - userXP);
        setXpProgress(((userXP - 200) / 300) * 100);
      } else if (userXP >= 50) {
        setLevel('Starter'); setXpToNext(200 - userXP);
        setXpProgress(((userXP - 50) / 150) * 100);
      } else {
        setLevel('Rookie'); setXpToNext(50 - userXP);
        setXpProgress((userXP / 50) * 100);
      }
    });
    storage.getItem('kids8CurrentStreak').then(v => { if (v) setStreak(parseInt(v)); });
  }, []);

  const performanceActivities = [
    { id: 'runner', title: 'Stadium Sprint', subtitle: 'Endless runner challenge', icon: '🏃', colors: ['#2563eb', '#0891b2'] as [string,string], screen: 'Kids8RunnerChallenge' as keyof RootStackParamList, tag: 'GAME' },
    { id: 'drills', title: 'Skill Drills', subtitle: 'Reaction & agility training', icon: '⚡', colors: ['#ca8a04', '#ea580c'] as [string,string], screen: 'Kids8SkillDrills' as keyof RootStackParamList, tag: '30SEC' },
    { id: 'pro', title: 'Train Like a Pro', subtitle: 'Elite athlete workouts', icon: '💪', colors: ['#9333ea', '#db2777'] as [string,string], screen: 'Kids8TrainLikePro' as keyof RootStackParamList, tag: '60SEC' },
  ];

  const nutritionTools = [
    { id: 'lunch', title: 'School Lunch Coach', subtitle: 'Rate & improve your meals', icon: '🍱', colors: ['#16a34a', '#059669'] as [string,string], screen: 'Kids8LunchBuilder' as keyof RootStackParamList },
    { id: 'snack', title: 'Athlete Upgrades', subtitle: 'Smart snack swaps', icon: '🔄', colors: ['#ea580c', '#d97706'] as [string,string], screen: 'Kids8SnackSwap' as keyof RootStackParamList },
  ];

  const quickLinks: { title: string; icon: React.ReactNode; screen: keyof RootStackParamList }[] = [
    { title: 'Progress Stats', icon: <TrendingUp size={20} color="#60a5fa" />, screen: 'Kids8ProgressTracker' },
    { title: 'Trophy Cabinet', icon: <Trophy size={20} color="#60a5fa" />, screen: 'Kids8Achievements' },
    { title: 'Ask Coach', icon: <Award size={20} color="#60a5fa" />, screen: 'Kids8AskCoach' },
    { title: 'School Fuel', icon: <Zap size={20} color="#60a5fa" />, screen: 'Kids8SchoolFuel' },
  ];

  const nextLevelName = level === 'Rookie' ? 'Starter' : level === 'Starter' ? 'Pro' : level === 'Pro' ? 'All-Star' : 'Legend';

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8PersonalizationSetup')} style={styles.menuBtn}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={{ fontSize: 24 }}>⚽</Text>
            </View>
          </View>

          {/* XP Progress Card */}
          <View style={styles.xpCard}>
            <View style={styles.xpRow}>
              <View>
                <Text style={styles.xpLabel}>Current Level</Text>
                <Text style={styles.xpLevel}>{level}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.xpLabel}>Total XP</Text>
                <Text style={[styles.xpLevel, { color: '#60a5fa' }]}>{xp}</Text>
              </View>
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressMetaText}>Progress to {nextLevelName}</Text>
              <Text style={styles.progressMetaText}>{xpToNext} XP to go</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(xpProgress, 100)}%` }]} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Flame size={20} color="#f97316" />
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Award size={20} color="#eab308" />
                <Text style={styles.statValue}>{badgeCount}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>

          {/* Pro Tip */}
          {favoriteAthlete ? (
            <View style={styles.proTip}>
              <Text style={{ fontSize: 28, marginRight: 10 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.proTipLabel}>PRO TIP</Text>
                <Text style={styles.proTipText}>Pro athletes build habits like this. Consistency matters more than intensity.</Text>
              </View>
            </View>
          ) : null}

          {/* Performance Training */}
          <Text style={styles.sectionTitle}>🏋️ Performance Training</Text>
          {performanceActivities.map(activity => (
            <TouchableOpacity
              key={activity.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(activity.screen as any)}
              style={{ marginBottom: 12 }}
            >
              <LinearGradient colors={activity.colors} style={styles.activityCard}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySub}>{activity.subtitle}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{activity.tag}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          {/* Nutrition & Fuel */}
          <Text style={styles.sectionTitle}>⚡ Nutrition & Fuel</Text>
          <View style={styles.nutritionRow}>
            {nutritionTools.map(tool => (
              <TouchableOpacity
                key={tool.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(tool.screen as any)}
                style={{ flex: 1 }}
              >
                <LinearGradient colors={tool.colors} style={styles.nutritionCard}>
                  <Text style={styles.nutritionIcon}>{tool.icon}</Text>
                  <Text style={styles.nutritionTitle}>{tool.title}</Text>
                  <Text style={styles.nutritionSub}>{tool.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Links */}
          <View style={styles.quickGrid}>
            {quickLinks.map(link => (
              <TouchableOpacity
                key={link.screen}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(link.screen as any)}
                style={styles.quickBtn}
              >
                {link.icon}
                <Text style={styles.quickTitle}>{link.title}</Text>
              </TouchableOpacity>
            ))}
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
  menuBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  welcomeText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  userName: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  xpCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#334155', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  xpLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 2 },
  xpLevel: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressMetaText: { fontSize: 11, color: '#94a3b8' },
  progressTrack: { height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#60a5fa', borderRadius: 5 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  proTip: { flexDirection: 'row', backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(147,51,234,0.3)', alignItems: 'flex-start' },
  proTipLabel: { fontSize: 10, fontWeight: '800', color: '#c084fc', marginBottom: 4 },
  proTipText: { fontSize: 13, color: '#ffffff', lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 12, marginTop: 4 },
  activityCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: { fontSize: 44 },
  activityTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 2 },
  activitySub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  tag: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, fontWeight: '800', color: '#ffffff' },
  nutritionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  nutritionCard: { borderRadius: 20, padding: 18, alignItems: 'center' },
  nutritionIcon: { fontSize: 44, marginBottom: 8 },
  nutritionTitle: { fontSize: 13, fontWeight: '800', color: '#ffffff', marginBottom: 4, textAlign: 'center' },
  nutritionSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickBtn: { width: '46%', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 14 },
  quickTitle: { fontSize: 13, fontWeight: '700', color: '#ffffff', marginTop: 8 },
});
