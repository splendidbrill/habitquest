import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, CheckCircle, Timer, Zap } from "lucide-react";

interface Workout {
  id: string;
  name: string;
  subtitle: string;
  athlete: string;
  duration: number;
  emoji: string;
  color: string;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  duration: number;
  description: string;
  emoji: string;
}

const workouts: Workout[] = [
  {
    id: "winger-warmup",
    name: "Winger Warm-Up",
    subtitle: "Speed & Agility",
    athlete: "Footballers use this before matches",
    duration: 60,
    emoji: "⚽",
    color: "from-green-600 to-emerald-600",
    exercises: [
      { name: "High Knees", duration: 15, description: "Run in place, knees high", emoji: "🏃" },
      { name: "Side Shuffles", duration: 15, description: "Quick side-to-side steps", emoji: "↔️" },
      { name: "Butt Kicks", duration: 15, description: "Kick heels to glutes", emoji: "🦵" },
      { name: "Arm Circles", duration: 15, description: "Big arm rotations", emoji: "💪" },
    ],
  },
  {
    id: "boxer-footwork",
    name: "Boxer Footwork",
    subtitle: "Balance & Coordination",
    athlete: "This is how boxers train reflexes",
    duration: 60,
    emoji: "🥊",
    color: "from-red-600 to-rose-600",
    exercises: [
      { name: "Quick Feet", duration: 15, description: "Light, fast steps on toes", emoji: "👣" },
      { name: "Shadow Boxing", duration: 15, description: "Punch combinations in the air", emoji: "🥊" },
      { name: "Lateral Hops", duration: 15, description: "Jump side to side", emoji: "↔️" },
      { name: "Skip Rope (Air)", duration: 15, description: "Pretend to skip rope", emoji: "➰" },
    ],
  },
  {
    id: "basketball-jump",
    name: "Basketball Jump Set",
    subtitle: "Explosive Power",
    athlete: "NBA players do this before games",
    duration: 60,
    emoji: "🏀",
    color: "from-orange-600 to-amber-600",
    exercises: [
      { name: "Jump Squats", duration: 15, description: "Squat then explode upward", emoji: "⬆️" },
      { name: "Lateral Lunges", duration: 15, description: "Lunge to the side", emoji: "↔️" },
      { name: "Ankle Bounces", duration: 15, description: "Quick, small jumps", emoji: "⚡" },
      { name: "Reach Jumps", duration: 15, description: "Jump and reach for the sky", emoji: "🌟" },
    ],
  },
  {
    id: "swimmer-stretch",
    name: "Swimmer's Stretch",
    subtitle: "Flexibility & Core",
    athlete: "Swimmers prepare shoulders like this",
    duration: 60,
    emoji: "🏊",
    color: "from-cyan-600 to-blue-600",
    exercises: [
      { name: "Arm Swings", duration: 15, description: "Swing arms in circles", emoji: "💪" },
      { name: "Torso Twists", duration: 15, description: "Rotate your upper body", emoji: "🔄" },
      { name: "Leg Swings", duration: 15, description: "Swing legs forward and back", emoji: "🦵" },
      { name: "Standing Pike", duration: 15, description: "Reach down to your toes", emoji: "🤸" },
    ],
  },
  {
    id: "sprinter-power",
    name: "Sprinter Power-Up",
    subtitle: "Acceleration & Speed",
    athlete: "This is how sprinters warm up",
    duration: 60,
    emoji: "🏃",
    color: "from-blue-600 to-purple-600",
    exercises: [
      { name: "A-Skips", duration: 15, description: "Skip with high knees", emoji: "⬆️" },
      { name: "Power Steps", duration: 15, description: "Explosive running motion", emoji: "💥" },
      { name: "Ankle Hops", duration: 15, description: "Quick bounces on toes", emoji: "⚡" },
      { name: "Drive Steps", duration: 15, description: "Push forward powerfully", emoji: "🚀" },
    ],
  },
  {
    id: "tennis-agility",
    name: "Tennis Agility",
    subtitle: "Court Movement",
    athlete: "Pro tennis players use these drills",
    duration: 60,
    emoji: "🎾",
    color: "from-yellow-600 to-lime-600",
    exercises: [
      { name: "Split Steps", duration: 15, description: "Quick ready position hops", emoji: "👟" },
      { name: "Crossover Steps", duration: 15, description: "Step across your body", emoji: "↔️" },
      { name: "Quick Pivots", duration: 15, description: "Turn fast on one foot", emoji: "🔄" },
      { name: "Forward Lunges", duration: 15, description: "Big steps forward", emoji: "➡️" },
    ],
  },
];

export function TrainLikePro() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutState, setWorkoutState] = useState<"ready" | "active" | "complete">("ready");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setWorkoutState("ready");
  };

  const beginWorkout = () => {
    if (!selectedWorkout) return;
    setWorkoutState("active");
    setCurrentExercise(0);
    setTimeLeft(selectedWorkout.exercises[0].duration);
    setIsPaused(false);
  };

  useState(() => {
    if (workoutState === "active" && !isPaused && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (workoutState === "active" && timeLeft === 0) {
      // Move to next exercise or complete
      if (selectedWorkout && currentExercise < selectedWorkout.exercises.length - 1) {
        const nextExercise = currentExercise + 1;
        setCurrentExercise(nextExercise);
        setTimeLeft(selectedWorkout.exercises[nextExercise].duration);
      } else {
        completeWorkout();
      }
    }
  });

  const completeWorkout = () => {
    setWorkoutState("complete");
    const xp = selectedWorkout ? selectedWorkout.duration : 0;
    const currentXP = parseInt(localStorage.getItem("userXP") || "0");
    localStorage.setItem("userXP", (currentXP + xp).toString());
  };

  if (!selectedWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/training")}
              className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <h1 className="text-2xl font-bold text-white">Train Like a Pro</h1>
            <div className="w-12" />
          </div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-2xl mb-8"
          >
            <div className="flex items-start gap-3">
              <div className="text-5xl">💪</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Professional Workouts
                </h2>
                <p className="text-purple-100 text-sm leading-relaxed">
                  60-second guided workouts based on how elite athletes train. Build strength, speed, and coordination.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {workouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => startWorkout(workout)}
                className={`bg-gradient-to-r ${workout.color} rounded-2xl p-6 shadow-xl cursor-pointer hover:scale-102 transition-transform`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{workout.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {workout.name}
                      </h3>
                      <p className="text-white/90 text-sm">{workout.subtitle}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Timer className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">{workout.duration}s</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white font-medium">
                  💡 {workout.athlete}
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {workout.exercises.map((ex) => (
                    <div key={ex.name} className="bg-white/20 rounded-full px-3 py-1 text-xs text-white font-medium">
                      {ex.emoji} {ex.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workoutState === "ready") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${selectedWorkout.color} p-6 py-12`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedWorkout(null)}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <h1 className="text-xl font-bold text-white">{selectedWorkout.name}</h1>
            <div className="w-12" />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-6 text-center"
          >
            <div className="text-8xl mb-6">{selectedWorkout.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to Train?
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedWorkout.athlete}
            </p>
            <div className="bg-white/20 rounded-2xl p-4 mb-6">
              <div className="text-white/80 text-sm font-bold mb-1">TOTAL TIME</div>
              <div className="text-4xl font-bold text-white">{selectedWorkout.duration}s</div>
            </div>
          </motion.div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6">
            <h3 className="text-white font-bold mb-4 text-lg">Workout Plan</h3>
            <div className="space-y-3">
              {selectedWorkout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                  <div className="text-3xl">{exercise.emoji}</div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{exercise.name}</div>
                    <div className="text-white/70 text-sm">{exercise.description}</div>
                  </div>
                  <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white font-bold">
                    {exercise.duration}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={beginWorkout}
            className="w-full py-5 bg-white rounded-2xl text-slate-900 font-bold text-xl shadow-xl flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Workout
          </motion.button>
        </div>
      </div>
    );
  }

  if (workoutState === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="max-w-md w-full bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Workout Complete!
          </h2>
          <p className="text-green-100 text-lg mb-6">
            Nice work — that's consistency. Pro athletes build habits like this.
          </p>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="text-yellow-300 font-bold text-sm mb-1">EXERCISES COMPLETED</div>
            <div className="text-5xl font-bold text-white mb-4">{selectedWorkout.exercises.length}</div>
            <div className="text-blue-300 text-sm font-bold mb-1">XP EARNED</div>
            <div className="text-2xl font-bold text-white">+{selectedWorkout.duration} XP</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedWorkout(null);
                setWorkoutState("ready");
              }}
              className="flex-1 py-4 bg-white/20 border border-white/30 rounded-xl text-white font-bold"
            >
              More Workouts
            </button>
            <button
              onClick={() => navigate("/training")}
              className="flex-1 py-4 bg-white rounded-xl text-green-600 font-bold"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active workout
  const exercise = selectedWorkout.exercises[currentExercise];
  const progress = ((currentExercise + (1 - timeLeft / exercise.duration)) / selectedWorkout.exercises.length) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedWorkout.color} relative overflow-hidden`}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-white/20">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-bold">
            {currentExercise + 1}/{selectedWorkout.exercises.length}
          </span>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 flex items-center gap-2">
          <Timer className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-2xl">{timeLeft}s</span>
        </div>
      </div>

      {/* Exercise Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={currentExercise}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-9xl mb-8"
        >
          {exercise.emoji}
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4 text-center px-6">
          {exercise.name}
        </h2>
        <p className="text-2xl text-white/90 text-center px-6 mb-8">
          {exercise.description}
        </p>

        {/* Next Exercise Preview */}
        {currentExercise < selectedWorkout.exercises.length - 1 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
            <p className="text-white/70 text-sm mb-1">UP NEXT</p>
            <p className="text-white font-bold">
              {selectedWorkout.exercises[currentExercise + 1].emoji}{" "}
              {selectedWorkout.exercises[currentExercise + 1].name}
            </p>
          </div>
        )}
      </div>

      {/* Pause/Skip Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold border-2 border-white"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={completeWorkout}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold border-2 border-white"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
