import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

const tasks = [
  { id: 'wash-veggies', emoji: '🥬', title: 'Washed Vegetables', description: 'Help wash the veggies for cooking', tips: ['🚿 Use cold water to rinse vegetables clean', '✋ Rub gently to remove dirt', '👀 Check both sides - dirt likes to hide!', '💧 Pat dry with a clean towel after washing'], whyItHelps: 'Washing removes dirt and germs so the food is safe. You\'re helping keep the family healthy!', skillLearned: 'Food Safety & Cleanliness' },
  { id: 'stir', emoji: '🥄', title: 'Stirred Ingredients', description: 'Stir the pot (with adult help!)', tips: ['🥄 Use a long wooden spoon so you don\'t get burned', '🔄 Stir slowly in circles - not too fast!', '👃 Smell the yummy spices as you stir', '⚠️ Never touch the pot - it\'s HOT! Ask an adult'], whyItHelps: 'Stirring mixes flavours together and stops food from burning. You\'re learning real cooking skills!', skillLearned: 'Cooking Technique & Kitchen Safety' },
  { id: 'set-table', emoji: '🍽️', title: 'Set the Table', description: 'Put out plates, spoons, and cups', tips: ['🍽️ Plate goes in front of each chair', '🥄 Spoon on the right, fork on the left', '🥤 Glass goes above the plate', '😊 Make it look nice - you\'re creating a happy mealtime!'], whyItHelps: 'Setting the table shows care for your family and makes mealtimes special.', skillLearned: 'Responsibility & Family Care' },
];

export function KidsKitchenHelper() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    storage.getItem('kidsCompletedKitchenTasks').then(v => {
      if (v) setCompletedTasks(JSON.parse(v));
    });
    storage.getItem('kidsKitchenHelperDone').then(v => {
      if (v === 'true') setShowSuccess(true);
    });
  }, []);

  const openTips = (taskId: string) => {
    setCurrentTask(taskId);
    setShowTipsModal(true);
  };

  const openPin = (taskId: string) => {
    setCurrentTask(taskId);
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if ((pin === '1234' || pin === '👍') && currentTask) {
      const newCompleted = [...completedTasks, currentTask];
      setCompletedTasks(newCompleted);
      await storage.setItem('kidsCompletedKitchenTasks', JSON.stringify(newCompleted));
      const pts = parseInt((await storage.getItem('kidsFamilyPoints')) ?? '0');
      await storage.setItem('kidsFamilyPoints', String(pts + 1));
      if (newCompleted.length === tasks.length) {
        const badges = JSON.parse((await storage.getItem('kidsEarnedBadges')) ?? '[]');
        if (!badges.includes('kitchen-champion')) {
          badges.push('kitchen-champion');
          await storage.setItem('kidsEarnedBadges', JSON.stringify(badges));
        }
        await storage.setItem('kidsKitchenHelperDone', 'true');
        setShowSuccess(true);
      }
      setShowPinModal(false);
      setPin('');
      setCurrentTask(null);
    } else {
      setPin('');
    }
  };

  const currentTaskData = tasks.find(t => t.id === currentTask);

  return (
    <LinearGradient colors={['#fef9c3', '#fed7aa', '#fef3c7']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Kitchen Helper</Text>
            <View style={{ width: 44 }} />
          </View>

          <LinearGradient colors={['#fbbf24', '#f97316']} style={styles.heroCard}>
            <Text style={styles.heroEmoji}>👨‍🍳</Text>
            <Text style={styles.heroTitle}>Help in the Kitchen!</Text>
            <Text style={styles.heroDesc}>Complete tasks to earn points and become a Kitchen Champion!</Text>
          </LinearGradient>

          {showSuccess ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🏆</Text>
              <Text style={styles.successTitle}>Kitchen Champion!</Text>
              <Text style={styles.successDesc}>You helped with all the tasks today! Your family is so lucky to have you! 🌟</Text>
            </View>
          ) : (
            <View style={styles.taskList}>
              {tasks.map(task => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <View key={task.id} style={[styles.taskCard, isDone && styles.taskCardDone]}>
                    <View style={styles.taskRow}>
                      <Text style={styles.taskEmoji}>{task.emoji}</Text>
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.taskDesc}>{task.description}</Text>
                        <Text style={styles.skillText}>🎓 {task.skillLearned}</Text>
                      </View>
                      {isDone && <CheckCircle size={28} color="#22c55e" />}
                    </View>
                    {!isDone && (
                      <View style={styles.taskActions}>
                        <TouchableOpacity
                          style={styles.tipsBtn}
                          onPress={() => openTips(task.id)}
                        >
                          <Text style={styles.tipsBtnText}>📋 See Tips</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.doneBtn}
                          onPress={() => openPin(task.id)}
                        >
                          <Text style={styles.doneBtnText}>🔒 I Did It! +1</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {isDone && (
                      <Text style={styles.doneLabel}>✓ Completed! +1 Point</Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.progressCard}>
            <Sparkles size={20} color="#d97706" />
            <Text style={styles.progressText}>
              {' '}{completedTasks.length} / {tasks.length} tasks done
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showTipsModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowTipsModal(false)}>
          {currentTaskData && (
            <TouchableOpacity activeOpacity={1} style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalEmoji}>{currentTaskData.emoji}</Text>
              <Text style={styles.modalTitle}>{currentTaskData.title}</Text>
              <View style={styles.tipsBox}>
                {currentTaskData.tips.map((tip, i) => (
                  <Text key={i} style={styles.tipItem}>{tip}</Text>
                ))}
              </View>
              <View style={styles.whyBox}>
                <Text style={styles.whyTitle}>❤️ Why This Helps:</Text>
                <Text style={styles.whyText}>{currentTaskData.whyItHelps}</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTipsModal(false)}>
                <Text style={styles.closeBtnText}>Got It! 👍</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>

      <Modal visible={showPinModal} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowPinModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.pinCard} onPress={() => {}}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.pinTitle}>Ask a Parent!</Text>
            <Text style={styles.pinDesc}>Did you complete this task?</Text>
            <TouchableOpacity style={styles.approveBtn} onPress={() => { setPin('👍'); setTimeout(handlePinSubmit, 100); }}>
              <Text style={styles.approveBtnText}>👍 Task Completed</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.pinInput}
              placeholder="Or type PIN (1234)"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
            />
            <TouchableOpacity style={styles.submitPin} onPress={handlePinSubmit}>
              <Text style={styles.submitPinText}>Submit PIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowPinModal(false); setPin(''); }}>
              <Text style={styles.cancelPinText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  heroCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  heroEmoji: { fontSize: 52, marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 20 },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  successEmoji: { fontSize: 64, marginBottom: 8 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
  successDesc: { fontSize: 15, color: '#4b5563', textAlign: 'center', lineHeight: 22 },
  taskList: { gap: 14 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  taskCardDone: { backgroundColor: '#f0fdf4' },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  taskEmoji: { fontSize: 40 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  taskDesc: { fontSize: 13, color: '#6b7280', marginBottom: 2 },
  skillText: { fontSize: 12, color: '#0d9488', fontWeight: '600' },
  taskActions: { flexDirection: 'row', gap: 10 },
  tipsBtn: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tipsBtnText: { fontSize: 13, fontWeight: '700', color: '#0369a1' },
  doneBtn: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  doneLabel: { fontSize: 14, fontWeight: '600', color: '#16a34a', textAlign: 'center' },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    justifyContent: 'center',
  },
  progressText: { fontSize: 16, fontWeight: '700', color: '#92400e' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 52, marginBottom: 4 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  tipsBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  tipItem: { fontSize: 14, color: '#14532d', marginBottom: 5, lineHeight: 20 },
  whyBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  whyTitle: { fontSize: 14, fontWeight: '700', color: '#78350f', marginBottom: 4 },
  whyText: { fontSize: 13, color: '#92400e', lineHeight: 20 },
  closeBtn: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  pinCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  lockEmoji: { fontSize: 52, marginBottom: 8 },
  pinTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  pinDesc: { fontSize: 15, color: '#6b7280', marginBottom: 16 },
  approveBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  approveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  pinInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    width: '100%',
    marginBottom: 10,
  },
  submitPin: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitPinText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cancelPinText: { fontSize: 15, color: '#6b7280', fontWeight: '600', paddingVertical: 6 },
});
