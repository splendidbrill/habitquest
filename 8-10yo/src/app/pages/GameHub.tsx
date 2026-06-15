import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function GameHub() {
  const games = [
    {
      id: "fruit-snake",
      icon: "🐍",
      name: "Fruit Snake Explorer",
      description: "Slither through the garden & collect healthy foods!",
      color: "from-green-400 to-emerald-500",
      duration: "90 seconds",
      reward: "Fruit stickers",
      path: "/fruit-snake",
    },
    {
      id: "jungle-runner",
      icon: "🌴",
      name: "Jungle Adventure Runner",
      description: "Run, jump & collect in the jungle!",
      color: "from-blue-400 to-cyan-500",
      duration: "Endless fun",
      reward: "Animal buddies",
      path: "/jungle-runner",
    },
    {
      id: "superhero-workout",
      icon: "🦸",
      name: "Superhero Workout Mission",
      description: "Copy superhero moves & become stronger!",
      color: "from-purple-400 to-pink-500",
      duration: "4 exercises",
      reward: "Superhero gear",
      path: "/superhero-workout",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Game Hub</h1>
        <div className="w-10"></div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-3"
        >
          🎮
        </motion.div>
        <h2 className="text-white mb-2">Adventure Games!</h2>
        <p className="text-purple-100">Play, learn & earn rewards!</p>
      </Card>

      {/* Games List */}
      <div className="space-y-4 mb-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.15 }}
          >
            <Link to={game.path}>
              <Card className="p-6 bg-white shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all">
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-5xl">{game.icon}</span>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-purple-900 mb-1">{game.name}</h3>
                    <p className="text-purple-600 text-sm mb-3">{game.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-700">{game.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs text-yellow-700">{game.reward}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Play Now!
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Daily Bonus */}
      <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          🌟
        </motion.div>
        <h3 className="text-white mb-2">Daily Game Bonus!</h3>
        <p className="text-yellow-100 text-sm mb-3">
          Play any game today for double stars!
        </p>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 fill-white" />
          <Star className="w-5 h-5 fill-white" />
          <span className="text-lg">x2 Today!</span>
        </div>
      </Card>
    </div>
  );
}
