import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Zap, TrendingUp } from "lucide-react";

interface SnackSwap {
  id: string;
  junkFood: {
    name: string;
    emoji: string;
  };
  athleteUpgrade: {
    name: string;
    emoji: string;
  };
  benefit: string;
  sportsImpact: string;
}

const snackSwaps: SnackSwap[] = [
  {
    id: "crisps-popcorn",
    junkFood: { name: "Crisps", emoji: "🍟" },
    athleteUpgrade: { name: "Air-Popped Popcorn", emoji: "🍿" },
    benefit: "Same crunch, 60% less fat, more fiber for steady energy!",
    sportsImpact: "Keeps you full longer without the grease that slows you down"
  },
  {
    id: "chocolate-banana",
    junkFood: { name: "Chocolate Bar", emoji: "🍫" },
    athleteUpgrade: { name: "Banana + Peanut Butter", emoji: "🍌🥜" },
    benefit: "Natural sugars + protein = sustained energy, not a sugar crash!",
    sportsImpact: "Pro tennis players eat this before matches for long-lasting power"
  },
  {
    id: "fizzy-water",
    junkFood: { name: "Fizzy Drink", emoji: "🥤" },
    athleteUpgrade: { name: "Flavoured Water", emoji: "💧🍋" },
    benefit: "Hydration without sugar crash. Add lemon, cucumber, or berries!",
    sportsImpact: "Athletes hydrate with water. Soda = dehydration + energy crash"
  },
  {
    id: "sweets-fruit",
    junkFood: { name: "Gummy Sweets", emoji: "🍬" },
    athleteUpgrade: { name: "Fresh Grapes", emoji: "🍇" },
    benefit: "Natural sweetness + vitamins that help you recover faster!",
    sportsImpact: "Fruits have antioxidants that reduce muscle soreness"
  },
  {
    id: "cookies-oatcakes",
    junkFood: { name: "Cookies", emoji: "🍪" },
    athleteUpgrade: { name: "Oatcakes + Cheese", emoji: "🧀🌾" },
    benefit: "Complex carbs + protein = energy that lasts for hours!",
    sportsImpact: "Oats are what marathon runners eat before races"
  },
  {
    id: "ice-cream-yogurt",
    junkFood: { name: "Ice Cream", emoji: "🍦" },
    athleteUpgrade: { name: "Greek Yogurt + Berries", emoji: "🥛🫐" },
    benefit: "Protein for muscle recovery + probiotics for gut health!",
    sportsImpact: "Bodybuilders eat Greek yogurt after training for muscle growth"
  },
  {
    id: "cereal-oats",
    junkFood: { name: "Sugary Cereal", emoji: "🥣" },
    athleteUpgrade: { name: "Porridge + Banana", emoji: "🥣🍌" },
    benefit: "Slow-release energy that powers you through the whole morning!",
    sportsImpact: "Olympic athletes fuel up with oats before competition"
  },
  {
    id: "juice-smoothie",
    junkFood: { name: "Fruit Juice", emoji: "🧃" },
    athleteUpgrade: { name: "Fruit Smoothie", emoji: "🥤🍓" },
    benefit: "Whole fruit = fiber + nutrients, not just sugar water!",
    sportsImpact: "Keeps blood sugar stable so you don't crash mid-game"
  },
];

export function SnackSwap() {
  const navigate = useNavigate();
  const [selectedSwap, setSelectedSwap] = useState<SnackSwap | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-white">Fuel for the Game ⚽</h1>
          <div className="w-12" />
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="text-5xl">⚡</div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Athlete Upgrades
              </h2>
              <p className="text-orange-100 text-sm leading-relaxed">
                Swap everyday snacks for athlete upgrades! These smart choices will boost your performance on the field.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Snack Swap Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {snackSwaps.map((swap, index) => (
            <motion.button
              key={swap.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSwap(swap)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 hover:border-orange-400 transition-all"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="text-4xl">{swap.junkFood.emoji}</div>
                <ArrowRight className="w-5 h-5 text-orange-400" />
                <div className="text-4xl">{swap.athleteUpgrade.emoji}</div>
              </div>
              <div className="text-xs text-white/70 mb-1">{swap.junkFood.name}</div>
              <div className="text-sm font-bold text-white">{swap.athleteUpgrade.name}</div>
            </motion.button>
          ))}
        </div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Smart Swapping</h4>
              <p className="text-green-100 text-sm">
                You don't have to give up treats forever! Smart athletes make better choices most of the time. 80/20 rule! 💪
              </p>
            </div>
          </div>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedSwap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedSwap(null)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-md w-full border border-white/20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wide mb-4">
                    Athlete Upgrade
                  </h3>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-6xl mb-2">{selectedSwap.junkFood.emoji}</div>
                      <div className="text-sm text-white/70">{selectedSwap.junkFood.name}</div>
                    </div>

                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-8 h-8 text-orange-400" />
                    </motion.div>

                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-6xl mb-2"
                      >
                        {selectedSwap.athleteUpgrade.emoji}
                      </motion.div>
                      <div className="text-sm font-bold text-white">{selectedSwap.athleteUpgrade.name}</div>
                    </div>
                  </div>
                </div>

                {/* Benefit */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="font-bold text-green-300">Why It's Better</div>
                  </div>
                  <p className="text-sm text-green-100">
                    {selectedSwap.benefit}
                  </p>
                </div>

                {/* Sports Impact */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="font-bold text-blue-300">Performance Boost</div>
                  </div>
                  <p className="text-sm text-blue-100">
                    {selectedSwap.sportsImpact}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSwap(null)}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full text-white font-bold shadow-lg"
                >
                  Got It! 💪
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}