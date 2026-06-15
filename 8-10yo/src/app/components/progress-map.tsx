import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star } from "lucide-react";

const worlds = [
  {
    id: "garden",
    name: "Garden World",
    emoji: "🌻",
    color: "from-green-400 to-emerald-500",
    requiredStars: 0,
  },
  {
    id: "jungle",
    name: "Jungle World",
    emoji: "🌴",
    color: "from-orange-400 to-amber-500",
    requiredStars: 10,
  },
  {
    id: "hero",
    name: "Hero Training Camp",
    emoji: "🦸",
    color: "from-purple-400 to-pink-500",
    requiredStars: 25,
  },
  {
    id: "mountain",
    name: "Mountain Peak",
    emoji: "⛰️",
    color: "from-blue-400 to-cyan-500",
    requiredStars: 50,
  },
  {
    id: "space",
    name: "Space Station",
    emoji: "🚀",
    color: "from-indigo-400 to-purple-500",
    requiredStars: 100,
  },
];

export function ProgressMap() {
  const navigate = useNavigate();
  const [totalStars, setTotalStars] = useState(0);
  const [adventures, setAdventures] = useState(0);

  useEffect(() => {
    const stars = parseInt(localStorage.getItem("totalStars") || "0");
    const adventureCount = parseInt(localStorage.getItem("adventuresCompleted") || "0");
    setTotalStars(stars);
    setAdventures(adventureCount);
  }, []);

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-purple-200 p-6 py-12">
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
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-6xl"
          >
            {buddyEmoji}
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            My Adventure Map! 🗺️
          </h1>
          <p className="text-2xl text-gray-700">
            See how far you've explored!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-6xl mb-3"
            >
              ⭐
            </motion.div>
            <div className="text-4xl font-bold text-amber-600 mb-1">
              {totalStars}
            </div>
            <div className="text-lg text-gray-600">
              Stars
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-2xl text-center"
          >
            <div className="text-6xl mb-3">🎯</div>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {adventures}
            </div>
            <div className="text-lg text-gray-600">
              Adventures
            </div>
          </motion.div>
        </div>

        {/* World Map Path */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Journey 🌟
          </h2>

          <div className="space-y-6">
            {worlds.map((world, index) => {
              const isUnlocked = totalStars >= world.requiredStars;
              const isCurrent = totalStars >= world.requiredStars && 
                               (index === worlds.length - 1 || totalStars < worlds[index + 1].requiredStars);

              return (
                <div key={world.id}>
                  <motion.div
                    initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`relative rounded-3xl p-6 shadow-xl ${
                      isUnlocked 
                        ? `bg-gradient-to-r ${world.color}` 
                        : "bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={isUnlocked ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className="text-7xl"
                      >
                        {isUnlocked ? world.emoji : "🔒"}
                      </motion.div>

                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 ${
                          isUnlocked ? "text-white" : "text-gray-500"
                        }`}>
                          {world.name}
                        </h3>
                        
                        {isUnlocked ? (
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-white fill-white" />
                            <span className="text-xl text-white font-bold">
                              Unlocked!
                            </span>
                          </div>
                        ) : (
                          <div className="text-lg text-gray-600">
                            Need {world.requiredStars} stars
                          </div>
                        )}
                      </div>

                      {isCurrent && (
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="text-5xl"
                        >
                          👆
                        </motion.div>
                      )}
                    </div>

                    {/* Progress bar to next world */}
                    {isUnlocked && index < worlds.length - 1 && (
                      <div className="mt-4">
                        <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="bg-white h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(
                                ((totalStars - world.requiredStars) / 
                                (worlds[index + 1].requiredStars - world.requiredStars)) * 100,
                                100
                              )}%`
                            }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                        <p className="text-sm text-white/80 mt-2 text-center">
                          {worlds[index + 1].requiredStars - totalStars > 0 
                            ? `${worlds[index + 1].requiredStars - totalStars} more stars to next world!`
                            : "Next world unlocked!"
                          }
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Path connector */}
                  {index < worlds.length - 1 && (
                    <div className="flex justify-center py-3">
                      <div className={`w-1 h-8 rounded-full ${
                        totalStars >= worlds[index + 1].requiredStars 
                          ? "bg-gradient-to-b from-green-400 to-blue-400" 
                          : "bg-gray-300"
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl p-8 shadow-2xl text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-3">
            You're Amazing!
          </h3>
          <p className="text-xl text-white/90">
            Keep exploring to unlock all the worlds! 🌟
          </p>
        </motion.div>

        {/* Floating stars */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100 }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute text-4xl opacity-20 pointer-events-none"
            style={{ left: `${Math.random() * 100}%` }}
          >
            {i % 2 === 0 ? "⭐" : "✨"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
