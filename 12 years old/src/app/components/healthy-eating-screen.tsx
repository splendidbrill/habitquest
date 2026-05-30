import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Apple, Heart, Info } from "lucide-react";

const eatingPrinciples = [
  {
    title: "Listen to your body",
    description: "Eat when you're hungry, stop when you're comfortable. Your body knows what it needs.",
    icon: "👂",
  },
  {
    title: "All foods fit",
    description: "No food is 'bad'. Balance and variety matter more than restriction.",
    icon: "🍽️",
  },
  {
    title: "Eat with others when you can",
    description: "Food is social. Sharing meals can be as important as what you eat.",
    icon: "👥",
  },
  {
    title: "Notice how food makes you feel",
    description: "Some foods give you energy, some make you sleepy. Pay attention.",
    icon: "💭",
  },
];

const simpleHabits = [
  "Drink water when you're thirsty",
  "Try to eat breakfast most days",
  "Include vegetables you actually like",
  "Don't skip meals to 'make up' for eating",
  "Eat slowly enough to taste your food",
  "Keep some healthy snacks handy",
];

const redFlags = [
  "Skipping meals regularly",
  "Exercising to 'burn off' food",
  "Feeling anxious about eating with others",
  "Comparing what you eat to others",
  "Restricting certain food groups completely",
];

export function HealthyEatingScreen() {
  const navigate = useNavigate();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = (habit: string) => {
    if (selectedHabits.includes(habit)) {
      setSelectedHabits(selectedHabits.filter(h => h !== habit));
    } else {
      setSelectedHabits([...selectedHabits, habit]);
    }
    
    // Save to local storage
    const newHabits = selectedHabits.includes(habit)
      ? selectedHabits.filter(h => h !== habit)
      : [...selectedHabits, habit];
    localStorage.setItem("eatingHabits", JSON.stringify(newHabits));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-neutral-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Food & eating
          </h1>
          <p className="text-neutral-500">
            No rules, no restrictions. Just what actually helps.
          </p>
        </motion.div>

        {/* Important note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
        >
          <Info className="w-6 h-6 text-amber-600 mb-3" />
          <p className="text-sm text-neutral-700 leading-relaxed">
            This isn't about losing weight or looking different. It's about feeling good and having energy for your life.
          </p>
        </motion.div>

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-sm font-medium text-neutral-600 mb-4">
            Basic principles
          </h2>
          <div className="space-y-4">
            {eatingPrinciples.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
              >
                <div className="flex gap-4">
                  <div className="text-3xl">{principle.icon}</div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Simple habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-sm font-medium text-neutral-600 mb-4">
            Pick habits that work for you
          </h2>
          <p className="text-xs text-neutral-500 mb-4">
            Choose what feels doable. You don't need to do everything.
          </p>
          <div className="space-y-2">
            {simpleHabits.map((habit, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleHabit(habit)}
                className={`w-full text-left rounded-xl p-4 transition-colors ${
                  selectedHabits.includes(habit)
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-700 border border-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedHabits.includes(habit)
                      ? 'border-white bg-white'
                      : 'border-neutral-300'
                  }`}>
                    {selectedHabits.includes(habit) && (
                      <div className="w-2 h-2 bg-neutral-800 rounded-sm" />
                    )}
                  </div>
                  <span className="text-sm">{habit}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Red flags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-medium text-red-600 mb-4">
            When to talk to someone
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-sm text-neutral-700 mb-4 leading-relaxed">
              If you notice these patterns, it might help to talk to someone you trust:
            </p>
            <ul className="space-y-2">
              {redFlags.map((flag, index) => (
                <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Support reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-6"
        >
          <Heart className="w-6 h-6 text-blue-400 mb-3" />
          <p className="text-sm text-neutral-700 leading-relaxed mb-3">
            Your relationship with food should feel calm, not stressful. If it doesn't, that's okay—but it might help to talk to someone.
          </p>
          <button
            onClick={() => navigate("/resources")}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            View support resources →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
