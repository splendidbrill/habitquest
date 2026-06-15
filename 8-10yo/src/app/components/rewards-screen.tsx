import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Award, Sparkles } from "lucide-react";

const allBadges = [
  {
    id: "fruit-explorer",
    emoji: "🍎",
    name: "Fruit Explorer",
    color: "from-red-400 to-pink-500",
    description: "Tried new fruits!",
  },
  {
    id: "dance-champion",
    emoji: "💃",
    name: "Dance Champion",
    color: "from-purple-400 to-pink-500",
    description: "Danced 5 times!",
  },
  {
    id: "super-jumper",
    emoji: "🦘",
    name: "Super Jumper",
    color: "from-orange-400 to-amber-500",
    description: "Jumped like animals!",
  },
  {
    id: "dinner-helper",
    emoji: "🍽️",
    name: "Dinner Helper",
    color: "from-blue-400 to-cyan-500",
    description: "Chose healthy dinner!",
  },
  {
    id: "veggie-explorer",
    emoji: "🥦",
    name: "Veggie Explorer",
    color: "from-green-400 to-emerald-500",
    description: "Tried veggies twice!",
  },
  {
    id: "kitchen-champion",
    emoji: "👨‍🍳",
    name: "Kitchen Champion",
    color: "from-yellow-400 to-orange-500",
    description: "Helped in the kitchen!",
  },
  {
    id: "adventure-star",
    emoji: "🌟",
    name: "Adventure Star",
    color: "from-indigo-400 to-purple-500",
    description: "Completed missions!",
  },
  {
    id: "playground-hero",
    emoji: "⚽",
    name: "Playground Hero",
    color: "from-teal-400 to-cyan-500",
    description: "Played outside!",
  },
  {
    id: "superhero-trainer",
    emoji: "🦸",
    name: "Superhero Trainer",
    color: "from-purple-400 to-pink-500",
    description: "Completed superhero training!",
  },
];

export function RewardsScreen() {
  const navigate = useNavigate();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [adventures, setAdventures] = useState(0);

  useEffect(() => {
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    const stars = parseInt(localStorage.getItem("totalStars") || "0");
    const adventureCount = parseInt(localStorage.getItem("adventuresCompleted") || "0");
    
    setEarnedBadges(badges);
    setTotalStars(stars);
    setAdventures(adventureCount);
  }, []);

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 p-6 py-12">
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

        {/* Big Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            My Rewards! 🏆
          </h1>
          <p className="text-2xl text-gray-700">
            Look what you earned!
          </p>
        </motion.div>

        {/* Stars Collection - BIG */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-white rounded-3xl p-8 shadow-2xl mb-6 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="text-8xl mb-4"
          >
            ⭐
          </motion.div>
          <div className="text-5xl font-bold text-amber-600 mb-2">
            {totalStars}
          </div>
          <div className="text-2xl text-gray-700">
            Stars Collected!
          </div>
        </motion.div>

        {/* Adventures Count */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl p-6 shadow-2xl mb-8 text-center"
        >
          <div className="text-6xl mb-3">🎯</div>
          <div className="text-4xl font-bold text-white mb-2">
            {adventures}
          </div>
          <div className="text-xl text-white/90">
            Adventures Complete!
          </div>
        </motion.div>

        {/* Badges Title */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl font-bold text-gray-800">
            My Badges! 🎖️
          </h2>
        </motion.div>

        {/* Badge Grid - BIG AND COLORFUL */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {allBadges.map((badge, index) => {
            const isEarned = earnedBadges.includes(badge.id);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                className={`rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden ${
                  isEarned 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : "bg-gray-200"
                }`}
              >
                {isEarned ? (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className="text-7xl mb-3"
                    >
                      {badge.emoji}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-white/80">
                      {badge.description}
                    </p>

                    {/* Sparkle */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute top-2 right-2 text-3xl"
                    >
                      ✨
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="text-7xl mb-3 opacity-30">🔒</div>
                    <h3 className="text-lg font-bold text-gray-500 mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Keep exploring!
                    </p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center"
        >
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            You're Amazing! 🌟
          </h3>
          <p className="text-xl text-gray-700">
            Keep going on adventures to earn more badges and stars!
          </p>
        </motion.div>

        {/* Floating Stars */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100 }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute text-4xl opacity-20 pointer-events-none"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "✨" : "🌟"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}