import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Circle, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";

export default function FoodTracker() {
  const [foodsTried, setFoodsTried] = useState<string[]>([]);

  const healthyFoods = [
    { id: "apple", emoji: "🍎", name: "Apple", category: "fruit" },
    { id: "banana", emoji: "🍌", name: "Banana", category: "fruit" },
    { id: "carrot", emoji: "🥕", name: "Carrot", category: "veggie" },
    { id: "broccoli", emoji: "🥦", name: "Broccoli", category: "veggie" },
    { id: "strawberry", emoji: "🍓", name: "Strawberry", category: "fruit" },
    { id: "cucumber", emoji: "🥒", name: "Cucumber", category: "veggie" },
    { id: "orange", emoji: "🍊", name: "Orange", category: "fruit" },
    { id: "pepper", emoji: "🫑", name: "Bell Pepper", category: "veggie" },
    { id: "grapes", emoji: "🍇", name: "Grapes", category: "fruit" },
    { id: "tomato", emoji: "🍅", name: "Tomato", category: "veggie" },
    { id: "watermelon", emoji: "🍉", name: "Watermelon", category: "fruit" },
    { id: "spinach", emoji: "🥬", name: "Spinach", category: "veggie" },
  ];

  const toggleFood = (id: string) => {
    if (foodsTried.includes(id)) {
      setFoodsTried(foodsTried.filter((f) => f !== id));
    } else {
      setFoodsTried([...foodsTried, id]);
    }
  };

  const fruitsTried = healthyFoods.filter(
    (f) => f.category === "fruit" && foodsTried.includes(f.id)
  ).length;

  const veggiesTried = healthyFoods.filter(
    (f) => f.category === "veggie" && foodsTried.includes(f.id)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-emerald-50 to-lime-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-green-900">Foods I've Tried</h1>
        <div className="w-10"></div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white mb-1">Food Explorer!</h2>
            <p className="text-green-100">Track all the healthy foods you try</p>
          </div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-3xl mb-1">{fruitsTried}</p>
            <p className="text-sm text-green-100">Fruits 🍎</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-3xl mb-1">{veggiesTried}</p>
            <p className="text-sm text-green-100">Veggies 🥕</p>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-green-900 mb-3">Tap foods you've tried!</h3>
        <div className="grid grid-cols-2 gap-3">
          {healthyFoods.map((food) => {
            const isTried = foodsTried.includes(food.id);
            return (
              <motion.div
                key={food.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  onClick={() => toggleFood(food.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isTried
                      ? 'bg-green-100 border-2 border-green-500 shadow-lg'
                      : 'bg-white border-2 border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{food.emoji}</span>
                    <div className="flex-1">
                      <p className="text-green-900">{food.name}</p>
                    </div>
                    {isTried ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-green-300" />
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {foodsTried.length >= 5 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
            <div className="text-6xl mb-3">🏆</div>
            <h3 className="text-white mb-2">Amazing Explorer!</h3>
            <p className="text-yellow-100">You've tried {foodsTried.length} healthy foods!</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
