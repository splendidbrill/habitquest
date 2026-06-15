import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Zap, Trophy, PartyPopper } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState } from "react";

export default function DailyQuests() {
  const [quests, setQuests] = useState([
    {
      id: 1,
      icon: "🥕",
      title: "Try a new veggie",
      description: "Taste something colorful today!",
      region: "nutrition",
      color: "from-green-400 to-emerald-500",
      xp: 50,
      difficulty: "Easy",
      completed: false,
    },
    {
      id: 2,
      icon: "⚽",
      title: "Football challenge",
      description: "Score 5 goals in the backyard!",
      region: "activity",
      color: "from-blue-400 to-cyan-500",
      xp: 75,
      difficulty: "Medium",
      completed: false,
    },
    {
      id: 3,
      icon: "😴",
      title: "Sleep on time",
      description: "Bed before 9pm tonight",
      region: "sleep",
      color: "from-purple-400 to-indigo-500",
      xp: 60,
      difficulty: "Easy",
      completed: false,
    },
  ]);

  const completedCount = quests.filter(q => q.completed).length;
  const totalXp = quests.reduce((sum, q) => sum + (q.completed ? q.xp : 0), 0);

  const completeQuest = (id: number) => {
    setQuests(quests.map(q =>
      q.id === id ? { ...q, completed: true } : q
    ));
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
        <h1 className="text-purple-900">Today's Adventures</h1>
        <div className="w-10"></div>
      </div>

      {/* Progress Summary */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white">Daily Progress</h2>
            <p className="text-purple-100">{completedCount} of {quests.length} completed</p>
          </div>
          <motion.div
            animate={{ rotate: completedCount === quests.length ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            <Trophy className="w-12 h-12 text-yellow-300" />
          </motion.div>
        </div>
        <Progress value={(completedCount / quests.length) * 100} className="h-3 mb-2" />
        <div className="flex items-center gap-2 text-yellow-300">
          <Zap className="w-5 h-5" />
          <span>{totalXp} XP earned today!</span>
        </div>
      </Card>

      {/* Quest List */}
      <div className="space-y-4 mb-6">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 shadow-lg border-2 ${quest.completed ? 'bg-green-50 border-green-300' : 'bg-white border-purple-200'}`}>
              <div className="flex items-start gap-4">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${quest.color} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                  animate={quest.completed ? { scale: [1, 1.2, 1] } : {}}
                >
                  <span className="text-3xl">{quest.icon}</span>
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-purple-900">{quest.title}</h3>
                      <p className="text-purple-600 text-sm">{quest.description}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">{quest.xp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {quest.difficulty}
                    </span>
                    <span className="text-xs text-purple-600 capitalize">{quest.region}</span>
                  </div>

                  {!quest.completed ? (
                    <Button
                      onClick={() => completeQuest(quest.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Mark Complete
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg"
                    >
                      <PartyPopper className="w-5 h-5" />
                      <span>Completed!</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Completion Bonus */}
      {completedCount === quests.length && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl mb-3"
            >
              🎉
            </motion.div>
            <h2 className="text-white mb-2">Amazing!</h2>
            <p className="text-yellow-100 mb-4">You completed all quests today!</p>
            <Link to="/rewards">
              <Button className="bg-white text-orange-600 hover:bg-yellow-50">
                Claim Bonus Reward!
              </Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
