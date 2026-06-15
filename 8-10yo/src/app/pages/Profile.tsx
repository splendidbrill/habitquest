import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Flame, Trophy, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Profile() {
  const playerData = {
    name: "Alex",
    level: 12,
    totalXp: 3450,
    streak: 7,
    bestStreak: 14,
    badges: 8,
    completedQuests: 42,
    avatar: "😊",
    buddy: "🐉",
  };

  const familyMessages = [
    { from: "Mum", message: "Great job on your veggie quest!", emoji: "👏" },
    { from: "Dad", message: "Loved your healthy choice!", emoji: "❤️" },
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
        <h1 className="text-purple-900">Your Profile</h1>
        <Link to="/avatar">
          <Button variant="ghost" size="sm" className="text-purple-600">
            Edit
          </Button>
        </Link>
      </div>

      {/* Player Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl">{playerData.avatar}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-white">{playerData.name}</h2>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-purple-100">Level {playerData.level}</span>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            {playerData.buddy}
          </motion.div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-purple-100 text-sm">Total XP: {playerData.totalXp}</p>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Streak</p>
              <p className="text-2xl text-purple-900">{playerData.streak}</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Best: {playerData.bestStreak} days</p>
        </Card>

        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Badges</p>
              <p className="text-2xl text-purple-900">{playerData.badges}</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Unlocked</p>
        </Card>

        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Quests</p>
              <p className="text-2xl text-purple-900">{playerData.completedQuests}</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Completed</p>
        </Card>

        <Card className="p-4 bg-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Level</p>
              <p className="text-2xl text-purple-900">{playerData.level}</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Hero Adventurer</p>
        </Card>
      </div>

      {/* Family Messages */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Family Team Messages</h3>
        <div className="space-y-3">
          {familyMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{msg.emoji}</span>
                  <div className="flex-1">
                    <p className="text-purple-900">{msg.message}</p>
                    <p className="text-sm text-purple-600">- {msg.from}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Link to="/avatar">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Customize Avatar
          </Button>
        </Link>
        <Link to="/rewards">
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            View All Rewards
          </Button>
        </Link>
      </div>
    </div>
  );
}
