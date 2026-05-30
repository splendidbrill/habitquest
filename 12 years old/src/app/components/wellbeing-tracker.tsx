import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Moon, Smile, Heart } from "lucide-react";

export function WellbeingTracker() {
  const navigate = useNavigate();
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [happinessRating, setHappinessRating] = useState<number | null>(null);
  const [wellbeingRating, setWellbeingRating] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (sleepQuality !== null || happinessRating !== null || wellbeingRating !== null) {
      const tracking = JSON.parse(localStorage.getItem("wellbeingTracking") || "[]");
      tracking.push({
        date: new Date().toISOString(),
        sleep: sleepQuality,
        happiness: happinessRating,
        wellbeing: wellbeingRating,
      });
      localStorage.setItem("wellbeingTracking", JSON.stringify(tracking));
      setSaved(true);
    }
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <h2 className="text-2xl font-light text-neutral-800 mb-3">
            Noted.
          </h2>
          <p className="text-neutral-600 mb-8">
            You're paying attention to yourself. That matters.
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
          className="mb-10"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Check in with your wellbeing
          </h1>
          <p className="text-neutral-500">
            Just noticing patterns can help.
          </p>
        </motion.div>

        {/* Sleep Quality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-neutral-600" />
            <label className="text-base text-neutral-700">
              How was your sleep?
            </label>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSleepQuality(value)}
                className={`flex-1 rounded-xl py-4 font-medium transition-colors ${
                  sleepQuality === value
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>Not great</span>
            <span>Really good</span>
          </div>
        </motion.div>

        {/* Happiness Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-neutral-600" />
            <label className="text-base text-neutral-700">
              How happy are you feeling?
            </label>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setHappinessRating(value)}
                className={`flex-1 rounded-xl py-4 font-medium transition-colors ${
                  happinessRating === value
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </motion.div>

        {/* General Wellbeing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-neutral-600" />
            <label className="text-base text-neutral-700">
              How are you doing overall?
            </label>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWellbeingRating(value)}
                className={`flex-1 rounded-xl py-4 font-medium transition-colors ${
                  wellbeingRating === value
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>Struggling</span>
            <span>Doing well</span>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8"
        >
          <p className="text-sm text-neutral-600 leading-relaxed">
            These ratings are just for you. Over time, you might notice patterns about what helps or what doesn't.
          </p>
        </motion.div>

        {/* Save button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={sleepQuality === null && happinessRating === null && wellbeingRating === null}
          className={`w-full rounded-full py-4 font-medium ${
            sleepQuality === null && happinessRating === null && wellbeingRating === null
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-800 text-white'
          }`}
        >
          Save
        </motion.button>
      </div>
    </div>
  );
}
