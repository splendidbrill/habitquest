import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const avatars = [
  {
    id: "tiger",
    name: "Tiger Cub",
    emoji: "🐯",
    description: "Brave & Strong",
    color: "bg-gradient-to-br from-orange-400 to-amber-500",
  },
  {
    id: "monkey",
    name: "Monkey Explorer",
    emoji: "🐵",
    description: "Curious & Quick",
    color: "bg-gradient-to-br from-amber-400 to-yellow-500",
  },
  {
    id: "elephant",
    name: "Elephant Buddy",
    emoji: "🐘",
    description: "Wise & Kind",
    color: "bg-gradient-to-br from-teal-400 to-cyan-500",
  },
];

const kitePattern = (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 200">
    <path d="M100,50 L120,100 L100,150 L80,100 Z" fill="white" />
    <path d="M100,150 L100,180" stroke="white" strokeWidth="2" />
    <circle cx="95" cy="165" r="3" fill="white" />
    <circle cx="105" cy="175" r="3" fill="white" />
  </svg>
);

export function AvatarSelection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (selected) {
      localStorage.setItem("selectedAvatar", selected);
      navigate("/customize");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-teal-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-12 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🪁
        </motion.div>
        <h1 className="text-4xl font-bold text-orange-900 mb-3">
          Choose Your Adventure Buddy!
        </h1>
        <p className="text-xl text-orange-700">
          Who will explore with you?
        </p>
      </motion.div>

      <div className="space-y-5 max-w-md w-full mb-10 relative z-10">
        {avatars.map((avatar, index) => {
          const isSelected = selected === avatar.id;
          const isHovered = hoveredId === avatar.id;

          return (
            <motion.button
              key={avatar.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(avatar.id)}
              onMouseEnter={() => setHoveredId(avatar.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`w-full rounded-3xl p-6 transition-all relative overflow-hidden ${
                isSelected
                  ? `${avatar.color} shadow-2xl ring-4 ring-white`
                  : "bg-white shadow-lg"
              }`}
            >
              {kitePattern}
              
              <div className="flex items-center gap-5 relative z-10">
                <motion.div
                  animate={
                    isHovered || isSelected
                      ? { rotate: [0, -10, 10, -10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                  className={`text-7xl ${isSelected ? 'drop-shadow-lg' : ''}`}
                >
                  {avatar.emoji}
                </motion.div>

                <div className="flex-1 text-left">
                  <h2
                    className={`text-2xl font-bold mb-1 ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {avatar.name}
                  </h2>
                  <p
                    className={`text-lg ${
                      isSelected ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {avatar.description}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-3xl">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        disabled={!selected}
        className={`w-full max-w-md py-6 rounded-full text-2xl font-bold transition-all relative z-10 flex items-center justify-center gap-3 ${
          selected
            ? "bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 text-white shadow-2xl"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {selected && <Sparkles className="w-7 h-7" />}
        Let's Go!
        {selected && <Sparkles className="w-7 h-7" />}
      </motion.button>
    </div>
  );
}
