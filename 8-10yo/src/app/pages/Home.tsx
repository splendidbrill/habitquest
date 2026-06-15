import { Link } from "react-router";
import { motion } from "motion/react";
import { Sparkles, MapPin, Trophy, Flame, Coins } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Home() {
  const playerData = {
    name: "Alex",
    level: 12,
    xp: 750,
    xpToNext: 1000,
    streak: 7,
    coins: 450,
    buddyType: "dragon",
    buddyMood: "excited",
  };

  const todayQuests = [
    { id: 1, icon: "🥕", title: "Try a new veggie", region: "nutrition", done: false },
    { id: 2, icon: "⚽", title: "Football challenge", region: "activity", done: false },
    { id: 3, icon: "😴", title: "Sleep on time", region: "sleep", done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/avatar">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-3xl">😊</span>
            </motion.div>
          </Link>
          <div>
            <h2 className="text-purple-900">Hey, {playerData.name}!</h2>
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-4 h-4" />
              <span>Level {playerData.level}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-md">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-orange-600">{playerData.streak} days</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-md">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-700">{playerData.coins}</span>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <Card className="p-4 mb-6 bg-white/90 backdrop-blur shadow-lg border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-700">XP Progress</span>
          <span className="text-purple-900">{playerData.xp}/{playerData.xpToNext}</span>
        </div>
        <Progress value={(playerData.xp / playerData.xpToNext) * 100} className="h-3" />
      </Card>

      {/* Buddy */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🐉</div>
            <div className="flex-1">
              <h3 className="text-white">Sparky the Dragon</h3>
              <p className="text-purple-100">Ready for adventure!</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Today's Quests Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-900">Today's Adventures</h3>
          <Link to="/quests" className="text-purple-600">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {todayQuests.map((quest) => (
            <motion.div
              key={quest.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 bg-white/90 backdrop-blur shadow-lg border-purple-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{quest.icon}</div>
                  <div className="flex-1">
                    <p className="text-purple-900">{quest.title}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">🎮 Games</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/game-hub">
            <Card className="p-4 bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🎮</div>
                <p className="text-sm">Game Hub</p>
              </div>
            </Card>
          </Link>
          <Link to="/energy-meter">
            <Card className="p-4 bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-sm">Energy Meter</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">🍎 Food Adventures</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/food-tracker">
            <Card className="p-4 bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm">Foods I Tried</p>
              </div>
            </Card>
          </Link>
          <Link to="/choose-dinner">
            <Card className="p-4 bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-sm">Choose Dinner</p>
              </div>
            </Card>
          </Link>
          <Link to="/veggie-week">
            <Card className="p-4 bg-gradient-to-br from-lime-400 to-green-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🥕</div>
                <p className="text-sm">Veggie Week</p>
              </div>
            </Card>
          </Link>
          <Link to="/kitchen-helper">
            <Card className="p-4 bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">👨‍🍳</div>
                <p className="text-sm">Kitchen Helper</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">🎒 School Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/lunch-builder">
            <Card className="p-4 bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🍱</div>
                <p className="text-sm">Lunch Builder</p>
              </div>
            </Card>
          </Link>
          <Link to="/snack-swap">
            <Card className="p-4 bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <p className="text-sm">Snack Swaps</p>
              </div>
            </Card>
          </Link>
          <Link to="/school-fuel">
            <Card className="p-4 bg-gradient-to-br from-indigo-400 to-blue-400 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-2">🎒</div>
                <p className="text-sm">School Fuel</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main CTA */}
      <Link to="/map">
        <Button className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl">
          <MapPin className="w-6 h-6 mr-2" />
          Start Today's Adventure!
        </Button>
      </Link>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-purple-200 px-4 py-3">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <Link to="/">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <span className="text-xs text-purple-700">Home</span>
            </motion.div>
          </Link>
          <Link to="/map">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-700">Map</span>
            </motion.div>
          </Link>
          <Link to="/game-hub">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <span className="text-xs text-purple-700">Games</span>
            </motion.div>
          </Link>
          <Link to="/quests">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-700">Quests</span>
            </motion.div>
          </Link>
          <Link to="/rewards">
            <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-700">Rewards</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
