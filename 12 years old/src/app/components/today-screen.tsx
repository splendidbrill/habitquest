import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Menu, Zap, Target, Flame, User, TrendingUp } from "lucide-react";

const greetings = [
  "What's up",
  "Hey",
  "Welcome back",
  "Good to see you",
];

const dailySuggestions = [
  {
    id: "energy-boost",
    type: "Energy Boost Activity",
    title: "Quick power-up?",
    subtitle: "2 minutes can shift your whole vibe",
    action: "Try a micro-workout",
    route: "/micro-workouts",
    color: "from-cyan-500 to-cyan-600",
    glow: "glow-cyan",
  },
  {
    id: "mood-reset",
    type: "Mood Reset Move",
    title: "Need a mental break?",
    subtitle: "Your mind needs movement too",
    action: "Play Reflex & Rhythm",
    route: "/reflex-rhythm",
    color: "from-purple-500 to-purple-600",
    glow: "glow-purple",
  },
  {
    id: "confidence-challenge",
    type: "Confidence Challenge",
    title: "Build something today",
    subtitle: "Small wins = big momentum",
    action: "Pick your move",
    route: "/movement",
    color: "from-pink-500 to-pink-600",
    glow: "glow-pink",
  },
  {
    id: "urban-run",
    type: "Energy Boost Activity",
    title: "Quick reflex session?",
    subtitle: "Athletes train their reactions",
    action: "Urban Runner",
    route: "/urban-runner",
    color: "from-blue-500 to-blue-600",
    glow: "glow-blue",
  },
];

export function TodayScreen() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [greeting] = useState(greetings[Math.floor(Math.random() * greetings.length)]);
  const [todaySuggestion] = useState(
    dailySuggestions[Math.floor(Math.random() * dailySuggestions.length)]
  );
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);

  useEffect(() => {
    const xp = parseInt(localStorage.getItem("playerXP") || "0");
    setPlayerXP(xp);
    setPlayerLevel(Math.floor(xp / 100) + 1);
  }, []);

  // Get current streak (soft, no pressure)
  const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
  const hasCheckedInToday = localStorage.getItem("lastCheckIn") === new Date().toDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {greeting}
            </h1>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-2 glow-purple"
            >
              <User className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Menu overlay */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#1a1a24] p-6 shadow-2xl border-l border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                  Your Space
                </h3>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white font-medium"
                >
                  Profile & Identity
                </button>
                <button
                  onClick={() => {
                    navigate("/weekly-plan");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  Weekly planner
                </button>
                <button
                  onClick={() => {
                    navigate("/wellbeing");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  Wellbeing tracker
                </button>
                
                <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-4 uppercase tracking-wider">
                  Games & Moves
                </h3>
                <button
                  onClick={() => {
                    navigate("/urban-runner");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  🏃 Urban Runner
                </button>
                <button
                  onClick={() => {
                    navigate("/reflex-rhythm");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  🎯 Reflex & Rhythm
                </button>
                <button
                  onClick={() => {
                    navigate("/micro-workouts");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  ⚡ Micro Workouts
                </button>

                <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-4 uppercase tracking-wider">
                  Support
                </h3>
                <button
                  onClick={() => {
                    navigate("/food-swaps");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  Food & Energy
                </button>
                <button
                  onClick={() => {
                    navigate("/resources");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  Resources & Support
                </button>
                <button
                  onClick={() => {
                    navigate("/feedback");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 text-white"
                >
                  Give Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* XP Progress bar */}
        {playerXP > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a24] rounded-2xl p-4 mb-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Level {playerLevel}</span>
              </div>
              <span className="text-xs text-gray-500">{playerXP} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(playerXP % 100)}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 glow-purple"
              />
            </div>
          </motion.div>
        )}

        {/* Today's suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
            {todaySuggestion.type}
          </p>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(todaySuggestion.route)}
            className={`w-full bg-gradient-to-br ${todaySuggestion.color} rounded-2xl p-6 text-left ${todaySuggestion.glow} relative overflow-hidden`}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                {todaySuggestion.title}
              </h2>
              <p className="text-white/80 mb-4 text-sm">
                {todaySuggestion.subtitle}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">
                  {todaySuggestion.action}
                </span>
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full text-center py-3 text-sm text-gray-500 hover:text-gray-400"
          >
            Skip for today
          </motion.button>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {/* Check-in card */}
          {!hasCheckedInToday && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/check-in")}
              className="w-full bg-[#1a1a24] rounded-2xl p-5 text-left border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Check in with yourself
                  </h3>
                  <p className="text-sm text-gray-400">
                    How are you feeling today?
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </motion.button>
          )}

          {/* Private journal */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate("/reflection")}
            className="w-full bg-[#1a1a24] rounded-2xl p-5 text-left border border-white/10 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Private space
                </h3>
                <p className="text-sm text-gray-400">
                  Your thoughts, your way
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </motion.button>
        </motion.div>

        {/* Soft streak indicator */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 py-4"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-400">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'} — you're showing up
            </span>
          </motion.div>
        )}

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            You're in control. Skip anything that doesn't fit today.
          </p>
        </motion.div>
      </div>
    </div>
  );
}