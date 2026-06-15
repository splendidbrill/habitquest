import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export default function NutritionForest() {
  const missions = [
    { id: 1, icon: "🍎", title: "Apple Adventure", xp: 30, completed: true },
    { id: 2, icon: "🥕", title: "Carrot Quest", xp: 40, completed: true },
    { id: 3, icon: "🥦", title: "Broccoli Battle", xp: 50, completed: false, locked: false },
    { id: 4, icon: "🍓", title: "Berry Bonanza", xp: 45, completed: false, locked: false },
    { id: 5, icon: "🌽", title: "Corn Challenge", xp: 55, completed: false, locked: true },
  ];

  const badges = [
    { id: 1, icon: "🌈", name: "Rainbow Plate", earned: true },
    { id: 2, icon: "🔍", name: "Food Explorer", earned: true },
    { id: 3, icon: "⭐", name: "Veggie Star", earned: false },
  ];

  const progress = 65;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 via-emerald-200 to-lime-100 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/map">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-green-900">Nutrition Forest</h1>
        <div className="w-10"></div>
      </div>

      {/* Hero Section */}
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
            <h2 className="text-white">Forest Progress</h2>
            <p className="text-green-100">Discover colorful foods!</p>
          </div>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-green-100 text-sm">{progress}% explored</p>
      </Card>

      {/* Missions */}
      <div className="mb-6">
        <h3 className="text-green-900 mb-3">Food Missions</h3>
        <div className="space-y-3">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 ${
                mission.completed
                  ? 'bg-green-100 border-green-300'
                  : mission.locked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : 'bg-white border-green-200'
              } border-2`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-md ${
                    mission.locked ? 'filter grayscale' : ''
                  }`}>
                    <span className="text-3xl">{mission.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-green-900">{mission.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-green-700">{mission.xp} XP</span>
                    </div>
                  </div>
                  {mission.completed ? (
                    <div className="text-3xl">✅</div>
                  ) : mission.locked ? (
                    <div className="text-2xl">🔒</div>
                  ) : (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Start
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-green-900 mb-3">Food Explorer Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`p-4 ${
                badge.earned ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-300'
              } border-2`}>
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-4xl ${!badge.earned && 'filter grayscale opacity-50'}`}>
                    {badge.icon}
                  </span>
                  <p className="text-xs text-center text-green-700">{badge.name}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mini Game CTA */}
      <Link to="/game/fruit-catcher">
        <Button className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
          <Trophy className="w-5 h-5 mr-2" />
          Play Fruit Catcher Game!
        </Button>
      </Link>
    </div>
  );
}
