import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Users, Star } from "lucide-react";

export function BuddyHome() {
  const navigate = useNavigate();
  const [buddyName, setBuddyName] = useState("");
  const [adventures, setAdventures] = useState(0);
  const [selectedBuddy, setSelectedBuddy] = useState("");
  const [greetingTime, setGreetingTime] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("buddyName") || "Explorer";
    const buddy = localStorage.getItem("selectedBuddy") || "lion";
    const adventureCount = parseInt(localStorage.getItem("adventuresCompleted") || "0");
    
    setBuddyName(name);
    setSelectedBuddy(buddy);
    setAdventures(adventureCount);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime("Good Morning");
    else if (hour < 17) setGreetingTime("Good Afternoon");
    else setGreetingTime("Good Evening");
  }, []);

  const buddyEmojis: Record<string, string> = {
    lion: "🦁",
    tiger: "🐯",
    elephant: "🐘",
    monkey: "🐵",
  };

  const hasMissionToday = !localStorage.getItem("missionCompleted");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-orange-100 to-amber-200 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Animated Buddy Character - MUCH BIGGER */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-9xl"
          >
            {buddyEmojis[selectedBuddy] || "🦁"}
          </motion.div>
        </motion.div>

        {/* Simple Greeting - BIG TEXT */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Hello {buddyName}! 👋
          </h1>
          <p className="text-2xl text-gray-700">
            Ready for today's mission?
          </p>
        </motion.div>

        {/* ONE BIG ACTION - Daily Mission */}
        {hasMissionToday ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/mission")}
            className="w-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl p-8 shadow-2xl mb-6"
          >
            <div className="text-center">
              <div className="text-7xl mb-4">🎯</div>
              <div className="text-3xl font-bold text-white mb-3">
                Start Mission!
              </div>
              <div className="text-xl text-white/90">
                Let's go on an adventure!
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl mb-6 text-center"
          >
            <div className="text-7xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              Mission Complete!
            </div>
            <div className="text-xl text-gray-600">
              Come back tomorrow! 🌟
            </div>
          </motion.div>
        )}

        {/* Food Discovery Button - SIMPLE */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/food-discovery")}
          className="w-full bg-gradient-to-r from-green-400 via-lime-400 to-emerald-400 rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">🍎</div>
            <div className="text-3xl font-bold text-white mb-3">
              Food Discovery!
            </div>
            <div className="text-xl text-white/90">
              Tap and explore yummy foods
            </div>
          </div>
        </motion.button>

        {/* Game Hub Button - NEW */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/game-hub")}
          className="w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">🎮</div>
            <div className="text-3xl font-bold text-white mb-3">
              Play Games!
            </div>
            <div className="text-xl text-white/90">
              Fun healthy games to play
            </div>
          </div>
        </motion.button>

        {/* My Rewards Button - SIMPLE */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/rewards")}
          className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">⭐</div>
            <div className="text-3xl font-bold text-white mb-3">
              My Rewards!
            </div>
            <div className="text-xl text-white/90">
              See your stars and badges
            </div>
          </div>
        </motion.button>

        {/* Collectibles Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/collectibles")}
          className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl p-8 shadow-2xl mb-6"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">🎁</div>
            <div className="text-3xl font-bold text-white mb-3">
              My Collection!
            </div>
            <div className="text-xl text-white/90">
              See all your cool items
            </div>
          </div>
        </motion.button>

        {/* Floating Stars Animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 400 }}
            animate={{
              y: [0, -20, 0],
              x: Math.random() * 400 - 50,
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute text-4xl opacity-30 pointer-events-none"
            style={{ left: Math.random() * 100 + "%" }}
          >
            {i % 2 === 0 ? "⭐" : "✨"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}