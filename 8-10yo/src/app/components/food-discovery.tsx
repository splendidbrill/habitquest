import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const foods = [
  {
    id: "carrot",
    emoji: "🥕",
    name: "Carrot",
    color: "from-orange-400 to-orange-600",
    reaction: "Crunch crunch! 🦁 loves carrots!",
    superpower: "Helps you see in the dark! 👀",
    tastyWith: "Try with hummus for dipping or in a yummy wrap!",
    whyBetter: "Better than crisps - carrots make your eyes super strong and give crunchy fun without making you sleepy!",
    funFact: "Carrots help you run faster and see better when you play outside! 🏃",
  },
  {
    id: "apple",
    emoji: "🍎",
    name: "Apple",
    color: "from-red-400 to-red-600",
    reaction: "So crunchy! 🦁 says YUM!",
    superpower: "Makes you strong! 💪",
    tastyWith: "Slice it and add peanut butter or eat with cheese cubes!",
    whyBetter: "Better than sweets - apples are naturally sweet AND make your tummy happy for playtime!",
    funFact: "One apple gives you energy to play for hours without feeling tired! ⚡",
  },
  {
    id: "broccoli",
    emoji: "🥦",
    name: "Broccoli",
    color: "from-green-400 to-green-600",
    reaction: "Tiny trees! 🦁 loves it!",
    superpower: "Helps you grow tall! 🌟",
    tastyWith: "Mix with pasta and cheese or dip in ranch sauce!",
    whyBetter: "Better than chips - broccoli helps you grow tall and strong like a superhero!",
    funFact: "Broccoli is like a tiny forest that makes your muscles super powerful! 💪",
  },
  {
    id: "banana",
    emoji: "🍌",
    name: "Banana",
    color: "from-yellow-300 to-yellow-500",
    reaction: "So sweet! 🦁 does a happy dance!",
    superpower: "Gives you energy to play! ⚡",
    tastyWith: "Mash on toast, blend in smoothies, or freeze for a treat!",
    whyBetter: "Better than chocolate bars - bananas give you zoom energy for running without the sugar crash!",
    funFact: "Athletes eat bananas to run super fast - just like you on the playground! 🏃",
  },
  {
    id: "tomato",
    emoji: "🍅",
    name: "Tomato",
    color: "from-red-400 to-rose-500",
    reaction: "Juicy and yummy! 🦁 smiles!",
    superpower: "Keeps your heart strong! ❤️",
    tastyWith: "Add to sandwiches, eat with mozzarella, or in yummy pasta sauce!",
    whyBetter: "Better than ketchup - fresh tomatoes are juicy and make your heart super healthy!",
    funFact: "Tomatoes help your brain work amazingly at school! 🧠",
  },
  {
    id: "grapes",
    emoji: "🍇",
    name: "Grapes",
    color: "from-purple-400 to-purple-600",
    reaction: "Pop pop! 🦁 loves grapes!",
    superpower: "Makes you super healthy! ✨",
    tastyWith: "Freeze them for icy pops or mix in fruit salad!",
    whyBetter: "Better than gummy sweets - grapes are naturally sweet AND keep you bouncing with energy!",
    funFact: "Each grape is like a tiny water balloon that keeps you hydrated for play! 💧",
  },
];

export function FoodDiscovery() {
  const navigate = useNavigate();
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [discoveredFoods, setDiscoveredFoods] = useState<string[]>(
    JSON.parse(localStorage.getItem("discoveredFoods") || "[]")
  );

  const handleFoodTap = (foodId: string) => {
    setSelectedFood(foodId);
    setShowReaction(true);

    // Mark as discovered
    if (!discoveredFoods.includes(foodId)) {
      const newDiscovered = [...discoveredFoods, foodId];
      setDiscoveredFoods(newDiscovered);
      localStorage.setItem("discoveredFoods", JSON.stringify(newDiscovered));
      
      // Add star
      const stars = parseInt(localStorage.getItem("totalStars") || "0");
      localStorage.setItem("totalStars", String(stars + 1));
    }

    // Auto-close after animation
    setTimeout(() => {
      setShowReaction(false);
    }, 3000);
  };

  const selectedFoodData = foods.find(f => f.id === selectedFood);
  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-emerald-200 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/home")}
            className="bg-white rounded-full p-4 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          <div className="text-6xl">{buddyEmoji}</div>
        </div>

        {/* Big Simple Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Food Discovery! 🍎
          </h1>
          <p className="text-2xl text-gray-700">
            Tap foods to explore!
          </p>
        </motion.div>

        {/* Food Grid - BIG AND COLORFUL */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {foods.map((food, index) => {
            const isDiscovered = discoveredFoods.includes(food.id);
            
            return (
              <motion.button
                key={food.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFoodTap(food.id)}
                className={`bg-gradient-to-br ${food.color} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  className="text-7xl mb-3"
                >
                  {food.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-white">
                  {food.name}
                </h3>

                {/* Discovery Star */}
                {isDiscovered && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-2 right-2 text-4xl"
                  >
                    ⭐
                  </motion.div>
                )}

                {/* Sparkle animation */}
                <div className="absolute top-2 left-2 text-3xl opacity-40">✨</div>
              </motion.button>
            );
          })}
        </div>

        {/* Progress Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl text-center"
        >
          <div className="text-5xl mb-3">🌟</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {discoveredFoods.length} / {foods.length} Foods Explored!
          </div>
          <div className="text-xl text-gray-600">
            You're an amazing explorer! 🎉
          </div>
        </motion.div>

        {/* Reaction Modal - FULL SCREEN */}
        <AnimatePresence>
          {showReaction && selectedFoodData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300 flex items-center justify-center z-50 p-6"
              onClick={() => setShowReaction(false)}
            >
              {/* Confetti */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                  animate={{ y: window.innerHeight, rotate: 720, opacity: 0 }}
                  transition={{ duration: 2, delay: Math.random() * 0.5 }}
                  className="absolute text-4xl"
                >
                  {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "✨" : "🌟"}
                </motion.div>
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center"
              >
                {/* Buddy Reaction */}
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 15, 0],
                    scale: [1, 1.3, 1, 1.3, 1],
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="text-9xl mb-6"
                >
                  {buddyEmoji}
                </motion.div>

                {/* Food */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-9xl mb-6"
                >
                  {selectedFoodData.emoji}
                </motion.div>

                {/* Reaction Text - BIG */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-8 shadow-2xl max-w-md"
                >
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {selectedFoodData.reaction}
                  </h2>

                  {/* Superpower */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl text-purple-900 font-bold mb-3">
                      {selectedFoodData.superpower}
                    </p>
                    <p className="text-lg text-purple-800">
                      {selectedFoodData.funFact}
                    </p>
                  </div>

                  {/* Tasty Combinations */}
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-5 mb-4">
                    <div className="text-3xl mb-2">😋</div>
                    <p className="text-xl font-bold text-orange-900 mb-2">Tasty Ideas:</p>
                    <p className="text-base text-orange-800">
                      {selectedFoodData.tastyWith}
                    </p>
                  </div>

                  {/* Why Better */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-5">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-xl font-bold text-green-900 mb-2">Smart Choice!</p>
                    <p className="text-base text-green-800">
                      {selectedFoodData.whyBetter}
                    </p>
                  </div>
                </motion.div>

                {/* Tap to close hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-2xl text-white font-bold mt-6"
                >
                  Tap anywhere to continue! ✨
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
