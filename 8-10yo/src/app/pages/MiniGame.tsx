import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";

export default function MiniGame() {
  const { gameType } = useParams();
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const games: Record<string, { name: string; icon: string; description: string }> = {
    "fruit-catcher": {
      name: "Fruit Catcher",
      icon: "🍎",
      description: "Catch the falling fruits!",
    },
    "treasure-dash": {
      name: "Treasure Dash",
      icon: "💎",
      description: "Collect treasures quickly!",
    },
    "sleep-stars": {
      name: "Sleep Star Collector",
      icon: "⭐",
      description: "Gather dream stars!",
    },
    "penalty-shootout": {
      name: "Penalty Shootout",
      icon: "⚽",
      description: "Score goals!",
    },
  };

  const currentGame = games[gameType || "fruit-catcher"] || games["fruit-catcher"];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
  };

  const handleClick = () => {
    if (gameActive) {
      setScore(score + 10);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/map">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">{currentGame.name}</h1>
        <div className="w-10"></div>
      </div>

      {/* Game Info */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            {currentGame.icon}
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white">{currentGame.name}</h2>
            <p className="text-purple-100">{currentGame.description}</p>
          </div>
        </div>
      </Card>

      {/* Game Stats */}
      {gameActive && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-purple-600 text-sm mb-1">Score</p>
            <motion.p
              key={score}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-3xl text-purple-900"
            >
              {score}
            </motion.p>
          </Card>
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-purple-600 text-sm mb-1">Time</p>
            <motion.p
              className={`text-3xl ${timeLeft < 10 ? 'text-red-600' : 'text-purple-900'}`}
              animate={timeLeft < 10 ? { scale: [1, 1.2, 1] } : {}}
            >
              {timeLeft}s
            </motion.p>
          </Card>
        </div>
      )}

      {/* Game Area */}
      <Card className="p-8 mb-6 bg-gradient-to-br from-sky-200 to-blue-100 shadow-xl min-h-[400px] relative overflow-hidden">
        {!gameActive && timeLeft === 30 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              {currentGame.icon}
            </motion.div>
            <h3 className="text-purple-900 mb-4">Ready to Play?</h3>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
            >
              Start Game!
            </Button>
          </div>
        ) : gameActive ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              onClick={handleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
              }}
              transition={{ duration: 1 }}
              className="text-8xl cursor-pointer"
            >
              {currentGame.icon}
            </motion.div>
            <p className="text-purple-700 mt-6">Tap to collect!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-purple-900 mb-2">Game Over!</h3>
              <p className="text-purple-700 mb-4">Final Score: {score}</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-xl text-purple-900">+{Math.floor(score / 2)} XP</span>
              </div>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Play Again
              </Button>
            </motion.div>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-white/90 backdrop-blur shadow-lg">
        <h4 className="text-purple-900 mb-2">How to Play</h4>
        <ul className="text-purple-700 text-sm space-y-1">
          <li>• Tap the {currentGame.icon} to score points</li>
          <li>• You have 30 seconds to get the highest score</li>
          <li>• Earn XP based on your final score!</li>
        </ul>
      </Card>
    </div>
  );
}
