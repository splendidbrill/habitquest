import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";

const workoutMoves = [
  {
    id: "fly-stretch",
    emoji: "🦅",
    name: "Fly & Stretch",
    description: "Spread your arms wide like wings and reach for the sky!",
    duration: 5,
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "power-punch",
    emoji: "👊",
    name: "Power Punches",
    description: "Punch forward like a superhero! Left, right, left, right!",
    duration: 5,
    color: "from-red-400 to-orange-500",
  },
  {
    id: "dodge-boulders",
    emoji: "🦘",
    name: "Dodge & Jump",
    description: "Jump side to side like you're dodging boulders!",
    duration: 5,
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "super-run",
    emoji: "🏃",
    name: "Super Speed Run",
    description: "Run in place as fast as you can - zoom zoom!",
    duration: 5,
    color: "from-purple-400 to-pink-500",
  },
];

export function SuperheroWorkout() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [moveDuration, setMoveDuration] = useState(0);
  const [showingMove, setShowingMove] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  const currentMove = workoutMoves[currentMoveIndex];

  // Countdown before move
  useEffect(() => {
    if (!gameStarted || showingMove || completed) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowingMove(true);
      setMoveDuration(currentMove.duration);
    }
  }, [countdown, gameStarted, showingMove, completed, currentMove.duration]);

  // Move timer
  useEffect(() => {
    if (!showingMove || completed) return;

    if (moveDuration > 0) {
      const timer = setTimeout(() => setMoveDuration(moveDuration - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTotalMoves(totalMoves + 1);
      
      if (currentMoveIndex < workoutMoves.length - 1) {
        setCurrentMoveIndex(currentMoveIndex + 1);
        setShowingMove(false);
        setCountdown(3);
      } else {
        setCompleted(true);
      }
    }
  }, [moveDuration, showingMove, completed, currentMoveIndex, totalMoves]);

  const handleFinish = () => {
    // Save rewards
    const stars = parseInt(localStorage.getItem("totalStars") || "0");
    localStorage.setItem("totalStars", String(stars + totalMoves * 2));
    
    const accessories = JSON.parse(localStorage.getItem("superheroAccessories") || "[]");
    accessories.push(...new Set([...accessories, "🦸‍♂️", "⚡", "🦸‍♀️"]));
    localStorage.setItem("superheroAccessories", JSON.stringify(accessories));

    // Add badge
    const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
    if (!badges.includes("superhero-trainer")) {
      badges.push("superhero-trainer");
      localStorage.setItem("earnedBadges", JSON.stringify(badges));
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 p-6 py-12">
      <div className="max-w-md mx-auto">
        {!gameStarted ? (
          /* Start Screen */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-8"
            >
              🦸
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Superhero Training! 💪
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Copy the superhero moves!
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Training Moves:</h3>
              <div className="space-y-3 text-left">
                {workoutMoves.map((move, i) => (
                  <div key={i} className="flex items-center gap-3 text-xl text-gray-700">
                    <span className="text-3xl">{move.emoji}</span>
                    <span>{move.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white"
            >
              Start Training! 🚀
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/game-hub")}
              className="w-full bg-gray-200 rounded-full py-6 shadow-xl text-2xl font-bold text-gray-700 mt-4"
            >
              Back to Games
            </motion.button>
          </motion.div>
        ) : completed ? (
          /* Completion Screen */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            {/* Confetti */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                animate={{ y: window.innerHeight, rotate: 720, opacity: 0 }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute text-5xl pointer-events-none"
              >
                {i % 4 === 0 ? "⭐" : i % 4 === 1 ? "✨" : i % 4 === 2 ? "🦸" : "💪"}
              </motion.div>
            ))}

            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.4, 1],
              }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-9xl mb-8"
            >
              🏆
            </motion.div>

            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              You're a Superhero! 🦸
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <div className="text-7xl mb-4">💪</div>
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {totalMoves}
              </div>
              <div className="text-2xl text-gray-700">
                Moves Completed!
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 shadow-xl mb-8">
              <div className="text-5xl mb-3">⭐</div>
              <div className="text-3xl font-bold text-amber-800">
                +{totalMoves * 2} Stars Earned!
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 shadow-xl mb-8">
              <div className="text-5xl mb-3">🦸</div>
              <div className="text-2xl font-bold text-purple-800">
                New Superhero Items Unlocked!
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white"
            >
              Keep Going! 🏠
            </motion.button>
          </motion.div>
        ) : (
          /* Training in Progress */
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCompleted(true)}
                className="bg-white rounded-full p-3 shadow-lg"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </motion.button>
              
              <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">
                  Move {currentMoveIndex + 1} / {workoutMoves.length}
                </span>
              </div>
            </div>

            {!showingMove ? (
              /* Countdown */
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-9xl mb-8"
                >
                  {buddyEmoji}
                </motion.div>

                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Get Ready!
                </h2>

                <motion.div
                  key={countdown}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-9xl font-bold text-purple-600 mb-8"
                >
                  {countdown}
                </motion.div>

                <div className={`bg-gradient-to-r ${currentMove.color} rounded-3xl p-8 shadow-2xl`}>
                  <div className="text-7xl mb-4">{currentMove.emoji}</div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {currentMove.name}
                  </h3>
                  <p className="text-xl text-white/90">
                    {currentMove.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Do the Move */
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1.2, 1.4, 1],
                    rotate: [0, 15, -15, 15, 0],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-9xl mb-8"
                >
                  {currentMove.emoji}
                </motion.div>

                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  {currentMove.name}!
                </h2>

                <motion.div
                  key={moveDuration}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-9xl font-bold text-purple-600 mb-8"
                >
                  {moveDuration}
                </motion.div>

                <div className={`bg-gradient-to-r ${currentMove.color} rounded-3xl p-8 shadow-2xl`}>
                  <p className="text-3xl text-white font-bold">
                    {currentMove.description}
                  </p>
                </div>

                {/* Animated buddy cheering */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-7xl mt-8"
                >
                  {buddyEmoji}
                </motion.div>
                <p className="text-2xl text-gray-700 font-bold mt-4">
                  You're doing great! 🌟
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
