import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Heart, Star, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function ConfidenceCastle() {
  const kindnessMissions = [
    { id: 1, icon: "💬", title: "Give a Compliment", description: "Make someone smile", xp: 40, completed: false },
    { id: 2, icon: "🌟", title: "Try Something New", description: "Be brave!", xp: 50, completed: false },
    { id: 3, icon: "🤝", title: "Help Someone", description: "Be kind today", xp: 45, completed: false },
    { id: 4, icon: "🎨", title: "Create Something", description: "Express yourself", xp: 55, completed: false, locked: true },
  ];

  const proudMoments = [
    { id: 1, text: "I helped my friend today!", emoji: "🤝" },
    { id: 2, text: "I tried a new activity!", emoji: "⭐" },
    { id: 3, text: "I was brave!", emoji: "💪" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 via-yellow-200 to-amber-100 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/map">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-orange-900">Confidence Castle</h1>
        <div className="w-10"></div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🧠
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white">You're Amazing!</h2>
            <p className="text-yellow-100">Build your confidence here</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
        </div>
      </Card>

      {/* Daily Affirmation */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="mb-6"
      >
        <Card className="p-6 bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-xl text-center">
          <Heart className="w-12 h-12 mx-auto mb-3 fill-white" />
          <h3 className="text-white mb-2">Today's Affirmation</h3>
          <p className="text-xl text-white">
            "I am brave and kind!"
          </p>
        </Card>
      </motion.div>

      {/* Kindness Missions */}
      <div className="mb-6">
        <h3 className="text-orange-900 mb-3">Kindness Missions</h3>
        <div className="space-y-3">
          {kindnessMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 ${
                mission.completed
                  ? 'bg-orange-100 border-orange-300'
                  : mission.locked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : 'bg-white border-orange-200'
              } border-2`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md ${
                    mission.locked ? 'filter grayscale' : ''
                  }`}>
                    <span className="text-3xl">{mission.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-orange-900">{mission.title}</h4>
                    <p className="text-sm text-orange-600">{mission.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-orange-700">{mission.xp} XP</span>
                    </div>
                  </div>
                  {mission.completed ? (
                    <div className="text-3xl">✅</div>
                  ) : mission.locked ? (
                    <div className="text-2xl">🔒</div>
                  ) : (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Start
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Proud Moments */}
      <div className="mb-6">
        <h3 className="text-orange-900 mb-3">I'm Proud Of...</h3>
        <div className="space-y-3">
          {proudMoments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{moment.emoji}</span>
                  <p className="text-purple-900">{moment.text}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          + Add New Moment
        </Button>
      </div>
    </div>
  );
}
