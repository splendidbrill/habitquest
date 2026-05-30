import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Zap, TrendingUp, Activity, Apple } from "lucide-react";

interface EnergyLog {
  type: "food" | "activity";
  name: string;
  emoji: string;
  points: number;
  time: string;
}

export function EnergyMeter() {
  const navigate = useNavigate();
  const [energyLevel, setEnergyLevel] = useState(50);
  const [todayLogs, setTodayLogs] = useState<EnergyLog[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    // Load today's logs from localStorage
    const today = new Date().toDateString();
    const savedLogs = localStorage.getItem(`energyLogs_${today}`);
    if (savedLogs) {
      const logs = JSON.parse(savedLogs);
      setTodayLogs(logs);
      
      // Calculate energy level from logs
      const totalEnergy = logs.reduce((sum: number, log: EnergyLog) => sum + log.points, 50);
      setEnergyLevel(Math.min(Math.max(totalEnergy, 0), 100));
    }
  }, []);

  const addEnergyLog = (log: EnergyLog) => {
    const newLogs = [...todayLogs, log];
    setTodayLogs(newLogs);
    
    const today = new Date().toDateString();
    localStorage.setItem(`energyLogs_${today}`, JSON.stringify(newLogs));
    
    const newEnergy = Math.min(Math.max(energyLevel + log.points, 0), 100);
    setEnergyLevel(newEnergy);
    setShowAddMenu(false);
  };

  const getEnergyStatus = () => {
    if (energyLevel >= 80) return { text: "Champion Energy!", emoji: "🔥", color: "from-green-500 to-emerald-500" };
    if (energyLevel >= 60) return { text: "Great Energy", emoji: "⚡", color: "from-blue-500 to-cyan-500" };
    if (energyLevel >= 40) return { text: "Moderate Energy", emoji: "💪", color: "from-yellow-500 to-orange-500" };
    return { text: "Need Fuel!", emoji: "🔋", color: "from-orange-500 to-red-500" };
  };

  const status = getEnergyStatus();

  const healthyFoods = [
    { name: "Fruit", emoji: "🍎", points: 10 },
    { name: "Vegetables", emoji: "🥦", points: 10 },
    { name: "Protein", emoji: "🍗", points: 15 },
    { name: "Whole Grains", emoji: "🍚", points: 12 },
    { name: "Water", emoji: "💧", points: 8 },
    { name: "Yogurt", emoji: "🥛", points: 10 },
  ];

  const activities = [
    { name: "Football", emoji: "⚽", points: 15 },
    { name: "Running", emoji: "🏃", points: 12 },
    { name: "Cycling", emoji: "🚴", points: 12 },
    { name: "Swimming", emoji: "🏊", points: 15 },
    { name: "Basketball", emoji: "🏀", points: 12 },
    { name: "Active Play", emoji: "🤸", points: 10 },
  ];

  const treats = [
    { name: "Treat Food", emoji: "🍪", points: -5 },
    { name: "Fizzy Drink", emoji: "🥤", points: -8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/training")}
            className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Energy Meter ⚡</h1>
          <div className="w-12" />
        </div>

        {/* Energy Meter Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`bg-gradient-to-br ${status.color} rounded-3xl p-8 shadow-2xl mb-6 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <div className="text-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                {status.emoji}
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">{status.text}</h2>
              <div className="text-5xl font-bold text-white">{energyLevel}%</div>
            </div>

            {/* Energy Bar */}
            <div className="bg-white/20 rounded-full h-6 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${energyLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-9xl opacity-10">⚡</div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold mb-2">How It Works</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Healthy foods and activity ADD energy points. Your body uses this energy for sports, school, and growing! Track what fuels you best.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMenu(showAddMenu === "food" ? false : "food" as any)}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-center shadow-xl"
          >
            <Apple className="w-10 h-10 text-white mx-auto mb-2" />
            <div className="text-white font-bold">Log Food</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMenu(showAddMenu === "activity" ? false : "activity" as any)}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-center shadow-xl"
          >
            <Activity className="w-10 h-10 text-white mx-auto mb-2" />
            <div className="text-white font-bold">Log Activity</div>
          </motion.button>
        </div>

        {/* Add Menu */}
        {showAddMenu === "food" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 mb-6"
          >
            <h3 className="text-white font-bold mb-4">Add Food</h3>
            <div className="space-y-2">
              {healthyFoods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => addEnergyLog({
                    type: "food",
                    name: food.name,
                    emoji: food.emoji,
                    points: food.points,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  })}
                  className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{food.emoji}</span>
                    <span className="text-white font-bold">{food.name}</span>
                  </div>
                  <span className="text-green-400 font-bold">+{food.points}</span>
                </button>
              ))}
              <div className="border-t border-white/20 my-3" />
              {treats.map((treat) => (
                <button
                  key={treat.name}
                  onClick={() => addEnergyLog({
                    type: "food",
                    name: treat.name,
                    emoji: treat.emoji,
                    points: treat.points,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  })}
                  className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{treat.emoji}</span>
                    <span className="text-white font-bold">{treat.name}</span>
                  </div>
                  <span className="text-orange-400 font-bold">{treat.points}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showAddMenu === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 mb-6"
          >
            <h3 className="text-white font-bold mb-4">Add Activity</h3>
            <div className="space-y-2">
              {activities.map((activity) => (
                <button
                  key={activity.name}
                  onClick={() => addEnergyLog({
                    type: "activity",
                    name: activity.name,
                    emoji: activity.emoji,
                    points: activity.points,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  })}
                  className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.emoji}</span>
                    <span className="text-white font-bold">{activity.name}</span>
                  </div>
                  <span className="text-blue-400 font-bold">+{activity.points}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Today's Log */}
        {todayLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Today's Log
            </h3>
            <div className="space-y-2">
              {todayLogs.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{log.emoji}</span>
                    <div>
                      <div className="text-white text-sm font-bold">{log.name}</div>
                      <div className="text-white/60 text-xs">{log.time}</div>
                    </div>
                  </div>
                  <span className={`font-bold ${log.points > 0 ? "text-green-400" : "text-orange-400"}`}>
                    {log.points > 0 ? "+" : ""}{log.points}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
