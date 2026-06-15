import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

const missions = [
  {
    id: "jump-animals",
    title: "Jump Like 5 Animals! 🦘",
    emoji: "🦘",
    description: "Jump like a kangaroo, frog, bunny, monkey, and tiger!",
    activity: "Movement",
    duration: "5 minutes",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "dance-party",
    title: "Dance for 5 Minutes! 💃",
    emoji: "💃",
    description: "Put on your favorite song and dance!",
    activity: "Dance",
    duration: "5 minutes",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: "try-fruit",
    title: "Try One New Fruit! 🍎",
    emoji: "🍎",
    description: "Ask a grown-up to help you pick a new fruit to taste!",
    activity: "Food Adventure",
    duration: "Anytime",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "playground-time",
    title: "Play at the Park! ⚽",
    emoji: "⚽",
    description: "Go outside and play - run, swing, or kick a ball!",
    activity: "Outdoor Play",
    duration: "30 minutes",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "bike-ride",
    title: "Bike Ride Adventure! 🚲",
    emoji: "🚲",
    description: "Go for a bike ride with family!",
    activity: "Cycling",
    duration: "20 minutes",
    color: "from-teal-400 to-green-500",
  },
];

export function DailyMission() {
  const navigate = useNavigate();
  
  // Pick today's mission
  const today = new Date().getDate();
  const todaysMission = missions[today % missions.length];
  
  const [missionStarted, setMissionStarted] = useState(false);

  const handleStartMission = () => {
    setMissionStarted(true);
  };

  const handleCompleteMission = () => {
    navigate("/success");
  };

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-purple-100 to-pink-200 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/home")}
            className="bg-white rounded-full p-4 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-6xl"
          >
            {buddyEmoji}
          </motion.div>
        </div>

        {!missionStarted ? (
          <>
            {/* Big Mission Title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Today's Mission! 🎯
              </h1>
            </motion.div>

            {/* Mission Card - BIG */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`bg-gradient-to-br ${todaysMission.color} rounded-3xl p-10 shadow-2xl mb-8`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="text-9xl text-center mb-6"
              >
                {todaysMission.emoji}
              </motion.div>

              <h2 className="text-4xl font-bold text-white text-center mb-4">
                {todaysMission.title}
              </h2>

              <p className="text-2xl text-white/90 text-center mb-6">
                {todaysMission.description}
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-xl text-white font-bold">
                    ⏰ {todaysMission.duration}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Start Button - HUGE */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartMission}
              className="w-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full py-8 shadow-2xl"
            >
              <div className="text-5xl font-bold text-white">
                Start Mission! 🚀
              </div>
            </motion.button>
          </>
        ) : (
          /* Mission In Progress - SIMPLE */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            {/* Animated Buddy - HUGE */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-9xl mb-8"
            >
              {buddyEmoji}
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="text-9xl mb-8"
            >
              {todaysMission.emoji}
            </motion.div>

            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              You're Doing Great! 🌟
            </h2>

            <p className="text-3xl text-gray-700 mb-12">
              Have fun! When you're done, tap below!
            </p>

            {/* Complete Button - HUGE */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteMission}
              className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full py-8 shadow-2xl"
            >
              <div className="text-5xl font-bold text-white">
                I'm Done! 🎉
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Floating Stars */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100 }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            className="absolute text-5xl opacity-20 pointer-events-none"
            style={{ left: `${Math.random() * 100}%` }}
          >
            {i % 2 === 0 ? "⭐" : "✨"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}