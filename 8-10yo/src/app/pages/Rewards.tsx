import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Trophy, Coins, Sparkles, Star, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState } from "react";

export default function Rewards() {
  const [chestOpen, setChestOpen] = useState(false);

  const playerStats = {
    level: 12,
    coins: 450,
    xp: 750,
    xpToNext: 1000,
    badges: 8,
    titles: 3,
  };

  const badges = [
    { id: 1, icon: "🌟", name: "Week Warrior", earned: true, rarity: "gold" },
    { id: 2, icon: "🥇", name: "First Quest", earned: true, rarity: "bronze" },
    { id: 3, icon: "🌈", name: "Rainbow Plate", earned: true, rarity: "silver" },
    { id: 4, icon: "⚡", name: "Speed Runner", earned: true, rarity: "silver" },
    { id: 5, icon: "💤", name: "Sleep Champion", earned: false, rarity: "gold" },
    { id: 6, icon: "🎯", name: "Perfect Week", earned: false, rarity: "legendary" },
  ];

  const cosmetics = [
    { id: 1, icon: "👑", name: "Gold Crown", unlocked: true, cost: 0 },
    { id: 2, icon: "🎩", name: "Top Hat", unlocked: true, cost: 0 },
    { id: 3, icon: "🦸", name: "Hero Cape", unlocked: false, cost: 200 },
    { id: 4, icon: "✨", name: "Sparkle Trail", unlocked: false, cost: 300 },
  ];

  const streakRewards = [
    { days: 7, reward: "Treasure Chest", unlocked: true },
    { days: 14, reward: "Special Badge", unlocked: false },
    { days: 30, reward: "Legendary Item", unlocked: false },
  ];

  const handleOpenChest = () => {
    setChestOpen(true);
    setTimeout(() => setChestOpen(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Your Rewards</h1>
        <div className="w-10"></div>
      </div>

      {/* Player Stats */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crown className="w-12 h-12 text-yellow-300" />
            <div>
              <h2 className="text-white">Level {playerStats.level}</h2>
              <p className="text-purple-100">Hero Adventurer</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-xl">{playerStats.coins}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span>{playerStats.badges} badges</span>
            </div>
          </div>
        </div>
        <Progress value={(playerStats.xp / playerStats.xpToNext) * 100} className="h-3 mb-2" />
        <p className="text-purple-100 text-sm">{playerStats.xp} / {playerStats.xpToNext} XP to next level</p>
      </Card>

      {/* Treasure Chest */}
      <motion.div className="mb-6">
        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
          <motion.div
            onClick={handleOpenChest}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <motion.div
              className="text-8xl mb-3"
              animate={chestOpen ? { rotateY: 180, scale: 1.2 } : {}}
            >
              {chestOpen ? "🎁" : "🎁"}
            </motion.div>
            {chestOpen && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="flex justify-center gap-2 mb-3"
              >
                <span className="text-4xl">✨</span>
                <span className="text-4xl">🌟</span>
                <span className="text-4xl">✨</span>
              </motion.div>
            )}
          </motion.div>
          <h3 className="text-white mb-2">Daily Treasure Chest</h3>
          <p className="text-yellow-100 mb-3">Tap to open!</p>
          {chestOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/20 rounded-lg p-3"
            >
              <p className="text-white">You got 50 coins and 25 XP!</p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Achievement Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Card className={`p-4 ${
                badge.earned
                  ? badge.rarity === 'legendary'
                    ? 'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-400'
                    : badge.rarity === 'gold'
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400'
                    : badge.rarity === 'silver'
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400'
                    : 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400'
                  : 'bg-white border-gray-300'
              } border-2`}>
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-4xl ${!badge.earned && 'filter grayscale opacity-30'}`}>
                    {badge.icon}
                  </span>
                  <p className="text-xs text-center text-purple-700">{badge.name}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cosmetics Shop */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Cosmetics Shop</h3>
        <div className="grid grid-cols-2 gap-3">
          {cosmetics.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`p-4 ${
                item.unlocked ? 'bg-purple-100 border-purple-300' : 'bg-white border-purple-200'
              } border-2`}>
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-5xl ${!item.unlocked && 'filter grayscale opacity-50'}`}>
                    {item.icon}
                  </span>
                  <p className="text-sm text-center text-purple-700">{item.name}</p>
                  {!item.unlocked && (
                    <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-900">
                      <Coins className="w-4 h-4 mr-1" />
                      {item.cost}
                    </Button>
                  )}
                  {item.unlocked && (
                    <div className="text-green-600 text-sm">Owned!</div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Streak Rewards */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Streak Milestones</h3>
        <div className="space-y-3">
          {streakRewards.map((milestone, index) => (
            <Card
              key={index}
              className={`p-4 ${
                milestone.unlocked ? 'bg-green-100 border-green-300' : 'bg-white border-purple-200'
              } border-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center ${
                    !milestone.unlocked && 'opacity-50'
                  }`}>
                    <span className="text-white">{milestone.days}</span>
                  </div>
                  <div>
                    <p className="text-purple-900">{milestone.days} Day Streak</p>
                    <p className="text-sm text-purple-600">{milestone.reward}</p>
                  </div>
                </div>
                {milestone.unlocked ? (
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ) : (
                  <div className="text-2xl">🔒</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
