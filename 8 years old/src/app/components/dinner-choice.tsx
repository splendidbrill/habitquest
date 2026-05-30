import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, Users, Lock, Lightbulb, Zap, Brain, Heart } from "lucide-react";

const mealOptions = [
  {
    id: "dal-rice",
    name: "Dal & Rice Bowl",
    emoji: "🍚",
    description: "Warm dal with fluffy rice",
    colors: "from-amber-400 to-orange-400",
    ingredients: ["Yellow dal", "Basmati rice", "Vegetables"],
    benefits: [
      { icon: "💪", text: "Protein helps your muscles grow strong for running and playing!" },
      { icon: "⚡", text: "Rice gives you energy that lasts all day - better than sweets that make you tired later" },
      { icon: "🧠", text: "Dal has iron that helps your brain think and remember things in school" },
    ],
    funFact: "Dal and rice together make a 'complete protein' - that means they work as a team to make you super strong!",
    whyBetterThanJunk: "Unlike chips that only give quick energy, dal & rice keep you energized for hours of play!",
  },
  {
    id: "veggie-curry",
    name: "Veggie Curry",
    emoji: "🍛",
    description: "Colorful mixed vegetables",
    colors: "from-green-400 to-emerald-400",
    ingredients: ["Potatoes", "Peas", "Carrots", "Spices"],
    benefits: [
      { icon: "👀", text: "Carrots help you see better, even in the dark - perfect for night adventures!" },
      { icon: "🦴", text: "Potatoes have potassium that keeps your bones and teeth super strong" },
      { icon: "❤️", text: "Peas help your heart stay healthy so you can run faster and play longer" },
    ],
    funFact: "Each color vegetable has different superpowers! Orange = eye power, Green = strong muscles, Red = heart health",
    whyBetterThanJunk: "Vegetables give you steady energy and don't make your tummy hurt like too many chocolates can!",
  },
  {
    id: "roti-sabzi",
    name: "Roti & Sabzi",
    emoji: "🫓",
    description: "Fresh roti with tasty sabzi",
    colors: "from-teal-400 to-cyan-400",
    ingredients: ["Whole wheat roti", "Mixed vegetables", "Paneer"],
    benefits: [
      { icon: "🏃", text: "Whole wheat gives you energy that lasts - perfect for playing football after lunch!" },
      { icon: "🦷", text: "Paneer has calcium that makes your teeth and bones super strong" },
      { icon: "🌟", text: "Fiber in roti keeps your tummy happy and helps you feel good all day" },
    ],
    funFact: "When you chew roti well, your tummy can grab all the energy from it. Try counting 20 chews!",
    whyBetterThanJunk: "Roti keeps you full and energized much longer than biscuits or crisps!",
  },
  {
    id: "biryani",
    name: "Veggie Biryani",
    emoji: "🍲",
    description: "Fragrant rice with vegetables",
    colors: "from-orange-400 to-red-400",
    ingredients: ["Basmati rice", "Mixed vegetables", "Aromatic spices"],
    benefits: [
      { icon: "🧠", text: "Spices like turmeric help your brain work faster and remember more!" },
      { icon: "🛡️", text: "Vegetables have vitamins that protect you from getting sick" },
      { icon: "⚡", text: "Rice gives you quick energy to play and run around after eating" },
    ],
    funFact: "The different spices in biryani don't just taste good - they help fight germs and keep you healthy!",
    whyBetterThanJunk: "Biryani fills you up with good energy, while chips leave you feeling hungry again quickly!",
  },
];

export function DinnerChoice() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMealInfo, setShowMealInfo] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [hasVoted, setHasVoted] = useState(
    localStorage.getItem("todaysDinnerVote") !== null
  );
  const [mealEaten, setMealEaten] = useState(
    localStorage.getItem("todaysDinnerEaten") === "true"
  );

  const handleVote = (mealId: string) => {
    setSelectedMeal(mealId);
    setShowMealInfo(true);
  };

  const confirmVote = () => {
    if (selectedMeal) {
      localStorage.setItem("todaysDinnerVote", selectedMeal);
      
      const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
      localStorage.setItem("familyPoints", String(currentPoints + 1));
      
      const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
      if (!badges.includes("dinner-helper")) {
        badges.push("dinner-helper");
        localStorage.setItem("earnedBadges", JSON.stringify(badges));
      }
      
      setShowMealInfo(false);
      setHasVoted(true);
    }
  };

  const handleMarkEaten = () => {
    setShowPinPrompt(true);
  };

  const handlePinSubmit = () => {
    if (pin === "👍" || pin === "1234") {
      localStorage.setItem("todaysDinnerEaten", "true");
      setMealEaten(true);
      setShowPinPrompt(false);
      setPin("");
      
      const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
      localStorage.setItem("familyPoints", String(currentPoints + 2));
      
      setShowSuccess(true);
    } else {
      setPin("");
    }
  };

  const selectedMealData = mealOptions.find(m => m.id === selectedMeal) || 
                         mealOptions.find(m => m.id === localStorage.getItem("todaysDinnerVote"));

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
                    Pick what sounds yummy and learn why it's great for you
                  </p>
                </div>
              </div>
              
              {hasVoted && !mealEaten && selectedMealData && (
                <div className="bg-blue-100 rounded-2xl p-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-3xl">{selectedMealData.emoji}</div>
                    <div>
                      <p className="text-blue-800 font-bold text-sm">
                        You chose: {selectedMealData.name}
                      </p>
                      <p className="text-blue-700 text-xs">
                        Did you eat it well?
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkEaten}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Ask Parent: I Ate Well! +2 Points
                  </motion.button>
                </div>
              )}

              {mealEaten && (
                <div className="bg-green-100 rounded-2xl p-3 text-center mt-4">
                  <p className="text-green-800 font-bold text-sm">
                    ✓ Amazing! You ate well today!
                  </p>
                  <p className="text-green-700 text-xs">
                    Your body is getting all the good energy it needs! 💪
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
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <Lightbulb className="w-3 h-3" />
                        <span>Tap to learn why this is great for you!</span>
                      </div>
                    </div>
                  </div>

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
              💪
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              You're Getting Stronger!
            </h2>

            <p className="text-lg text-gray-700 mb-6 text-center px-6">
              Every healthy meal gives your body superpowers for playing, learning, and having fun! 🌟
            </p>

            {selectedMealData && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-6 mb-6 w-full shadow-2xl"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{selectedMealData.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedMealData.name}
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Heart className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-green-800 mb-2">What You Just Did:</div>
                      <p className="text-green-700 text-sm">
                        You gave your body the nutrients it needs to grow strong, play longer, and think better! 🌟
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full mb-6"
            >
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-5 text-center">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800 mb-1">+2 Family Points!</div>
                <div className="text-sm text-orange-700">
                  You helped the team AND ate well! 🎉
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

        {/* Meal Info Modal */}
        <AnimatePresence>
          {showMealInfo && selectedMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setShowMealInfo(false)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full my-8"
              >
                {(() => {
                  const meal = mealOptions.find(m => m.id === selectedMeal)!;
                  return (
                    <>
                      <div className="text-center mb-6">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 0.5, repeat: 3 }}
                          className="text-8xl mb-4"
                        >
                          {meal.emoji}
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {meal.name}
                        </h3>
                        <p className="text-gray-600">{meal.description}</p>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h4 className="font-bold text-gray-800">Why This is Amazing For You:</h4>
                        </div>
                        
                        {meal.benefits.map((benefit, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {benefit.text}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Fun Fact */}
                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0" />
                          <div className="font-bold text-amber-800">Fun Fact!</div>
                        </div>
                        <p className="text-sm text-amber-900">
                          {meal.funFact}
                        </p>
                      </div>

                      {/* Why Better */}
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-6">
                        <div className="flex items-start gap-2 mb-2">
                          <Zap className="w-5 h-5 text-green-700 flex-shrink-0" />
                          <div className="font-bold text-green-800">Smart Choice!</div>
                        </div>
                        <p className="text-sm text-green-900">
                          {meal.whyBetterThanJunk}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={confirmVote}
                          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2"
                        >
                          <Users className="w-5 h-5" />
                          I Choose This! +1 Point
                        </motion.button>
                        
                        <button
                          onClick={() => setShowMealInfo(false)}
                          className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                        >
                          Look at Other Options
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Prompt Modal */}
        <AnimatePresence>
          {showPinPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setShowPinPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Ask a Parent!
                  </h3>
                  <p className="text-gray-600">
                    Did you eat your meal well?
                  </p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center mb-3">
                    Parent PIN: Type <strong>1234</strong> or tap 👍
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPin("👍");
                      setTimeout(handlePinSubmit, 100);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg mb-3"
                  >
                    👍 Child Ate Well
                  </motion.button>

                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="Or type PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handlePinSubmit()}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 text-center font-bold text-lg mb-3"
                    maxLength={4}
                  />

                  <button
                    onClick={handlePinSubmit}
                    className="w-full py-3 bg-orange-500 rounded-full text-white font-bold shadow-lg"
                  >
                    Submit PIN
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowPinPrompt(false);
                    setPin("");
                  }}
                  className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}