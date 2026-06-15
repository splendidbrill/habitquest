import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function SuccessCelebration() {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    // Mark mission as complete
    localStorage.setItem("missionCompleted", "true");
    
    // Increment adventure count
    const currentAdventures = parseInt(localStorage.getItem("adventuresCompleted") || "0");
    localStorage.setItem("adventuresCompleted", String(currentAdventures + 1));

    // Add stars
    const currentStars = parseInt(localStorage.getItem("totalStars") || "0");
    const newStars = currentStars + 3;
    localStorage.setItem("totalStars", String(newStars));
    setStars(newStars);

    // Add adventure badge
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    if (!badges.includes("adventure-star")) {
      badges.push("adventure-star");
      localStorage.setItem("earnedBadges", JSON.stringify(badges));
    }
  }, []);

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-6 py-12 relative overflow-hidden">
      {/* MASSIVE Confetti */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1, scale: 1 }}
          animate={{ 
            y: window.innerHeight + 100, 
            rotate: Math.random() * 720,
            opacity: [1, 1, 0],
            scale: [1, 1.5, 0.5],
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: Math.random() * 1,
            ease: "easeIn",
          }}
          className="absolute text-6xl pointer-events-none"
        >
          {i % 5 === 0 ? "🎉" : i % 5 === 1 ? "⭐" : i % 5 === 2 ? "✨" : i % 5 === 3 ? "🌟" : "🎊"}
        </motion.div>
      ))}

      <div className="max-w-md mx-auto relative z-10">
        {/* Buddy Celebration - HUGE */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 15, -15, 15, -15, 0],
              scale: [1, 1.4, 1.2, 1.4, 1],
              y: [0, -30, 0, -30, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-9xl"
          >
            {buddyEmoji}
          </motion.div>
        </motion.div>

        {/* Trophy - HUGE */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="text-9xl"
          >
            🏆
          </motion.div>
        </motion.div>

        {/* Success Message - BIG TEXT */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Amazing! 🎉
          </h1>
          <p className="text-4xl text-gray-700 mb-8">
            You Did It!
          </p>
        </motion.div>

        {/* Stars Earned - HUGE */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="bg-white rounded-3xl p-10 shadow-2xl mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-9xl text-center mb-6"
          >
            ⭐
          </motion.div>

          <div className="text-center">
            <div className="text-6xl font-bold text-amber-600 mb-3">
              +3 Stars!
            </div>
            <div className="text-3xl text-gray-700">
              You now have {stars} stars! 🌟
            </div>
          </div>
        </motion.div>

        {/* Continue Button - HUGE */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full py-10 shadow-2xl"
        >
          <div className="text-5xl font-bold text-white">
            Keep Going! 🚀
          </div>
        </motion.button>

        {/* Fireworks Animation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`firework-${i}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 3, 4],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            className="absolute text-7xl"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}