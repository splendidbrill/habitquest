import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Moon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export default function SleepMountain() {
  const dreamStars = 12;
  const dreamGoal = 20;

  const sleepHabits = [
    { id: 1, icon: "🌙", title: "Bedtime on Time", streak: 7, active: true },
    { id: 2, icon: "📱", title: "Screen-Free Hour", streak: 5, active: true },
    { id: 3, icon: "📖", title: "Bedtime Story", streak: 3, active: false },
    { id: 4, icon: "🛁", title: "Calm Bath Time", streak: 0, active: false, locked: true },
  ];

  const dreamCreatures = [
    { id: 1, emoji: "⭐", name: "Sleepy Star", collected: true },
    { id: 2, emoji: "🌟", name: "Dream Star", collected: true },
    { id: 3, emoji: "✨", name: "Sparkle Star", collected: false },
    { id: 4, emoji: "💫", name: "Dizzy Star", collected: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-300 to-pink-200 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/map">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Sleep Mountain</h1>
        <div className="w-10"></div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              y: [0, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            😴
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white">Dream Stars</h2>
            <p className="text-purple-100">Help your buddy sleep well!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: i < dreamStars ? 1 : 0.5 }}
              transition={{ delay: i * 0.05 }}
            >
              <Star
                className={`w-4 h-4 ${
                  i < dreamStars ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'
                }`}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-purple-100 text-sm">{dreamStars} / {dreamGoal} stars collected</p>
      </Card>

      {/* Sleep Habits */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Sleep Habits</h3>
        <div className="space-y-3">
          {sleepHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 ${
                habit.locked
                  ? 'bg-gray-100 border-gray-300 opacity-60'
                  : habit.active
                  ? 'bg-purple-100 border-purple-300'
                  : 'bg-white border-purple-200'
              } border-2`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-md ${
                    habit.locked ? 'filter grayscale' : ''
                  }`}>
                    <span className="text-3xl">{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-purple-900">{habit.title}</h4>
                    {!habit.locked && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-purple-600">
                          {habit.streak > 0 ? `${habit.streak} day streak!` : 'Start tonight'}
                        </span>
                      </div>
                    )}
                  </div>
                  {habit.locked ? (
                    <div className="text-2xl">🔒</div>
                  ) : habit.active ? (
                    <div className="text-3xl">✅</div>
                  ) : (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Track
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dream Creatures */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Dream Guardians</h3>
        <div className="grid grid-cols-2 gap-3">
          {dreamCreatures.map((creature) => (
            <motion.div
              key={creature.id}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`p-6 ${
                creature.collected ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-purple-300'
              } border-2`}>
                <div className="flex flex-col items-center gap-2">
                  <motion.span
                    className={`text-5xl ${!creature.collected && 'filter grayscale opacity-30'}`}
                    animate={creature.collected ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {creature.emoji}
                  </motion.span>
                  <p className="text-sm text-center text-purple-700">{creature.name}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mini Game CTA */}
      <Link to="/game/sleep-stars">
        <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl">
          <Moon className="w-5 h-5 mr-2" />
          Collect Dream Stars!
        </Button>
      </Link>
    </div>
  );
}
