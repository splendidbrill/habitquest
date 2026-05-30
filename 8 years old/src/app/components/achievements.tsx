import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Trophy, Award, Star, Target, Lock } from "lucide-react";

const allBadges = [
  {
    id: "dinner-helper",
    emoji: "🍽️",
    name: "Meal Master",
    description: "Made a smart meal choice",
    color: "from-orange-500 to-red-500",
    category: "Nutrition",
  },
  {
    id: "veggie-explorer",
    emoji: "🥦",
    name: "Veggie Champion",
    description: "Completed veggie challenge",
    color: "from-green-500 to-emerald-500",
    category: "Nutrition",
  },
  {
    id: "kitchen-champion",
    emoji: "👨‍🍳",
    name: "Kitchen Pro",
    description: "Helped with meal prep",
    color: "from-amber-500 to-orange-500",
    category: "Teamwork",
  },
  {
    id: "fuel-master",
    emoji: "⚡",
    name: "Fuel Expert",
    description: "Learned about performance nutrition",
    color: "from-blue-500 to-cyan-500",
    category: "Knowledge",
  },
  {
    id: "lunch-builder",
    emoji: "🍱",
    name: "Lunch Builder",
    description: "Created a balanced lunchbox",
    color: "from-purple-500 to-pink-500",
    category: "Nutrition",
  },
  {
    id: "school-smart",
    emoji: "🎒",
    name: "School Smart",
    description: "Made smart choices at school",
    color: "from-teal-500 to-cyan-500",
    category: "Independence",
  },
  {
    id: "first-mission",
    emoji: "🎯",
    name: "First Mission",
    description: "Completed your first training",
    color: "from-purple-500 to-pink-500",
    category: "Training",
  },
  {
    id: "week-warrior",
    emoji: "🔥",
    name: "Week Warrior",
    description: "7 day active streak",
    color: "from-red-500 to-orange-500",
    category: "Consistency",
  },
  {
    id: "team-player",
    emoji: "🤝",
    name: "Team Player",
    description: "Earned 50 family points",
    color: "from-teal-500 to-cyan-500",
    category: "Teamwork",
  },
  {
    id: "rising-star",
    emoji: "⭐",
    name: "Rising Star",
    description: "Reached Rising Star level",
    color: "from-yellow-400 to-orange-400",
    category: "Progress",
  },
  {
    id: "swap-master",
    emoji: "🔄",
    name: "Swap Master",
    description: "Learning healthy alternatives",
    color: "from-orange-500 to-amber-500",
    category: "Knowledge",
  },
  {
    id: "energy-tracker",
    emoji: "📊",
    name: "Energy Tracker",
    description: "Tracking daily fuel and activity",
    color: "from-emerald-500 to-green-500",
    category: "Independence",
  },
];

export function Achievements() {
  const navigate = useNavigate();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState("Rookie");

  useEffect(() => {
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    setEarnedBadges(badges);

    const points = parseInt(localStorage.getItem("userXP") || "0");
    setTotalPoints(points);

    if (points >= 500) setLevel("All-Star");
    else if (points >= 200) setLevel("Pro");
    else if (points >= 50) setLevel("Starter");
    else setLevel("Rookie");
  }, []);

  const earnedCount = earnedBadges.length;
  const totalCount = allBadges.length;
  const completionPercent = (earnedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-white">Trophy Cabinet 🏆</h1>
          <div className="w-12" />
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-6 shadow-2xl mb-8"
        >
          <div className="text-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">{level}</h2>
            <p className="text-yellow-100 text-lg">{totalPoints} Total Points</p>
          </div>

          <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-center text-yellow-100 text-sm">
            {earnedCount} of {totalCount} badges unlocked
          </p>
        </motion.div>

        {/* Achievement Categories */}
        <div className="space-y-6">
          {["Training", "Nutrition", "Teamwork", "Knowledge", "Consistency", "Progress", "Independence"].map((category, catIndex) => {
            const categoryBadges = allBadges.filter(b => b.category === category);
            if (categoryBadges.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  {category}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {categoryBadges.map((badge) => {
                    const isEarned = earnedBadges.includes(badge.id);
                    
                    return (
                      <motion.div
                        key={badge.id}
                        whileHover={{ scale: isEarned ? 1.05 : 1 }}
                        className={`rounded-2xl p-5 text-center relative overflow-hidden ${
                          isEarned
                            ? `bg-gradient-to-br ${badge.color} shadow-xl`
                            : "bg-white/5 backdrop-blur-sm border border-white/10"
                        }`}
                      >
                        {!isEarned && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white/60" />
                          </div>
                        )}
                        
                        <motion.div
                          animate={
                            isEarned
                              ? {
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className={`text-5xl mb-3 ${!isEarned && "grayscale opacity-30"}`}
                        >
                          {badge.emoji}
                        </motion.div>
                        
                        <h4
                          className={`font-bold mb-1 text-sm ${
                            isEarned ? "text-white" : "text-white/40"
                          }`}
                        >
                          {badge.name}
                        </h4>
                        
                        <p
                          className={`text-xs ${
                            isEarned ? "text-white/90" : "text-white/30"
                          }`}
                        >
                          {badge.description}
                        </p>

                        {isEarned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Award className="w-5 h-5 text-yellow-300" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Trophy className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Keep Going!</h4>
              <p className="text-blue-100 text-sm">
                Every badge represents a step toward becoming your best self. Champions are made one day at a time! 💪
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}