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

export function SuccessCelebration() {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);
  const [lastUnlock, setLastUnlock] = useState("");
  const [showAvatarGrowth, setShowAvatarGrowth] = useState(false);
  
  const selectedAvatar = localStorage.getItem("selectedAvatar") || "tiger";
  const avatarColor = localStorage.getItem("avatarColor") || "orange";
  const [encouragement] = useState(
    encouragements[Math.floor(Math.random() * encouragements.length)]
  );

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
    setLastUnlock(localStorage.getItem("lastUnlock") || "Special Badge");
    
    // Show avatar growth animation after 1 second
    setTimeout(() => setShowAvatarGrowth(true), 1000);
  }, []);

  // Calculate world growth
  const hasTree = completedCount >= 1;
  const hasKites = completedCount >= 2;
  const hasPlayground = completedCount >= 3;
  const hasGarden = completedCount >= 4;
  const hasFountain = completedCount >= 5;
  const hasBridge = completedCount >= 7;
  const hasBoat = completedCount >= 10;

  // Avatar grows with each adventure
  const oldAvatarSize = Math.min(20 + (completedCount - 1) * 2, 32);
  const newAvatarSize = Math.min(20 + completedCount * 2, 32);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-300 via-orange-300 to-teal-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti */}
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -100, x: `${item.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            rotate: 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-2xl"
          style={{ left: 0 }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-md w-full">
        {/* Celebration header */}
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
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
            className="text-9xl mb-4"
          >
            🎉
          </motion.div>

          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3">
            {encouragement}
          </h1>
          <p className="text-2xl text-white/95 drop-shadow">
            You did something amazing today! 🌟
          </p>
        </motion.div>

        {/* Avatar Growth */}
        {showAvatarGrowth && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <Star className="w-7 h-7 text-amber-500" />
                Your Buddy Grew!
                <Star className="w-7 h-7 text-amber-500" />
              </h2>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                {/* Before */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.9, opacity: 0.5 }}
                  className={`${colorClasses[avatarColor]} rounded-full flex items-center justify-center shadow-lg`}
                  style={{ width: `${oldAvatarSize * 4}px`, height: `${oldAvatarSize * 4}px` }}
                >
                  <span style={{ fontSize: `${oldAvatarSize}px` }}>{avatarEmojis[selectedAvatar]}</span>
                </motion.div>

                {/* Arrow */}
                <div className="text-4xl">→</div>

                {/* After */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className={`${colorClasses[avatarColor]} rounded-full flex items-center justify-center shadow-2xl ring-4 ring-amber-400`}
                  style={{ width: `${newAvatarSize * 4}px`, height: `${newAvatarSize * 4}px` }}
                >
                  <span style={{ fontSize: `${newAvatarSize}px` }}>{avatarEmojis[selectedAvatar]}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full px-3 py-1 shadow-lg"
                  >
                    <span className="text-sm font-bold text-white">Lv.{Math.min(completedCount, 20)}</span>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4"
              >
                <p className="text-lg font-bold text-orange-800">
                  Getting stronger every day! 💪
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* New Unlock */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <Award className="w-7 h-7 text-teal-600" />
              You Unlocked!
              <Award className="w-7 h-7 text-teal-600" />
            </h2>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
              className="inline-block bg-gradient-to-br from-orange-400 to-teal-400 rounded-3xl p-8 mb-4"
            >
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-white font-bold text-lg">{lastUnlock}</div>
            </motion.div>

            <p className="text-base text-gray-600 mt-4">
              Your buddy can wear this now!
            </p>
          </div>
        </motion.div>

        {/* Growing World visualization */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl mb-8"
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-600" />
              Your World is Growing!
              <Sparkles className="w-6 h-6 text-orange-600" />
            </h3>
          </div>

          {/* World illustration */}
          <div className="bg-gradient-to-b from-sky-300 to-green-200 rounded-2xl p-6 min-h-56 relative overflow-hidden">
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-300/60 rounded-b-2xl" />
            
            {/* Sun */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 text-5xl"
            >
              ☀️
            </motion.div>

            {/* Clouds */}
            <motion.div
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-8 left-8 text-3xl opacity-80"
            >
              ☁️
            </motion.div>

            {/* Growing elements */}
            <div className="relative z-10 grid grid-cols-4 gap-2 items-end h-36 px-4">
              {hasTree && (
                <motion.div
                  initial={{ y: 50, scale: 0 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-5xl"
                >
                  🌳
                </motion.div>
              )}
              
              {hasKites && (
                <motion.div
                  initial={{ y: 50, scale: 0 }}
                  animate={{ y: [-5, 5, -5], scale: 1 }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity },
                    scale: { type: "spring", stiffness: 100 }
                  }}
                  className="text-4xl"
                >
                  🪁
                </motion.div>
              )}

              {hasPlayground && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-5xl"
                >
                  🎠
                </motion.div>
              )}

              {hasGarden && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    type: "spring" 
                  }}
                  className="text-4xl"
                >
                  🌺
                </motion.div>
              )}

              {hasFountain && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-4xl"
                >
                  ⛲
                </motion.div>
              )}

              {hasBridge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-4xl"
                >
                  🌉
                </motion.div>
              )}

              {hasBoat && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, x: [0, 10, 0] }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 100 },
                    x: { duration: 3, repeat: Infinity }
                  }}
                  className="text-4xl"
                >
                  ⛵
                </motion.div>
              )}
            </div>

            {/* Avatar in the world */}
            <motion.div
              animate={{
                x: [0, 10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className={`absolute bottom-8 left-8 ${colorClasses[avatarColor]} rounded-full p-2 shadow-lg`}
            >
              <span className="text-4xl">{avatarEmojis[selectedAvatar]}</span>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Every adventure makes your world more amazing! ✨
            </p>
          </div>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="w-full py-6 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-2xl font-bold text-white shadow-2xl flex items-center justify-center gap-3"
        >
          <Star className="w-7 h-7" />
          Back to Home! 🏠
          <Star className="w-7 h-7" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xl text-white/95 font-bold drop-shadow">
            You're becoming stronger every day! 💪🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
}