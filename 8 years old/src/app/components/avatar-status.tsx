import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Award, Sparkles, ArrowLeft } from "lucide-react";

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

const allUnlockables = [
  { id: 1, emoji: "⚽", name: "Football Star Badge", level: 1 },
  { id: 2, emoji: "🚴", name: "Cyclist Cape", level: 1 },
  { id: 3, emoji: "🏃", name: "Running Shoes", level: 1 },
  { id: 4, emoji: "🏏", name: "Cricket Champion Hat", level: 2 },
  { id: 5, emoji: "🏊", name: "Swimmer Goggles", level: 2 },
  { id: 6, emoji: "🎒", name: "Explorer Backpack", level: 3 },
  { id: 7, emoji: "💃", name: "Dancer Badge", level: 3 },
  { id: 8, emoji: "🏸", name: "Champion Racket", level: 4 },
  { id: 9, emoji: "🎨", name: "Creative Star", level: 5 },
  { id: 10, emoji: "🌟", name: "Super Explorer", level: 7 },
  { id: 11, emoji: "🏆", name: "Amazing Hero", level: 10 },
  { id: 12, emoji: "👑", name: "Adventure King", level: 15 },
];

export function AvatarStatus() {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);
  
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

  useEffect(() => {
    const count = parseInt(localStorage.getItem("completedMissions") || "0");
    setCompletedCount(count);
  }, []);

  const avatarSize = Math.min(20 + completedCount * 2, 32);
  const unlockedItems = allUnlockables.filter(item => completedCount >= item.level);
  const lockedItems = allUnlockables.filter(item => completedCount < item.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-gray-800">Your Adventure Buddy</h1>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Avatar Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className={`inline-block ${colorClasses[avatarColor]} rounded-full flex items-center justify-center shadow-2xl mb-4 relative`}
              style={{ width: `${avatarSize * 5}px`, height: `${avatarSize * 5}px` }}
            >
              <span style={{ fontSize: `${avatarSize * 1.2}px` }}>{avatarEmojis[selectedAvatar]}</span>
              
              {/* Level badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-4 py-2 shadow-lg"
              >
                <span className="text-lg font-bold text-white">Level {Math.min(completedCount, 20)}</span>
              </motion.div>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
              {selectedAvatar === "tiger" ? "Tiger Cub" : selectedAvatar === "monkey" ? "Monkey Explorer" : "Elephant Buddy"}
            </h2>
            <p className="text-gray-600">
              Growing stronger with every adventure!
            </p>
          </div>
        </motion.div>

        {/* Adventure Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-600" />
            Your Journey
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-4 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-1">
                {completedCount}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Adventures Complete
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl p-4 text-center">
              <div className="text-4xl font-bold text-teal-600 mb-1">
                {unlockedItems.length}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Items Unlocked
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unlocked Items */}
        {unlockedItems.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-xl mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-teal-600" />
              Your Collection
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {unlockedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-gradient-to-br from-orange-400 to-teal-400 rounded-2xl p-4 text-center shadow-lg"
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {item.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked Items - What's Coming */}
        {lockedItems.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-xl mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Coming Soon!
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {lockedItems.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-gray-200 rounded-2xl p-4 text-center"
                >
                  <div className="text-4xl mb-2 opacity-40">{item.emoji}</div>
                  <div className="text-xs font-bold text-gray-500 leading-tight">
                    Level {item.level}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Keep having adventures to unlock more! 🌟
              </p>
            </div>
          </motion.div>
        )}

        {/* Back to Mission */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/mission")}
          className="w-full py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-xl font-bold text-white shadow-2xl"
        >
          Back to Adventures! 🚀
        </motion.button>
      </div>
    </div>
  );
}