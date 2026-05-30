import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, Zap, Book, Target } from "lucide-react";

interface SchoolMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  examples: string[];
  tip: string;
}

const schoolMissions: SchoolMission[] = [
  {
    id: "water-day",
    title: "Water Champion",
    description: "Choose water instead of fizzy drinks today",
    emoji: "💧",
    examples: ["Water bottle", "Flavoured water", "Coconut water"],
    tip: "Pro athletes drink 2-3 liters of water daily. Even 2% dehydration drops performance by 10%!"
  },
  {
    id: "fruit-snack",
    title: "Fresh Fuel",
    description: "Pick fresh fruit for your snack",
    emoji: "🍎",
    examples: ["Apple", "Banana", "Grapes", "Orange"],
    tip: "Fruit gives you vitamins that help your brain focus in class and energy for sports!"
  },
  {
    id: "veggie-lunch",
    title: "Veggie Power",
    description: "Add vegetables to your lunch today",
    emoji: "🥕",
    examples: ["Carrot sticks", "Cucumber", "Tomatoes", "Peppers"],
    tip: "Vegetables have nutrients that help muscles recover after training!"
  },
  {
    id: "protein-choice",
    title: "Muscle Builder",
    description: "Choose a protein-rich lunch option",
    emoji: "🍗",
    examples: ["Chicken", "Eggs", "Cheese", "Yogurt", "Dal"],
    tip: "Protein builds muscle and keeps you full through afternoon classes!"
  },
  {
    id: "smart-breakfast",
    title: "Breakfast Champion",
    description: "Eat a balanced breakfast before school",
    emoji: "🥣",
    examples: ["Porridge", "Eggs on toast", "Yogurt & fruit", "Dosa"],
    tip: "Athletes NEVER skip breakfast. It's the fuel that starts your engine!"
  },
];

interface SmartSwap {
  instead: string;
  choose: string;
  instEmoji: string;
  chooseEmoji: string;
}

const smartSwaps: SmartSwap[] = [
  { instead: "Crisps", choose: "Popcorn", instEmoji: "🍟", chooseEmoji: "🍿" },
  { instead: "Fizzy drink", choose: "Water", instEmoji: "🥤", chooseEmoji: "💧" },
  { instead: "Chocolate bar", choose: "Fruit + Yogurt", instEmoji: "🍫", chooseEmoji: "🍎🥛" },
  { instead: "Sweets", choose: "Fresh fruit", instEmoji: "🍬", chooseEmoji: "🍇" },
  { instead: "White bread", choose: "Whole grain", instEmoji: "🍞", chooseEmoji: "🥖" },
  { instead: "Cookies", choose: "Oat bar", instEmoji: "🍪", chooseEmoji: "🌾" },
];

export function SchoolFuel() {
  const navigate = useNavigate();
  const [todaysMission, setTodaysMission] = useState<SchoolMission>(schoolMissions[0]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const today = new Date().getDate();
    const missionIndex = today % schoolMissions.length;
    setTodaysMission(schoolMissions[missionIndex]);

    const completedToday = localStorage.getItem("schoolMissionDate") === new Date().toDateString();
    setCompleted(completedToday);
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    localStorage.setItem("schoolMissionDate", new Date().toDateString());
    
    const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
    localStorage.setItem("familyPoints", String(currentPoints + 2));

    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    if (!badges.includes("school-smart")) {
      badges.push("school-smart");
      localStorage.setItem("earnedBadges", JSON.stringify(badges));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/training")}
            className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Fuel for School 🎒</h1>
          <div className="w-12" />
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <Book className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Smart Choices at School
              </h2>
              <p className="text-teal-100 text-sm leading-relaxed">
                What you eat at school affects how you perform in class AND on the field. Make choices like a pro athlete!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Today's Mission */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Today's School Mission</h3>
          </div>

          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              {todaysMission.emoji}
            </motion.div>
            <h4 className="text-2xl font-bold text-white mb-2">
              {todaysMission.title}
            </h4>
            <p className="text-blue-200 text-sm">
              {todaysMission.description}
            </p>
          </div>

          {/* Examples */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <h5 className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-3">
              Smart Choices:
            </h5>
            <div className="flex flex-wrap gap-2">
              {todaysMission.examples.map((example, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full px-3 py-1 text-sm text-white font-bold"
                >
                  ✓ {example}
                </span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-orange-300 mb-1 text-sm">Pro Tip</div>
                <p className="text-orange-100 text-sm">{todaysMission.tip}</p>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          {!completed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              I Did This Today! +2 Points
            </motion.button>
          ) : (
            <div className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Mission Complete! ✅
            </div>
          )}
        </motion.div>

        {/* Smart Swaps Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            Smart Swaps for School
          </h3>

          <div className="space-y-3">
            {smartSwaps.map((swap, index) => (
              <motion.div
                key={index}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl opacity-50">{swap.instEmoji}</div>
                    <div>
                      <div className="text-xs text-white/60">Instead of:</div>
                      <div className="text-sm text-white/70 line-through">{swap.instead}</div>
                    </div>
                  </div>

                  <div className="text-xl text-teal-400">→</div>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-teal-300">Choose:</div>
                      <div className="text-sm font-bold text-white">{swap.choose}</div>
                    </div>
                    <div className="text-3xl">{swap.chooseEmoji}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Independence Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">💪</div>
            <div>
              <h4 className="text-white font-bold mb-1">You're In Control</h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                Making smart choices at school shows you're becoming independent and responsible. That's champion mindset! 🏆
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
