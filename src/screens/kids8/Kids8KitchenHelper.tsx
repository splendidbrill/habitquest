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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  Lightbulb,
  Heart,
} from 'lucide-react-native';

// Full pool of kitchen jobs. Each week the helper shows a different rotating
// set of 3 (see getWeeklyTasks) so the tasks change every week.
const TASK_POOL = [
  {
    id: 'wash-veggies',
    emoji: '🥬',
    title: 'Washed Vegetables',
    description: 'Help wash the veggies for cooking',
    tips: [
      '🚿 Use cold water to rinse vegetables clean',
      '✋ Rub gently to remove dirt - be gentle!',
      '👀 Check both sides - dirt likes to hide!',
      '💧 Pat dry with a clean towel after washing',
    ],
    whyItHelps:
      "Washing removes dirt and germs so the food is safe to eat. You're helping keep the family healthy!",
    skillLearned: 'Food Safety & Cleanliness',
  },
  {
    id: 'stir',
    emoji: '🥄',
    title: 'Stirred Ingredients',
    description: 'Stir the pot (with adult help!)',
    tips: [
      "🥄 Use a long wooden spoon so you don't get burned",
      '🔄 Stir slowly in circles - not too fast!',
      '👃 Smell the yummy spices as you stir',
      "⚠️ Never touch the pot - it's HOT! Ask an adult",
    ],
    whyItHelps:
      "Stirring mixes flavors together and stops food from burning. You're learning real cooking skills!",
    skillLearned: 'Cooking Technique & Kitchen Safety',
  },
  {
    id: 'set-table',
    emoji: '🍽️',
    title: 'Set the Table',
    description: 'Put out plates, spoons, and cups',
    tips: [
      '🍽️ Plate goes in front of each chair',
      '🥄 Spoon on the right, fork on the left',
      '🥤 Glass goes above the plate',
      "😊 Make it look nice - you're creating a happy mealtime!",
    ],
    whyItHelps:
      "Setting the table shows care for your family and makes mealtimes special. You're being responsible!",
    skillLearned: 'Responsibility & Family Care',
  },
  {
    id: 'mix-salad',
    emoji: '🥗',
    title: 'Tossed the Salad',
    description: 'Mix the salad in a big bowl',
    tips: [
      '🥗 Use two big spoons to toss gently',
      '🌈 Count the colours - the more the better!',
      '💧 Add the dressing last so it stays crunchy',
      '🍋 A squeeze of lemon makes it extra tasty',
    ],
    whyItHelps:
      'Mixing lots of colourful veggies gives your body lots of different vitamins!',
    skillLearned: 'Healthy Eating & Coordination',
  },
  {
    id: 'measure',
    emoji: '🥣',
    title: 'Measured Ingredients',
    description: 'Scoop and level the cups and spoons',
    tips: [
      '🥣 Fill the cup right to the top',
      '📏 Level it off flat with a knife (ask an adult)',
      '🔢 Count out loud as you scoop',
      '👏 Being exact makes the food turn out just right',
    ],
    whyItHelps:
      'Measuring carefully is like being a food scientist - it helps the recipe work!',
    skillLearned: 'Maths & Following Recipes',
  },
  {
    id: 'crack-egg',
    emoji: '🥚',
    title: 'Cracked the Eggs',
    description: 'Crack eggs into a bowl (with help!)',
    tips: [
      '🥚 Tap the egg gently on the edge of the bowl',
      '👐 Pull the shell apart with both thumbs',
      '👀 Check for any little shell bits',
      '🧼 Wash your hands after - eggs need clean hands',
    ],
    whyItHelps:
      'Eggs help you grow strong muscles, and cracking them takes careful hands!',
    skillLearned: 'Fine Motor Skills & Hygiene',
  },
  {
    id: 'pour',
    emoji: '🫗',
    title: 'Poured the Drinks',
    description: 'Pour water or milk into cups',
    tips: [
      '🫗 Hold the jug with two hands',
      '🐢 Pour slowly - slow and steady wins!',
      '🛑 Stop before it reaches the top',
      '🧽 Wipe up any spills like a pro',
    ],
    whyItHelps:
      'Pouring carefully helps everyone stay hydrated and shows great control!',
    skillLearned: 'Balance & Serving Others',
  },
  {
    id: 'tidy',
    emoji: '🧽',
    title: 'Tidied Up',
    description: 'Wipe the table and put things away',
    tips: [
      '🧽 Wipe in big circles to clean it all',
      '🗑️ Put rubbish in the bin',
      '🧴 Put lids back on jars',
      '✨ A clean kitchen is a happy kitchen!',
    ],
    whyItHelps:
      "Cleaning up keeps the kitchen safe and shows you're a great team player.",
    skillLearned: 'Responsibility & Teamwork',
  },
  {
    id: 'plate',
    emoji: '🍚',
    title: 'Plated the Food',
    description: "Help put food onto everyone's plate",
    tips: [
      '🥄 Give everyone a fair share',
      '🌈 Make the plate look colourful',
      '🔥 Ask an adult to move hot pans',
      '😋 A pretty plate makes food more fun to eat',
    ],
    whyItHelps:
      'Sharing food fairly is kind, and a colourful plate has lots of goodness!',
    skillLearned: 'Sharing & Presentation',
  },
];

/** Week bucket — changes once every 7 days. */
function weekNumber(d = new Date()): number {
  return Math.floor(d.getTime() / 86_400_000 / 7);
}

/** The 3 kitchen tasks for the current week, rotating through the pool. */
function getWeeklyTasks() {
  const start = (weekNumber() * 3) % TASK_POOL.length;
  return [0, 1, 2].map(i => TASK_POOL[(start + i) % TASK_POOL.length]);
}

export function Kids8KitchenHelper() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  // This week's rotating set of 3 tasks (changes automatically every 7 days).
  const tasks = getWeeklyTasks();

  useEffect(() => {
    (async () => {
      // New week → clear last week's progress so the fresh tasks can be done.
      const currentWeek = String(weekNumber());
      const storedWeek = await storage.getItem('kids8KitchenWeek');
      if (storedWeek !== currentWeek) {
        await storage.setItem('kids8KitchenWeek', currentWeek);
        await storage.removeItem('kids8TodaysKitchenTasks');
        await storage.removeItem('kids8KitchenHelperDate');
        return;
      }

      const today = new Date().toDateString();
      const v = await storage.getItem('kids8KitchenHelperDate');
      if (v === today) {
        setHasCompletedToday(true);
        const t = await storage.getItem('kids8TodaysKitchenTasks');
        if (t) setCompletedTasks(JSON.parse(t));
      }
    })();
  }, []);

  const handleTaskClick = (taskId: string) => {
    if (completedTasks.includes(taskId) || hasCompletedToday) return;
    setCurrentTask(taskId);
    setShowTipsModal(true);
  };

  const handleStartTask = () => {
    setShowTipsModal(false);
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if (pin === '1234' || pin === '👍') {
      if (currentTask && !completedTasks.includes(currentTask)) {
        const newCompleted = [...completedTasks, currentTask];
        setCompletedTasks(newCompleted);
        await storage.setItem(
          'kids8TodaysKitchenTasks',
          JSON.stringify(newCompleted),
        );
        const pts = await storage.getItem('kids8FamilyPoints');
        await storage.setItem(
          'kids8FamilyPoints',
          String(parseInt(pts || '0') + 1),
        );
        if (newCompleted.length === tasks.length) {
          const today = new Date().toDateString();
          await storage.setItem('kids8KitchenHelperDate', today);
          const badgesStr = await storage.getItem('kids8EarnedBadges');
          const badges: string[] = badgesStr ? JSON.parse(badgesStr) : [];
          if (!badges.includes('kitchen-champion')) {
            badges.push('kitchen-champion');
            await storage.setItem('kids8EarnedBadges', JSON.stringify(badges));
          }
          setHasCompletedToday(true);
          setShowSuccess(true);
        }
      }
      setShowPinModal(false);
      setPin('');
      setCurrentTask(null);
    } else {
      setPin('');
    }
  };

  const progress = (completedTasks.length / tasks.length) * 100;
  const currentTaskData = tasks.find(t => t.id === currentTask);

  if (showSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff7ed' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.successContent}>
            <Text
              style={{ fontSize: 80, textAlign: 'center', marginBottom: 16 }}
            >
              🏆
            </Text>
            <Text style={styles.successTitle}>Kitchen Champion!</Text>
            <Text style={styles.successSub}>You helped so much today! 🌟</Text>
            <View style={styles.rewardsCard}>
              <View style={styles.badgeRow}>
                <Text style={{ fontSize: 36, marginRight: 10 }}>👨‍🍳</Text>
                <View>
                  <Text style={styles.badgeNew}>New Badge!</Text>
                  <Text style={styles.badgeName}>Kitchen Champion</Text>
                </View>
              </View>
              <View style={styles.pointsBox}>
                <Text style={styles.pointsNum}>
                  +{tasks.length} Family Points!
                </Text>
                <Text style={styles.pointsSub}>
                  You're an amazing helper! 🎉
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids8TrainingDashboard')}
            >
              <LinearGradient
                colors={['#f97316', '#f59e0b', '#ef4444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Back to Dashboard 🏠</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Kids8TrainingDashboard')}
              style={styles.backBtn}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.title}>Kitchen Helper</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.instructCard}>
            <Text style={{ fontSize: 36, marginRight: 10 }}>👨‍🍳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.instructTitle}>Help Cook Today!</Text>
              <Text style={styles.instructSub}>
                Ask a parent to approve each task
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {completedTasks.length} / {tasks.length} tasks done
              </Text>
            </View>
          </View>

          {hasCompletedToday && (
            <View style={styles.doneCard}>
              <Text style={styles.doneTxt}>✓ All done for today!</Text>
              <Text style={styles.doneSub}>
                Come back tomorrow to help again
              </Text>
            </View>
          )}

          {tasks.map((task, index) => {
            const isCompleted = completedTasks.includes(task.id);
            return (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.85}
                onPress={() => handleTaskClick(task.id)}
                disabled={hasCompletedToday}
                style={[
                  styles.taskCard,
                  isCompleted && styles.taskDone,
                  hasCompletedToday && !isCompleted && { opacity: 0.5 },
                ]}
              >
                <Text style={{ fontSize: 44, marginRight: 14 }}>
                  {task.emoji}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDesc}>{task.description}</Text>
                </View>
                {isCompleted ? (
                  <CheckCircle size={32} color="#16a34a" />
                ) : (
                  <Lock size={32} color="#9ca3af" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tips Modal */}
        <Modal
          visible={showTipsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTipsModal(false)}
        >
          <View style={styles.modalOverlay}>
            {currentTaskData && (
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{ textAlign: 'center', fontSize: 72, marginBottom: 8 }}
                >
                  {currentTaskData.emoji}
                </Text>
                <Text style={styles.modalTitle}>{currentTaskData.title}</Text>
                <Text style={styles.modalDesc}>
                  {currentTaskData.description}
                </Text>
                <View style={styles.tipsBox}>
                  <View style={styles.tipsHeader}>
                    <Lightbulb size={18} color="#1d4ed8" />
                    <Text style={styles.tipsTitle}>Cooking Tips</Text>
                  </View>
                  {currentTaskData.tips.map((tip, i) => (
                    <Text key={i} style={styles.tipItem}>
                      {tip}
                    </Text>
                  ))}
                </View>
                <View style={styles.whyBox}>
                  <Heart size={18} color="#166534" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.whyTitle}>Why This Helps</Text>
                    <Text style={styles.whyText}>
                      {currentTaskData.whyItHelps}
                    </Text>
                  </View>
                </View>
                <View style={styles.skillBox}>
                  <Text style={styles.skillTitle}>Skill You're Learning</Text>
                  <Text style={styles.skillText}>
                    {currentTaskData.skillLearned}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleStartTask}
                  style={{ marginBottom: 10 }}
                >
                  <LinearGradient
                    colors={['#f97316', '#ef4444']}
                    style={styles.readyBtn}
                  >
                    <Text style={styles.readyBtnText}>
                      I'm Ready! Start Task 🚀
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setShowTipsModal(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Not Yet</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </Modal>

        {/* PIN Modal */}
        <Modal
          visible={showPinModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPinModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pinContent}>
              <Text
                style={{ fontSize: 52, textAlign: 'center', marginBottom: 12 }}
              >
                🔒
              </Text>
              <Text style={styles.pinTitle}>Ask a Parent!</Text>
              <Text style={styles.pinSub}>Let them approve this task</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setPin('👍');
                  setTimeout(handlePinSubmit, 100);
                }}
              >
                <LinearGradient
                  colors={['#16a34a', '#059669']}
                  style={styles.pinGreenBtn}
                >
                  <Text style={styles.pinGreenBtnText}>👍 Parent Approves</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TextInput
                value={pin}
                onChangeText={setPin}
                placeholder="Or type PIN (1234)"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                style={styles.pinInput}
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePinSubmit}
                style={styles.pinSubmitBtn}
              >
                <Text style={styles.pinSubmitText}>Submit PIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  instructCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  instructTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 2,
  },
  instructSub: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  progressTrack: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 5 },
  progressLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  doneCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  doneTxt: { fontSize: 14, fontWeight: '700', color: '#166534' },
  doneSub: { fontSize: 12, color: '#16a34a', marginTop: 2 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  taskDone: { backgroundColor: '#f0fdf4' },
  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskDesc: { fontSize: 13, color: '#6b7280' },
  successContent: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  successTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  rewardsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 14,
  },
  badgeNew: { fontSize: 14, fontWeight: '800', color: '#c2410c' },
  badgeName: { fontSize: 13, color: '#ea580c' },
  pointsBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  pointsNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 4,
  },
  pointsSub: { fontSize: 13, color: '#b45309' },
  btn: {
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  btnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  tipsBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: { fontSize: 14, fontWeight: '800', color: '#1d4ed8' },
  tipItem: { fontSize: 13, color: '#1e3a8a', marginBottom: 6, lineHeight: 18 },
  whyBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  whyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  whyText: { fontSize: 13, color: '#166534', lineHeight: 18 },
  skillBox: {
    backgroundColor: '#faf5ff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  skillTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6b21a8',
    marginBottom: 2,
  },
  skillText: { fontSize: 13, color: '#581c87' },
  readyBtn: { borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  readyBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  cancelBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
  pinContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 28,
    margin: 24,
  },
  pinTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  pinSub: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  pinGreenBtn: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  pinGreenBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  pinInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 14,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  pinSubmitBtn: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  pinSubmitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  closeBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
});
