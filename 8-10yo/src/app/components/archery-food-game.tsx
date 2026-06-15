import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";

const GAME_WIDTH = 360;
const GAME_HEIGHT = 500;

interface FoodItem {
  id: number;
  emoji: string;
  name: string;
  isHealthy: boolean;
  points: number;
  x: number;
  y: number;
  message: string;
}

const healthyFoods = [
  { emoji: "🍎", name: "Apple", points: 10, message: "Apples give you super energy!" },
  { emoji: "🥕", name: "Carrot", points: 10, message: "Carrots make you see better!" },
  { emoji: "🍌", name: "Banana", points: 10, message: "Bananas help you run fast!" },
  { emoji: "🥦", name: "Broccoli", points: 10, message: "Broccoli makes you strong!" },
  { emoji: "🍊", name: "Orange", points: 10, message: "Oranges keep you healthy!" },
  { emoji: "🍓", name: "Strawberry", points: 10, message: "Strawberries are super yummy!" },
];

const unhealthyFoods = [
  { emoji: "🍩", name: "Donut", points: 2, message: "Sometimes treats are okay!" },
  { emoji: "🍬", name: "Candy", points: 2, message: "Save sweets for special days!" },
  { emoji: "🍟", name: "Fries", points: 2, message: "Try sweet potato instead!" },
  { emoji: "🍕", name: "Pizza", points: 2, message: "Add veggies to make it better!" },
];

export function ArcheryFoodGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [arrowX, setArrowX] = useState(GAME_WIDTH / 2);
  const [shooting, setShooting] = useState(false);
  const [arrowY, setArrowY] = useState(GAME_HEIGHT - 80);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hitMessage, setHitMessage] = useState<{ text: string; points: number; color: string } | null>(null);
  const [healthyCount, setHealthyCount] = useState(0);

  // Game timer
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

  // Spawn foods
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      const allFoods = [...healthyFoods, ...unhealthyFoods];
      const randomFood = allFoods[Math.floor(Math.random() * allFoods.length)];
      const isHealthy = healthyFoods.some(f => f.emoji === randomFood.emoji);

      const newFood: FoodItem = {
        id: Date.now() + Math.random(),
        emoji: randomFood.emoji,
        name: randomFood.name,
        isHealthy,
        points: randomFood.points,
        x: Math.random() * (GAME_WIDTH - 60) + 30,
        y: -50,
        message: randomFood.message,
      };

      setFoods(prev => [...prev, newFood]);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver]);

  // Move foods down
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveInterval = setInterval(() => {
      setFoods(prev =>
        prev
          .map(food => ({ ...food, y: food.y + 3 }))
          .filter(food => food.y < GAME_HEIGHT)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver]);

  // Arrow shooting animation
  useEffect(() => {
    if (!shooting) return;

    const shootInterval = setInterval(() => {
      setArrowY(prev => {
        if (prev <= 0) {
          setShooting(false);
          return GAME_HEIGHT - 80;
        }
        return prev - 15;
      });
    }, 20);

    return () => clearInterval(shootInterval);
  }, [shooting]);

  // Collision detection
  useEffect(() => {
    if (!shooting) return;

    foods.forEach(food => {
      const distance = Math.sqrt(
        Math.pow(food.x - arrowX, 2) + Math.pow(food.y - arrowY, 2)
      );

      if (distance < 35) {
        // Hit!
        setScore(prev => prev + food.points);
        if (food.isHealthy) {
          setHealthyCount(prev => prev + 1);
        }
        setHitMessage({
          text: food.message,
          points: food.points,
          color: food.isHealthy ? "from-green-400 to-emerald-500" : "from-yellow-400 to-orange-400"
        });
        setTimeout(() => setHitMessage(null), 1500);

        setFoods(prev => prev.filter(f => f.id !== food.id));
        setShooting(false);
        setArrowY(GAME_HEIGHT - 80);
      }
    });
  }, [shooting, arrowY, arrowX, foods]);

  const handleShoot = (side: 'left' | 'right') => {
    if (shooting) return;

    const targetX = side === 'left' ? GAME_WIDTH * 0.25 : GAME_WIDTH * 0.75;
    setArrowX(targetX);
    setShooting(true);
  };

  const handleFinish = () => {
    const stars = Math.floor(score / 2);
    const currentStars = parseInt(localStorage.getItem("totalStars") || "0");
    localStorage.setItem("totalStars", String(currentStars + stars));

    navigate("/game-hub");
  };

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" :
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 p-6 py-12">
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
              🏹
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Healthy Food Archery! 🎯
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Shoot arrows at healthy foods!
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">How to Play:</h3>
              <div className="space-y-4 text-left">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                  <div className="text-4xl mb-2">🍎</div>
                  <p className="text-lg font-bold text-green-900 mb-1">Healthy Foods = 10 Points!</p>
                  <p className="text-base text-green-800">Shoot apples, carrots, bananas!</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4">
                  <div className="text-4xl mb-2">🍩</div>
                  <p className="text-lg font-bold text-orange-900 mb-1">Treats = 2 Points</p>
                  <p className="text-base text-orange-800">You can shoot these too!</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4">
                  <p className="text-lg text-blue-900">
                    🏹 Tap LEFT or RIGHT to aim and shoot!
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white mb-4"
            >
              Start Shooting! 🏹
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/game-hub")}
              className="w-full bg-gray-200 rounded-full py-6 shadow-xl text-2xl font-bold text-gray-700"
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
              Amazing Shooting! 🎯
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
              <div className="text-7xl mb-4">🏹</div>
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {score}
              </div>
              <div className="text-2xl text-gray-700 mb-4">
                Total Points!
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6">
                <div className="text-5xl mb-2">🍎</div>
                <div className="text-3xl font-bold text-green-800">
                  {healthyCount} Healthy Foods Hit!
                </div>
                <p className="text-lg text-green-700 mt-2">
                  You're a healthy food champion! 🌟
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 shadow-xl mb-8">
              <div className="text-5xl mb-3">⭐</div>
              <div className="text-3xl font-bold text-amber-800">
                +{Math.floor(score / 2)} Stars Earned!
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white"
            >
              Continue! 🏠
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
                  <span className="text-2xl font-bold text-purple-600">
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

            {/* Score Legend */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 shadow-lg">
                <p className="text-lg font-bold text-white text-center">
                  🍎 = 10 pts
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-3 shadow-lg">
                <p className="text-lg font-bold text-white text-center">
                  🍩 = 2 pts
                </p>
              </div>
            </div>

            {/* Game Area */}
            <div
              className="relative bg-gradient-to-br from-sky-300 to-blue-200 rounded-3xl shadow-2xl mx-auto overflow-hidden"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {/* Falling Foods */}
              <AnimatePresence>
                {foods.map(food => (
                  <motion.div
                    key={food.id}
                    className="absolute"
                    style={{
                      left: food.x,
                      top: food.y,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <div className={`text-5xl ${food.isHealthy ? 'drop-shadow-lg' : ''}`}>
                      {food.emoji}
                    </div>
                    {food.isHealthy && (
                      <div className="absolute -top-1 -right-1 text-xl">✨</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Arrow */}
              <motion.div
                className="absolute"
                style={{
                  left: arrowX - 15,
                  top: arrowY,
                }}
                animate={{
                  rotate: shooting ? 0 : [0, -5, 5, 0],
                }}
                transition={{
                  duration: shooting ? 0 : 1,
                  repeat: shooting ? 0 : Infinity,
                }}
              >
                <div className="text-5xl">🏹</div>
              </motion.div>

              {/* Archer at bottom */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              >
                <div className="text-6xl">{buddyEmoji}</div>
              </div>

              {/* Hit Message */}
              <AnimatePresence>
                {hitMessage && (
                  <motion.div
                    initial={{ scale: 0, y: GAME_HEIGHT / 2 }}
                    animate={{ scale: 1, y: GAME_HEIGHT / 3 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${hitMessage.color} rounded-2xl px-6 py-4 shadow-2xl`}
                  >
                    <p className="text-2xl font-bold text-white text-center mb-1">
                      +{hitMessage.points} Points! 🎉
                    </p>
                    <p className="text-base text-white text-center">
                      {hitMessage.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls - BIG BUTTONS */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShoot('left')}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl p-8 shadow-2xl"
                disabled={shooting}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">⬅️</div>
                  <div className="text-2xl font-bold text-white">
                    Shoot Left
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShoot('right')}
                className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl p-8 shadow-2xl"
                disabled={shooting}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">➡️</div>
                  <div className="text-2xl font-bold text-white">
                    Shoot Right
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Educational tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-4 bg-white rounded-2xl p-4 shadow-lg text-center"
            >
              <p className="text-lg text-gray-700">
                💡 <span className="font-bold">Tip:</span> Healthy foods give you{" "}
                <span className="text-green-600 font-bold">5X more points</span>!
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
