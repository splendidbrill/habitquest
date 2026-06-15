import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, X, Trophy, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";

type FoodItem = {
  id: string;
  emoji: string;
  name: string;
  category: "energy" | "protein" | "fresh";
};

export default function LunchBuilder() {
  const [lunchbox, setLunchbox] = useState<FoodItem[]>([]);
  const [isBalanced, setIsBalanced] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const foods: FoodItem[] = [
    // Energy Foods
    { id: "rice", emoji: "🍚", name: "Rice", category: "energy" },
    { id: "bread", emoji: "🍞", name: "Bread", category: "energy" },
    { id: "pasta", emoji: "🍝", name: "Pasta", category: "energy" },
    { id: "potato", emoji: "🥔", name: "Potato", category: "energy" },
    // Protein Foods
    { id: "egg", emoji: "🥚", name: "Egg", category: "protein" },
    { id: "chicken", emoji: "🍗", name: "Chicken", category: "protein" },
    { id: "beans", emoji: "🫘", name: "Beans", category: "protein" },
    { id: "cheese", emoji: "🧀", name: "Cheese", category: "protein" },
    // Fresh Foods
    { id: "apple", emoji: "🍎", name: "Apple", category: "fresh" },
    { id: "carrot", emoji: "🥕", name: "Carrot", category: "fresh" },
    { id: "cucumber", emoji: "🥒", name: "Cucumber", category: "fresh" },
    { id: "tomato", emoji: "🍅", name: "Tomato", category: "fresh" },
    { id: "banana", emoji: "🍌", name: "Banana", category: "fresh" },
  ];

  const addToLunchbox = (food: FoodItem) => {
    if (lunchbox.length < 6 && !lunchbox.find((f) => f.id === food.id)) {
      const newLunchbox = [...lunchbox, food];
      setLunchbox(newLunchbox);
      checkBalance(newLunchbox);
    }
  };

  const removeFromLunchbox = (id: string) => {
    const newLunchbox = lunchbox.filter((f) => f.id !== id);
    setLunchbox(newLunchbox);
    checkBalance(newLunchbox);
  };

  const checkBalance = (items: FoodItem[]) => {
    const hasEnergy = items.some((f) => f.category === "energy");
    const hasProtein = items.some((f) => f.category === "protein");
    const hasFresh = items.some((f) => f.category === "fresh");
    const balanced = hasEnergy && hasProtein && hasFresh;
    setIsBalanced(balanced);
    if (balanced && !showSuccess) {
      setShowSuccess(true);
    }
  };

  const reset = () => {
    setLunchbox([]);
    setIsBalanced(false);
    setShowSuccess(false);
  };

  const energyCount = lunchbox.filter((f) => f.category === "energy").length;
  const proteinCount = lunchbox.filter((f) => f.category === "protein").length;
  const freshCount = lunchbox.filter((f) => f.category === "fresh").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-cyan-50 to-sky-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-blue-900">Build Your Lunch</h1>
        <Button onClick={reset} variant="ghost" size="sm" className="text-blue-600">
          Reset
        </Button>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🍱
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1">Lunch Builder Game!</h2>
            <p className="text-blue-100">Create a balanced meal</p>
          </div>
        </div>
      </Card>

      {/* Lunchbox */}
      <Card className="p-6 mb-6 bg-white shadow-lg">
        <h3 className="text-blue-900 mb-3">Your Lunchbox ({lunchbox.length}/6)</h3>
        {lunchbox.length === 0 ? (
          <div className="text-center py-8 text-blue-400">
            Tap foods below to add them!
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {lunchbox.map((food) => (
              <motion.div
                key={food.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <span className="text-4xl">{food.emoji}</span>
                  <p className="text-xs text-blue-700 mt-1">{food.name}</p>
                </div>
                <button
                  onClick={() => removeFromLunchbox(food.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Balance Checklist */}
      <Card className="p-4 mb-6 bg-blue-50 border-2 border-blue-200">
        <h4 className="text-blue-900 mb-3">Balanced Meal Checklist:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {energyCount > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-blue-300" />
            )}
            <span className="text-blue-700">⚡ Energy Food ({energyCount})</span>
          </div>
          <div className="flex items-center gap-2">
            {proteinCount > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-blue-300" />
            )}
            <span className="text-blue-700">💪 Protein Food ({proteinCount})</span>
          </div>
          <div className="flex items-center gap-2">
            {freshCount > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-blue-300" />
            )}
            <span className="text-blue-700">🥗 Fresh Food ({freshCount})</span>
          </div>
        </div>
      </Card>

      {/* Food Categories */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-blue-900 mb-2">⚡ Energy Foods</h4>
          <div className="grid grid-cols-4 gap-2">
            {foods
              .filter((f) => f.category === "energy")
              .map((food) => (
                <motion.div
                  key={food.id}
                  whileTap={{ scale: 0.9 }}
                >
                  <Card
                    onClick={() => addToLunchbox(food)}
                    className={`p-3 text-center cursor-pointer ${
                      lunchbox.find((f) => f.id === food.id)
                        ? 'bg-blue-100 opacity-50'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-3xl">{food.emoji}</span>
                    <p className="text-xs text-blue-700 mt-1">{food.name}</p>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-blue-900 mb-2">💪 Protein Foods</h4>
          <div className="grid grid-cols-4 gap-2">
            {foods
              .filter((f) => f.category === "protein")
              .map((food) => (
                <motion.div
                  key={food.id}
                  whileTap={{ scale: 0.9 }}
                >
                  <Card
                    onClick={() => addToLunchbox(food)}
                    className={`p-3 text-center cursor-pointer ${
                      lunchbox.find((f) => f.id === food.id)
                        ? 'bg-blue-100 opacity-50'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-3xl">{food.emoji}</span>
                    <p className="text-xs text-blue-700 mt-1">{food.name}</p>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-blue-900 mb-2">🥗 Fresh Foods</h4>
          <div className="grid grid-cols-4 gap-2">
            {foods
              .filter((f) => f.category === "fresh")
              .map((food) => (
                <motion.div
                  key={food.id}
                  whileTap={{ scale: 0.9 }}
                >
                  <Card
                    onClick={() => addToLunchbox(food)}
                    className={`p-3 text-center cursor-pointer ${
                      lunchbox.find((f) => f.id === food.id)
                        ? 'bg-blue-100 opacity-50'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-3xl">{food.emoji}</span>
                    <p className="text-xs text-blue-700 mt-1">{food.name}</p>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {showSuccess && isBalanced && (
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="p-8 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-xl text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-white mb-3">Awesome Lunch!</h2>
            <p className="text-green-100 mb-6">
              That balanced meal will power your football game!
            </p>

            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
              <p className="text-white mb-1">Badge Earned:</p>
              <p className="text-xl text-white">Lunch Builder</p>
            </div>

            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-2xl text-white">+3 Points</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
