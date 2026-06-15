import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";

const games = [
  {
    id: "fruit-snake",
    title: "Fruit Snake Explorer",
    emoji: "🐍",
    description: "Collect yummy fruits!",
    color: "from-green-400 to-emerald-500",
    bgEmoji: "🍎",
  },
  {
    id: "jungle-runner",
    title: "Jungle Adventure",
    emoji: "🦁",
    description: "Run through the jungle!",
    color: "from-orange-400 to-amber-500",
    bgEmoji: "🌴",
  },
  {
    id: "superhero-workout",
    title: "Superhero Training",
    emoji: "🦸",
    description: "Be a superhero!",
    color: "from-purple-400 to-pink-500",
    bgEmoji: "⚡",
  },
  {
    id: "archery-food",
    title: "Healthy Food Archery",
    emoji: "🏹",
    description: "Shoot healthy foods!",
    color: "from-blue-400 to-purple-500",
    bgEmoji: "🎯",
  },
];

export function GameHub() {
  const navigate = useNavigate();

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-100 to-blue-200 p-6 py-12">
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
            Game Time! 🎮
          </h1>
          <p className="text-2xl text-gray-700">
            Pick a fun game to play!
          </p>
        </motion.div>

        {/* Game Cards */}
        <div className="space-y-6 mb-8">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/game/${game.id}`)}
              className={`w-full bg-gradient-to-r ${game.color} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
            >
              {/* Background decorative emoji */}
              <div className="absolute top-2 right-2 text-6xl opacity-20">
                {game.bgEmoji}
              </div>
              <div className="absolute bottom-2 left-2 text-6xl opacity-20">
                {game.bgEmoji}
              </div>

              <div className="flex items-center gap-6 relative z-10">
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
                  className="text-8xl"
                >
                  {game.emoji}
                </motion.div>
                <div className="flex-1 text-left">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-xl text-white/90">
                    {game.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Progress Map Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/progress-map")}
          className="w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="text-6xl">🗺️</div>
            <div className="text-3xl font-bold text-white">
              My Adventure Map
            </div>
          </div>
        </motion.button>

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
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
              delay: i * 0.4,
            }}
            className="absolute text-4xl opacity-30 pointer-events-none"
            style={{ left: `${Math.random() * 100}%` }}
          >
            {i % 2 === 0 ? "⭐" : "✨"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
