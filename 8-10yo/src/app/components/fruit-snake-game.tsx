import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";

const GRID_SIZE = 12;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [{ x: 6, y: 6 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const fruits = [
  {
    emoji: "🍎",
    name: "Apple",
    fact: "Apples help keep your tummy happy and give you energy to play!",
    tastyWith: "Try with peanut butter or cheese!",
    whyGood: "Better than sweets - naturally sweet AND keeps you energized for hours of fun!"
  },
  {
    emoji: "🍌",
    name: "Banana",
    fact: "Bananas give you super energy for running and jumping!",
    tastyWith: "Yummy on toast or in smoothies!",
    whyGood: "Athletes eat these to run fast - just like you at playtime!"
  },
  {
    emoji: "🥕",
    name: "Carrot",
    fact: "Carrots boost your superhero vision - you can see better!",
    tastyWith: "Dip in hummus or crunch raw!",
    whyGood: "Way better than crisps - super crunchy AND makes your eyes strong!"
  },
  {
    emoji: "🍓",
    name: "Strawberry",
    fact: "Strawberries make your heart strong and happy!",
    tastyWith: "Mix with yogurt or eat fresh!",
    whyGood: "Sweeter than candy but helps you stay healthy and strong!"
  },
  {
    emoji: "🍊",
    name: "Orange",
    fact: "Oranges protect you from getting sick - like a shield!",
    tastyWith: "Eat as slices or drink fresh juice!",
    whyGood: "Better than fizzy drinks - juicy AND keeps colds away!"
  },
  {
    emoji: "🥦",
    name: "Broccoli",
    fact: "Broccoli helps you grow tall and strong like a tree!",
    tastyWith: "Great with cheese or in pasta!",
    whyGood: "Tiny green trees that make your muscles super powerful!"
  },
];

export function FruitSnakeGame() {
  const navigate = useNavigate();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [fruit, setFruit] = useState({ x: 3, y: 3, ...fruits[0] });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds max

  const generateFruit = useCallback(() => {
    const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      ...randomFruit,
    };
  }, []);

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

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Wall collision - wrap around (friendly for kids)
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;

        // Check fruit collision
        if (newHead.x === fruit.x && newHead.y === fruit.y) {
          setScore((prev) => prev + 1);
          setShowFact(true);
          setTimeout(() => {
            setShowFact(false);
            setFruit(generateFruit());
          }, 2000);
          return [newHead, ...prevSnake]; // Grow snake
        }

        // Move snake
        return [newHead, ...prevSnake.slice(0, -1)];
      });
    };

    const interval = setInterval(moveSnake, 300);
    return () => clearInterval(interval);
  }, [direction, fruit, gameStarted, gameOver, generateFruit]);

  const handleDirection = (newDir: { x: number; y: number }) => {
    // Prevent reversing
    if (newDir.x === -direction.x || newDir.y === -direction.y) return;
    setDirection(newDir);
  };

  const handleFinish = () => {
    // Save stars and collectibles
    const stars = parseInt(localStorage.getItem("totalStars") || "0");
    localStorage.setItem("totalStars", String(stars + score));
    
    const collectibles = JSON.parse(localStorage.getItem("fruitStickers") || "[]");
    collectibles.push(...new Set([...collectibles, fruit.emoji]));
    localStorage.setItem("fruitStickers", JSON.stringify(collectibles));

    navigate("/home");
  };

  const buddyEmoji = localStorage.getItem("selectedBuddy") === "tiger" ? "🐯" : 
                    localStorage.getItem("selectedBuddy") === "elephant" ? "🐘" :
                    localStorage.getItem("selectedBuddy") === "monkey" ? "🐵" : "🦁";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200 p-6 py-12">
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
              🐍
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Fruit Snake! 🍎
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Collect fruits and learn fun facts!
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">How to Play:</h3>
              <div className="space-y-3 text-left text-xl text-gray-700">
                <div>🐍 Control the snake with arrows</div>
                <div>🍎 Collect yummy fruits</div>
                <div>📚 Learn cool facts!</div>
                <div>⏰ 90 seconds to explore</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full py-8 shadow-2xl text-4xl font-bold text-white"
            >
              Start Game! 🚀
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
              Amazing Exploring! 🎉
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <div className="text-7xl mb-4">🍎</div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {score}
              </div>
              <div className="text-2xl text-gray-700">
                Fruits Collected!
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
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl font-bold text-green-600">
                    🍎 {score}
                  </span>
                </div>
                <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">
                    ⏰ {timeLeft}s
                  </span>
                </div>
              </div>
            </div>

            {/* Game Board */}
            <div 
              className="bg-gradient-to-br from-green-300 to-lime-200 rounded-3xl p-4 shadow-2xl mb-6 mx-auto"
              style={{ width: GRID_SIZE * CELL_SIZE + 32 }}
            >
              <div 
                className="relative"
                style={{ 
                  width: GRID_SIZE * CELL_SIZE, 
                  height: GRID_SIZE * CELL_SIZE,
                }}
              >
                {/* Grid background */}
                <div className="absolute inset-0 grid grid-cols-12 gap-0">
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <div key={i} className="border border-green-200/20" />
                  ))}
                </div>

                {/* Snake */}
                {snake.map((segment, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg"
                    style={{
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {i === 0 && <div className="text-xs text-center">😊</div>}
                  </motion.div>
                ))}

                {/* Fruit */}
                <motion.div
                  className="absolute"
                  style={{
                    left: fruit.x * CELL_SIZE,
                    top: fruit.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <div className="text-xl">{fruit.emoji}</div>
                </motion.div>
              </div>
            </div>

            {/* Controls - BIG BUTTONS */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirection({ x: 0, y: -1 })}
                className="bg-white rounded-2xl p-6 shadow-xl text-4xl"
              >
                ⬆️
              </motion.button>
              <div></div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirection({ x: -1, y: 0 })}
                className="bg-white rounded-2xl p-6 shadow-xl text-4xl"
              >
                ⬅️
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirection({ x: 1, y: 0 })}
                className="bg-white rounded-2xl p-6 shadow-xl text-4xl"
              >
                ➡️
              </motion.button>
              
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirection({ x: 0, y: 1 })}
                className="bg-white rounded-2xl p-6 shadow-xl text-4xl"
              >
                ⬇️
              </motion.button>
              <div></div>
            </div>

            {/* Fun Fact Popup */}
            <AnimatePresence>
              {showFact && (
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
                    className="bg-white rounded-3xl p-8 shadow-2xl max-w-md"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 0.5, repeat: 2 }}
                      className="text-8xl text-center mb-4"
                    >
                      {fruit.emoji}
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                      {fruit.name}!
                    </h3>

                    {/* Main fact */}
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-5 mb-3">
                      <p className="text-lg text-gray-800 text-center font-bold mb-2">
                        {fruit.fact}
                      </p>
                    </div>

                    {/* Tasty combinations */}
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-4 mb-3">
                      <p className="text-base font-bold text-orange-900 text-center mb-1">
                        😋 Try it:
                      </p>
                      <p className="text-sm text-orange-800 text-center">
                        {fruit.tastyWith}
                      </p>
                    </div>

                    {/* Why good */}
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                      <p className="text-base font-bold text-purple-900 text-center mb-1">
                        ⭐ Did you know?
                      </p>
                      <p className="text-sm text-purple-800 text-center">
                        {fruit.whyGood}
                      </p>
                    </div>
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
