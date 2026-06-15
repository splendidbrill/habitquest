import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";

export function CollectiblesViewer() {
  const navigate = useNavigate();
  const [fruitStickers, setFruitStickers] = useState<string[]>([]);
  const [animalBuddies, setAnimalBuddies] = useState<string[]>([]);
  const [superheroAccessories, setSuperheroAccessories] = useState<string[]>([]);

  useEffect(() => {
    const fruits = JSON.parse(localStorage.getItem("fruitStickers") || "[]");
    const animals = JSON.parse(localStorage.getItem("animalBuddies") || "[]");
    const accessories = JSON.parse(localStorage.getItem("superheroAccessories") || "[]");
    
    setFruitStickers(fruits);
    setAnimalBuddies(animals);
    setSuperheroAccessories(accessories);
  }, []);

  const allFruitStickers = ["🍎", "🍌", "🥕", "🍓", "🍊", "🥦", "🍇", "🍉", "🍑", "🥝"];
  const allAnimalBuddies = ["🦁", "🐯", "🐘", "🐵", "🦒", "🐻", "🦘", "🐼"];
  const allSuperheroAccessories = ["🦸‍♂️", "🦸‍♀️", "⚡", "💪", "🦅", "🌟", "👊", "🛡️"];

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200 p-6 py-12">
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
            My Collection! 🎁
          </h1>
          <p className="text-2xl text-gray-700">
            Look at everything you've collected!
          </p>
        </motion.div>

        {/* Fruit Stickers */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Fruit Stickers
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            {fruitStickers.length} / {allFruitStickers.length} collected
          </p>
          
          <div className="grid grid-cols-5 gap-3">
            {allFruitStickers.map((fruit, i) => {
              const isCollected = fruitStickers.includes(fruit);
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`rounded-2xl p-4 text-center ${
                    isCollected 
                      ? "bg-gradient-to-br from-green-400 to-emerald-500" 
                      : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    animate={isCollected ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="text-4xl"
                  >
                    {isCollected ? fruit : "🔒"}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Animal Buddies */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Animal Buddies
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            {animalBuddies.length} / {allAnimalBuddies.length} collected
          </p>
          
          <div className="grid grid-cols-4 gap-3">
            {allAnimalBuddies.map((animal, i) => {
              const isCollected = animalBuddies.includes(animal);
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className={`rounded-2xl p-4 text-center ${
                    isCollected 
                      ? "bg-gradient-to-br from-orange-400 to-amber-500" 
                      : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    animate={isCollected ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="text-4xl"
                  >
                    {isCollected ? animal : "🔒"}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Superhero Accessories */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Superhero Items
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            {superheroAccessories.length} / {allSuperheroAccessories.length} collected
          </p>
          
          <div className="grid grid-cols-4 gap-3">
            {allSuperheroAccessories.map((item, i) => {
              const isCollected = superheroAccessories.includes(item);
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className={`rounded-2xl p-4 text-center ${
                    isCollected 
                      ? "bg-gradient-to-br from-purple-400 to-pink-500" 
                      : "bg-gray-200"
                  }`}
                >
                  <motion.div
                    animate={isCollected ? {
                      scale: [1, 1.3, 1],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="text-4xl"
                  >
                    {isCollected ? item : "🔒"}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-amber-300 to-orange-300 rounded-3xl p-8 shadow-2xl text-center"
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
            className="text-7xl mb-4"
          >
            ⭐
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-3">
            Keep Exploring!
          </h3>
          <p className="text-xl text-white/90">
            Play more games to collect everything! 🎮
          </p>
        </motion.div>
      </div>
    </div>
  );
}
