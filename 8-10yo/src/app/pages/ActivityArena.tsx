import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export default function ActivityArena() {
  const challenges = [
    { id: 1, icon: "⚽", title: "Football Skills", description: "Score 5 goals!", xp: 60, completed: true },
    { id: 2, icon: "🏃", title: "Sprint Challenge", description: "Run around the park", xp: 50, completed: false },
    { id: 3, icon: "🤸", title: "Jump Quest", description: "10 jumping jacks", xp: 40, completed: false },
    { id: 4, icon: "🏀", title: "Basketball Bounce", description: "Dribble for 2 minutes", xp: 55, completed: false, locked: true },
    { id: 5, icon: "🧗", title: "Obstacle Course", description: "Complete the course!", xp: 80, completed: false, locked: true },
  ];

  const progress = 45;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-cyan-200 to-sky-100 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/map">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-blue-900">Activity Arena</h1>
        <div className="w-10"></div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{
              rotate: [0, 20, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            ⚽
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white">Arena Progress</h2>
            <p className="text-blue-100">Get moving and have fun!</p>
          </div>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-blue-100 text-sm">{progress}% complete</p>
      </Card>

      {/* Today's Challenge */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="mb-6"
      >
        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8" />
            <h3 className="text-white">Today's Special!</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏃</span>
            <div className="flex-1">
              <h4 className="text-white">Sprint Challenge</h4>
              <p className="text-yellow-100 text-sm">Run around the park - double XP!</p>
            </div>
            <Button className="bg-white text-orange-600 hover:bg-yellow-50">
              Go!
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Challenges */}
      <div className="mb-6">
        <h3 className="text-blue-900 mb-3">Movement Challenges</h3>
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 ${
                challenge.completed
                  ? 'bg-blue-100 border-blue-300'
                  : challenge.locked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : 'bg-white border-blue-200'
              } border-2`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md ${
                    challenge.locked ? 'filter grayscale' : ''
                  }`}>
                    <span className="text-3xl">{challenge.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-blue-900">{challenge.title}</h4>
                    <p className="text-sm text-blue-600">{challenge.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-blue-700">{challenge.xp} XP</span>
                    </div>
                  </div>
                  {challenge.completed ? (
                    <div className="text-3xl">✅</div>
                  ) : challenge.locked ? (
                    <div className="text-2xl">🔒</div>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Start
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mini Game CTA */}
      <Link to="/game/treasure-dash">
        <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl">
          <Zap className="w-5 h-5 mr-2" />
          Play Treasure Dash!
        </Button>
      </Link>
    </div>
  );
}
