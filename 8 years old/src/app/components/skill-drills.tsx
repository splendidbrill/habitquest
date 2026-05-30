import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Zap, Trophy, Timer } from "lucide-react";

type DrillType = "reaction" | "agility" | "balance" | "shooting";

interface Drill {
  id: DrillType;
  name: string;
  description: string;
  emoji: string;
  color: string;
  sportRef: string;
}

const drills: Drill[] = [
  {
    id: "reaction",
    name: "Reaction Time",
    description: "Tap the target as fast as you can",
    emoji: "⚡",
    color: "from-yellow-600 to-orange-600",
    sportRef: "Goalkeepers train reflexes like this",
  },
  {
    id: "agility",
    name: "Agility Drill",
    description: "Follow the pattern: Left-Right-Left",
    emoji: "↔️",
    color: "from-blue-600 to-cyan-600",
    sportRef: "This is how sprinters warm up",
  },
  {
    id: "balance",
    name: "Balance Test",
    description: "Keep the bar centered",
    emoji: "⚖️",
    color: "from-green-600 to-emerald-600",
    sportRef: "Surfers and skaters use balance drills",
  },
  {
    id: "shooting",
    name: "Target Practice",
    description: "Hit the moving targets",
    emoji: "🎯",
    color: "from-red-600 to-rose-600",
    sportRef: "Strikers practice accuracy like this",
  },
];

export function SkillDrills() {
  const navigate = useNavigate();
  const [selectedDrill, setSelectedDrill] = useState<DrillType | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "complete">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // Reaction Time Game
  const [showTarget, setShowTarget] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [reactionTime, setReactionTime] = useState<number[]>([]);
  const [targetShownAt, setTargetShownAt] = useState(0);

  // Agility Game
  const [agilitySequence, setAgilitySequence] = useState<("left" | "right")[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Balance Game
  const [barPosition, setBarPosition] = useState(50);
  const [barVelocity, setBarVelocity] = useState(0);

  // Shooting Game
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame();
    }
  }, [gameState, timeLeft]);

  const startDrill = (drillId: DrillType) => {
    setSelectedDrill(drillId);
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);

    if (drillId === "reaction") {
      scheduleNextTarget();
    } else if (drillId === "agility") {
      const sequence: ("left" | "right")[] = [];
      for (let i = 0; i < 10; i++) {
        sequence.push(Math.random() > 0.5 ? "left" : "right");
      }
      setAgilitySequence(sequence);
      setCurrentStep(0);
    } else if (drillId === "balance") {
      setBarPosition(50);
      setBarVelocity(2);
    } else if (drillId === "shooting") {
      spawnTargets();
    }
  };

  const scheduleNextTarget = () => {
    setTimeout(() => {
      const x = Math.random() * 70 + 10;
      const y = Math.random() * 60 + 10;
      setTargetPosition({ x, y });
      setShowTarget(true);
      setTargetShownAt(Date.now());
    }, Math.random() * 1500 + 500);
  };

  const handleTargetClick = () => {
    const time = Date.now() - targetShownAt;
    setReactionTime([...reactionTime, time]);
    setScore(score + Math.max(100 - time / 10, 10));
    setShowTarget(false);
    scheduleNextTarget();
  };

  const handleAgilityMove = (direction: "left" | "right") => {
    if (direction === agilitySequence[currentStep]) {
      setScore(score + 10);
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 >= agilitySequence.length) {
        // Generate new sequence
        const sequence: ("left" | "right")[] = [];
        for (let i = 0; i < 10; i++) {
          sequence.push(Math.random() > 0.5 ? "left" : "right");
        }
        setAgilitySequence(sequence);
        setCurrentStep(0);
      }
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  useEffect(() => {
    if (selectedDrill === "balance" && gameState === "playing") {
      const interval = setInterval(() => {
        setBarPosition((prev) => {
          let newPos = prev + barVelocity;
          if (newPos > 100 || newPos < 0) {
            setBarVelocity(-barVelocity);
            newPos = Math.max(0, Math.min(100, newPos));
          }
          
          // Score for keeping centered
          if (newPos > 45 && newPos < 55) {
            setScore((s) => s + 1);
          }
          
          return newPos;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [selectedDrill, gameState, barVelocity]);

  const adjustBalance = (direction: "left" | "right") => {
    setBarVelocity((v) => direction === "left" ? v - 3 : v + 3);
  };

  const spawnTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 3; i++) {
      newTargets.push({
        id: Date.now() + i,
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 10,
      });
    }
    setTargets(newTargets);
  };

  const hitTarget = (id: number) => {
    setTargets(targets.filter((t) => t.id !== id));
    setScore(score + 15);
    if (targets.length <= 1) {
      spawnTargets();
    }
  };

  const endGame = () => {
    setGameState("complete");
    const xp = Math.floor(score / 5);
    const currentXP = parseInt(localStorage.getItem("userXP") || "0");
    localStorage.setItem("userXP", (currentXP + xp).toString());
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/training")}
              className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <h1 className="text-2xl font-bold text-white">Skill Drills</h1>
            <div className="w-12" />
          </div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 shadow-2xl mb-8"
          >
            <div className="flex items-start gap-3">
              <div className="text-5xl">⚡</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Train Your Skills
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Quick 30-second drills to sharpen your reflexes, agility, and coordination. Pro athletes use these daily.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {drills.map((drill, index) => (
              <motion.div
                key={drill.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => startDrill(drill.id)}
                className={`bg-gradient-to-r ${drill.color} rounded-2xl p-6 shadow-xl cursor-pointer hover:scale-102 transition-transform`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-5xl">{drill.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {drill.name}
                    </h3>
                    <p className="text-white/90 text-sm">{drill.description}</p>
                  </div>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white font-medium">
                  💡 {drill.sportRef}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="max-w-md w-full bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="text-8xl mb-6">💪</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Nice Work!
          </h2>
          <p className="text-green-100 text-lg mb-6">
            That's consistency. Pro athletes build habits like this.
          </p>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="text-yellow-300 font-bold text-sm mb-1">SCORE</div>
            <div className="text-5xl font-bold text-white mb-4">{Math.round(score)}</div>
            <div className="text-blue-300 text-sm font-bold mb-1">XP EARNED</div>
            <div className="text-2xl font-bold text-white">+{Math.floor(score / 5)} XP</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setGameState("menu")}
              className="flex-1 py-4 bg-white/20 border border-white/30 rounded-xl text-white font-bold"
            >
              Back to Drills
            </button>
            <button
              onClick={() => navigate("/training")}
              className="flex-1 py-4 bg-white rounded-xl text-green-600 font-bold"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing state
  const drill = drills.find((d) => d.id === selectedDrill);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${drill?.color} relative overflow-hidden`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-bold text-lg">
            Score: {Math.round(score)}
          </span>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 flex items-center gap-2">
          <Timer className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-lg">{timeLeft}s</span>
        </div>
      </div>

      {/* Reaction Time Game */}
      {selectedDrill === "reaction" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {showTarget && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={handleTargetClick}
                className="absolute w-20 h-20 bg-yellow-400 rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-3xl"
                style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }}
              >
                🎯
              </motion.button>
            )}
          </AnimatePresence>
          {!showTarget && (
            <div className="text-white text-2xl font-bold">Get Ready...</div>
          )}
        </div>
      )}

      {/* Agility Game */}
      {selectedDrill === "agility" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-12 text-center">
            <div className="text-6xl mb-4">
              {agilitySequence[currentStep] === "left" ? "←" : "→"}
            </div>
            <div className="text-white text-xl font-bold">
              Step {currentStep + 1} of {agilitySequence.length}
            </div>
          </div>
          <div className="flex gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAgilityMove("left")}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full text-white text-4xl font-bold shadow-2xl border-2 border-white"
            >
              ←
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAgilityMove("right")}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full text-white text-4xl font-bold shadow-2xl border-2 border-white"
            >
              →
            </motion.button>
          </div>
        </div>
      )}

      {/* Balance Game */}
      {selectedDrill === "balance" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-80 mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-8 relative overflow-hidden border-2 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-full bg-yellow-400" style={{ left: "50%" }} />
              </div>
              <motion.div
                className="absolute top-0 bottom-0 w-4 bg-white rounded-full"
                style={{ left: `${barPosition}%`, transform: "translateX(-50%)" }}
              />
            </div>
            <p className="text-white text-center mt-4 text-sm">
              Keep the bar centered!
            </p>
          </div>
          <div className="flex gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustBalance("left")}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full text-white text-4xl font-bold shadow-2xl border-2 border-white"
            >
              ←
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustBalance("right")}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full text-white text-4xl font-bold shadow-2xl border-2 border-white"
            >
              →
            </motion.button>
          </div>
        </div>
      )}

      {/* Shooting Game */}
      {selectedDrill === "shooting" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => hitTarget(target.id)}
              className="absolute w-16 h-16 bg-yellow-400 rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-2xl"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              🎯
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
