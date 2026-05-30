import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, Users } from "lucide-react";

const mealOptions = [
  {
    id: "dal-rice",
    name: "Dal & Rice Bowl",
    emoji: "🍚",
    description: "Warm dal with fluffy rice",
    colors: "from-amber-400 to-orange-400",
    ingredients: ["Yellow dal", "Basmati rice", "Vegetables"],
  },
  {
    id: "veggie-curry",
    name: "Veggie Curry",
    emoji: "🍛",
    description: "Colorful mixed vegetables",
    colors: "from-green-400 to-emerald-400",
    ingredients: ["Potatoes", "Peas", "Carrots", "Spices"],
  },
  {
    id: "roti-sabzi",
    name: "Roti & Sabzi",
    emoji: "🫓",
    description: "Fresh roti with tasty sabzi",
    colors: "from-teal-400 to-cyan-400",
    ingredients: ["Whole wheat roti", "Mixed vegetables", "Paneer"],
  },
  {
    id: "biryani",
    name: "Veggie Biryani",
    emoji: "🍲",
    description: "Fragrant rice with vegetables",
    colors: "from-orange-400 to-red-400",
    ingredients: ["Basmati rice", "Mixed vegetables", "Aromatic spices"],
  },
];

export function DinnerChoice() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasVoted, setHasVoted] = useState(
    localStorage.getItem("todaysDinnerVote") !== null
  );

  const handleVote = (mealId: string) => {
    setSelectedMeal(mealId);
    
    // Save vote
    localStorage.setItem("todaysDinnerVote", mealId);
    
    // Add family point
    const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
    localStorage.setItem("familyPoints", String(currentPoints + 1));
    
    // Add badge if first time
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    if (!badges.includes("dinner-helper")) {
      badges.push("dinner-helper");
      localStorage.setItem("earnedBadges", JSON.stringify(badges));
    }
    
    setShowSuccess(true);
    setHasVoted(true);
  };

  const selectedMealData = mealOptions.find(m => m.id === selectedMeal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-teal-100 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/home")}
            className="bg-white rounded-full p-3 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">Choose Dinner!</h1>
          <div className="w-12" />
        </div>

        {!showSuccess ? (
          <>
            {/* Instructions */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-6 shadow-xl mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">👨‍🍳</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Choice Helps the Team!
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Pick what sounds yummy today
                  </p>
                </div>
              </div>
              
              {hasVoted && (
                <div className="bg-green-100 rounded-2xl p-3 text-center">
                  <p className="text-green-800 font-bold text-sm">
                    ✓ You already voted today!
                  </p>
                  <p className="text-green-700 text-xs">
                    Come back tomorrow for more choices
                  </p>
                </div>
              )}
            </motion.div>

            {/* Meal Cards */}
            <div className="space-y-4">
              {mealOptions.map((meal, index) => (
                <motion.button
                  key={meal.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: hasVoted ? 1 : 1.02 }}
                  whileTap={{ scale: hasVoted ? 1 : 0.98 }}
                  onClick={() => !hasVoted && handleVote(meal.id)}
                  disabled={hasVoted}
                  className={`w-full bg-gradient-to-r ${meal.colors} rounded-3xl p-6 shadow-xl text-left relative overflow-hidden ${
                    hasVoted ? "opacity-50" : ""
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="text-6xl">{meal.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {meal.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-2">
                        {meal.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {meal.ingredients.map((ingredient, i) => (
                          <span
                            key={i}
                            className="bg-white/30 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative pattern */}
                  <div className="absolute top-0 right-0 text-6xl opacity-20">
                    ✨
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * 400 - 200, opacity: 1 }}
                animate={{ y: 600, rotate: 720, opacity: 0 }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute text-2xl"
              >
                {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "✨" : "🌟"}
              </motion.div>
            ))}

            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Great Choice!
            </h2>

            {selectedMealData && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`bg-gradient-to-r ${selectedMealData.colors} rounded-3xl p-6 mb-6 text-center`}
              >
                <div className="text-6xl mb-2">{selectedMealData.emoji}</div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedMealData.name}
                </h3>
              </motion.div>
            )}

            {/* Rewards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full mb-6"
            >
              <div className="space-y-4">
                {/* Badge */}
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <div className="font-bold text-purple-800">New Badge!</div>
                      <div className="text-sm text-purple-600">Dinner Helper</div>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>

                {/* Family Point */}
                <div className="flex items-center justify-between bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-600" />
                    <div>
                      <div className="font-bold text-orange-800">+1 Family Point</div>
                      <div className="text-sm text-orange-600">You helped the team!</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {parseInt(localStorage.getItem("familyPoints") || "0")}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="w-full py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-xl font-bold text-white shadow-2xl"
            >
              Back to Home 🏠
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
