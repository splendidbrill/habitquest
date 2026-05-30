import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Music, Circle, User } from "lucide-react";

const missions = [
  {
    id: "park-football",
    title: "Park Football!",
    subtitle: "Play at the park with friends",
    emoji: "⚽",
    bgGradient: "from-green-400 via-emerald-400 to-teal-400",
    illustration: "⚽",
    sound: "Goal!",
    time: "30 minutes of fun",
    unlocks: "Football Star Badge",
  },
  {
    id: "family-bike",
    title: "Family Bike Adventure",
    subtitle: "Ride bikes together!",
    emoji: "🚴",
    bgGradient: "from-blue-400 via-cyan-400 to-sky-400",
    illustration: "🚴",
    sound: "Wheee!",
    time: "Ride around the neighbourhood",
    unlocks: "Cyclist Cape",
  },
  {
    id: "school-play",
    title: "School Playground",
    subtitle: "Run & play with friends",
    emoji: "🏃",
    bgGradient: "from-orange-400 via-amber-400 to-yellow-400",
    illustration: "🏃",
    sound: "Let's go!",
    time: "Playtime at school",
    unlocks: "Running Shoes",
  },
  {
    id: "cricket-match",
    title: "Cricket Time!",
    subtitle: "Play cricket with family or friends",
    emoji: "🏏",
    bgGradient: "from-teal-400 via-green-400 to-lime-400",
    illustration: "🏏",
    sound: "Howzat!",
    time: "Play a fun match",
    unlocks: "Cricket Champion Hat",
  },
  {
    id: "swimming",
    title: "Swimming Fun",
    subtitle: "Swim & splash around!",
    emoji: "🏊",
    bgGradient: "from-cyan-400 via-blue-400 to-indigo-400",
    illustration: "🏊",
    sound: "Splash!",
    time: "Have fun in the water",
    unlocks: "Swimmer Goggles",
  },
  {
    id: "park-explore",
    title: "Park Explorer",
    subtitle: "Walk & explore nature",
    emoji: "🌳",
    bgGradient: "from-lime-400 via-green-400 to-emerald-400",
    illustration: "🌳",
    sound: "Adventure!",
    time: "Explore the outdoors",
    unlocks: "Explorer Backpack",
  },
  {
    id: "dance-party",
    title: "Bollywood Dance Party",
    subtitle: "Dance with family!",
    emoji: "💃",
    bgGradient: "from-pink-400 via-rose-400 to-red-400",
    illustration: "💃",
    sound: "Dance!",
    time: "Move to the music",
    unlocks: "Dancer Badge",
  },
  {
    id: "badminton",
    title: "Badminton Fun",
    subtitle: "Play in the garden or park",
    emoji: "🏸",
    bgGradient: "from-purple-400 via-violet-400 to-fuchsia-400",
    illustration: "🏸",
    sound: "Smash!",
    time: "Play together",
    unlocks: "Champion Racket",
  },
];

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

export function DailyMission() {
  const navigate = useNavigate();
  const [todaysMission] = useState(
    missions[Math.floor(Math.random() * missions.length)]
  );
  const [started, setStarted] = useState(false);
  const [showSound, setShowSound] = useState(false);

  const selectedAvatar = localStorage.getItem("selectedAvatar") || "tiger";
  const avatarColor = localStorage.getItem("avatarColor") || "orange";
  const completedCount = parseInt(localStorage.getItem("completedMissions") || "0");

  const colorClasses: { [key: string]: string } = {
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  const handleStart = () => {
    setStarted(true);
    setShowSound(true);
    setTimeout(() => setShowSound(false), 2000);
  };

  const handleComplete = () => {
    const completed = parseInt(localStorage.getItem("completedMissions") || "0");
    localStorage.setItem("completedMissions", String(completed + 1));
    localStorage.setItem("lastUnlock", todaysMission.unlocks);
    navigate("/success");
  };

  // Avatar grows bigger with progress
  const avatarSize = Math.min(20 + completedCount * 2, 32);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${todaysMission.bgGradient} flex flex-col items-center justify-between p-6 py-12 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 2 === 0 ? "⭐" : "✨"}
          </motion.div>
        ))}
      </div>

      {/* Growing Avatar buddy */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/status")}
          animate={{
            rotate: started ? [0, -5, 5, -5, 0] : 0,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: started ? Infinity : 0,
            repeatDelay: 2,
          }}
          className={`${colorClasses[avatarColor]} rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
          style={{ width: `${avatarSize * 4}px`, height: `${avatarSize * 4}px` }}
        >
          <span style={{ fontSize: `${avatarSize}px` }}>{avatarEmojis[selectedAvatar]}</span>
        </motion.button>
        {completedCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full px-2 py-1 shadow-lg pointer-events-none"
          >
            <span className="text-xs font-bold text-white">Lv.{Math.min(completedCount, 20)}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Sound effect */}
      {showSound && (
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg z-20"
        >
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-gray-800">{todaysMission.sound}</span>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-7xl mb-4"
          >
            {todaysMission.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold text-white/90 mb-2">
            Today's Big Adventure
          </h2>
        </motion.div>

        {/* Mission card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{
                y: started ? [0, -15, 0] : 0,
              }}
              transition={{
                duration: 1.5,
                repeat: started ? Infinity : 0,
              }}
              className="text-8xl mb-4"
            >
              {todaysMission.illustration}
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {todaysMission.title}
            </h1>
            <p className="text-xl text-gray-700 mb-3">
              {todaysMission.subtitle}
            </p>
            <div className="inline-block bg-gradient-to-r from-orange-100 to-teal-100 rounded-full px-4 py-2">
              <p className="text-sm font-bold text-gray-700">
                ⏱️ {todaysMission.time}
              </p>
            </div>
          </div>

          {/* What you'll unlock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">You'll unlock:</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-bold text-orange-600">{todaysMission.unlocks}</span>
              </div>
            </div>
          </motion.div>

          {/* Pattern decoration */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Circle className="w-3 h-3 fill-orange-400 text-orange-400" />
              </motion.div>
            ))}
          </div>

          {!started ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-2xl font-bold text-white shadow-lg flex items-center justify-center gap-3"
            >
              <Sparkles className="w-7 h-7" />
              Let's Go Play!
              <Sparkles className="w-7 h-7" />
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-2xl font-bold text-white shadow-lg"
            >
              I Did It! ✨
            </motion.button>
          )}
        </motion.div>

        {/* Encouraging text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg text-white/90 font-medium">
            {started ? "Have the best time! 🌟" : "This is going to be amazing!"}
          </p>
        </motion.div>
      </div>

      {/* Flying kites decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ["-10%", "110%"],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 3,
            }}
            className="absolute bottom-10 text-3xl opacity-60"
          >
            🪁
          </motion.div>
        ))}
      </div>
    </div>
  );
}