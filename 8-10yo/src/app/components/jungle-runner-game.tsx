import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";

const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;

const collectibles = [
  { emoji: "🍎", type: "fruit", message: "Yummy apple!" },
  { emoji: "🍌", type: "fruit", message: "Sweet banana!" },
  { emoji: "🍊", type: "fruit", message: "Juicy orange!" },
  { emoji: "💧", type: "water", message: "Stay hydrated!" },
  { emoji: "⚽", type: "sports", message: "Play time!" },
  { emoji: "🏀", type: "sports", message: "Sporty!" },
];

const movements = [
  { emoji: "🐸", action: "Jump like a frog!", duration: 3 },
  { emoji: "🦒", action: "Stretch like a giraffe!", duration: 3 },
  { emoji: "🐻", action: "Walk like a bear!", duration: 3 },
  { emoji: "🦘", action: "Hop like a kangaroo!", duration: 3 },
];

export function JungleRunnerGame() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<Array<{ x: number; y: number; item: typeof collectibles[0] }>>([]);
  const [showMovement, setShowMovement] = useState(false);
  const [currentMovement, setCurrentMovement] = useState(movements[0]);
  const [timeLeft, setTimeLeft] = useState(90);

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  // Generate items
  const generateItem = useCallback(() => {
    const randomItem = collectibles[Math.floor(Math.random() * collectibles.length)];
    return {
      x: GAME_WIDTH,
      y: Math.random() * (GAME_HEIGHT - 60) + 30,
      item: randomItem,
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Spawn items
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setItems((prev) => [...prev, generateItem()]);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, generateItem]);

  // Move items and check collisions
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setItems((prevItems) => {
        return prevItems
          .map((item) => ({ ...item, x: item.x - 5 }))
          .filter((item) => {
            // Check collision with player
            const playerX = 50;
            const distance = Math.sqrt(
              Math.pow(item.x - playerX, 2) + Math.pow(item.y - playerY, 2)
            );
            
            if (distance < 40) {
              setScore((prev) => prev + 1);
              
              // Random movement prompt every 5 items
              if ((score + 1) % 5 === 0) {
                const randomMovement = movements[Math.floor(Math.random() * movements.length)];
                setCurrentMovement(randomMovement);
                setShowMovement(true);
                setTimeout(() => setShowMovement(false), 3000);
              }
              
              return false; // Remove collected item
            }
            
            return item.x > -50; // Keep if still on screen
          });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, playerY, score]);

  const movePlayer = (direction: "up" | "down") => {
    setPlayerY((prev) => {
      if (direction === "up") {
        return Math.max(30, prev - 60);
      } else {
        return Math.min(GAME_HEIGHT - 30, prev + 60);
      }
    });
  };

  const handleFinish = () => {
    const stars = parseInt(localStorage.getItem("totalStars") || "0");
    localStorage.setItem("totalStars", String(stars + score));
    
    const animalBuddies = JSON.parse(localStorage.getItem("animalBuddies") || "[]");
    animalBuddies.push(...new Set([...animalBuddies, "🦁", "🐵", "🐘"]));
    localStorage.setItem("animalBuddies", JSON.stringify(animalBuddies));

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 p-6 py-12">
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
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-8"
            >
              🌴
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Jungle Adventure! 🦁
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Run through the jungle and collect items!
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">How to Play:</h3>
              <div className="space-y-3 text-left text-xl text-gray-700">
                <div>🦁 Control your character</div>
                <div>🍎 Collect fruits and items</div>
                <div>🐸 Do fun movements!</div>
                <div>🌴 Explore the jungle!</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white"
            >
              Start Adventure! 🚀
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
        ) : gameOver ? (
          /* Game Over Screen */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-9xl mb-8"
            >
              {buddyEmoji}
            </motion.div>

            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Great Adventure! 🎉
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <div className="text-7xl mb-4">🌴</div>
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {score}
              </div>
              <div className="text-2xl text-gray-700">
                Items Collected!
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 shadow-xl mb-8">
              <div className="text-5xl mb-3">⭐</div>
              <div className="text-3xl font-bold text-amber-800">
                +{score} Stars Earned!
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
          /* Game Play */
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setGameOver(true)}
                className="bg-white rounded-full p-3 shadow-lg"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </motion.button>
              
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl font-bold text-orange-600">
                    🎯 {score}
                  </span>
                </div>
                <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">
                    ⏰ {timeLeft}s
                  </span>
                </div>
              </div>
            </div>

            {/* Game Area */}
            <div 
              className="relative bg-gradient-to-b from-green-300 via-lime-200 to-yellow-200 rounded-3xl shadow-2xl overflow-hidden mb-6 mx-auto"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {/* Jungle decorations */}
              <div className="absolute top-0 left-0 text-4xl opacity-40">🌴</div>
              <div className="absolute top-20 right-0 text-4xl opacity-40">🌺</div>
              <div className="absolute bottom-20 left-0 text-4xl opacity-40">🦜</div>
              <div className="absolute bottom-0 right-0 text-4xl opacity-40">🌴</div>

              {/* Player */}
              <motion.div
                className="absolute left-12 text-5xl"
                style={{ top: playerY - 25 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {buddyEmoji}
              </motion.div>

              {/* Items */}
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute text-4xl"
                  style={{ left: item.x, top: item.y - 20 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {item.item.emoji}
                </motion.div>
              ))}

              {/* Path lines */}
              <div className="absolute inset-0 flex flex-col justify-around py-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 bg-yellow-300/30" />
                ))}
              </div>
            </div>

            {/* Controls - BIG BUTTONS */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => movePlayer("up")}
                className="bg-white rounded-3xl py-10 shadow-xl text-5xl font-bold text-gray-800"
              >
                ⬆️ Up
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => movePlayer("down")}
                className="bg-white rounded-3xl py-10 shadow-xl text-5xl font-bold text-gray-800"
              >
                ⬇️ Down
              </motion.button>
            </div>

            {/* Movement Prompt */}
            <AnimatePresence>
              {showMovement && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl p-10 shadow-2xl max-w-md"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.4, 1],
                        rotate: [0, 15, -15, 0],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-9xl text-center mb-6"
                    >
                      {currentMovement.emoji}
                    </motion.div>
                    <h3 className="text-4xl font-bold text-white text-center mb-4">
                      Move Time! 🎉
                    </h3>
                    <p className="text-3xl text-white text-center font-bold">
                      {currentMovement.action}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
