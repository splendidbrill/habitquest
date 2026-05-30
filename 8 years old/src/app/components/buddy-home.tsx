import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Map, Award, Apple } from "lucide-react";
import { Users } from "lucide-react";

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

const avatarNames: { [key: string]: string } = {
  tiger: "Tiger Cub",
  monkey: "Monkey Explorer",
  elephant: "Elephant Buddy",
};

const allUnlockables = [
  { id: 1, emoji: "⚽", name: "Football Star", level: 1, slot: "badge" },
  { id: 2, emoji: "🚴", name: "Cyclist Cape", level: 1, slot: "outfit" },
  { id: 3, emoji: "🏃", name: "Running Shoes", level: 1, slot: "shoes" },
  { id: 4, emoji: "🏏", name: "Cricket Hat", level: 2, slot: "hat" },
  { id: 5, emoji: "🏊", name: "Goggles", level: 2, slot: "accessory" },
  { id: 6, emoji: "🎒", name: "Backpack", level: 3, slot: "accessory" },
  { id: 7, emoji: "💃", name: "Dancer", level: 3, slot: "badge" },
  { id: 8, emoji: "🏸", name: "Racket", level: 4, slot: "accessory" },
  { id: 9, emoji: "🎨", name: "Artist", level: 5, slot: "badge" },
  { id: 10, emoji: "🌟", name: "Explorer", level: 7, slot: "badge" },
  { id: 11, emoji: "🏆", name: "Hero", level: 10, slot: "badge" },
  { id: 12, emoji: "👑", name: "Crown", level: 15, slot: "hat" },
];

const foodPrompts = [
  {
    emoji: "🥭",
    title: "Mango Magic!",
    subtitle: "Have you tried mango today?",
    color: "from-orange-400 to-yellow-400",
  },
  {
    emoji: "🥒",
    title: "Crunchy Adventure",
    subtitle: "What makes the crunchiest sound?",
    color: "from-green-400 to-lime-400",
  },
  {
    emoji: "🍇",
    title: "Color Explorer",
    subtitle: "Find something purple to eat!",
    color: "from-purple-400 to-pink-400",
  },
  {
    emoji: "🥕",
    title: "Orange Power",
    subtitle: "Carrots make you see in the dark!",
    color: "from-orange-500 to-red-400",
  },
  {
    emoji: "🫘",
    title: "Dal Detective",
    subtitle: "Which dal is your favorite?",
    color: "from-amber-400 to-orange-400",
  },
  {
    emoji: "🍎",
    title: "Apple Crunch",
    subtitle: "Red or green apple today?",
    color: "from-red-400 to-rose-400",
  },
  {
    emoji: "🥛",
    title: "Milk Time",
    subtitle: "Growing strong like your buddy!",
    color: "from-blue-200 to-cyan-200",
  },
  {
    emoji: "🍚",
    title: "Rice & Nice",
    subtitle: "What's your favorite with rice?",
    color: "from-teal-300 to-green-300",
  },
];

export function BuddyHome() {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [todaysFood] = useState(foodPrompts[Math.floor(Math.random() * foodPrompts.length)]);
  
  const selectedAvatar = localStorage.getItem("selectedAvatar") || "tiger";
  const avatarColor = localStorage.getItem("avatarColor") || "orange";

  const colorClasses: { [key: string]: string } = {
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  const colorGradients: { [key: string]: string } = {
    orange: "from-orange-400 to-amber-400",
    teal: "from-teal-400 to-cyan-400",
    purple: "from-purple-400 to-fuchsia-400",
    red: "from-red-400 to-rose-400",
    green: "from-green-400 to-emerald-400",
    blue: "from-blue-400 to-indigo-400",
  };

  useEffect(() => {
    const count = parseInt(localStorage.getItem("completedMissions") || "0");
    setCompletedCount(count);
  }, []);

  const avatarSize = Math.min(20 + completedCount * 2, 32);
  const unlockedItems = allUnlockables.filter(item => completedCount >= item.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-orange-100 to-teal-200 p-6 py-12 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute text-4xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "🪁" : "✨"}
          </motion.div>
        ))}
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back! 🌟
          </h1>
          <p className="text-lg text-gray-700">
            Your buddy is excited to see you!
          </p>
        </motion.div>

        {/* Main Buddy Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="bg-white rounded-3xl p-8 shadow-2xl mb-6 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">⭐</div>
            <div className="absolute bottom-4 right-4 text-6xl">✨</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">🪁</div>
          </div>

          <div className="relative z-10 text-center">
            {/* Buddy Avatar */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="inline-block relative mb-6"
            >
              <div className={`bg-gradient-to-br ${colorGradients[avatarColor]} rounded-full flex items-center justify-center shadow-2xl relative`}
                style={{ width: `${avatarSize * 6}px`, height: `${avatarSize * 6}px` }}
              >
                <span style={{ fontSize: `${avatarSize * 1.5}px` }}>{avatarEmojis[selectedAvatar]}</span>
                
                {/* Level badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-4 py-2 shadow-lg"
                >
                  <span className="text-lg font-bold text-white">Level {Math.min(completedCount, 20)}</span>
                </motion.div>

                {/* Worn outfit */}
                {selectedOutfit !== null && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-6 -right-6 text-5xl"
                  >
                    {unlockedItems.find(item => item.id === selectedOutfit)?.emoji}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {avatarNames[selectedAvatar]}
            </h2>
            <p className="text-gray-600 mb-6">
              Ready for today's adventure!
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-3">
                <div className="text-2xl font-bold text-orange-600">{completedCount}</div>
                <div className="text-xs text-gray-700">Adventures</div>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl p-3">
                <div className="text-2xl font-bold text-teal-600">{unlockedItems.length}</div>
                <div className="text-xs text-gray-700">Items</div>
              </div>
            </div>

            {/* Wardrobe button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWardrobe(!showWardrobe)}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              {showWardrobe ? "Close Wardrobe" : "Open Wardrobe"}
            </motion.button>
          </div>
        </motion.div>

        {/* Wardrobe Panel */}
        <AnimatePresence>
          {showWardrobe && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl mb-6 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Dress Your Buddy
                </h3>

                {unlockedItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Remove outfit option */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedOutfit(null)}
                      className={`${selectedOutfit === null ? 'bg-gradient-to-br from-gray-400 to-gray-500 ring-4 ring-gray-300' : 'bg-gray-200'} rounded-2xl p-4 text-center shadow-lg`}
                    >
                      <div className="text-3xl mb-1">✨</div>
                      <div className="text-xs font-bold text-gray-700">No Outfit</div>
                    </motion.button>

                    {unlockedItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOutfit(item.id)}
                        className={`${selectedOutfit === item.id ? 'bg-gradient-to-br from-orange-400 to-teal-400 ring-4 ring-amber-300' : 'bg-gradient-to-br from-orange-300 to-teal-300'} rounded-2xl p-4 text-center shadow-lg`}
                      >
                        <div className="text-3xl mb-1">{item.emoji}</div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎁</div>
                    <p className="text-gray-600">
                      Complete adventures to unlock items for your buddy!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Food Curiosity Card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Food Adventures!</h3>
          </div>

          {/* Today's Food Prompt */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${todaysFood.color} rounded-2xl p-6 text-center shadow-lg mb-4`}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-6xl mb-3"
            >
              {todaysFood.emoji}
            </motion.div>
            <h4 className="text-xl font-bold text-white mb-2">
              {todaysFood.title}
            </h4>
            <p className="text-white/90 text-sm">
              {todaysFood.subtitle}
            </p>
          </motion.div>

          {/* Food Feature Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dinner")}
              className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-4 text-center shadow-lg"
            >
              <div className="text-3xl mb-1">🍽️</div>
              <div className="text-xs font-bold text-white">Choose Dinner</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/veggie")}
              className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl p-4 text-center shadow-lg"
            >
              <div className="text-3xl mb-1">🥦</div>
              <div className="text-xs font-bold text-white">Veggie Quest</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/kitchen")}
              className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-4 text-center shadow-lg"
            >
              <div className="text-3xl mb-1">👨‍🍳</div>
              <div className="text-xs font-bold text-white">Help Cook</div>
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Trying new foods is an adventure too! 🌈
          </p>
        </motion.div>

        {/* Family Points Display */}
        {parseInt(localStorage.getItem("familyPoints") || "0") > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-sm text-gray-600">Team Points</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {localStorage.getItem("familyPoints") || "0"}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🏆</div>
                <div className="text-xs text-gray-600">Helping Together!</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/mission")}
            className="w-full py-6 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-2xl font-bold text-white shadow-2xl flex items-center justify-center gap-3"
          >
            <Map className="w-7 h-7" />
            Today's Adventure!
            <Sparkles className="w-7 h-7" />
          </motion.button>

          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/status")}
            className="w-full py-4 bg-white rounded-full text-lg font-bold text-gray-700 shadow-lg border-4 border-orange-200"
          >
            See All Your Achievements 🏆
          </motion.button>
        </div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-lg text-gray-700 font-medium">
            Every day is a new adventure! 🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
}