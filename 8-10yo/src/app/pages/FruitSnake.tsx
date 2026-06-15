import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Star, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

type Position = { x: number; y: number };
type Fruit = { emoji: string; fact: string; points: number };

export default function FruitSnake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [fruit, setFruit] = useState<Position>({ x: 10, y: 10 });
  const [currentFruit, setCurrentFruit] = useState<Fruit | null>(null);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showFact, setShowFact] = useState(false);
  const [collectedFruits, setCollectedFruits] = useState<string[]>([]);

  const fruits: Fruit[] = [
    { emoji: "🍎", fact: "Apples help keep your tummy happy and give you steady energy!", points: 10 },
    { emoji: "🍌", fact: "Bananas are packed with energy for your adventures!", points: 10 },
    { emoji: "🥕", fact: "Carrots boost superhero vision and help you see in the dark!", points: 15 },
    { emoji: "🍓", fact: "Strawberries are full of vitamins to keep you strong!", points: 10 },
    { emoji: "🍊", fact: "Oranges have vitamin C to help you fight off sniffles!", points: 10 },
    { emoji: "🥦", fact: "Broccoli makes your muscles and bones super strong!", points: 15 },
  ];

  const gridSize = 15;

  const generateFruit = useCallback(() => {
    const newX = Math.floor(Math.random() * gridSize);
    const newY = Math.floor(Math.random() * gridSize);
    setFruit({ x: newX, y: newY });
    setCurrentFruit(fruits[Math.floor(Math.random() * fruits.length)]);
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (!gameActive) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + gridSize) % gridSize,
          y: (prevSnake[0].y + direction.y + gridSize) % gridSize,
        };

        if (newHead.x === fruit.x && newHead.y === fruit.y) {
          setScore((s) => s + (currentFruit?.points || 10));
          if (currentFruit) {
            setCollectedFruits((prev) => [...prev, currentFruit.emoji]);
            setShowFact(true);
            setTimeout(() => setShowFact(false), 3000);
          }
          generateFruit();
          return [newHead, ...prevSnake];
        }

        return [newHead, ...prevSnake.slice(0, -1)];
      });
    }, 200);

    return () => clearInterval(moveSnake);
  }, [gameActive, direction, fruit, currentFruit, generateFruit]);

  const startGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setTimeLeft(90);
    setCollectedFruits([]);
    setGameActive(true);
    generateFruit();
  };

  const handleKeyPress = useCallback((key: string) => {
    if (key === "ArrowUp" && direction.y === 0) setDirection({ x: 0, y: -1 });
    if (key === "ArrowDown" && direction.y === 0) setDirection({ x: 0, y: 1 });
    if (key === "ArrowLeft" && direction.x === 0) setDirection({ x: -1, y: 0 });
    if (key === "ArrowRight" && direction.x === 0) setDirection({ x: 1, y: 0 });
  }, [direction]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 via-emerald-200 to-lime-100 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/game-hub">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-green-900">Fruit Snake Explorer</h1>
        <div className="w-10"></div>
      </div>

      {gameActive && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-green-600 text-sm mb-1">Score</p>
            <motion.p key={score} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-3xl text-green-900">
              {score}
            </motion.p>
          </Card>
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-green-600 text-sm mb-1">Time</p>
            <motion.p className={`text-3xl ${timeLeft < 20 ? 'text-red-600' : 'text-green-900'}`}>
              {timeLeft}s
            </motion.p>
          </Card>
        </div>
      )}

      <Card className="p-4 mb-6 bg-white shadow-xl">
        {!gameActive && timeLeft === 90 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-6">
              🐍
            </motion.div>
            <h3 className="text-green-900 mb-4">Ready to explore?</h3>
            <Button onClick={startGame} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-6">
              Start Game!
            </Button>
          </div>
        ) : gameActive ? (
          <div className="relative">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
              {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                const isSnake = snake.some((s) => s.x === x && s.y === y);
                const isFruit = fruit.x === x && fruit.y === y;
                const isHead = snake[0].x === x && snake[0].y === y;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded ${
                      isHead ? 'bg-green-600' : isSnake ? 'bg-green-400' : isFruit ? 'bg-yellow-200' : 'bg-green-50'
                    } flex items-center justify-center text-xs`}
                  >
                    {isFruit && <span className="text-sm">{currentFruit?.emoji}</span>}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div />
              <Button onClick={() => handleKeyPress("ArrowUp")} className="bg-green-600 hover:bg-green-700">↑</Button>
              <div />
              <Button onClick={() => handleKeyPress("ArrowLeft")} className="bg-green-600 hover:bg-green-700">←</Button>
              <Button onClick={() => handleKeyPress("ArrowDown")} className="bg-green-600 hover:bg-green-700">↓</Button>
              <Button onClick={() => handleKeyPress("ArrowRight")} className="bg-green-600 hover:bg-green-700">→</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-green-900 mb-2">Great exploring!</h3>
              <p className="text-green-700 mb-4">Final Score: {score}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {collectedFruits.map((f, i) => (
                  <span key={i} className="text-3xl">{f}</span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-xl text-green-900">+{collectedFruits.length * 5} XP</span>
              </div>
              <Button onClick={startGame} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Play Again
              </Button>
            </motion.div>
          </div>
        )}
      </Card>

      <Dialog open={showFact} onOpenChange={setShowFact}>
        <DialogContent className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Info className="w-6 h-6" />
              Fun Food Fact!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-6xl mb-4">{currentFruit?.emoji}</div>
            <p className="text-lg text-white">{currentFruit?.fact}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
