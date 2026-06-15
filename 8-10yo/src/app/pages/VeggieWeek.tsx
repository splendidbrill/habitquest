import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function VeggieWeek() {
  const [selectedVeggie, setSelectedVeggie] = useState<string | null>(null);
  const [showFact, setShowFact] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const veggies = [
    {
      id: "carrot",
      emoji: "🥕",
      name: "Carrots",
      color: "from-orange-400 to-amber-500",
      fact: "Carrots have beta-carotene that helps you see better, especially at night! They make your eyes sparkle! ✨",
    },
    {
      id: "broccoli",
      emoji: "🥦",
      name: "Broccoli",
      color: "from-green-400 to-emerald-500",
      fact: "Broccoli is like tiny trees that make your muscles super strong! It's a superhero food! 💪",
    },
    {
      id: "tomato",
      emoji: "🍅",
      name: "Tomatoes",
      color: "from-red-400 to-rose-500",
      fact: "Tomatoes are full of lycopene that keeps your heart happy and healthy! They're heart heroes! ❤️",
    },
    {
      id: "cucumber",
      emoji: "🥒",
      name: "Cucumber",
      color: "from-green-300 to-lime-400",
      fact: "Cucumbers are 96% water! They keep you cool and hydrated like a refreshing splash! 💧",
    },
    {
      id: "pepper",
      emoji: "🫑",
      name: "Bell Peppers",
      color: "from-yellow-400 to-green-400",
      fact: "Bell peppers have more vitamin C than oranges! They boost your immune power! 🛡️",
    },
  ];

  const currentVeggie = veggies.find((v) => v.id === selectedVeggie);

  const handleSelectVeggie = (id: string) => {
    setSelectedVeggie(id);
    setShowFact(true);
  };

  const markAttempt = () => {
    if (selectedVeggie) {
      const current = attempts[selectedVeggie] || 0;
      if (current < 2) {
        setAttempts({ ...attempts, [selectedVeggie]: current + 1 });
      }
    }
  };

  const totalAttempts = Object.values(attempts).reduce((sum, val) => sum + val, 0);
  const completedVeggies = Object.values(attempts).filter((val) => val >= 2).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-lime-50 to-emerald-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-green-900">Veggie of the Week</h1>
        <div className="w-10"></div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🥕
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1">Veggie Explorer!</h2>
            <p className="text-green-100">Try veggies twice this week</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm text-green-100 mb-1">Total Tries: {totalAttempts}</p>
          <p className="text-sm text-green-100">Completed: {completedVeggies}/5 veggies</p>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-green-900 mb-3">Choose your veggie challenge:</h3>
        <div className="space-y-3">
          {veggies.map((veggie) => {
            const tries = attempts[veggie.id] || 0;
            const isComplete = tries >= 2;

            return (
              <motion.div
                key={veggie.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => handleSelectVeggie(veggie.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isComplete
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-white border-2 border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${veggie.color} rounded-2xl flex items-center justify-center shadow-md`}>
                      <span className="text-4xl">{veggie.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-green-900 mb-2">{veggie.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-full rounded-full transition-all"
                            style={{ width: `${(tries / 2) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-green-700">{tries}/2</span>
                      </div>
                      {isComplete && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Completed!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {completedVeggies >= 3 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
            <div className="text-6xl mb-3">🏆</div>
            <h3 className="text-white mb-2">Veggie Explorer Badge!</h3>
            <p className="text-yellow-100 mb-2">You completed 3+ veggie challenges!</p>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 fill-white" />
              <span className="text-xl">+{completedVeggies * 5} Family Points</span>
            </div>
          </Card>
        </motion.div>
      )}

      <Dialog open={showFact} onOpenChange={setShowFact}>
        <DialogContent className={`bg-gradient-to-br ${currentVeggie?.color} text-white border-none`}>
          <DialogHeader>
            <DialogTitle className="text-white text-center">Fun Veggie Fact!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-7xl mb-4">{currentVeggie?.emoji}</div>
            <h3 className="text-2xl text-white mb-3">{currentVeggie?.name}</h3>
            <p className="text-lg text-white mb-6">{currentVeggie?.fact}</p>

            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <p className="text-white mb-2">Try it twice this week!</p>
              <Progress
                value={((attempts[currentVeggie?.id || ""] || 0) / 2) * 100}
                className="h-3 mb-2"
              />
              <p className="text-sm text-white">
                {attempts[currentVeggie?.id || ""] || 0} / 2 tries
              </p>
            </div>

            {(attempts[currentVeggie?.id || ""] || 0) < 2 && (
              <Button
                onClick={markAttempt}
                className="w-full bg-white text-green-600 hover:bg-green-50"
              >
                I Tried It! (+1)
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
