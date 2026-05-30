import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";

type FoodSwap = {
  from: string;
  to: string;
  reason: string;
  emoji: string;
};

const swaps: FoodSwap[] = [
  {
    from: "Chocolate bar",
    to: "Mini-bar + fruit",
    reason: "Still get the treat, plus energy boost",
    emoji: "🍫→🍎",
  },
  {
    from: "Crisps",
    to: "Popcorn or savoury mix",
    reason: "More volume, same crunch",
    emoji: "🥔→🍿",
  },
  {
    from: "Energy drink",
    to: "Water + piece of fruit",
    reason: "No crash later, real energy",
    emoji: "⚡→💧",
  },
  {
    from: "Skipping breakfast",
    to: "Toast or cereal bar",
    reason: "Something small > nothing",
    emoji: "❌→🍞",
  },
  {
    from: "Large sugary drink",
    to: "Sparkling water + squash",
    reason: "Still refreshing, less sugar spike",
    emoji: "🥤→🫧",
  },
  {
    from: "Sweets all at once",
    to: "Sweets + save some",
    reason: "You'll still enjoy them later",
    emoji: "🍬→🍬",
  },
];

const energyCheck = [
  { time: "9am", question: "Did you eat breakfast?" },
  { time: "1pm", question: "Energy level @ lunch?" },
  { time: "3pm", question: "Did you get something fresh today?" },
  { time: "Evening", question: "How do you feel overall?" },
];

export function FoodSwaps() {
  const navigate = useNavigate();
  const [selectedSwaps, setSelectedSwaps] = useState<string[]>([]);
  const [energyNotes, setEnergyNotes] = useState<{ [key: string]: string }>({});

  const toggleSwap = (swap: string) => {
    if (selectedSwaps.includes(swap)) {
      setSelectedSwaps(selectedSwaps.filter(s => s !== swap));
    } else {
      setSelectedSwaps([...selectedSwaps, swap]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-gray-400"
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Food & Energy
          </h1>
          <p className="text-gray-400 mb-2">
            Realistic swaps that actually work
          </p>
          <p className="text-sm text-gray-500">
            Not about restriction — about feeling good
          </p>
        </motion.div>

        {/* Info block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8"
        >
          <Zap className="w-6 h-6 text-purple-400 mb-3" />
          <p className="text-sm text-gray-300 leading-relaxed">
            This isn't about "good" or "bad" foods. It's about noticing how different choices affect your energy, mood, and how you feel in class or after school.
          </p>
        </motion.div>

        {/* Realistic swaps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Try These Swaps</h2>
          <p className="text-sm text-gray-400 mb-4">
            Pick one or two to experiment with. See what works for you.
          </p>
          <div className="space-y-3">
            {swaps.map((swap, index) => {
              const isSelected = selectedSwaps.includes(swap.from);
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSwap(swap.from)}
                  className={`w-full bg-[#1a1a24] rounded-2xl p-5 text-left border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{swap.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-400">{swap.from}</p>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-white font-semibold">{swap.to}</p>
                      </div>
                      <p className="text-xs text-gray-500">{swap.reason}</p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-cyan-500 rounded-full p-1"
                      >
                        <Zap className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Energy check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Self-Check Throughout Day</h2>
          <p className="text-sm text-gray-400 mb-4">
            Quick mental notes to see what helps your energy
          </p>
          <div className="space-y-3">
            {energyCheck.map((check, index) => (
              <div
                key={index}
                className="bg-[#1a1a24] rounded-xl p-4 border border-white/10"
              >
                <p className="text-xs text-purple-400 font-semibold mb-1">{check.time}</p>
                <p className="text-sm text-gray-300">{check.question}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lunch reflection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10 mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-3">Lunch Self-Reflection</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Energy level @ 1pm?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                      energyNotes['lunch-energy'] === level.toString()
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                    onClick={() => setEnergyNotes({ ...energyNotes, 'lunch-energy': level.toString() })}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Tired</span>
                <span>Energised</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Did you get something fresh?
              </label>
              <div className="flex gap-2">
                {['Yes', 'No', 'Trying tomorrow'].map((option) => (
                  <button
                    key={option}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                      energyNotes['lunch-fresh'] === option
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                    onClick={() => setEnergyNotes({ ...energyNotes, 'lunch-fresh': option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500 leading-relaxed">
            This is about experimenting and learning what works for YOUR body and YOUR schedule. Not copying what someone else does.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
