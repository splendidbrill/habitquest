import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Heart, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";

export default function ChooseDinner() {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  const meals = [
    {
      id: "dal-rice",
      emoji: "🍛",
      name: "Dal & Rice",
      description: "Creamy lentils with fluffy rice",
      benefits: "Protein power & steady energy!",
    },
    {
      id: "veggie-curry",
      emoji: "🍲",
      name: "Veggie Curry",
      description: "Colorful vegetables in mild curry",
      benefits: "Vitamins & tasty spices!",
    },
    {
      id: "roti-sabzi",
      emoji: "🫓",
      name: "Roti & Sabzi",
      description: "Soft roti with veggie sides",
      benefits: "Fiber & plant power!",
    },
    {
      id: "veggie-biryani",
      emoji: "🍚",
      name: "Veggie Biryani",
      description: "Spiced rice with mixed vegetables",
      benefits: "Energy & exciting flavors!",
    },
  ];

  const handleVote = () => {
    if (selectedMeal) {
      setVoted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-amber-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-orange-900">Help Choose Dinner</h1>
        <div className="w-10"></div>
      </div>

      {!voted ? (
        <>
          <Card className="p-6 mb-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-3"
            >
              🍽️
            </motion.div>
            <h2 className="text-white mb-2">Be the Dinner Helper!</h2>
            <p className="text-orange-100">Choose your favorite healthy meal</p>
          </Card>

          <div className="mb-6">
            <h3 className="text-orange-900 mb-3">Pick your dinner vote:</h3>
            <div className="space-y-3">
              {meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedMeal === meal.id
                        ? 'bg-orange-100 border-2 border-orange-500 shadow-lg'
                        : 'bg-white border-2 border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{meal.emoji}</div>
                      <div className="flex-1">
                        <h4 className="text-orange-900 mb-1">{meal.name}</h4>
                        <p className="text-sm text-orange-600 mb-1">{meal.description}</p>
                        <p className="text-xs text-green-600">✨ {meal.benefits}</p>
                      </div>
                      {selectedMeal === meal.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Heart className="w-6 h-6 text-orange-600 fill-orange-600" />
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleVote}
            disabled={!selectedMeal}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-lg"
          >
            Cast Your Vote!
          </Button>
        </>
      ) : (
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}>
          <Card className="p-8 bg-white shadow-xl text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-orange-900 mb-3">Thank you, Dinner Helper!</h2>
            <p className="text-orange-700 mb-6">
              Your vote helps the family decide together!
            </p>

            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
              <p className="text-orange-900 mb-1">Earned:</p>
              <p className="text-lg text-orange-700">"Dinner Helper" Badge</p>
              <p className="text-2xl text-green-600">+1 Family Point</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <p className="text-purple-900">
                🌟 You're helping make healthy choices for the whole family!
              </p>
            </div>

            <Link to="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Back to Home
              </Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
