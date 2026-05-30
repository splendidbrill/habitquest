import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Zap, TrendingUp, Award, Target, Flame, Brain, Dumbbell } from "lucide-react";

const fuelOptions = [
  {
    id: "protein-power",
    emoji: "🥚",
    name: "Protein Power",
    category: "Muscle Builder",
    color: "from-red-500 to-orange-500",
    foods: ["Eggs", "Chicken", "Paneer", "Dal", "Fish"],
    performance: [
      { icon: "💪", benefit: "Builds muscle faster after training" },
      { icon: "⚡", benefit: "Repairs your body after hard workouts" },
      { icon: "🏃", benefit: "Helps you recover quicker for next match" },
    ],
    sportsImpact: "Football players need protein to sprint faster and tackle stronger. Your muscles grow when you rest - protein helps that happen!",
    vsJunk: "A chicken sandwich keeps you full for 3-4 hours. Chips? 30 minutes, then you're hungry and tired.",
    performanceTip: "Eat protein within 30 minutes after training for maximum muscle growth!",
  },
  {
    id: "energy-carbs",
    emoji: "🍚",
    name: "Energy Fuel",
    category: "Performance Boost",
    color: "from-amber-500 to-yellow-500",
    foods: ["Rice", "Roti", "Oats", "Sweet Potato", "Whole Wheat Pasta"],
    performance: [
      { icon: "⚡", benefit: "Energy that lasts the whole match" },
      { icon: "🧠", benefit: "Keeps your brain sharp for game strategy" },
      { icon: "🏃", benefit: "Fuel for running and explosive movements" },
    ],
    sportsImpact: "Carbs = Energy! Athletes eat rice and pasta before big games because it gives steady power. White bread or sweets spike then crash you.",
    vsJunk: "Rice gives you 2-3 hours of steady energy. Chocolate bar? Quick spike, then you crash hard after 20 minutes.",
    performanceTip: "Eat complex carbs 2-3 hours before training - you'll feel the difference in your stamina!",
  },
  {
    id: "hydration-hero",
    emoji: "💧",
    name: "Hydration Station",
    category: "Performance Essential",
    color: "from-blue-500 to-cyan-500",
    foods: ["Water", "Coconut Water", "Cucumber", "Watermelon", "Buttermilk"],
    performance: [
      { icon: "🏃", benefit: "Run faster when properly hydrated" },
      { icon: "🧠", benefit: "Think clearer during games" },
      { icon: "❤️", benefit: "Your heart works better when hydrated" },
    ],
    sportsImpact: "Just 2% dehydration = 10% drop in performance! Pro athletes drink water constantly. Soda dehydrates you more.",
    vsJunk: "Water keeps you performing at 100%. Soda has sugar that makes you thirsty, slows you down, and crashes your energy.",
    performanceTip: "Drink water before you're thirsty! By the time you feel thirsty, you're already dehydrated.",
  },
  {
    id: "vitamin-boost",
    emoji: "🥬",
    name: "Recovery Greens",
    category: "Health & Defense",
    color: "from-green-500 to-emerald-500",
    foods: ["Spinach", "Broccoli", "Peppers", "Carrots", "Tomatoes"],
    performance: [
      { icon: "🛡️", benefit: "Protects from getting sick before big matches" },
      { icon: "⚡", benefit: "Vitamins help convert food to energy faster" },
      { icon: "💪", benefit: "Helps muscles recover and grow stronger" },
    ],
    sportsImpact: "Vegetables have vitamins that help your body use protein and carbs better. Top athletes eat tons of veggies for recovery!",
    vsJunk: "Veggies give you nutrients that help you play better. Junk food gives you calories but no performance benefits.",
    performanceTip: "Eat rainbow colors - different colors = different vitamins your body needs to perform!",
  },
];

export function FuelStation() {
  const navigate = useNavigate();
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [showFuelInfo, setShowFuelInfo] = useState(false);

  const handleSelectFuel = (fuelId: string) => {
    setSelectedFuel(fuelId);
    setShowFuelInfo(true);
  };

  const handleLogFuel = () => {
    setShowFuelInfo(false);
    const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
    localStorage.setItem("familyPoints", String(currentPoints + 2));
    
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    if (!badges.includes("fuel-master")) {
      badges.push("fuel-master");
      localStorage.setItem("earnedBadges", JSON.stringify(badges));
    }
  };

  const selectedFuelData = fuelOptions.find(f => f.id === selectedFuel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/training")}
            className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Fuel Station ⚡</h1>
          <div className="w-12" />
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <Flame className="w-8 h-8 text-yellow-300 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Fuel Like a Pro Athlete
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Your body is a high-performance machine. What you eat directly affects how fast you run, how strong you are, and how long you can play!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fuel Categories */}
        <div className="space-y-4 mb-6">
          {fuelOptions.map((fuel, index) => (
            <motion.button
              key={fuel.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectFuel(fuel.id)}
              className={`w-full bg-gradient-to-r ${fuel.color} rounded-3xl p-6 shadow-xl text-left relative overflow-hidden`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="text-6xl">{fuel.emoji}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white/80 mb-1 uppercase tracking-wide">
                    {fuel.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {fuel.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {fuel.foods.slice(0, 3).map((food, i) => (
                      <span
                        key={i}
                        className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-bold"
                      >
                        {food}
                      </span>
                    ))}
                    {fuel.foods.length > 3 && (
                      <span className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-bold">
                        +{fuel.foods.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <Target className="w-6 h-6 text-white" />
              </div>

              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 text-8xl opacity-10">
                ⚡
              </div>
            </motion.button>
          ))}
        </div>

        {/* Performance Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Pro Tip</h4>
              <p className="text-purple-100 text-sm">
                Professional athletes track their nutrition like training. Smart fuel choices = Better performance on the field! 🏆
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fuel Info Modal */}
        <AnimatePresence>
          {showFuelInfo && selectedFuelData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setShowFuelInfo(false)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-md w-full my-8 border border-white/20"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-9xl mb-4"
                  >
                    {selectedFuelData.emoji}
                  </motion.div>
                  <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">
                    {selectedFuelData.category}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {selectedFuelData.name}
                  </h3>

                  {/* Food Examples */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {selectedFuelData.foods.map((food, i) => (
                      <span
                        key={i}
                        className={`bg-gradient-to-r ${selectedFuelData.color} rounded-full px-4 py-2 text-sm text-white font-bold shadow-lg`}
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Benefits */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-white">Performance Benefits:</h4>
                  </div>
                  
                  {selectedFuelData.performance.map((perf, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{perf.icon}</div>
                        <p className="text-sm text-blue-100 leading-relaxed">
                          {perf.benefit}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sports Impact */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="font-bold text-green-300">Sports Impact</div>
                  </div>
                  <p className="text-sm text-green-100">
                    {selectedFuelData.sportsImpact}
                  </p>
                </div>

                {/* Smart Choice */}
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <div className="font-bold text-orange-300">Smart Choice vs Junk</div>
                  </div>
                  <p className="text-sm text-orange-100">
                    {selectedFuelData.vsJunk}
                  </p>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div className="font-bold text-purple-300">Pro Athlete Tip</div>
                  </div>
                  <p className="text-sm text-purple-100">
                    {selectedFuelData.performanceTip}
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogFuel}
                    className={`w-full py-4 bg-gradient-to-r ${selectedFuelData.color} rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2`}
                  >
                    <Zap className="w-5 h-5" />
                    I'm Fueling Smart! +2 Points
                  </motion.button>
                  
                  <button
                    onClick={() => setShowFuelInfo(false)}
                    className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold"
                  >
                    Explore More Options
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
