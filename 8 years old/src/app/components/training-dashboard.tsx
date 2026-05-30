import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  Trophy, 
  Flame, 
  Target, 
  Zap, 
  TrendingUp,
  Dumbbell,
  Gamepad2,
  Rocket,
  Award,
  Menu
} from "lucide-react";

export function TrainingDashboard() {
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem("userName") || "Athlete");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState("Rookie");
  const [xpToNext, setXpToNext] = useState(50);
  const [avatar, setAvatar] = useState({
    character: localStorage.getItem("avatarCharacter") || "⚽",
    skinTone: localStorage.getItem("avatarSkin") || "medium",
  });
  const [themeColors, setThemeColors] = useState({
    primary: localStorage.getItem("themeColor1") || "#0ea5e9",
    secondary: localStorage.getItem("themeColor2") || "#FFFFFF",
  });
  const [favoriteSport, setFavoriteSport] = useState(localStorage.getItem("favoriteSport") || "");
  const [favoriteAthlete, setFavoriteAthlete] = useState(localStorage.getItem("favoriteAthlete") || "");

  useEffect(() => {
    // Load XP and calculate level
    const userXP = parseInt(localStorage.getItem("userXP") || "0");
    setXP(userXP);

    // Calculate level based on XP: Rookie → Starter → Pro → All-Star
    if (userXP >= 500) {
      setLevel("All-Star");
      setXpToNext(1000 - userXP);
    } else if (userXP >= 200) {
      setLevel("Pro");
      setXpToNext(500 - userXP);
    } else if (userXP >= 50) {
      setLevel("Starter");
      setXpToNext(200 - userXP);
    } else {
      setLevel("Rookie");
      setXpToNext(50 - userXP);
    }

    // Check streak
    const lastActive = localStorage.getItem("lastActiveDate");
    const today = new Date().toDateString();
    if (lastActive === today) {
      const currentStreak = parseInt(localStorage.getItem("currentStreak") || "0");
      setStreak(currentStreak);
    }
  }, []);

  const xpProgress = level === "Rookie" 
    ? (xp / 50) * 100
    : level === "Starter"
    ? ((xp - 50) / 150) * 100
    : level === "Pro"
    ? ((xp - 200) / 300) * 100
    : ((xp - 500) / 500) * 100;

  const performanceActivities = [
    {
      id: "runner",
      title: "Stadium Sprint",
      subtitle: "Endless runner challenge",
      icon: "🏃",
      color: "from-blue-600 to-cyan-600",
      path: "/runner-challenge",
      tag: "GAME",
    },
    {
      id: "drills",
      title: "Skill Drills",
      subtitle: "Reaction & agility training",
      icon: "⚡",
      color: "from-yellow-600 to-orange-600",
      path: "/skill-drills",
      tag: "30SEC",
    },
    {
      id: "pro-workouts",
      title: "Train Like a Pro",
      subtitle: "Elite athlete workouts",
      icon: "💪",
      color: "from-purple-600 to-pink-600",
      path: "/train-like-pro",
      tag: "60SEC",
    },
  ];

  const nutritionTools = [
    {
      id: "lunch-coach",
      title: "School Lunch Coach",
      subtitle: "Rate & improve your meals",
      icon: "🍱",
      color: "from-green-600 to-emerald-600",
      path: "/lunch-builder",
    },
    {
      id: "snack-swap",
      title: "Athlete Upgrades",
      subtitle: "Smart snack swaps",
      icon: "🔄",
      color: "from-orange-600 to-amber-600",
      path: "/snack-swap",
    },
  ];

  const quickLinks = [
    { title: "Progress Stats", icon: <TrendingUp />, path: "/progress" },
    { title: "Trophy Cabinet", icon: <Trophy />, path: "/achievements" },
    { title: "Ask Coach", icon: <Target />, path: "/ask-coach" },
    { title: "School Fuel", icon: <Rocket />, path: "/school-fuel" },
  ];

  return (
    <div 
      className="min-h-screen p-6 py-12"
      style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/personalize")}
            className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.button>
          
          <div className="text-center">
            <p className="text-white/60 text-sm">Welcome back</p>
            <h1 className="text-xl font-bold text-white">{userName}</h1>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-3xl border-3"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                borderColor: themeColors.primary,
              }}
            >
              {avatar.character}
            </div>
          </motion.div>
        </div>

        {/* XP Progress Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-slate-400 text-sm font-medium mb-1">Current Level</div>
              <div className="text-3xl font-bold text-white">{level}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm font-medium mb-1">Total XP</div>
              <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {xp}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs font-medium">
                Progress to {level === "Rookie" ? "Starter" : level === "Starter" ? "Pro" : level === "Pro" ? "All-Star" : "Legend"}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                {xpToNext} XP to go
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
              <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">
                {parseInt(localStorage.getItem("earnedBadges")?.length || "0")}
              </div>
              <div className="text-xs text-slate-400">Badges</div>
            </div>
          </div>
        </motion.div>

        {/* Pro Tip */}
        {favoriteAthlete && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <div className="text-purple-300 text-xs font-bold mb-1">PRO TIP</div>
                <p className="text-white text-sm leading-relaxed">
                  Pro athletes build habits like this. Consistency matters more than intensity.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Training */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" style={{ color: themeColors.primary }} />
            Performance Training
          </h2>
          <div className="space-y-3">
            {performanceActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(activity.path)}
                className={`bg-gradient-to-r ${activity.color} rounded-2xl p-5 shadow-xl cursor-pointer hover:scale-102 transition-transform relative overflow-hidden`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{activity.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{activity.title}</h3>
                      <p className="text-sm text-white/90">{activity.subtitle}</p>
                    </div>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white">
                    {activity.tag}
                  </div>
                </div>
                <div className="absolute top-0 right-0 text-9xl opacity-10">
                  {activity.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nutrition Tools */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: themeColors.primary }} />
            Nutrition & Fuel
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {nutritionTools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(tool.path)}
                className={`bg-gradient-to-br ${tool.color} rounded-2xl p-5 shadow-xl cursor-pointer text-center`}
              >
                <div className="text-5xl mb-3">{tool.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{tool.title}</h3>
                <p className="text-xs text-white/80 leading-tight">{tool.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <motion.button
              key={link.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(link.path)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:bg-slate-800 transition-colors"
            >
              <div className="text-white mb-2" style={{ color: themeColors.primary }}>
                {link.icon}
              </div>
              <div className="text-sm font-bold text-white">{link.title}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
