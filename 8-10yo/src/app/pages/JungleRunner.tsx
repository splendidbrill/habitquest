import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function JungleRunner() {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [items, setItems] = useState<{ id: number; emoji: string; x: number; collected: boolean }[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [showMovementPrompt, setShowMovementPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState({ emoji: "", text: "" });
  const [animalBuddies, setAnimalBuddies] = useState<string[]>([]);

  const collectibles = ["🍎", "🍌", "💧", "⚽", "🍓", "🥕"];
  const movementPrompts = [
    { emoji: "🐸", text: "Jump like a frog!" },
    { emoji: "🦒", text: "Stretch like a giraffe!" },
    { emoji: "🐻", text: "Walk like a bear!" },
    { emoji: "🦘", text: "Hop like a kangaroo!" },
  ];

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = prev
          .map((item) => ({ ...item, x: item.x - 5 }))
          .filter((item) => item.x > -100);

        if (Math.random() > 0.7) {
          newItems.push({
            id: Date.now(),
            emoji: collectibles[Math.floor(Math.random() * collectibles.length)],
            x: 100,
            collected: false,
          });
        }

        return newItems;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (itemCount > 0 && itemCount % 5 === 0) {
      const prompt = movementPrompts[Math.floor(Math.random() * movementPrompts.length)];
      setCurrentPrompt(prompt);
      setShowMovementPrompt(true);
      setTimeout(() => setShowMovementPrompt(false), 3000);
    }
  }, [itemCount]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setItems([]);
    setItemCount(0);
    setAnimalBuddies([]);
  };

  const collectItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, collected: true } : item
      )
    );
    setScore((s) => s + 10);
    setItemCount((c) => c + 1);

    if (Math.random() > 0.8) {
      const animals = ["🐵", "🦁", "🐯", "🐼", "🐨", "🦊"];
      const newBuddy = animals[Math.floor(Math.random() * animals.length)];
      if (!animalBuddies.includes(newBuddy)) {
        setAnimalBuddies((prev) => [...prev, newBuddy]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-cyan-200 to-green-200 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/game-hub">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-blue-900">Jungle Adventure Runner</h1>
        <div className="w-10"></div>
      </div>

      {gameActive && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-blue-600 text-sm mb-1">Score</p>
            <motion.p key={score} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-3xl text-blue-900">
              {score}
            </motion.p>
          </Card>
          <Card className="p-4 bg-white shadow-lg text-center">
            <p className="text-blue-600 text-sm mb-1">Items</p>
            <p className="text-3xl text-blue-900">{itemCount}</p>
          </Card>
        </div>
      )}

      <Card className="p-6 mb-6 bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl min-h-[400px] relative overflow-hidden">
        {!gameActive ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-8xl mb-6">
              🏃
            </motion.div>
            <h3 className="text-white mb-4">Ready to run?</h3>
            <Button onClick={startGame} className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
              Start Running!
            </Button>
          </div>
        ) : (
          <div className="relative h-full">
            <div className="absolute bottom-20 left-8">
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-6xl">
                🏃
              </motion.div>
            </div>

            <div className="absolute top-0 left-0 right-0 h-full">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ x: "100%" }}
                  animate={{ x: `${item.x}%` }}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  onClick={() => !item.collected && collectItem(item.id)}
                >
                  <motion.div
                    className={`text-5xl cursor-pointer ${item.collected ? 'opacity-0' : 'opacity-100'}`}
                    whileTap={{ scale: 1.5 }}
                  >
                    {item.emoji}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-lg">Tap items to collect!</p>
            </div>

            {animalBuddies.length > 0 && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2">
                <p className="text-xs text-blue-600 mb-1">Animal Friends:</p>
                <div className="flex gap-1">
                  {animalBuddies.map((buddy, i) => (
                    <span key={i} className="text-2xl">{buddy}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {gameActive && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button onClick={() => collectItem(items[0]?.id)} className="bg-blue-600 hover:bg-blue-700">
            Collect!
          </Button>
          <Button onClick={() => setScore((s) => s + 5)} className="bg-green-600 hover:bg-green-700">
            Jump!
          </Button>
          <Button onClick={() => {}} className="bg-purple-600 hover:bg-purple-700">
            Duck!
          </Button>
        </div>
      )}

      {!gameActive && score > 0 && (
        <Card className="p-6 bg-white shadow-xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-blue-900 mb-2">Amazing run!</h3>
          <p className="text-blue-700 mb-4">You collected {itemCount} items!</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-xl text-blue-900">+{itemCount * 2} XP</span>
          </div>
          <Button onClick={startGame} className="bg-gradient-to-r from-blue-600 to-cyan-600">
            Run Again!
          </Button>
        </Card>
      )}

      <Dialog open={showMovementPrompt} onOpenChange={setShowMovementPrompt}>
        <DialogContent className="bg-gradient-to-br from-purple-400 to-pink-500 text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Movement Time!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: 3 }} className="text-8xl mb-4">
              {currentPrompt.emoji}
            </motion.div>
            <p className="text-2xl text-white">{currentPrompt.text}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
