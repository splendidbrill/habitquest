import { Link } from "react-router";
import { motion } from "motion/react";
import { Lock, Star, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function WorldMap() {
  const regions = [
    {
      id: "nutrition",
      name: "Nutrition Forest",
      icon: "🥕",
      color: "from-green-400 to-emerald-500",
      progress: 65,
      locked: false,
      path: "/nutrition",
      position: "top-[15%] left-[10%]",
    },
    {
      id: "activity",
      name: "Activity Arena",
      icon: "⚽",
      color: "from-blue-400 to-cyan-500",
      progress: 45,
      locked: false,
      path: "/activity",
      position: "top-[20%] right-[15%]",
    },
    {
      id: "sleep",
      name: "Sleep Mountain",
      icon: "😴",
      color: "from-purple-400 to-indigo-500",
      progress: 30,
      locked: false,
      path: "/sleep",
      position: "bottom-[30%] left-[15%]",
    },
    {
      id: "confidence",
      name: "Confidence Castle",
      icon: "🧠",
      color: "from-yellow-400 to-orange-500",
      progress: 20,
      locked: true,
      path: "/confidence",
      position: "bottom-[25%] right-[10%]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 relative overflow-hidden">
      {/* Decorative clouds */}
      <motion.div
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-10 left-10 text-6xl opacity-70"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-20 right-20 text-5xl opacity-70"
      >
        ☁️
      </motion.div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-white drop-shadow-lg">HabitQuest World</h1>
        <div className="w-10"></div>
      </div>

      {/* World Map Container */}
      <div className="relative h-[calc(100vh-8rem)] mx-4">
        {/* Animated pathways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M 50 100 Q 200 150, 350 120"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="20,10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 350 120 Q 250 250, 100 350"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="20,10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Region nodes */}
        {regions.map((region, index) => (
          <motion.div
            key={region.id}
            className={`absolute ${region.position}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: index * 0.2,
            }}
          >
            {region.locked ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className={`w-28 h-28 bg-gradient-to-br ${region.color} rounded-full flex flex-col items-center justify-center shadow-2xl opacity-50 border-4 border-white`}>
                  <Lock className="w-8 h-8 text-white mb-1" />
                  <span className="text-3xl filter grayscale">{region.icon}</span>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <p className="text-sm text-gray-600 drop-shadow">Locked</p>
                </div>
              </motion.div>
            ) : (
              <Link to={region.path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    },
                  }}
                  className="relative"
                >
                  <div className={`w-28 h-28 bg-gradient-to-br ${region.color} rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white cursor-pointer`}>
                    <span className="text-4xl mb-1">{region.icon}</span>
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(region.progress / 33) ? 'fill-yellow-300 text-yellow-300' : 'text-white/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-sm text-purple-900 drop-shadow bg-white/80 px-2 py-1 rounded-full">
                      {region.name.split(' ')[0]}
                    </p>
                  </div>
                  {region.progress > 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-xs">{region.progress}%</span>
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            )}
          </motion.div>
        ))}

        {/* Decorative elements */}
        <motion.div
          className="absolute top-[10%] left-[50%] text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-[10%] left-[40%] text-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌟
        </motion.div>
      </div>

      {/* Quick Access */}
      <div className="fixed bottom-4 left-4 right-4 z-20">
        <Link to="/quests">
          <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl">
            <MapPin className="w-5 h-5 mr-2" />
            View Today's Quests
          </Button>
        </Link>
      </div>
    </div>
  );
}
