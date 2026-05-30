import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Target, Zap, ChevronRight } from "lucide-react";

export function AthleteOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");

  const sports = [
    { id: "football", emoji: "⚽", name: "Football" },
    { id: "cricket", emoji: "🏏", name: "Cricket" },
    { id: "basketball", emoji: "🏀", name: "Basketball" },
    { id: "running", emoji: "🏃", name: "Running" },
    { id: "cycling", emoji: "🚴", name: "Cycling" },
    { id: "swimming", emoji: "🏊", name: "Swimming" },
  ];

  const handleStart = () => {
    if (name && sport) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userSport", sport);
      localStorage.setItem("familyPoints", "0");
      localStorage.setItem("currentStreak", "1");
      localStorage.setItem("lastActiveDate", new Date().toDateString());
      navigate("/training");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl mb-8"
              >
                🏆
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome, Athlete!
              </h1>
              
              <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                Ready to train like a pro? This is your personal sports performance tracker!
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-bold mb-1">Daily Missions</div>
                      <div className="text-blue-200 text-sm">Complete training challenges every day</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-bold mb-1">Fuel Like a Pro</div>
                      <div className="text-blue-200 text-sm">Learn what athletes eat to perform their best</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-bold mb-1">Earn Achievements</div>
                      <div className="text-blue-200 text-sm">Unlock badges and level up your status</div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-xl font-bold text-white shadow-2xl flex items-center justify-center gap-2"
              >
                Let's Start! 
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">👋</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  What's your name?
                </h2>
                <p className="text-blue-200">
                  We'll use this to personalize your training
                </p>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-5 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white text-center text-xl placeholder-white/50 mb-6 focus:outline-none focus:border-blue-400"
                autoFocus
              />

              <motion.button
                whileHover={{ scale: name ? 1.05 : 1 }}
                whileTap={{ scale: name ? 0.95 : 1 }}
                onClick={() => name && setStep(3)}
                disabled={!name}
                className={`w-full py-5 rounded-full text-xl font-bold shadow-2xl flex items-center justify-center gap-2 ${
                  name
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
              >
                Continue
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="sport"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">⚽</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  What's your favorite sport?
                </h2>
                <p className="text-blue-200">
                  We'll tailor your training to your goals
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {sports.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSport(s.id)}
                    className={`rounded-2xl p-6 text-center transition-all ${
                      sport === s.id
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl"
                        : "bg-white/10 backdrop-blur-sm border border-white/20"
                    }`}
                  >
                    <div className="text-5xl mb-3">{s.emoji}</div>
                    <div className="text-white font-bold">{s.name}</div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: sport ? 1.05 : 1 }}
                whileTap={{ scale: sport ? 0.95 : 1 }}
                onClick={handleStart}
                disabled={!sport}
                className={`w-full py-5 rounded-full text-xl font-bold shadow-2xl flex items-center justify-center gap-2 ${
                  sport
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
              >
                Start Training! 💪
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
