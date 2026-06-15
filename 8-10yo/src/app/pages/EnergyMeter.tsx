import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Zap, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

type LogEntry = {
  id: string;
  type: "food" | "activity";
  emoji: string;
  name: string;
  points: number;
  time: string;
};

export default function EnergyMeter() {
  const [energy, setEnergy] = useState(60);
  const [log, setLog] = useState<LogEntry[]>([
    { id: "1", type: "food", emoji: "🍌", name: "Banana", points: 12, time: "8:30 AM" },
    { id: "2", type: "activity", emoji: "⚽", name: "Football", points: 15, time: "10:00 AM" },
  ]);
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  const healthyFoods = [
    { emoji: "🍎", name: "Apple", points: 10 },
    { emoji: "🍌", name: "Banana", points: 12 },
    { emoji: "🥕", name: "Carrot", points: 8 },
    { emoji: "🥦", name: "Broccoli", points: 10 },
    { emoji: "🍚", name: "Rice", points: 15 },
    { emoji: "🍞", name: "Bread", points: 12 },
    { emoji: "🥚", name: "Egg", points: 13 },
    { emoji: "🥛", name: "Milk", points: 10 },
  ];

  const treatFoods = [
    { emoji: "🍫", name: "Chocolate", points: -5 },
    { emoji: "🍟", name: "Crisps", points: -6 },
    { emoji: "🥤", name: "Soda", points: -7 },
    { emoji: "🍩", name: "Donut", points: -8 },
  ];

  const activities = [
    { emoji: "⚽", name: "Football", points: 15 },
    { emoji: "🏃", name: "Running", points: 12 },
    { emoji: "🚴", name: "Cycling", points: 13 },
    { emoji: "🏊", name: "Swimming", points: 14 },
    { emoji: "🤸", name: "Playing", points: 10 },
    { emoji: "🧘", name: "Stretching", points: 8 },
  ];

  const addFood = (food: { emoji: string; name: string; points: number }) => {
    const newEnergy = Math.max(0, Math.min(100, energy + food.points));
    setEnergy(newEnergy);
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setLog([
      ...log,
      {
        id: Date.now().toString(),
        type: "food",
        emoji: food.emoji,
        name: food.name,
        points: food.points,
        time,
      },
    ]);
    setShowFoodDialog(false);
  };

  const addActivity = (activity: { emoji: string; name: string; points: number }) => {
    const newEnergy = Math.min(100, energy + activity.points);
    setEnergy(newEnergy);
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setLog([
      ...log,
      {
        id: Date.now().toString(),
        type: "activity",
        emoji: activity.emoji,
        name: activity.name,
        points: activity.points,
        time,
      },
    ]);
    setShowActivityDialog(false);
  };

  const getEnergyStatus = () => {
    if (energy >= 80) return { text: "Champion Energy!", emoji: "🔥", color: "from-green-400 to-emerald-500" };
    if (energy >= 60) return { text: "Great Energy", emoji: "⚡", color: "from-blue-400 to-cyan-500" };
    if (energy >= 40) return { text: "Moderate Energy", emoji: "💪", color: "from-yellow-400 to-orange-500" };
    return { text: "Need Fuel!", emoji: "🔋", color: "from-orange-400 to-red-500" };
  };

  const status = getEnergyStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Daily Energy Meter</h1>
        <div className="w-10"></div>
      </div>

      {/* Energy Meter */}
      <Card className={`p-6 mb-6 bg-gradient-to-br ${status.color} text-white shadow-xl`}>
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl"
          >
            {status.emoji}
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1">{status.text}</h2>
            <p className="text-white/80 text-sm">Energy Level: {energy}%</p>
          </div>
        </div>
        <Progress value={energy} className="h-4" />
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={() => setShowFoodDialog(true)}
          className="h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <div className="flex flex-col items-center gap-1">
            <Plus className="w-6 h-6" />
            <span>Log Food</span>
          </div>
        </Button>
        <Button
          onClick={() => setShowActivityDialog(true)}
          className="h-20 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
        >
          <div className="flex flex-col items-center gap-1">
            <Plus className="w-6 h-6" />
            <span>Log Activity</span>
          </div>
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 mb-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-2">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 mb-1">
              Energy points show how foods and activities fuel your day!
            </p>
            <p className="text-xs text-blue-700">
              Healthy choices add energy. Treats are okay sometimes but give less fuel.
            </p>
          </div>
        </div>
      </Card>

      {/* Today's Log */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Today's Fuel & Activity:</h3>
        <Card className="p-4 bg-white shadow-lg">
          {log.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No entries yet today</p>
          ) : (
            <div className="space-y-3">
              {log.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-3xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="text-purple-900">{entry.name}</p>
                    <p className="text-xs text-purple-600">{entry.time}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      entry.points > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {entry.points > 0 ? '+' : ''}{entry.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Food Dialog */}
      <Dialog open={showFoodDialog} onOpenChange={setShowFoodDialog}>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-purple-900">What did you eat?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-green-700 mb-3">Healthy Foods (Add Energy):</h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {healthyFoods.map((food) => (
                <Button
                  key={food.name}
                  onClick={() => addFood(food)}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <span className="text-sm">{food.name}</span>
                  <span className="text-xs text-green-600">+{food.points}</span>
                </Button>
              ))}
            </div>

            <h4 className="text-orange-700 mb-3">Treats (Small Energy):</h4>
            <div className="grid grid-cols-2 gap-3">
              {treatFoods.map((food) => (
                <Button
                  key={food.name}
                  onClick={() => addFood(food)}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <span className="text-sm">{food.name}</span>
                  <span className="text-xs text-orange-600">{food.points}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-purple-900">What activity did you do?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-3">
              {activities.map((activity) => (
                <Button
                  key={activity.name}
                  onClick={() => addActivity(activity)}
                  variant="outline"
                  className="h-24 flex flex-col items-center gap-1"
                >
                  <span className="text-4xl">{activity.emoji}</span>
                  <span className="text-sm">{activity.name}</span>
                  <span className="text-xs text-blue-600">+{activity.points}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
