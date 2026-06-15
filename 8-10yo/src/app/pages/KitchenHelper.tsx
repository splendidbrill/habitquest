import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Lock, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

export default function KitchenHelper() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const tasks = [
    {
      id: "wash",
      emoji: "🧼",
      title: "Wash Vegetables",
      description: "Help rinse the veggies under water",
      points: 1,
    },
    {
      id: "stir",
      emoji: "🥄",
      title: "Stir Ingredients",
      description: "Mix the ingredients together",
      points: 1,
    },
    {
      id: "table",
      emoji: "🍽️",
      title: "Set the Table",
      description: "Put out plates, forks, and cups",
      points: 1,
    },
  ];

  const handleTaskClick = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setSelectedTask(taskId);
      setShowPinDialog(true);
      setPin("");
      setPinError(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin === "1234" || pin === "👍") {
      if (selectedTask) {
        setCompletedTasks([...completedTasks, selectedTask]);
      }
      setShowPinDialog(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const allTasksComplete = completedTasks.length === tasks.length;
  const totalPoints = completedTasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-amber-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-orange-900">Kitchen Helper</h1>
        <div className="w-10"></div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            👨‍🍳
          </motion.div>
          <div className="flex-1">
            <h2 className="text-white mb-1">Earn Points for Helping!</h2>
            <p className="text-orange-100">Complete tasks in the kitchen</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <p className="text-2xl text-white">{totalPoints}/3 Tasks Complete</p>
          <p className="text-sm text-orange-100 mt-1">+{totalPoints} Family Points</p>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-orange-900 mb-3">Kitchen Tasks:</h3>
        <div className="space-y-3">
          {tasks.map((task) => {
            const isComplete = completedTasks.includes(task.id);

            return (
              <motion.div
                key={task.id}
                whileHover={!isComplete ? { scale: 1.02 } : {}}
                whileTap={!isComplete ? { scale: 0.98 } : {}}
              >
                <Card
                  onClick={() => handleTaskClick(task.id)}
                  className={`p-5 ${
                    isComplete
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-white border-2 border-orange-200 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${
                        isComplete ? 'bg-green-500' : 'bg-orange-400'
                      } rounded-2xl flex items-center justify-center shadow-md`}
                    >
                      <span className="text-4xl">{task.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-orange-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-orange-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm">+{task.points} point</span>
                      </div>
                    </div>
                    {isComplete ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <Lock className="w-8 h-8 text-orange-300" />
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-2 border-blue-200 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-blue-900 text-sm">
              Ask a parent to enter the PIN (1234) when you complete each task!
            </p>
          </div>
        </div>
      </Card>

      {allTasksComplete && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="p-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-white mb-3">Kitchen Champion!</h2>
            <p className="text-yellow-100 mb-6">You completed all kitchen tasks!</p>

            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-2" />
              <p className="text-white text-lg mb-1">Badge Earned:</p>
              <p className="text-2xl text-white">Kitchen Champion</p>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-3xl text-white">+3 Family Points</p>
            </div>
          </Card>
        </motion.div>
      )}

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-orange-900">Parent Approval</DialogTitle>
            <DialogDescription>
              Ask a parent to enter the PIN to confirm you completed this task
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm text-orange-700 mb-2 block">
                Enter PIN (1234)
              </label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN"
                className={pinError ? "border-red-500" : ""}
                maxLength={4}
              />
              {pinError && (
                <p className="text-red-600 text-sm mt-1">Incorrect PIN. Try again!</p>
              )}
            </div>
            <Button
              onClick={handlePinSubmit}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Confirm Task Complete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
