import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Target, Zap, Award, Calendar, Flame } from "lucide-react";

export function ProgressTracker() {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState("Rookie");
  const [nextLevel, setNextLevel] = useState("Starter");
  const [pointsToNext, setPointsToNext] = useState(50);
  const [weeklyProgress, setWeeklyProgress] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const points = parseInt(localStorage.getItem("userXP") || "0");
    setTotalPoints(points);

    // Calculate level and progress with XP-based system
    if (points >= 500) {
      setLevel("All-Star");
      setNextLevel("Legend");
      setPointsToNext(1000 - points);
    } else if (points >= 200) {
      setLevel("Pro");
      setNextLevel("All-Star");
      setPointsToNext(500 - points);
    } else if (points >= 50) {
      setLevel("Starter");
      setNextLevel("Pro");
      setPointsToNext(200 - points);
    } else {
      setLevel("Rookie");
      setNextLevel("Starter");
      setPointsToNext(50 - points);
    }

    // Mock weekly progress (in real app, track daily points)
    setWeeklyProgress([3, 5, 4, 6, 8, 7, points % 10]);
  }, []);

  const levelProgress = level === "Rookie" 
    ? (totalPoints / 50) * 100
    : level === "Starter"
    ? ((totalPoints - 50) / 150) * 100
    : level === "Pro"
    ? ((totalPoints - 200) / 300) * 100
    : ((totalPoints - 500) / 500) * 100;

  const maxWeekly = Math.max(...weeklyProgress, 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-white">Progress Tracker 📊</h1>
          <div className="w-12" />
        </div>

        {/* Level Progress Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold text-emerald-100 uppercase tracking-wide mb-1">
                Current Level
              </div>
              <h2 className="text-3xl font-bold text-white">{level}</h2>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-12 h-12 text-yellow-300" />
            </motion.div>
          </div>

          <div className="bg-white/20 rounded-full h-4 overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelProgress, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex items-center justify-between text-emerald-100 text-sm">
            <span>{totalPoints} points</span>
            <span>{pointsToNext} to {nextLevel}</span>
          </div>
        </motion.div>

        {/* Key Stats Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {/* Streak */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🔥
            </motion.div>
            <div className="text-3xl font-bold text-white mb-1">{streak}</div>
            <div className="text-xs text-blue-300">Day Streak</div>
          </div>

          {/* Total Points */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white mb-1">{totalPoints}</div>
            <div className="text-xs text-blue-300">Total Points</div>
          </div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">This Week's Activity</h3>
          </div>

          <div className="flex items-end justify-between gap-2 h-40 mb-4">
            {weeklyProgress.map((points, index) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const height = (points / maxWeekly) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${
                      index === 6
                        ? "bg-gradient-to-t from-green-500 to-emerald-400"
                        : "bg-gradient-to-t from-blue-500 to-cyan-400"
                    }`}
                  />
                  <div className="text-xs text-blue-300 font-bold">{days[index]}</div>
                  <div className="text-xs text-white font-bold">{points}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-3 text-center">
            <p className="text-green-300 text-sm font-bold">
              💪 Consistent effort builds champions!
            </p>
          </div>
        </motion.div>

        {/* Personal Records */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Personal Records</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="text-white font-bold">Best Streak</div>
                  <div className="text-blue-300 text-xs">Longest active days</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{Math.max(streak, 0)} days</div>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-white font-bold">Best Week</div>
                  <div className="text-blue-300 text-xs">Highest weekly points</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{Math.max(...weeklyProgress)} pts</div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Keep Climbing! 🚀</h4>
              <p className="text-purple-100 text-sm">
                You're building habits that last a lifetime. Every point represents progress toward your goals!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}