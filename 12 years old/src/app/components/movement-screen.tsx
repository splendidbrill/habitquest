import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Play, Check } from "lucide-react";

const movementOptions = [
  {
    id: "stretch",
    title: "Stretch",
    subtitle: "5-10 minutes of gentle stretching",
    duration: 5,
  },
  {
    id: "walk-music",
    title: "Walk with music",
    subtitle: "As long as you want",
    duration: 15,
  },
  {
    id: "dance",
    title: "Dance alone",
    subtitle: "Your room, your moves",
    duration: 10,
  },
  {
    id: "yoga",
    title: "Gentle yoga",
    subtitle: "Follow along or just do what feels good",
    duration: 10,
  },
  {
    id: "rest",
    title: "Rest day",
    subtitle: "Recovery is part of progress",
    duration: 0,
  },
];

export function MovementScreen() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleSelect = (activityId: string) => {
    setSelectedActivity(activityId);
    const activity = movementOptions.find(a => a.id === activityId);
    if (activity && activity.duration > 0) {
      setTimer(activity.duration * 60); // Convert to seconds
    }
  };

  const handleStart = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
      });
    }, 1000);
  };

  const handleComplete = () => {
    // Save movement
    const movementHistory = JSON.parse(localStorage.getItem("movementHistory") || "[]");
    movementHistory.push({
      date: new Date().toISOString(),
      activity: selectedActivity,
    });
    localStorage.setItem("movementHistory", JSON.stringify(movementHistory));

    setIsComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <Check className="w-16 h-16 mx-auto text-neutral-400 stroke-[1.5]" />
          </motion.div>
          
          <h2 className="text-2xl font-light text-neutral-800 mb-3">
            That counts.
          </h2>
          <p className="text-neutral-600 mb-8">
            You showed up for yourself today.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full bg-neutral-800 text-white rounded-full py-4 font-medium"
          >
            Back to today
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (selectedActivity && timer !== null) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedActivity(null)}
              className="text-neutral-400"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-xl font-light text-neutral-800 mb-8">
              {movementOptions.find(a => a.id === selectedActivity)?.title}
            </h2>

            <motion.div
              animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1, repeat: isTimerRunning ? Infinity : 0 }}
              className="text-7xl font-light text-neutral-800 mb-12"
            >
              {formatTime(timer)}
            </motion.div>

            {!isTimerRunning && timer > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="bg-neutral-800 text-white rounded-full px-12 py-4 font-medium inline-flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start
              </motion.button>
            ) : timer === 0 ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-neutral-800 text-white rounded-full px-12 py-4 font-medium"
              >
                Done
              </motion.button>
            ) : (
              <p className="text-neutral-500 text-sm">
                Take your time. No rush.
              </p>
            )}
          </motion.div>

          <div className="text-center">
            <button
              onClick={handleComplete}
              className="text-sm text-neutral-400 hover:text-neutral-600"
            >
              I'll do this without the timer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-neutral-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-neutral-400 hover:text-neutral-600"
          >
            Skip
          </button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Pick what feels right today
          </h1>
          <p className="text-neutral-500">
            Movement is for you, not anyone else.
          </p>
        </motion.div>

        {/* Options */}
        <div className="space-y-3">
          {movementOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(option.id)}
              className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-neutral-100"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-neutral-500">
                {option.subtitle}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
