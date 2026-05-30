import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Star, Award } from "lucide-react";

const confetti = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
  duration: 2 + Math.random() * 2,
  emoji: ["⭐", "✨", "🌟", "💫", "🎉", "⚽", "🏏", "🎨"][Math.floor(Math.random() * 8)],
}));

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

const encouragements = [
  "You're incredible!",
  "What an adventure!",
  "You're a superstar!",
  "Amazing effort!",
  "You're so strong!",
  "Brilliant!",
  "You're amazing!",
];

const motivationalMessages = [
  "Champions aren't made in gyms. Champions are made from something they have deep inside them - a desire, a dream, a vision! Keep going!",
  "Great athletes train every single day. You're building habits that will make you unstoppable!",
  "You just got 1% better than yesterday. That's how pros train - small gains add up to huge results!",
  "Your body is getting stronger, faster, and more skilled. That's the power of consistent training!",
  "Every session counts. You're not just training your body - you're training your mind to never give up!",
  "Professional athletes started exactly where you are now. Keep showing up and you'll be amazed at your progress!",
  "You're building athletic habits that will serve you for life. This is how champions are made!",
];

export function SuccessCelebration() {
  const navigate = useNavigate();
  const [lastUnlock] = useState(localStorage.getItem("lastUnlock") || "Achievement");
  const [showConfetti, setShowConfetti] = useState(true);
  const completedMissions = parseInt(localStorage.getItem("completedMissions") || "0");
  
  const userName = localStorage.getItem("userName") || "Champion";

  useEffect(() => {
    localStorage.setItem("todaysMission", "completed");
    
    const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
    localStorage.setItem("familyPoints", String(currentPoints + 5));
    
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("lastActiveDate");
    
    if (lastActive !== today) {
      const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
      localStorage.setItem("currentStreak", String(currentStreak + 1));
      localStorage.setItem("lastActiveDate", today);
    }

    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -100,
                x: Math.random() * window.innerWidth,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 720,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "linear",
              }}
              className="absolute text-3xl"
            >
              {i % 4 === 0 ? "🏆" : i % 4 === 1 ? "⭐" : i % 4 === 2 ? "💪" : "🔥"}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main celebration content */}
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{ duration: 0.8, repeat: 3 }}
            className="text-9xl mb-6"
          >
            🏆
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Incredible Work, {userName}!
          </h1>
          
          <p className="text-xl text-purple-200 mb-2">
            Training Complete! 💪
          </p>

          <p className="text-lg text-purple-300">
            You're getting stronger every day!
          </p>
        </motion.div>

        {/* Achievement unlocked card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="text-6xl mb-4"
            >
              🎖️
            </motion.div>
            <h3 className="text-sm font-bold text-yellow-100 uppercase tracking-wide mb-2">
              Achievement Unlocked
            </h3>
            <h2 className="text-2xl font-bold text-white mb-2">{lastUnlock}</h2>
            <p className="text-yellow-100 text-sm">
              Added to your trophy cabinet!
            </p>
          </div>
        </motion.div>

        {/* Stats earned */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            Today's Gains 🔥
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/5 rounded-2xl p-4">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-white mb-1">+5</div>
              <div className="text-xs text-blue-300">Training Points</div>
            </div>
            <div className="text-center bg-white/5 rounded-2xl p-4">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-white mb-1">{completedMissions}</div>
              <div className="text-xs text-blue-300">Total Completed</div>
            </div>
          </div>
        </motion.div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">💪</div>
            <div>
              <h4 className="text-white font-bold mb-2">Coach Says:</h4>
              <p className="text-green-100 text-sm leading-relaxed">
                {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/training")}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-xl font-bold text-white shadow-2xl"
        >
          Back to Dashboard 🏠
        </motion.button>
      </div>
    </div>
  );
}