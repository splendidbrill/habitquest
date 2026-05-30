import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ArrowLeft, Zap, TrendingUp, Activity, Apple } from 'lucide-react-native';

interface EnergyLog { type: 'food' | 'activity'; name: string; emoji: string; points: number; time: string; }

const healthyFoods = [
  { name: 'Fruit', emoji: '🍎', points: 10 },
  { name: 'Vegetables', emoji: '🥦', points: 10 },
  { name: 'Protein', emoji: '🍗', points: 15 },
  { name: 'Whole Grains', emoji: '🍚', points: 12 },
  { name: 'Water', emoji: '💧', points: 8 },
  { name: 'Yogurt', emoji: '🥛', points: 10 },
];
const activities = [
  { name: 'Football', emoji: '⚽', points: 15 },
  { name: 'Running', emoji: '🏃', points: 12 },
  { name: 'Cycling', emoji: '🚴', points: 12 },
  { name: 'Swimming', emoji: '🏊', points: 15 },
  { name: 'Basketball', emoji: '🏀', points: 12 },
  { name: 'Active Play', emoji: '🤸', points: 10 },
];
const treats = [
  { name: 'Treat Food', emoji: '🍪', points: -5 },
  { name: 'Fizzy Drink', emoji: '🥤', points: -8 },
];

export function Kids8EnergyMeter() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [energyLevel, setEnergyLevel] = useState(50);
  const [todayLogs, setTodayLogs] = useState<EnergyLog[]>([]);
  const [showMenu, setShowMenu] = useState<'food' | 'activity' | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    storage.getItem(`kids8EnergyLogs_${today}`).then(v => {
      if (v) {
        const logs: EnergyLog[] = JSON.parse(v);
        setTodayLogs(logs);
        const totalEnergy = logs.reduce((sum, log) => sum + log.points, 50);
        setEnergyLevel(Math.min(Math.max(totalEnergy, 0), 100));
      }
    });
  }, []);

  const addLog = async (log: EnergyLog) => {
    const newLogs = [...todayLogs, log];
    setTodayLogs(newLogs);
    const today = new Date().toDateString();
    await storage.setItem(`kids8EnergyLogs_${today}`, JSON.stringify(newLogs));
    setEnergyLevel(prev => Math.min(Math.max(prev + log.points, 0), 100));
    setShowMenu(null);
  };

  const getStatus = () => {
    if (energyLevel >= 80) return { text: 'Champion Energy!', emoji: '🔥', colors: ['#16a34a', '#059669'] as [string,string] };
    if (energyLevel >= 60) return { text: 'Great Energy', emoji: '⚡', colors: ['#2563eb', '#0891b2'] as [string,string] };
    if (energyLevel >= 40) return { text: 'Moderate Energy', emoji: '💪', colors: ['#eab308', '#f97316'] as [string,string] };
    return { text: 'Need Fuel!', emoji: '🔋', colors: ['#f97316', '#ef4444'] as [string,string] };
  };

  const status = getStatus();

  return (
    <LinearGradient colors={['#0f172a', '#064e3b', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Energy Meter ⚡</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={status.colors} style={styles.meterCard}>
            <Text style={styles.meterEmoji}>{status.emoji}</Text>
            <Text style={styles.meterStatus}>{status.text}</Text>
            <Text style={styles.meterValue}>{energyLevel}%</Text>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${energyLevel}%` }]} />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 80, position: 'absolute', top: 0, right: 10, opacity: 0.1 }}>⚡</Text>
          </LinearGradient>

          <View style={styles.infoCard}>
            <Zap size={22} color="#facc15" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.infoTitle}>How It Works</Text>
              <Text style={styles.infoText}>Healthy foods and activity ADD energy points. Your body uses this energy for sports, school, and growing! Track what fuels you best.</Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowMenu(showMenu === 'food' ? null : 'food')} style={{ flex: 1 }}>
              <LinearGradient colors={['#16a34a', '#059669']} style={styles.logBtn}>
                <Apple size={28} color="#fff" />
                <Text style={styles.logBtnText}>Log Food</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowMenu(showMenu === 'activity' ? null : 'activity')} style={{ flex: 1 }}>
              <LinearGradient colors={['#2563eb', '#0891b2']} style={styles.logBtn}>
                <Activity size={28} color="#fff" />
                <Text style={styles.logBtnText}>Log Activity</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {showMenu === 'food' && (
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>Add Food</Text>
              {healthyFoods.map(food => (
                <TouchableOpacity key={food.name} activeOpacity={0.85} onPress={() => addLog({ type: 'food', name: food.name, emoji: food.emoji, points: food.points, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })} style={styles.menuItem}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>{food.emoji}</Text>
                  <Text style={styles.menuItemName}>{food.name}</Text>
                  <Text style={styles.menuItemPts}>+{food.points}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.divider} />
              {treats.map(treat => (
                <TouchableOpacity key={treat.name} activeOpacity={0.85} onPress={() => addLog({ type: 'food', name: treat.name, emoji: treat.emoji, points: treat.points, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })} style={styles.menuItem}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>{treat.emoji}</Text>
                  <Text style={styles.menuItemName}>{treat.name}</Text>
                  <Text style={[styles.menuItemPts, { color: '#fb923c' }]}>{treat.points}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showMenu === 'activity' && (
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>Add Activity</Text>
              {activities.map(act => (
                <TouchableOpacity key={act.name} activeOpacity={0.85} onPress={() => addLog({ type: 'activity', name: act.name, emoji: act.emoji, points: act.points, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })} style={styles.menuItem}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>{act.emoji}</Text>
                  <Text style={styles.menuItemName}>{act.name}</Text>
                  <Text style={styles.menuItemPts}>+{act.points}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {todayLogs.length > 0 && (
            <View style={styles.logsCard}>
              <View style={styles.logsHeader}>
                <TrendingUp size={18} color="#4ade80" />
                <Text style={styles.logsTitle}>Today's Log</Text>
              </View>
              {[...todayLogs].reverse().map((log, i) => (
                <View key={i} style={styles.logRow}>
                  <Text style={{ fontSize: 22, marginRight: 10 }}>{log.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.logName}>{log.name}</Text>
                    <Text style={styles.logTime}>{log.time}</Text>
                  </View>
                  <Text style={[styles.logPts, { color: log.points > 0 ? '#4ade80' : '#fb923c' }]}>
                    {log.points > 0 ? '+' : ''}{log.points}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  meterCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16, overflow: 'hidden', position: 'relative' },
  meterEmoji: { fontSize: 64, marginBottom: 10 },
  meterStatus: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
  meterValue: { fontSize: 48, fontWeight: '800', color: '#fff', marginBottom: 12 },
  meterTrack: { width: '100%', height: 22, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 11, overflow: 'hidden' },
  meterFill: { height: '100%', backgroundColor: '#fff', borderRadius: 11 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 14 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  btnRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  logBtn: { borderRadius: 20, padding: 18, alignItems: 'center', gap: 6 },
  logBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  menuCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  menuTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 10, marginBottom: 6 },
  menuItemName: { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
  menuItemPts: { fontSize: 14, fontWeight: '800', color: '#4ade80' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 8 },
  logsCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  logsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  logsTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  logRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10, marginBottom: 6 },
  logName: { fontSize: 13, fontWeight: '700', color: '#fff' },
  logTime: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  logPts: { fontSize: 14, fontWeight: '800' },
});
