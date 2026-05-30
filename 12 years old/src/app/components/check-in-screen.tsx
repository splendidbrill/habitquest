import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

const moods = [
  { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-500 to-orange-500" },
  { id: "tired", emoji: "😴", label: "Tired", color: "from-blue-500 to-indigo-500" },
  { id: "stressed", emoji: "😰", label: "Stressed", color: "from-red-500 to-pink-500" },
  { id: "calm", emoji: "😌", label: "Calm", color: "from-green-500 to-teal-500" },
  { id: "frustrated", emoji: "😤", label: "Frustrated", color: "from-orange-500 to-red-500" },
  { id: "okay", emoji: "😐", label: "Just okay", color: "from-gray-500 to-gray-600" },
];

const copingOptions = [
  {
    id: "micro-workout",
    title: "Quick movement",
    subtitle: "30-60 seconds of energy",
    route: "/micro-workouts",
  },
  {
    id: "game",
    title: "Play a game",
    subtitle: "Quick dopamine hit",
    route: "/urban-runner",
  },
  {
    id: "breathe",
    title: "Breathing exercise",
    subtitle: "Reset your system",
    route: "/reflection",
  },
  {
    id: "walk",
    title: "Go for a walk",
    subtitle: "Music or silence, your call",
    route: "/movement",
  },
  {
    id: "journal",
    title: "Write it out",
    subtitle: "Private space, no judgment",
    route: "/reflection",
  },
  {
    id: "rest",
    title: "Just rest",
    subtitle: "Sometimes that's the right move",
    route: "/",
  },
];

export function CheckInScreen() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCoping, setShowCoping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowCoping(true);
  };

  const handleCopingSelect = (copingId: string) => {
    // Save check-in
    localStorage.setItem("lastCheckIn", new Date().toDateString());
    
    // Update streak
    const lastCheckIn = localStorage.getItem("lastCheckIn");
    const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
    
    if (lastCheckIn !== new Date().toDateString()) {
      localStorage.setItem("currentStreak", String(currentStreak + 1));
    }

    // Save mood data (private)
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    moodHistory.push({
      date: new Date().toISOString(),
      mood: selectedMood,
      coping: copingId,
    });
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    setIsComplete(true);
  };

  const handleSkip = () => {
    navigate("/");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 glow-purple" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            That counted.
          </h2>
          <p className="text-gray-400 mb-8">
            Checking in with yourself matters.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-4 font-semibold glow-purple"
          >
            Back to today
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-gray-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Skip
          </button>
        </div>

        {!showCoping ? (
          /* Mood selection */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">
              How are you feeling?
            </h1>
            <p className="text-gray-400 mb-8">
              No right or wrong answer. Just you.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`bg-gradient-to-br ${mood.color} rounded-2xl p-6 text-center shadow-lg`}
                >
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <div className="text-sm font-semibold text-white">
                    {mood.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Coping options */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">
              What might help?
            </h1>
            <p className="text-gray-400 mb-8">
              Or nothing. That's fine too.
            </p>

            <div className="space-y-3">
              {copingOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleCopingSelect(option.id)}
                  className="w-full bg-[#1a1a24] rounded-2xl p-5 text-left border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <h3 className="text-base font-semibold text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {option.subtitle}
                  </p>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setIsComplete(true)}
              className="w-full mt-6 text-center text-sm text-gray-500 hover:text-gray-400 py-4"
            >
              I'll figure it out myself
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}