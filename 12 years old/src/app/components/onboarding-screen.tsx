import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Zap, Target, Shield } from "lucide-react";

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleStart = () => {
    localStorage.setItem("hasOnboarded", "true");
    navigate("/");
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <Zap className="w-24 h-24 mx-auto text-purple-400 glow-purple" />
          </motion.div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Your Space
          </h1>
          <p className="text-gray-400 mb-12 leading-relaxed">
            Build your vibe. Your way. No pressure.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-6 font-bold text-lg glow-purple"
          >
            Let's go
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            Here's the deal
          </h2>

          <div className="space-y-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    100% Private
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Your stuff stays yours. No sharing, no tracking who you are. Just you.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    You're in control
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Skip anything. Change anything. This adapts to you, not the other way around.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-pink-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Small wins, big confidence
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    This isn't about fixing you. You're not broken. It's about building momentum.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(3)}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-5 font-bold text-lg glow-purple flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            What's inside
          </h2>
          <p className="text-gray-400 mb-8">
            Try what fits, skip what doesn't
          </p>

          <div className="space-y-4 mb-12">
            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
              <p className="text-white font-semibold mb-1">🎯 Quick Games</p>
              <p className="text-sm text-gray-400">Urban Runner, Reflex challenges — dopamine hits, not time sinks</p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
              <p className="text-white font-semibold mb-1">⚡ Micro-Workouts</p>
              <p className="text-sm text-gray-400">30-60 sec mood boosters. No equipment, no judgment.</p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
              <p className="text-white font-semibold mb-1">🍎 Real Food Swaps</p>
              <p className="text-sm text-gray-400">Not diet advice — just energy tips that actually make sense</p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
              <p className="text-white font-semibold mb-1">🔒 Private Journal</p>
              <p className="text-sm text-gray-400">Your space. Mood tracking, gratitude, or just venting.</p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
              <p className="text-white font-semibold mb-1">👤 Identity Builder</p>
              <p className="text-sm text-gray-400">Unlock themes, titles, skins. Build your vibe.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-6 font-bold text-lg glow-purple flex items-center justify-center gap-2"
          >
            Start building
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-6">
            You showed up — that counts.
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
}