import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Trophy, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";

export default function SchoolFuel() {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  const todaysMissions = [
    {
      id: "water",
      icon: "💧",
      title: "Water Champion",
      description: "Drink water at breaks instead of juice",
      choices: ["Water bottle", "Fizzy drink", "Juice box"],
      correct: "Water bottle",
      tip: "Pro athletes drink water to stay at peak performance!",
      points: 2,
    },
    {
      id: "fresh",
      icon: "🍎",
      title: "Fresh Fuel",
      description: "Choose a fresh fruit or veggie",
      choices: ["Apple", "Crisps", "Chocolate"],
      correct: "Apple",
      tip: "Fresh foods give you energy that lasts all day!",
      points: 2,
    },
    {
      id: "veggie",
      icon: "🥕",
      title: "Veggie Power",
      description: "Add a vegetable to your lunch",
      choices: ["Carrot sticks", "Cookies", "Sweets"],
      correct: "Carrot sticks",
      tip: "Veggies build strong muscles and boost your immune system!",
      points: 2,
    },
  ];

  const smartSwaps = [
    { from: "🍟 Crisps", to: "🍿 Popcorn" },
    { from: "🍫 Chocolate", to: "🍌 Banana" },
    { from: "🥤 Soda", to: "💧 Water" },
    { from: "🍬 Sweets", to: "🍇 Grapes" },
    { from: "🍩 Donut", to: "🥯 Bagel" },
    { from: "🧃 Juice", to: "🍊 Orange" },
  ];

  const completeMission = (id: string) => {
    if (!completedMissions.includes(id)) {
      setCompletedMissions([...completedMissions, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-sky-50 to-cyan-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-blue-900">Fuel for School</h1>
        <div className="w-10"></div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🎒
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1">School Day Missions!</h2>
            <p className="text-blue-100">Make smart choices at school</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <p className="text-white">
            {completedMissions.length}/{todaysMissions.length} Missions Complete
          </p>
          <p className="text-sm text-blue-100 mt-1">
            +{completedMissions.length * 2} Points
          </p>
        </div>
      </Card>

      <Card className="p-4 mb-6 bg-purple-50 border-2 border-purple-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          <p className="text-sm text-purple-900">
            Making smart choices at school shows you're becoming independent!
          </p>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-blue-900 mb-3">Today's Missions:</h3>
        <div className="space-y-4">
          {todaysMissions.map((mission) => {
            const isComplete = completedMissions.includes(mission.id);

            return (
              <motion.div
                key={mission.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <Card
                  className={`p-5 ${
                    isComplete
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-white border-2 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-4xl">{mission.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-blue-900 mb-1">{mission.title}</h4>
                      <p className="text-sm text-blue-600 mb-2">{mission.description}</p>
                      {!isComplete && (
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <p className="text-xs text-yellow-800">💡 {mission.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isComplete ? (
                    <div className="space-y-2">
                      {mission.choices.map((choice) => (
                        <Button
                          key={choice}
                          onClick={() => {
                            if (choice === mission.correct) {
                              completeMission(mission.id);
                            }
                          }}
                          variant={choice === mission.correct ? "default" : "outline"}
                          className="w-full"
                        >
                          {choice}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-200 rounded-lg p-3 text-center">
                      <Trophy className="w-8 h-8 text-green-600 mx-auto mb-1" />
                      <p className="text-green-800">Mission Complete! +{mission.points} points</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-blue-900 mb-3">Smart Swaps for School:</h3>
        <Card className="p-4 bg-white shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            {smartSwaps.map((swap, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{swap.from}</span>
                <ArrowRight className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="text-green-600">{swap.to}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {completedMissions.length === todaysMissions.length && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="p-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-white mb-3">All Missions Complete!</h2>
            <p className="text-yellow-100 mb-6">
              You made awesome choices at school today!
            </p>

            <div className="bg-white/20 rounded-lg p-4">
              <Star className="w-12 h-12 text-yellow-300 mx-auto mb-2 fill-yellow-300" />
              <p className="text-3xl text-white">
                +{todaysMissions.length * 2} Points
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
