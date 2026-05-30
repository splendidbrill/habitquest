import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Zap, Check, Flame } from "lucide-react";

type Workout = {
  id: string;
  name: string;
  mood: string;
  duration: number;
  exercises: { name: string; duration: number; icon: string }[];
  color: string;
  glow: string;
};

const workouts: Workout[] = [
  {
    id: 'de-stress',
    name: 'De-stress Reset',
    mood: 'Overwhelmed or tense',
    duration: 30,
    exercises: [
      { name: 'Deep breathing', duration: 10, icon: '🌬️' },
      { name: 'Shoulder rolls', duration: 10, icon: '💆' },
      { name: 'Gentle stretch', duration: 10, icon: '🧘' },
    ],
    color: 'from-purple-500 to-purple-600',
    glow: 'glow-purple',
  },
  {
    id: 'power-up',
    name: 'Power-Up Warm-Up',
    mood: 'Need energy boost',
    duration: 60,
    exercises: [
      { name: 'Jumping jacks', duration: 15, icon: '🏃' },
      { name: 'High knees', duration: 15, icon: '🦵' },
      { name: 'Arm circles', duration: 15, icon: '💪' },
      { name: 'Quick march', duration: 15, icon: '🚶' },
    ],
    color: 'from-cyan-500 to-cyan-600',
    glow: 'glow-cyan',
  },
  {
    id: 'after-school',
    name: 'After-School Recharge',
    mood: 'Mentally tired',
    duration: 45,
    exercises: [
      { name: 'Shake it out', duration: 10, icon: '🤸' },
      { name: 'Cat-cow stretch', duration: 15, icon: '🐱' },
      { name: 'Walk in place', duration: 20, icon: '👟' },
    ],
    color: 'from-pink-500 to-pink-600',
    glow: 'glow-pink',
  },
  {
    id: 'confidence',
    name: 'Confidence Builder',
    mood: 'Building strength',
    duration: 60,
    exercises: [
      { name: 'Power stance', duration: 15, icon: '🦸' },
      { name: 'Wall push-ups', duration: 15, icon: '💥' },
      { name: 'Squats', duration: 15, icon: '🏋️' },
      { name: 'Plank hold', duration: 15, icon: '🔥' },
    ],
    color: 'from-blue-500 to-blue-600',
    glow: 'glow-blue',
  },
];

export function MicroWorkouts() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && countdown === 0 && selectedWorkout) {
      // Move to next exercise
      if (currentExercise < selectedWorkout.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCountdown(selectedWorkout.exercises[currentExercise + 1].duration);
      } else {
        // Workout complete
        setIsActive(false);
        setCompleted(true);
        
        // Award XP
        const currentXP = parseInt(localStorage.getItem("playerXP") || "0");
        localStorage.setItem("playerXP", (currentXP + selectedWorkout.duration).toString());
        
        // Track completion
        const completions = JSON.parse(localStorage.getItem("microWorkoutCompletions") || "{}");
        completions[selectedWorkout.id] = (completions[selectedWorkout.id] || 0) + 1;
        localStorage.setItem("microWorkoutCompletions", JSON.stringify(completions));
      }
    }
  }, [countdown, isActive, currentExercise, selectedWorkout]);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExercise(0);
    setCountdown(workout.exercises[0].duration);
    setIsActive(true);
    setCompleted(false);
  };

  const resetWorkout = () => {
    setSelectedWorkout(null);
    setCurrentExercise(0);
    setCountdown(0);
    setIsActive(false);
    setCompleted(false);
  };

  if (completed && selectedWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <Check className="w-20 h-20 mx-auto text-green-400" />
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            You showed up!
          </h2>
          <p className="text-gray-400 mb-8">
            That's how athletes stay balanced.
          </p>

          <div className="bg-[#1a1a24] rounded-2xl p-6 mb-6 border border-white/10">
            <p className="text-sm text-gray-400 mb-2">Completed</p>
            <p className="text-2xl font-bold text-white mb-1">{selectedWorkout.name}</p>
            <p className="text-sm text-gray-400">{selectedWorkout.duration} seconds</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetWorkout}
              className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl py-4 font-semibold"
            >
              Do Another
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex-1 bg-[#1a1a24] text-white rounded-xl py-4 font-semibold border border-white/10"
            >
              Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedWorkout && isActive) {
    const exercise = selectedWorkout.exercises[currentExercise];
    const progress = ((currentExercise + 1) / selectedWorkout.exercises.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full bg-gradient-to-r ${selectedWorkout.color}`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Exercise {currentExercise + 1} of {selectedWorkout.exercises.length}
            </p>
          </div>

          {/* Current exercise */}
          <div className="text-center mb-12">
            <motion.div
              key={currentExercise}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-8xl mb-6"
            >
              {exercise.icon}
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {exercise.name}
            </h2>

            {/* Countdown */}
            <motion.div
              animate={{ scale: countdown <= 3 ? [1, 1.1, 1] : 1 }}
              className={`text-7xl font-bold mb-8 ${
                countdown <= 3 ? 'text-red-400' : 'text-cyan-400'
              }`}
            >
              {countdown}
            </motion.div>

            <p className="text-gray-400">
              Keep going — you're doing great
            </p>
          </div>

          {/* Skip button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentExercise < selectedWorkout.exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
                setCountdown(selectedWorkout.exercises[currentExercise + 1].duration);
              } else {
                setIsActive(false);
                setCompleted(true);
              }
            }}
            className="w-full bg-[#1a1a24] text-gray-400 rounded-xl py-4 font-semibold border border-white/10"
          >
            Skip Exercise
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-gray-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Level Up Your Day
          </h1>
          <p className="text-gray-400 mb-2">
            30–60 second mood-based missions
          </p>
          <p className="text-sm text-gray-500">
            Pick what fits right now
          </p>
        </motion.div>

        {/* Workout cards */}
        <div className="space-y-4">
          {workouts.map((workout, index) => {
            const completions = JSON.parse(localStorage.getItem("microWorkoutCompletions") || "{}");
            const timesCompleted = completions[workout.id] || 0;

            return (
              <motion.button
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startWorkout(workout)}
                className="w-full bg-[#1a1a24] rounded-2xl p-6 text-left border border-white/10 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${workout.color}`} />
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {workout.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {workout.mood}
                    </p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">{workout.duration} seconds</span>
                    </div>
                  </div>
                  {timesCompleted > 0 && (
                    <div className="bg-green-500/20 rounded-full px-3 py-1">
                      <p className="text-xs text-green-400 font-semibold">
                        ✓ {timesCompleted}x
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {workout.exercises.map((ex, i) => (
                    <span key={i} className="text-sm">
                      {ex.icon}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
