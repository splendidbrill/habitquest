import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Check, X } from "lucide-react";

const activitySuggestions = {
  starter: [
    { id: "stretch-5", name: "5-min stretch", duration: "5 min" },
    { id: "walk-10", name: "10-min walk", duration: "10 min" },
    { id: "dance-song", name: "Dance to 1 song", duration: "3 min" },
  ],
  building: [
    { id: "walk-20", name: "20-min walk", duration: "20 min" },
    { id: "yoga-15", name: "15-min yoga", duration: "15 min" },
    { id: "dance-15", name: "Dance session", duration: "15 min" },
  ],
  confident: [
    { id: "walk-30", name: "30-min walk", duration: "30 min" },
    { id: "jog-15", name: "Light jog", duration: "15 min" },
    { id: "workout-20", name: "Home workout", duration: "20 min" },
  ],
};

const motivationalQuotes = [
  "Small steps still move you forward.",
  "You're doing better than you think.",
  "Progress isn't always visible.",
  "Being consistent matters more than being perfect.",
  "You showed up. That's what counts.",
  "Rest is part of progress.",
];

export function WeeklyPlanner() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<'starter' | 'building' | 'confident' | null>(null);
  const [weekPlan, setWeekPlan] = useState<any[]>([]);
  const [showQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const saved = localStorage.getItem("weeklyPlan");
    if (saved) {
      setWeekPlan(JSON.parse(saved));
    }
  }, []);

  const handleLevelSelect = (selectedLevel: 'starter' | 'building' | 'confident') => {
    setLevel(selectedLevel);
    
    // Generate week plan
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const activities = activitySuggestions[selectedLevel];
    
    const plan = days.map((day, index) => ({
      day,
      activity: activities[index % activities.length],
      completed: false,
      skipped: false,
    }));
    
    setWeekPlan(plan);
    localStorage.setItem("weeklyPlan", JSON.stringify(plan));
    localStorage.setItem("currentLevel", selectedLevel);
  };

  const handleToggleComplete = (index: number) => {
    const updated = [...weekPlan];
    updated[index].completed = !updated[index].completed;
    if (updated[index].completed) {
      updated[index].skipped = false;
    }
    setWeekPlan(updated);
    localStorage.setItem("weeklyPlan", JSON.stringify(updated));
  };

  const handleReschedule = (index: number) => {
    // Move to next available day
    const updated = [...weekPlan];
    const activity = updated[index].activity;
    
    // Find next incomplete day
    for (let i = index + 1; i < updated.length; i++) {
      if (!updated[i].completed) {
        updated[i].activity = activity;
        updated[index].skipped = true;
        break;
      }
    }
    
    setWeekPlan(updated);
    localStorage.setItem("weeklyPlan", JSON.stringify(updated));
  };

  if (!level || weekPlan.length === 0) {
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
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10"
          >
            <h1 className="text-2xl font-light text-neutral-800 mb-3">
              Plan your week
            </h1>
            <p className="text-neutral-500 mb-6">
              Start small and build up. You can always adjust.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm text-neutral-700 italic">
                "{showQuote}"
              </p>
            </div>
          </motion.div>

          {/* Level selection */}
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleLevelSelect('starter')}
              className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-neutral-100"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                Starting out
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                Short, gentle activities (5-10 minutes)
              </p>
              <div className="flex flex-wrap gap-2">
                {activitySuggestions.starter.map((activity) => (
                  <span
                    key={activity.id}
                    className="text-xs bg-neutral-100 px-3 py-1 rounded-full text-neutral-600"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleLevelSelect('building')}
              className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-neutral-100"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                Building confidence
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                Medium activities (15-20 minutes)
              </p>
              <div className="flex flex-wrap gap-2">
                {activitySuggestions.building.map((activity) => (
                  <span
                    key={activity.id}
                    className="text-xs bg-neutral-100 px-3 py-1 rounded-full text-neutral-600"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleLevelSelect('confident')}
              className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-neutral-100"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                Feeling confident
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                Longer activities (20-30 minutes)
              </p>
              <div className="flex flex-wrap gap-2">
                {activitySuggestions.confident.map((activity) => (
                  <span
                    key={activity.id}
                    className="text-xs bg-neutral-100 px-3 py-1 rounded-full text-neutral-600"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </motion.button>
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
            onClick={() => {
              setLevel(null);
              setWeekPlan([]);
            }}
            className="text-sm text-neutral-400 hover:text-neutral-600"
          >
            Change plan
          </button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Your week
          </h1>
          <p className="text-neutral-500">
            You can reschedule anything that doesn't feel right.
          </p>
        </motion.div>

        {/* Week plan */}
        <div className="space-y-3">
          {weekPlan.map((dayPlan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${
                dayPlan.completed
                  ? 'border-green-200 bg-green-50'
                  : dayPlan.skipped
                  ? 'border-neutral-200 opacity-50'
                  : 'border-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neutral-400" />
                  <div>
                    <h3 className="font-medium text-neutral-800">{dayPlan.day}</h3>
                    {!dayPlan.skipped && (
                      <p className="text-sm text-neutral-500">
                        {dayPlan.activity.name} • {dayPlan.activity.duration}
                      </p>
                    )}
                    {dayPlan.skipped && (
                      <p className="text-sm text-neutral-400">Rescheduled</p>
                    )}
                  </div>
                </div>
                {dayPlan.completed && (
                  <Check className="w-6 h-6 text-green-600" />
                )}
              </div>

              {!dayPlan.completed && !dayPlan.skipped && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleComplete(index)}
                    className="flex-1 bg-neutral-800 text-white rounded-xl py-2 text-sm font-medium"
                  >
                    Done
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReschedule(index)}
                    className="flex-1 bg-neutral-100 text-neutral-600 rounded-xl py-2 text-sm font-medium"
                  >
                    Reschedule
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-neutral-400">
            Life happens. Rescheduling isn't failing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
