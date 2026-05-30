import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Music, Circle, User } from "lucide-react";

const missions = [
  {
    id: "football-drills",
    title: "Football Skills Training",
    subtitle: "Practice dribbling & shooting",
    emoji: "⚽",
    bgGradient: "from-green-500 via-emerald-500 to-teal-500",
    illustration: "⚽",
    sound: "Goal!",
    time: "20-30 minutes",
    unlocks: "Football Master Badge",
    description: "Work on your ball control, dribbling through cones, and taking shots at goal. Focus on technique!",
    performanceTip: "Pro footballers practice ball control for 30 mins daily. Even 10 mins makes you better!"
  },
  {
    id: "sprint-training",
    title: "Speed & Agility Drills",
    subtitle: "Get faster and quicker!",
    emoji: "🏃",
    bgGradient: "from-blue-500 via-cyan-500 to-sky-500",
    illustration: "🏃",
    sound: "Sprint!",
    time: "15-20 minutes",
    unlocks: "Speed Demon Badge",
    description: "Sprint intervals, cone drills, and quick feet exercises to boost your speed and agility.",
    performanceTip: "Athletes do sprint training 3x per week. Explosive speed = game changer!"
  },
  {
    id: "basketball-practice",
    title: "Basketball Shooting",
    subtitle: "Work on your shooting game",
    emoji: "🏀",
    bgGradient: "from-orange-500 via-amber-500 to-yellow-500",
    illustration: "🏀",
    sound: "Swish!",
    time: "25 minutes",
    unlocks: "Hoops Hero Badge",
    description: "Practice free throws, layups, and three-pointers. Track how many you make!",
    performanceTip: "NBA players shoot 500+ shots per practice. Start with 50 and build up!"
  },
  {
    id: "cricket-nets",
    title: "Cricket Batting Practice",
    subtitle: "Hit some sixes!",
    emoji: "🏏",
    bgGradient: "from-teal-500 via-green-500 to-lime-500",
    illustration: "🏏",
    sound: "Six!",
    time: "30 minutes",
    unlocks: "Cricket Champion Badge",
    description: "Practice your batting technique, footwork, and timing. Bowl to friends or use a wall.",
    performanceTip: "Cricketers practice in nets daily. Master your straight drive first!"
  },
  {
    id: "strength-bodyweight",
    title: "Bodyweight Strength",
    subtitle: "Build functional strength",
    emoji: "💪",
    bgGradient: "from-red-500 via-rose-500 to-pink-500",
    illustration: "💪",
    sound: "Strong!",
    time: "15 minutes",
    unlocks: "Strength Warrior Badge",
    description: "Push-ups, planks, squats, and lunges. Build real strength without equipment!",
    performanceTip: "Every athlete does bodyweight training. Your body weight is your best gym!"
  },
  {
    id: "cycling-ride",
    title: "Cycling Adventure",
    subtitle: "Build endurance on wheels",
    emoji: "🚴",
    bgGradient: "from-indigo-500 via-violet-500 to-purple-500",
    illustration: "🚴",
    sound: "Ride!",
    time: "30-45 minutes",
    unlocks: "Cycling Pro Badge",
    description: "Go for a bike ride - build cardio and leg strength while having fun!",
    performanceTip: "Cyclists train cardio for hours. Even 30 mins builds serious endurance!"
  },
  {
    id: "swim-training",
    title: "Swimming Session",
    subtitle: "Full body workout in water",
    emoji: "🏊",
    bgGradient: "from-cyan-500 via-blue-500 to-indigo-500",
    illustration: "🏊",
    sound: "Swim!",
    time: "30 minutes",
    unlocks: "Swimmer Badge",
    description: "Practice different strokes, work on breathing, and build endurance in the pool.",
    performanceTip: "Swimming works every muscle! Great for recovery and cardio!"
  },
  {
    id: "jump-rope",
    title: "Jump Rope Challenge",
    subtitle: "Cardio & coordination",
    emoji: "🪢",
    bgGradient: "from-yellow-500 via-orange-500 to-red-500",
    illustration: "🪢",
    sound: "Jump!",
    time: "10-15 minutes",
    unlocks: "Jump Master Badge",
    description: "Jump rope intervals - great for footwork, cardio, and coordination!",
    performanceTip: "Boxers jump rope for 30 mins daily. Start with 2 min rounds!"
  },
];

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

export function DailyMission() {
  const navigate = useNavigate();
  const [todaysMission] = useState(
    missions[Math.floor(Math.random() * missions.length)]
  );
  const [started, setStarted] = useState(false);
  const [showSound, setShowSound] = useState(false);

  const selectedAvatar = localStorage.getItem("selectedAvatar") || "tiger";
  const avatarColor = localStorage.getItem("avatarColor") || "orange";
  const completedCount = parseInt(localStorage.getItem("completedMissions") || "0");

  const colorClasses: { [key: string]: string } = {
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  const handleStart = () => {
    setStarted(true);
    setShowSound(true);
    setTimeout(() => setShowSound(false), 2000);
  };

  const handleComplete = () => {
    const completed = parseInt(localStorage.getItem("completedMissions") || "0");
    localStorage.setItem("completedMissions", String(completed + 1));
    localStorage.setItem("lastUnlock", todaysMission.unlocks);
    navigate("/success");
  };

  // Avatar grows bigger with progress
  const avatarSize = Math.min(20 + completedCount * 2, 32);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${todaysMission.bgGradient} flex flex-col items-center justify-between p-6 py-12 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "💪" : "🔥"}
          </motion.div>
        ))}
      </div>

      {/* Back button */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/training")}
        className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10 mt-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-7xl mb-3"
          >
            {todaysMission.emoji}
          </motion.div>
          <h2 className="text-xl font-bold text-white/90 uppercase tracking-wide">
            Today's Training
          </h2>
        </motion.div>

        {/* Mission card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6 border border-white/10"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {todaysMission.title}
            </h1>
            <p className="text-lg text-blue-200 mb-4">
              {todaysMission.subtitle}
            </p>
            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
              <p className="text-sm font-bold text-blue-300">
                ⏱️ {todaysMission.time}
              </p>
            </div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10"
          >
            <h3 className="text-sm font-bold text-blue-300 mb-2 uppercase tracking-wide">Training Plan</h3>
            <p className="text-sm text-white/90 leading-relaxed">
              {todaysMission.description}
            </p>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-orange-400/30"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <h3 className="text-sm font-bold text-orange-300 mb-1">Pro Athlete Tip</h3>
                <p className="text-sm text-orange-100 leading-relaxed">
                  {todaysMission.performanceTip}
                </p>
              </div>
            </div>
          </motion.div>

          {/* What you'll unlock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-purple-400/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-purple-200">Achievement Unlock:</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-300">{todaysMission.unlocks}</span>
              </div>
            </div>
          </motion.div>

          {!started ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-xl font-bold text-white shadow-lg flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Start Training! 💪
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-xl font-bold text-white shadow-lg"
            >
              Training Complete! ✅
            </motion.button>
          )}
        </motion.div>

        {/* Encouraging text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-base text-white/90 font-medium">
            {started ? "Push yourself! Champions train hard! 🔥" : "Every rep makes you stronger! 💪"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}