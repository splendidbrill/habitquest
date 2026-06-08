import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { ArrowLeft, MessageCircle, Zap, Volume2, VolumeX } from 'lucide-react-native';
import { useTTS } from '../../hooks/useTTS';
import { TTSInstallPrompt } from '../../components/TTSInstallPrompt';

const coachQuestions = [
  { id: 'before-football', question: 'What should I eat before football?', emoji: '⚽', answer: 'Eat 1-2 hours before playing. Best choices: banana, toast with peanut butter, or a small bowl of porridge. These give you energy that lasts the whole game!', tip: 'Pro footballers eat bananas 30 mins before kickoff. It\'s quick energy that won\'t make you feel heavy!' },
  { id: 'pizza-bad', question: 'Is pizza bad?', emoji: '🍕', answer: 'Pizza isn\'t "bad"! It has carbs (crust), protein (cheese), and can have veggies too. The key is: how often and what type. Homemade or thin-crust veggie pizza = better choice than deep-dish pepperoni every day.', tip: 'Pro athletes eat pizza sometimes! They just balance it out with training and other healthy meals.' },
  { id: 'after-school-snack', question: 'What\'s a good after-school snack?', emoji: '🎒', answer: 'You need energy + protein after school! Try: apple with peanut butter, cheese and crackers, yogurt with berries, or a smoothie. These keep you full and give you power for homework and sports.', tip: 'After school is when your body needs fuel most. Smart snacking prevents energy crashes!' },
  { id: 'junk-food-cravings', question: 'Why do I crave junk food?', emoji: '🍟', answer: 'Your brain loves sugar and salt because they give quick energy. But here\'s the trick: junk food makes you crave MORE junk food! When you eat healthy regularly, cravings decrease.', tip: 'Athletes use the 80/20 rule: eat healthy 80% of the time, enjoy treats 20%. Balance is key!' },
  { id: 'water-amount', question: 'How much water should I drink?', emoji: '💧', answer: 'Aim for 6-8 glasses a day, more if you\'re active! Your body is 60% water - it needs constant refills. Drink BEFORE you\'re thirsty, especially when playing sports.', tip: 'Check your pee color: pale yellow = well hydrated. Dark yellow = drink more water!' },
  { id: 'breakfast-skip', question: 'Can I skip breakfast?', emoji: '🥣', answer: 'Never skip breakfast! Your body has been fasting all night. Breakfast literally "breaks the fast" and fires up your metabolism. Athletes who eat breakfast perform better in training AND school!', tip: 'Even if you\'re not hungry, try something small: banana, yogurt, or a smoothie. Your brain needs fuel!' },
  { id: 'protein-muscles', question: 'Do I need protein for muscles?', emoji: '💪', answer: 'YES! Protein is the building block of muscles. After training, your muscles need protein to repair and grow stronger. Aim for protein in every meal: eggs, chicken, fish, dal, paneer, yogurt, nuts.', tip: 'Eat protein within 30 mins after training for maximum muscle growth. Chocolate milk is a great recovery drink!' },
  { id: 'energy-drinks', question: 'What about energy drinks?', emoji: '⚡', answer: 'Energy drinks are NOT for kids! They have massive amounts of caffeine and sugar that can mess with your heart, sleep, and focus. Real energy comes from good food, water, and sleep.', tip: 'Want real energy? Eat complex carbs (oats, rice, bread), stay hydrated, and get 9-10 hours sleep.' },
  { id: 'fast-food', question: 'Is fast food always bad?', emoji: '🍔', answer: 'Fast food CAN be okay occasionally. The problem is: it\'s usually high in salt, fat, and low in nutrients. If you do eat fast food, pick better options: grilled over fried, water over soda.', tip: 'Elite athletes sometimes eat fast food on the road. They just make smarter choices and don\'t make it a habit!' },
  { id: 'tired-sports', question: 'Why am I tired during sports?', emoji: '😴', answer: 'Could be: not eating enough before activity, dehydration, not enough sleep, or low iron. Make sure you eat a good snack 1-2 hours before sports, drink water throughout the day, and sleep 9-10 hours!', tip: 'Pro athletes track sleep like they track training. Sleep is when your body recovers and gets stronger!' },
  { id: 'vegetables-boring', question: 'Vegetables are boring. Help!', emoji: '🥦', answer: 'Try different preparations! Roasted veggies taste completely different than boiled. Add spices, dips (hummus!), or mix them into foods you already like. Even pro athletes didn\'t love veggies at first!', tip: 'Challenge: try ONE new vegetable each week prepared a different way. You might find favorites you never knew!' },
  { id: 'hunger-games', question: 'I\'m always hungry after games!', emoji: '🏃', answer: 'That\'s normal! You burned tons of energy. Have a recovery snack within 30 mins: chocolate milk, banana + peanut butter, or yogurt. Then eat a proper meal with carbs + protein within 2 hours.', tip: 'Your hunger is your body saying "I need fuel to recover!" Listen to it and eat quality food, not junk!' },
];

export function Kids8AskCoach() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedQ, setSelectedQ] = useState<typeof coachQuestions[0] | null>(null);
  const { read, toggle, stop, speaking, showPrompt, setShowPrompt } = useTTS({
    autoRead: 'Welcome to Ask Coach. Tap any question to hear expert advice.',
  });

  // Auto-read when a question is opened
  useEffect(() => {
    if (selectedQ) {
      read(`${selectedQ.answer} Pro tip: ${selectedQ.tip}`);
    } else {
      stop();
    }
  }, [selectedQ]);

  return (
    <LinearGradient colors={['#0f172a', '#3b0764', '#0f172a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Kids8TrainingDashboard')} style={styles.backBtn}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Ask Coach 🏆</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#9333ea', '#db2777']} style={styles.infoCard}>
            <Text style={{ fontSize: 44, marginRight: 12 }}>👨‍🏫</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Got Questions?</Text>
              <Text style={styles.infoText}>Tap any question to get expert advice from your virtual coach. Real answers for real athletes!</Text>
            </View>
          </LinearGradient>

          {coachQuestions.map(q => (
            <TouchableOpacity key={q.id} activeOpacity={0.85} onPress={() => setSelectedQ(q)} style={styles.questionBtn}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>{q.emoji}</Text>
              <Text style={styles.questionText}>{q.question}</Text>
              <MessageCircle size={18} color="#c084fc" />
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Zap size={22} color="#60a5fa" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.footerTitle}>Keep Learning!</Text>
              <Text style={styles.footerText}>The more you understand about nutrition and training, the better athlete you become. Knowledge = power! 💪</Text>
            </View>
          </View>
        </ScrollView>

        <TTSInstallPrompt visible={showPrompt} onClose={() => setShowPrompt(false)} />

        <Modal visible={!!selectedQ} transparent animationType="slide" onRequestClose={() => setSelectedQ(null)}>
          <View style={styles.modalOverlay}>
            {selectedQ && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={{ textAlign: 'center', fontSize: 72, marginBottom: 12 }}>{selectedQ.emoji}</Text>
                <View style={styles.questionBox}>
                  <Text style={styles.modalQuestion}>{selectedQ.question}</Text>
                </View>
                <View style={styles.answerBox}>
                  <View style={styles.answerHeader}>
                    <Text style={{ fontSize: 22, marginRight: 8 }}>👨‍🏫</Text>
                    <Text style={styles.coachSays}>Coach Says:</Text>
                    <TouchableOpacity
                      onPress={() => selectedQ && toggle(`${selectedQ.answer} Pro tip: ${selectedQ.tip}`)}
                      style={styles.speakBtn}
                    >
                      {speaking
                        ? <VolumeX size={18} color="#c084fc" />
                        : <Volume2 size={18} color="#c084fc" />
                      }
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.answerText}>{selectedQ.answer}</Text>
                </View>
                <View style={styles.proTipBox}>
                  <Zap size={18} color="#fb923c" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.proTipLabel}>Pro Tip</Text>
                    <Text style={styles.proTipText}>{selectedQ.tip}</Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.85} onPress={() => { stop(); setSelectedQ(null); }}>
                  <LinearGradient colors={['#9333ea', '#db2777']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.thanksBtn}>
                    <Text style={styles.thanksBtnText}>Thanks, Coach! 💪</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </Modal>
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
  infoCard: { borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  infoTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#f5d0fe', lineHeight: 17 },
  questionBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  questionText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff', lineHeight: 19 },
  footer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(37,99,235,0.15)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)', marginTop: 4 },
  footerTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  footerText: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 32, padding: 24, maxHeight: '90%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  questionBox: { backgroundColor: 'rgba(147,51,234,0.2)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 14 },
  modalQuestion: { fontSize: 16, fontWeight: '800', color: '#fff', textAlign: 'center' },
  answerBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  coachSays: { fontSize: 14, fontWeight: '800', color: '#93c5fd', flex: 1 },
  speakBtn: { padding: 6 },
  answerText: { fontSize: 14, color: '#fff', lineHeight: 20 },
  proTipBox: { flexDirection: 'row', backgroundColor: 'rgba(234,88,12,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(251,146,60,0.3)', marginBottom: 16 },
  proTipLabel: { fontSize: 12, fontWeight: '800', color: '#fb923c', marginBottom: 2 },
  proTipText: { fontSize: 13, color: '#fed7aa', lineHeight: 18 },
  thanksBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  thanksBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
