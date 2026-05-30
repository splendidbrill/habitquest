import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Crown, Zap, Target, Flame, Award } from "lucide-react";

type Theme = {
  id: string;
  name: string;
  colors: string;
  glow: string;
  unlockXP: number;
};

type Title = {
  id: string;
  name: string;
  requirement: string;
  icon: string;
  unlocked: boolean;
};

const themes: Theme[] = [
  { id: 'default', name: 'Default', colors: 'from-purple-500 to-cyan-500', glow: 'glow-purple', unlockXP: 0 },
  { id: 'focused', name: 'Focused', colors: 'from-blue-500 to-indigo-600', glow: 'glow-blue', unlockXP: 100 },
  { id: 'resilient', name: 'Resilient', colors: 'from-green-500 to-teal-600', glow: 'glow-cyan', unlockXP: 250 },
  { id: 'driven', name: 'Driven', colors: 'from-orange-500 to-red-600', glow: 'glow-pink', unlockXP: 500 },
  { id: 'consistent', name: 'Consistent', colors: 'from-cyan-500 to-purple-600', glow: 'glow-cyan', unlockXP: 750 },
];

export function ProfileIdentity() {
  const navigate = useNavigate();
  const [currentXP, setCurrentXP] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const xp = parseInt(localStorage.getItem("playerXP") || "0");
    setCurrentXP(xp);
    setLevel(Math.floor(xp / 100) + 1);
    
    const theme = localStorage.getItem("playerTheme") || "default";
    setSelectedTheme(theme);
    
    const title = localStorage.getItem("playerTitle") || "";
    setSelectedTitle(title);
  }, []);

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem("playerTheme", themeId);
  };

  const applyTitle = (titleName: string) => {
    setSelectedTitle(titleName);
    localStorage.setItem("playerTitle", titleName);
  };

  const titles: Title[] = [
    { id: 'starter', name: 'Getting Started', requirement: 'Complete onboarding', icon: '🌱', unlocked: true },
    { id: 'consistent', name: 'Consistent', requirement: '7 day streak', icon: '🔥', unlocked: currentXP >= 70 },
    { id: 'focused', name: 'Focused', requirement: 'Complete 10 activities', icon: '🎯', unlocked: currentXP >= 100 },
    { id: 'resilient', name: 'Resilient', requirement: 'Keep going after a miss', icon: '💪', unlocked: currentXP >= 150 },
    { id: 'driven', name: 'Driven', requirement: 'Reach level 5', icon: '⚡', unlocked: level >= 5 },
    { id: 'balanced', name: 'Balanced', requirement: 'Try all activity types', icon: '⚖️', unlocked: currentXP >= 300 },
  ];

  const xpToNextLevel = (level * 100) - currentXP;
  const progressToNextLevel = (currentXP % 100) / 100 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-gray-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Your Identity
          </h1>
          <p className="text-gray-400">
            Build your vibe
          </p>
        </motion.div>

        {/* Current stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a24] rounded-2xl p-6 mb-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Level</p>
              <p className="text-3xl font-bold text-white">{level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Total XP</p>
              <p className="text-2xl font-bold text-purple-400">{currentXP}</p>
            </div>
          </div>

          <div className="mb-2">
            <p className="text-xs text-gray-400 mb-2">
              {xpToNextLevel} XP to level {level + 1}
            </p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 glow-purple"
              />
            </div>
          </div>

          {selectedTitle && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-1">Current Title</p>
              <p className="text-lg font-bold text-cyan-400">
                {titles.find(t => t.name === selectedTitle)?.icon} {selectedTitle}
              </p>
            </div>
          )}
        </motion.div>

        {/* Themes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Themes</h2>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const isUnlocked = currentXP >= theme.unlockXP;
              const isSelected = selectedTheme === theme.id;

              return (
                <motion.button
                  key={theme.id}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  onClick={() => isUnlocked && applyTheme(theme.id)}
                  disabled={!isUnlocked}
                  className={`relative rounded-2xl p-6 text-center border-2 transition-all ${
                    isSelected
                      ? 'border-white/50'
                      : 'border-white/10'
                  } ${
                    !isUnlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`h-20 rounded-xl bg-gradient-to-br ${theme.colors} ${isSelected ? theme.glow : ''} mb-3`} />
                  <p className="font-bold text-white mb-1">{theme.name}</p>
                  {!isUnlocked && (
                    <div className="flex items-center justify-center gap-1">
                      <Crown className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-500">{theme.unlockXP} XP</p>
                    </div>
                  )}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                    >
                      <Award className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Titles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Titles</h2>
          <div className="space-y-3">
            {titles.map((title) => {
              const isSelected = selectedTitle === title.name;

              return (
                <motion.button
                  key={title.id}
                  whileHover={title.unlocked ? { scale: 1.02 } : {}}
                  whileTap={title.unlocked ? { scale: 0.98 } : {}}
                  onClick={() => title.unlocked && applyTitle(title.name)}
                  disabled={!title.unlocked}
                  className={`w-full bg-[#1a1a24] rounded-2xl p-5 text-left border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10'
                  } ${
                    !title.unlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{title.icon}</span>
                      <div>
                        <p className="font-bold text-white mb-1">{title.name}</p>
                        <p className="text-xs text-gray-400">{title.requirement}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-cyan-500 rounded-full p-2"
                      >
                        <Award className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    {!title.unlocked && (
                      <div className="bg-gray-700 rounded-full p-2">
                        <Crown className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Earn XP by completing activities and games
          </p>
        </motion.div>
      </div>
    </div>
  );
}
