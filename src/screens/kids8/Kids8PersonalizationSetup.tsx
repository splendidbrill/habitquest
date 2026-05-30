import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import { ChevronRight, Trophy } from 'lucide-react-native';

const sports = [
  { id: 'football', name: 'Football', emoji: '⚽', colors: ['#16a34a', '#059669'] as [string, string] },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', colors: ['#ea580c', '#d97706'] as [string, string] },
  { id: 'running', name: 'Running', emoji: '🏃', colors: ['#2563eb', '#0891b2'] as [string, string] },
  { id: 'swimming', name: 'Swimming', emoji: '🏊', colors: ['#0891b2', '#2563eb'] as [string, string] },
  { id: 'cycling', name: 'Cycling', emoji: '🚴', colors: ['#9333ea', '#db2777'] as [string, string] },
  { id: 'tennis', name: 'Tennis', emoji: '🎾', colors: ['#ca8a04', '#65a30d'] as [string, string] },
];

const teams = [
  { id: 'arsenal', name: 'Arsenal', colors: ['#EF0107', '#FFFFFF'] as [string, string], sport: 'football' },
  { id: 'chelsea', name: 'Chelsea', colors: ['#034694', '#FFFFFF'] as [string, string], sport: 'football' },
  { id: 'liverpool', name: 'Liverpool', colors: ['#C8102E', '#FFFFFF'] as [string, string], sport: 'football' },
  { id: 'man-city', name: 'Man City', colors: ['#6CABDD', '#FFFFFF'] as [string, string], sport: 'football' },
  { id: 'lakers', name: 'Lakers', colors: ['#552583', '#FDB927'] as [string, string], sport: 'basketball' },
  { id: 'warriors', name: 'Warriors', colors: ['#1D428A', '#FFC72C'] as [string, string], sport: 'basketball' },
  { id: 'no-team', name: 'No Team', colors: ['#1e293b', '#0ea5e9'] as [string, string], sport: 'all' },
];

const athletes = [
  { id: 'ronaldo', name: 'Cristiano Ronaldo', sport: 'football', emoji: '⚽' },
  { id: 'messi', name: 'Lionel Messi', sport: 'football', emoji: '⚽' },
  { id: 'mbappe', name: 'Kylian Mbappé', sport: 'football', emoji: '⚽' },
  { id: 'lebron', name: 'LeBron James', sport: 'basketball', emoji: '🏀' },
  { id: 'curry', name: 'Stephen Curry', sport: 'basketball', emoji: '🏀' },
  { id: 'bolt', name: 'Usain Bolt', sport: 'running', emoji: '🏃' },
  { id: 'phelps', name: 'Michael Phelps', sport: 'swimming', emoji: '🏊' },
  { id: 'federer', name: 'Roger Federer', sport: 'tennis', emoji: '🎾' },
];

export function Kids8PersonalizationSetup() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState('');

  const handleFinish = async () => {
    await storage.setItem('kids8FavoriteSport', selectedSport);
    await storage.setItem('kids8FavoriteTeam', selectedTeam);
    await storage.setItem('kids8FavoriteAthlete', selectedAthlete);
    const team = teams.find(t => t.id === selectedTeam);
    if (team) {
      await storage.setItem('kids8ThemeColor1', team.colors[0]);
      await storage.setItem('kids8ThemeColor2', team.colors[1]);
    }
    navigation.navigate('Kids8TrainingDashboard');
  };

  const filteredTeams = selectedSport
    ? teams.filter(t => t.sport === selectedSport || t.sport === 'all')
    : teams;

  const filteredAthletes = selectedSport
    ? athletes.filter(a => a.sport === selectedSport)
    : athletes;

  const progressColors = (active: boolean): [string, string] =>
    active ? ['#2563eb', '#0891b2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'];

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Bar */}
          <View style={styles.progressRow}>
            {[1, 2, 3].map(s => (
              <LinearGradient
                key={s}
                colors={progressColors(s <= step)}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.progressBar}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>Step {step} of 3</Text>

          {step === 1 && (
            <>
              <Text style={styles.stepEmoji}>🏆</Text>
              <Text style={styles.title}>What's Your Sport?</Text>
              <Text style={styles.subtitle}>Let's customize your training experience</Text>

              <View style={styles.sportsGrid}>
                {sports.map(sport => (
                  <TouchableOpacity
                    key={sport.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedSport(sport.id)}
                    style={styles.sportBtnWrap}
                  >
                    <LinearGradient
                      colors={selectedSport === sport.id ? sport.colors : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                      style={styles.sportCard}
                    >
                      <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                      <Text style={[styles.sportName, { color: selectedSport === sport.id ? '#fff' : '#94a3b8' }]}>
                        {sport.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(2)} disabled={!selectedSport}>
                <LinearGradient colors={selectedSport ? ['#2563eb', '#0891b2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                  <Text style={[styles.btnText, !selectedSport && styles.btnDisabled]}>Continue</Text>
                  <ChevronRight size={22} color={selectedSport ? '#fff' : 'rgba(255,255,255,0.4)'} />
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepEmoji}>🎽</Text>
              <Text style={styles.title}>Favorite Team?</Text>
              <Text style={styles.subtitle}>We'll match your app colors to your team</Text>

              {filteredTeams.map(team => (
                <TouchableOpacity
                  key={team.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedTeam(team.id)}
                  style={{ marginBottom: 12 }}
                >
                  <LinearGradient
                    colors={selectedTeam === team.id ? team.colors : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                    start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                    style={styles.teamBtn}
                  >
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={styles.teamColors}>
                      <View style={[styles.teamColorDot, { backgroundColor: team.colors[0] }]} />
                      <View style={[styles.teamColorDot, { backgroundColor: team.colors[1] }]} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              <View style={styles.rowBtns}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(1)} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(3)} disabled={!selectedTeam} style={{ flex: 2 }}>
                  <LinearGradient colors={selectedTeam ? ['#2563eb', '#0891b2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                    <Text style={[styles.btnText, !selectedTeam && styles.btnDisabled]}>Continue</Text>
                    <ChevronRight size={22} color={selectedTeam ? '#fff' : 'rgba(255,255,255,0.4)'} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.stepEmoji}>⭐</Text>
              <Text style={styles.title}>Who Inspires You?</Text>
              <Text style={styles.subtitle}>Train like the pros you admire</Text>

              {filteredAthletes.map(athlete => (
                <TouchableOpacity
                  key={athlete.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedAthlete(athlete.id)}
                  style={{ marginBottom: 12 }}
                >
                  <LinearGradient
                    colors={selectedAthlete === athlete.id ? ['#9333ea', '#db2777'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.athleteBtn}
                  >
                    <Text style={styles.athleteEmoji}>{athlete.emoji}</Text>
                    <Text style={styles.athleteName}>{athlete.name}</Text>
                    {selectedAthlete === athlete.id && <Trophy size={22} color="#fde68a" />}
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              <View style={styles.rowBtns}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => setStep(2)} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={handleFinish} disabled={!selectedAthlete} style={{ flex: 2 }}>
                  <LinearGradient colors={selectedAthlete ? ['#16a34a', '#059669'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
                    <Trophy size={20} color={selectedAthlete ? '#fff' : 'rgba(255,255,255,0.4)'} />
                    <Text style={[styles.btnText, !selectedAthlete && styles.btnDisabled]}>Start Training</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
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
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  progressBar: { flex: 1, height: 8, borderRadius: 4 },
  stepLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24 },
  stepEmoji: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 24, textAlign: 'center' },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20, justifyContent: 'center' },
  sportBtnWrap: { width: '46%' },
  sportCard: { borderRadius: 20, padding: 20, alignItems: 'center' },
  sportEmoji: { fontSize: 44, marginBottom: 8 },
  sportName: { fontSize: 15, fontWeight: '700' },
  teamBtn: {
    borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  teamName: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  teamColors: { flexDirection: 'row', gap: 6 },
  teamColorDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#fff' },
  athleteBtn: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  athleteEmoji: { fontSize: 36 },
  athleteName: { flex: 1, fontSize: 17, fontWeight: '700', color: '#ffffff' },
  rowBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  backBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  btn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  btnText: { fontSize: 17, fontWeight: '800', color: '#ffffff' },
  btnDisabled: { color: 'rgba(255,255,255,0.4)' },
});
