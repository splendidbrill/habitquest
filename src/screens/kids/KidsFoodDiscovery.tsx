import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { storage } from '../../utils/storage';

// Curated fruit & veg pool. Each week surfaces 5 (auto-rotating), so over a
// few weeks the whole pool cycles through and then repeats (§3.3.5).
const foodPool = [
  {
    id: 'carrot',
    emoji: '🥕',
    name: 'Carrot',
    colors: ['#fb923c', '#ea580c'] as [string, string],
    reaction: 'Crunch crunch! Tiger loves carrots!',
    superpower: 'Helps you see in the dark! 👀',
    funFact:
      'Carrots help you run faster and see better when you play outside! 🏃',
    tastyWith: 'Try with hummus for dipping or in a yummy wrap!',
    whyBetter: 'Better than crisps - carrots make your eyes super strong!',
  },
  {
    id: 'apple',
    emoji: '🍎',
    name: 'Apple',
    colors: ['#ef4444', '#dc2626'] as [string, string],
    reaction: 'So crunchy! Tiger says YUM!',
    superpower: 'Makes you strong! 💪',
    funFact:
      'One apple gives you energy to play for hours without feeling tired! ⚡',
    tastyWith: 'Slice it and add peanut butter or eat with cheese cubes!',
    whyBetter:
      'Better than sweets - apples are naturally sweet AND good for you!',
  },
  {
    id: 'broccoli',
    emoji: '🥦',
    name: 'Broccoli',
    colors: ['#4ade80', '#16a34a'] as [string, string],
    reaction: 'Tiny trees! Tiger loves it!',
    superpower: 'Helps you grow tall! 🌟',
    funFact:
      'Broccoli is like a tiny forest that makes your muscles super powerful! 💪',
    tastyWith: 'Mix with pasta and cheese or dip in ranch sauce!',
    whyBetter: 'Better than chips - broccoli helps you grow tall and strong!',
  },
  {
    id: 'banana',
    emoji: '🍌',
    name: 'Banana',
    colors: ['#fbbf24', '#f59e0b'] as [string, string],
    reaction: 'So sweet! Tiger does a happy dance!',
    superpower: 'Gives you energy to play! ⚡',
    funFact:
      'Athletes eat bananas to run super fast - just like you on the playground! 🏃',
    tastyWith: 'Mash on toast, blend in smoothies, or freeze for a treat!',
    whyBetter: 'Better than chocolate bars - bananas give you lasting energy!',
  },
  {
    id: 'tomato',
    emoji: '🍅',
    name: 'Tomato',
    colors: ['#ef4444', '#fb7185'] as [string, string],
    reaction: 'Juicy and yummy! Tiger smiles!',
    superpower: 'Keeps your heart strong! ❤️',
    funFact: 'Tomatoes help your brain work amazingly at school! 🧠',
    tastyWith: 'Add to sandwiches, eat with cheese, or in yummy pasta sauce!',
    whyBetter: 'Better than ketchup - fresh tomatoes are juicy and healthy!',
  },
  {
    id: 'grapes',
    emoji: '🍇',
    name: 'Grapes',
    colors: ['#c084fc', '#9333ea'] as [string, string],
    reaction: 'Pop pop! Tiger loves grapes!',
    superpower: 'Makes you super healthy! ✨',
    funFact:
      'Each grape is like a tiny water balloon that keeps you hydrated for play! 💧',
    tastyWith: 'Freeze them for icy pops or mix in fruit salad!',
    whyBetter:
      'Better than gummy sweets - grapes keep you bouncing with energy!',
  },
  {
    id: 'pepper',
    emoji: '🫑',
    name: 'Pepper',
    colors: ['#22c55e', '#15803d'] as [string, string],
    reaction: 'Sweet and crunchy! Tiger cheers!',
    superpower: 'Super vitamin power! 🦸',
    funFact:
      'Peppers have even more vitamin C than oranges to keep you well! 🍊',
    tastyWith: 'Slice into sticks for dipping or pop into a stir-fry!',
    whyBetter: 'Better than crisps - peppers are crunchy AND full of goodness!',
  },
  {
    id: 'orange',
    emoji: '🍊',
    name: 'Orange',
    colors: ['#fb923c', '#f97316'] as [string, string],
    reaction: 'Juicy burst! Tiger licks his lips!',
    superpower: 'Fights off sniffles! 🤧',
    funFact: 'Oranges help your body stay strong so you can keep playing! 💪',
    tastyWith: 'Peel and share the segments, or squeeze for fresh juice!',
    whyBetter:
      'Better than fizzy drinks - oranges are naturally sweet and juicy!',
  },
  {
    id: 'strawberry',
    emoji: '🍓',
    name: 'Strawberry',
    colors: ['#f43f5e', '#e11d48'] as [string, string],
    reaction: 'Sweet treat! Tiger does a flip!',
    superpower: 'Brain booster! 🧠',
    funFact:
      'Strawberries help your memory so you remember all the fun things! ✨',
    tastyWith: 'Add to yoghurt, porridge, or eat as a sweet snack!',
    whyBetter: "Better than sweets - strawberries are nature's candy!",
  },
  {
    id: 'peas',
    emoji: '🫛',
    name: 'Peas',
    colors: ['#4ade80', '#22c55e'] as [string, string],
    reaction: 'Pop! Tiger loves green gems!',
    superpower: 'Muscle maker! 💪',
    funFact: 'Tiny peas are packed with protein to help your muscles grow! 🌱',
    tastyWith: 'Mix into rice, pasta, or mash on toast!',
    whyBetter: 'Better than chips - peas are little balls of energy!',
  },
  {
    id: 'cucumber',
    emoji: '🥒',
    name: 'Cucumber',
    colors: ['#34d399', '#059669'] as [string, string],
    reaction: 'Cool and crunchy! Tiger grins!',
    superpower: 'Keeps you cool! 💧',
    funFact:
      'Cucumbers are mostly water, so they keep you hydrated on hot days! ☀️',
    tastyWith: 'Cut into sticks with dip or add to sandwiches!',
    whyBetter: 'Better than crisps - cucumbers are super refreshing!',
  },
  {
    id: 'blueberry',
    emoji: '🫐',
    name: 'Blueberries',
    colors: ['#60a5fa', '#3b82f6'] as [string, string],
    reaction: 'Tiny and tasty! Tiger pops them!',
    superpower: 'Super-vision power! 👀',
    funFact:
      'Blueberries are tiny superfoods that help your eyes and brain! 🧠',
    tastyWith: 'Sprinkle on cereal, in pancakes, or eat by the handful!',
    whyBetter:
      'Better than gummy sweets - blueberries are tiny treats with powers!',
  },
  {
    id: 'sweetcorn',
    emoji: '🌽',
    name: 'Sweetcorn',
    colors: ['#facc15', '#eab308'] as [string, string],
    reaction: 'Sunny and sweet! Tiger beams!',
    superpower: 'Sunshine energy! ☀️',
    funFact: 'Sweetcorn gives you happy energy to run and jump all day! 🏃',
    tastyWith: 'Add to wraps, salads, or eat on the cob!',
    whyBetter: 'Better than chips - sweetcorn is naturally sweet and fun!',
  },
  {
    id: 'pear',
    emoji: '🍐',
    name: 'Pear',
    colors: ['#a3e635', '#65a30d'] as [string, string],
    reaction: 'Soft and sweet! Tiger smiles!',
    superpower: 'Tummy helper! 🌟',
    funFact: 'Pears help your tummy feel happy and full of energy! ✨',
    tastyWith: 'Slice with cheese or eat as a juicy snack!',
    whyBetter: 'Better than biscuits - pears are soft, sweet and good for you!',
  },
  {
    id: 'spinach',
    emoji: '🥬',
    name: 'Spinach',
    colors: ['#22c55e', '#16a34a'] as [string, string],
    reaction: 'Leafy power! Tiger flexes!',
    superpower: 'Super strength! 💪',
    funFact:
      'Spinach makes you strong like a superhero - just a little goes far! 🦸',
    tastyWith: 'Hide it in smoothies, pasta sauce, or wraps!',
    whyBetter: 'Better than chips - spinach gives you real superhero strength!',
  },
  {
    id: 'mango',
    emoji: '🥭',
    name: 'Mango',
    colors: ['#fb923c', '#f59e0b'] as [string, string],
    reaction: 'Tropical yum! Tiger dances!',
    superpower: 'Sunshine vitamins! ☀️',
    funFact: 'Mango is a sweet treat from sunny places, full of goodness! 🌴',
    tastyWith: 'Chop into chunks, blend in smoothies, or freeze!',
    whyBetter: 'Better than ice lollies - mango is sweet and full of vitamins!',
  },
  {
    id: 'kiwi',
    emoji: '🥝',
    name: 'Kiwi',
    colors: ['#84cc16', '#4d7c0f'] as [string, string],
    reaction: 'Zingy and green! Tiger cheers!',
    superpower: 'Sniffle fighter! 🤧',
    funFact: 'Kiwi is packed with vitamin C to keep you feeling great! ✨',
    tastyWith: 'Scoop with a spoon or slice into fruit salad!',
    whyBetter: 'Better than sweets - kiwi is zingy, sweet and healthy!',
  },
  {
    id: 'sweet-potato',
    emoji: '🍠',
    name: 'Sweet Potato',
    colors: ['#fb923c', '#ea580c'] as [string, string],
    reaction: 'Sweet and orange! Tiger grins!',
    superpower: 'Glowing power! ✨',
    funFact:
      'Sweet potatoes help your skin and eyes stay healthy and bright! 👀',
    tastyWith: 'Bake into wedges or mash with a little butter!',
    whyBetter: 'Better than chips - sweet potato wedges are sweet and crispy!',
  },
];

// 5 foods for the current week — a sliding window over the pool that advances
// each week and wraps around, so items reappear every few weeks.
const WEEKLY_COUNT = 5;
function weekIndex(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}
function weeklyFoods(week: number): typeof foodPool {
  const start = (week * WEEKLY_COUNT) % foodPool.length;
  return Array.from(
    { length: WEEKLY_COUNT },
    (_, i) => foodPool[(start + i) % foodPool.length],
  );
}

export function KidsFoodDiscovery() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<(typeof foodPool)[0] | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);

  // This week's 5 foods, and a discovery key scoped to the week so progress
  // resets each week as a fresh set rotates in.
  const week = weekIndex();
  const foods = weeklyFoods(week);
  const discoveredKey = `kidsDiscoveredFoods:${week}`;

  useEffect(() => {
    storage.getItem(discoveredKey).then(v => {
      if (v) setDiscovered(JSON.parse(v));
    });
  }, [discoveredKey]);

  const handleTap = async (food: (typeof foodPool)[0]) => {
    setSelectedFood(food);
    setModalVisible(true);
    if (!discovered.includes(food.id)) {
      const newList = [...discovered, food.id];
      setDiscovered(newList);
      await storage.setItem(discoveredKey, JSON.stringify(newList));
      const stars = parseInt((await storage.getItem('kidsTotalStars')) ?? '0');
      await storage.setItem('kidsTotalStars', String(stars + 1));
    }
  };

  return (
    <LinearGradient
      colors={['#bbf7d0', '#d1fae5', '#ecfdf5']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerEmoji}>🐯</Text>
          </View>

          <Text style={styles.title}>Food & Veggie Discovery! 🍓</Text>
          <Text style={styles.subtitle}>5 new foods to explore this week!</Text>

          <View style={styles.grid}>
            {foods.map((food, i) => {
              const isDiscovered = discovered.includes(food.id);
              return (
                <TouchableOpacity
                  key={food.id}
                  activeOpacity={0.85}
                  onPress={() => handleTap(food)}
                  style={styles.foodCardWrap}
                >
                  <LinearGradient colors={food.colors} style={styles.foodCard}>
                    <Text style={styles.foodEmoji}>{food.emoji}</Text>
                    <Text style={styles.foodName}>{food.name}</Text>
                    {isDiscovered && (
                      <View style={styles.discoverStar}>
                        <Text style={{ fontSize: 24 }}>⭐</Text>
                      </View>
                    )}
                    <Text style={styles.sparkle}>✨</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.progressCard}>
            <Text style={styles.progressEmoji}>🌟</Text>
            <Text style={styles.progressText}>
              {discovered.length} / {foods.length} Explored This Week!
            </Text>
            <Text style={styles.progressSub}>
              {discovered.length >= foods.length
                ? 'All done! New foods next week! 🎉'
                : "You're an amazing explorer! 🎉"}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          {selectedFood && (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalCard}
              onPress={() => {}}
            >
              <Text style={styles.modalFoodEmoji}>{selectedFood.emoji}</Text>
              <Text style={styles.modalReaction}>{selectedFood.reaction}</Text>
              <View style={styles.infoBox}>
                <Sparkles size={18} color="#9333ea" />
                <Text style={styles.infoBoxTitle}> Superpower!</Text>
                <Text style={styles.infoBoxText}>
                  {selectedFood.superpower}
                </Text>
                <Text style={styles.infoBoxText}>{selectedFood.funFact}</Text>
              </View>
              <View style={styles.tastyBox}>
                <Text style={styles.tastyTitle}>😋 Tasty Ideas:</Text>
                <Text style={styles.tastyText}>{selectedFood.tastyWith}</Text>
              </View>
              <View style={styles.smartBox}>
                <Text style={styles.smartTitle}>⭐ Smart Choice!</Text>
                <Text style={styles.smartText}>{selectedFood.whyBetter}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>
                  Tap anywhere to continue! ✨
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerEmoji: { fontSize: 52 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  foodCardWrap: { width: '47%' },
  foodCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  foodEmoji: { fontSize: 56, marginBottom: 6 },
  foodName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  discoverStar: { position: 'absolute', top: 8, right: 8 },
  sparkle: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 20,
    opacity: 0.4,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressEmoji: { fontSize: 40, marginBottom: 8 },
  progressText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressSub: { fontSize: 16, color: '#6b7280' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalFoodEmoji: { fontSize: 72, marginBottom: 8 },
  modalReaction: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b21a8',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#581c87',
    marginBottom: 2,
    lineHeight: 20,
  },
  tastyBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 10,
  },
  tastyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350f',
    marginBottom: 4,
  },
  tastyText: { fontSize: 14, color: '#92400e', lineHeight: 20 },
  smartBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  smartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14532d',
    marginBottom: 4,
  },
  smartText: { fontSize: 14, color: '#166534', lineHeight: 20 },
  closeBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeBtnText: { fontSize: 16, fontWeight: '600', color: '#374151' },
});
