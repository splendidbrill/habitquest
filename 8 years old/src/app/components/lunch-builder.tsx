import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Trophy, Zap, CheckCircle2, X, TrendingUp, AlertCircle } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "energy" | "protein" | "fresh";
  color: string;
  quality: "great" | "okay" | "poor";
}

const foodItems: FoodItem[] = [
  // Energy Foods (Carbs)
  { id: "sandwich", name: "Sandwich", emoji: "🥪", category: "energy", color: "from-amber-500 to-orange-500", quality: "great" },
  { id: "pasta", name: "Pasta", emoji: "🍝", category: "energy", color: "from-amber-500 to-orange-500", quality: "great" },
  { id: "rice", name: "Rice Bowl", emoji: "🍚", category: "energy", color: "from-amber-500 to-orange-500", quality: "great" },
  { id: "wrap", name: "Wrap", emoji: "🌯", category: "energy", color: "from-amber-500 to-orange-500", quality: "great" },
  { id: "crackers", name: "Crackers", emoji: "🍘", category: "energy", color: "from-amber-500 to-orange-500", quality: "okay" },
  { id: "chips", name: "Chips", emoji: "🍟", category: "energy", color: "from-red-500 to-rose-500", quality: "poor" },

  // Protein Foods
  { id: "chicken", name: "Chicken", emoji: "🍗", category: "protein", color: "from-red-500 to-rose-500", quality: "great" },
  { id: "eggs", name: "Boiled Eggs", emoji: "🥚", category: "protein", color: "from-red-500 to-rose-500", quality: "great" },
  { id: "cheese", name: "Cheese", emoji: "🧀", category: "protein", color: "from-red-500 to-rose-500", quality: "great" },
  { id: "yogurt", name: "Yogurt", emoji: "🥛", category: "protein", color: "from-red-500 to-rose-500", quality: "great" },
  { id: "nuts", name: "Nuts", emoji: "🥜", category: "protein", color: "from-red-500 to-rose-500", quality: "great" },

  // Fresh Foods (Fruit & Veg)
  { id: "apple", name: "Apple", emoji: "🍎", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "banana", name: "Banana", emoji: "🍌", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "carrot", name: "Carrot Sticks", emoji: "🥕", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "grapes", name: "Grapes", emoji: "🍇", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "cucumber", name: "Cucumber", emoji: "🥒", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "tomato", name: "Cherry Tomatoes", emoji: "🍅", category: "fresh", color: "from-green-500 to-emerald-500", quality: "great" },
  { id: "candy", name: "Candy", emoji: "🍬", category: "fresh", color: "from-red-500 to-rose-500", quality: "poor" },
];

export function LunchBuilder() {
  const navigate = useNavigate();
  const [lunchbox, setLunchbox] = useState<FoodItem[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<"great" | "okay" | "improve">("okay");
  const [tips, setTips] = useState<string[]>([]);

  const isBalanced = () => {
    const hasEnergy = lunchbox.some(item => item.category === "energy");
    const hasProtein = lunchbox.some(item => item.category === "protein");
    const hasFresh = lunchbox.some(item => item.category === "fresh");
    return hasEnergy && hasProtein && hasFresh;
  };

  const calculateRating = () => {
    if (lunchbox.length === 0) return;

    const greatItems = lunchbox.filter(i => i.quality === "great").length;
    const poorItems = lunchbox.filter(i => i.quality === "poor").length;
    const balanced = isBalanced();

    const newTips: string[] = [];

    // Determine rating
    if (balanced && greatItems >= 3 && poorItems === 0) {
      setRating("great");
      newTips.push("Perfect fuel for peak performance");
      newTips.push("Midday energy comes from balanced carbs + protein");
    } else if (poorItems > 1 || !balanced) {
      setRating("improve");
      if (!balanced) newTips.push("Try adding items from all three groups");
      if (poorItems > 0) {
        if (lunchbox.some(i => i.id === "chips")) newTips.push("Chips → Popcorn (more energy, less oil)");
        if (lunchbox.some(i => i.id === "candy")) newTips.push("Candy → Fresh fruit + yogurt (sustained energy)");
      }
      newTips.push("Athletes need balanced meals for training");
    } else {
      setRating("okay");
      newTips.push("Good start! A few small upgrades would help");
      if (!lunchbox.some(i => i.category === "fresh")) {
        newTips.push("Add some fresh fruit or veg for vitamins");
      }
    }

    setTips(newTips);
    setShowRating(true);

    // Award XP for rating
    const xp = rating === "great" ? 10 : rating === "okay" ? 5 : 3;
    const currentXP = parseInt(localStorage.getItem("userXP") || "0");
    localStorage.setItem("userXP", (currentXP + xp).toString());
  };

  const handleAddToLunchbox = (item: FoodItem) => {
    if (lunchbox.length < 6 && !lunchbox.find(i => i.id === item.id)) {
      setLunchbox([...lunchbox, item]);
    }
  };

  const handleRemoveFromLunchbox = (itemId: string) => {
    setLunchbox(lunchbox.filter(item => item.id !== itemId));
    setShowRating(false);
  };

  const handleReset = () => {
    setLunchbox([]);
    setShowRating(false);
  };

  const categoryProgress = {
    energy: lunchbox.filter(i => i.category === "energy").length > 0,
    protein: lunchbox.filter(i => i.category === "protein").length > 0,
    fresh: lunchbox.filter(i => i.category === "fresh").length > 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-white">School Lunch Coach</h1>
          <button
            onClick={handleReset}
            className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 text-white text-sm font-bold"
          >
            Reset
          </button>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-5 shadow-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="text-4xl">🍱</div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                Rate & Improve Your Meals
              </h2>
              <p className="text-green-100 text-sm leading-relaxed">
                Add what you're eating for lunch, and get personalized tips to fuel your performance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Checklist */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`rounded-2xl p-3 text-center transition-all ${
            categoryProgress.energy 
              ? "bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg" 
              : "bg-white/5 border border-white/10"
          }`}>
            <div className="text-3xl mb-1">⚡</div>
            <div className={`text-xs font-bold ${categoryProgress.energy ? "text-white" : "text-white/50"}`}>
              Energy
            </div>
            {categoryProgress.energy && <CheckCircle2 className="w-4 h-4 text-white mx-auto mt-1" />}
          </div>

          <div className={`rounded-2xl p-3 text-center transition-all ${
            categoryProgress.protein 
              ? "bg-gradient-to-br from-red-600 to-rose-600 shadow-lg" 
              : "bg-white/5 border border-white/10"
          }`}>
            <div className="text-3xl mb-1">💪</div>
            <div className={`text-xs font-bold ${categoryProgress.protein ? "text-white" : "text-white/50"}`}>
              Protein
            </div>
            {categoryProgress.protein && <CheckCircle2 className="w-4 h-4 text-white mx-auto mt-1" />}
          </div>

          <div className={`rounded-2xl p-3 text-center transition-all ${
            categoryProgress.fresh 
              ? "bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg" 
              : "bg-white/5 border border-white/10"
          }`}>
            <div className="text-3xl mb-1">🥗</div>
            <div className={`text-xs font-bold ${categoryProgress.fresh ? "text-white" : "text-white/50"}`}>
              Fresh
            </div>
            {categoryProgress.fresh && <CheckCircle2 className="w-4 h-4 text-white mx-auto mt-1" />}
          </div>
        </div>

        {/* Lunchbox */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm border-4 border-dashed border-white/30 rounded-3xl p-6 mb-6 min-h-[200px] relative"
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <span className="text-3xl">🍱</span>
              My Lunchbox ({lunchbox.length}/6)
            </h3>
          </div>

          {lunchbox.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/50 text-sm">Tap foods below to add them!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {lunchbox.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="relative"
                  >
                    <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-3 text-center shadow-lg`}>
                      <div className="text-4xl mb-1">{item.emoji}</div>
                      <div className="text-xs text-white font-bold">{item.name}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromLunchbox(item.id)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {lunchbox.length >= 2 && !showRating && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={calculateRating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Rate My Lunch
                </motion.button>
              )}
            </>
          )}
        </motion.div>

        {/* Food Categories */}
        <div className="space-y-4">
          {/* Energy Foods */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-3 py-1 text-xs">
                ⚡ ENERGY FOODS
              </span>
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {foodItems.filter(f => f.category === "energy").map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToLunchbox(item)}
                  disabled={lunchbox.find(i => i.id === item.id) !== undefined || lunchbox.length >= 6}
                  className={`rounded-xl p-2 text-center transition-all ${
                    lunchbox.find(i => i.id === item.id)
                      ? "bg-white/5 opacity-40"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-[10px] text-white font-bold leading-tight">{item.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Protein Foods */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-500 to-rose-500 rounded-full px-3 py-1 text-xs">
                💪 PROTEIN FOODS
              </span>
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {foodItems.filter(f => f.category === "protein").map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToLunchbox(item)}
                  disabled={lunchbox.find(i => i.id === item.id) !== undefined || lunchbox.length >= 6}
                  className={`rounded-xl p-2 text-center transition-all ${
                    lunchbox.find(i => i.id === item.id)
                      ? "bg-white/5 opacity-40"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-[10px] text-white font-bold leading-tight">{item.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Fresh Foods */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1 text-xs">
                🥗 FRESH FOODS
              </span>
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {foodItems.filter(f => f.category === "fresh").map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToLunchbox(item)}
                  disabled={lunchbox.find(i => i.id === item.id) !== undefined || lunchbox.length >= 6}
                  className={`rounded-xl p-2 text-center transition-all ${
                    lunchbox.find(i => i.id === item.id)
                      ? "bg-white/5 opacity-40"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-[10px] text-white font-bold leading-tight">{item.name}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        <AnimatePresence>
          {showRating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 shadow-2xl max-w-sm w-full border-4 border-yellow-400"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="text-9xl text-center mb-6"
                >
                  🏆
                </motion.div>

                <h2 className="text-3xl font-bold text-white text-center mb-4">
                  Awesome Lunch!
                </h2>

                <p className="text-xl text-green-100 text-center mb-6 leading-relaxed">
                  Great fuel for your training! That balanced meal will power you through the whole day! 💪⚽
                </p>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <span className="text-2xl font-bold text-white">+3 Points</span>
                  </div>
                  <p className="text-green-100 text-sm">Lunch Builder Master!</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowRating(false)}
                    className="w-full py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg"
                  >
                    Keep Building! 🍱
                  </button>
                  <button
                    onClick={() => navigate("/training")}
                    className="w-full py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}