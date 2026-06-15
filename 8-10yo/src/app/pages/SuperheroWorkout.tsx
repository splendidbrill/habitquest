import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";

export default function SuperheroWorkout() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  const exercises = [
    {
      id: 1,
      icon: "🦅",
      name: "Fly & Stretch",
      description: "Spread your arms like wings and reach for the sky!",
      animation: "Arms out wide, stretch up high",
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 2,
      icon: "👊",
      name: "Power Punches",
      description: "Punch forward with superhero strength!",
      animation: "Alternate arm punches",
      color: "from-red-400 to-orange-500",
    },
    {
      id: 3,
      icon: "🦘",
      name: "Dodge & Jump",
      description: "Jump side to side like dodging laser beams!",
      animation: "Jump left and right",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 4,
      icon: "🏃",
      name: "Super Speed Run",
      description: "Run in place as fast as you can!",
      animation: "High knees running",
      color: "from-green-400 to-emerald-500",
    },
  ];

  const currentExerciseData = exercises[currentExercise];

  useEffect(() => {
    if (!showCountdown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowCountdown(false);
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCountdown(5);
      } else {
        setGameActive(false);
        setExercisesCompleted(exercises.length);
      }
    }
  }, [showCountdown, countdown, currentExercise]);

  const startWorkout = () => {
    setGameActive(true);
    setCurrentExercise(0);
    setExercisesCompleted(0);
    setCountdown(5);
    setShowCountdown(true);
  };

  const completeExercise = () => {
    setShowCountdown(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/game-hub">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Superhero Workout</h1>
        <div className="w-10"></div>
      </div>

      {gameActive ? (
        <>
          <Card className="p-4 mb-6 bg-white shadow-lg text-center">
            <p className="text-purple-600 text-sm mb-1">Exercise Progress</p>
            <p className="text-2xl text-purple-900">
              {currentExercise + 1} of {exercises.length}
            </p>
          </Card>

          {showCountdown ? (
            <Card className={`p-12 mb-6 bg-gradient-to-br ${currentExerciseData.color} shadow-xl min-h-[500px] flex flex-col items-center justify-center`}>
              <motion.div
                key={countdown}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                className="text-white text-9xl mb-4"
              >
                {countdown === 0 ? "GO!" : countdown}
              </motion.div>
              <p className="text-white text-xl">Get ready for {currentExerciseData.name}!</p>
            </Card>
          ) : (
            <Card className={`p-8 mb-6 bg-gradient-to-br ${currentExerciseData.color} text-white shadow-xl min-h-[500px]`}>
              <div className="text-center mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: currentExerciseData.id === 2 ? [-10, 10, -10] : 0,
                    y: currentExerciseData.id === 3 ? [-20, 0, -20] : 0,
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-9xl mb-4"
                >
                  {currentExerciseData.icon}
                </motion.div>
                <h2 className="text-white mb-3">{currentExerciseData.name}</h2>
                <p className="text-xl text-white/90 mb-2">{currentExerciseData.description}</p>
                <div className="bg-white/20 rounded-lg p-3 mb-6">
                  <p className="text-white">{currentExerciseData.animation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-white text-lg">Copy the superhero move!</p>
                  <p className="text-white/80 text-sm">Do it for 5 seconds</p>
                </div>

                <Button
                  onClick={completeExercise}
                  className="w-full h-16 bg-white text-purple-900 hover:bg-yellow-100 text-xl"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  I Did It!
                </Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-4 gap-2">
            {exercises.map((ex, i) => (
              <div
                key={ex.id}
                className={`h-2 rounded-full ${
                  i < currentExercise ? 'bg-green-500' : i === currentExercise ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      ) : exercisesCompleted > 0 ? (
        <Card className="p-8 bg-white shadow-xl text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-8xl mb-4"
          >
            🦸
          </motion.div>
          <h2 className="text-purple-900 mb-3">You're a Superhero!</h2>
          <p className="text-purple-700 mb-4">You completed all {exercisesCompleted} exercises!</p>

          <div className="bg-yellow-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              <span className="text-2xl text-purple-900">Double Stars!</span>
            </div>
            <p className="text-purple-700">+{exercisesCompleted * 20} XP</p>
          </div>

          <div className="mb-6">
            <p className="text-purple-600 mb-2">Unlocked:</p>
            <div className="flex justify-center gap-2">
              <span className="text-4xl">🦸</span>
              <span className="text-4xl">⚡</span>
              <span className="text-4xl">💪</span>
            </div>
          </div>

          <Button
            onClick={startWorkout}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
          >
            Train Again!
          </Button>
        </Card>
      ) : (
        <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl mb-6"
          >
            🦸
          </motion.div>
          <h2 className="text-white mb-3">Superhero Training!</h2>
          <p className="text-purple-100 mb-6">
            Copy 4 superhero moves and become stronger!
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {exercises.map((ex) => (
              <div key={ex.id} className="bg-white/20 rounded-lg p-3">
                <div className="text-4xl mb-1">{ex.icon}</div>
                <p className="text-sm text-white">{ex.name}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={startWorkout}
            className="w-full h-16 bg-white text-purple-900 hover:bg-yellow-100 text-xl"
          >
            <Zap className="w-6 h-6 mr-2" />
            Start Training!
          </Button>
        </Card>
      )}
    </div>
  );
}
