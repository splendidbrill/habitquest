import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, RotateCcw, Trophy } from "lucide-react";

type GameItem = {
  type: "energy" | "water" | "gear" | "obstacle";
  emoji: string;
  position: number;
  lane: number;
};

export function RunnerChallenge() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [items, setItems] = useState<GameItem[]>([]);
  const [showPrompt, setShowPrompt] = useState<string | null>(null);
  const gameLoopRef = useRef<number>();
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("runnerHighScore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = window.setInterval(() => {
        setDistance(d => d + 1);
        
        // Spawn items randomly
        if (Math.random() < 0.15) {
          const lane = Math.floor(Math.random() * 3);
          const itemTypes: GameItem["type"][] = ["energy", "water", "gear", "obstacle"];
          const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
          
          const emojis = {
            energy: "⚡",
            water: "💧",
            gear: "🏆",
            obstacle: "🚧",
          };

          setItems(prev => [...prev, {
            type,
            emoji: emojis[type],
            position: 0,
            lane,
          }]);
        }

        // Move items down
        setItems(prev => 
          prev
            .map(item => ({ ...item, position: item.position + 1 }))
            .filter(item => item.position < 100)
        );

        // Check collisions
        setItems(prev => {
          const newItems = [...prev];
          const playerItems = newItems.filter(
            item => item.lane === playerLane && item.position >= 85 && item.position <= 95
          );

          playerItems.forEach(item => {
            if (item.type === "obstacle") {
              setGameState("gameover");
            } else {
              const points = item.type === "gear" ? 10 : item.type === "energy" ? 5 : 3;
              setScore(s => s + points);
              
              if (item.type === "energy") setShowPrompt("Power boost! ⚡");
              else if (item.type === "water") setShowPrompt("Hydration! 💧");
              else if (item.type === "gear") setShowPrompt("Gear up! 🏆");
            }
          });

          return newItems.filter(
            item => !(item.lane === playerLane && item.position >= 85 && item.position <= 95)
          );
        });

        if (showPrompt) {
          setTimeout(() => setShowPrompt(null), 800);
        }
      }, 100);

      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [gameState, playerLane, showPrompt]);

  useEffect(() => {
    if (gameState === "gameover" && score > highScore) {
      setHighScore(score);
      localStorage.setItem("runnerHighScore", score.toString());
      
      const xp = parseInt(localStorage.getItem("userXP") || "0");
      localStorage.setItem("userXP", (xp + Math.floor(score / 10)).toString());
    }
  }, [gameState, score, highScore]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameState !== "playing") return;
    
    if (e.key === "ArrowLeft" && playerLane > 0) {
      setPlayerLane(l => l - 1);
      setShowPrompt("Side-step!");
    } else if (e.key === "ArrowRight" && playerLane < 2) {
      setPlayerLane(l => l + 1);
      setShowPrompt("Side-step!");
    } else if (e.key === " " || e.key === "ArrowUp") {
      setShowPrompt("Sprint burst!");
      setScore(s => s + 2);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, playerLane]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setDistance(0);
    setPlayerLane(1);
    setItems([]);
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setDistance(0);
    setPlayerLane(1);
    setItems([]);
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/training")}
              className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <h1 className="text-2xl font-bold text-white">Runner Challenge 🏃</h1>
            <div className="w-12" />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-2xl mb-6 text-center"
          >
            <div className="text-8xl mb-6">🏃</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Stadium Sprint
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              Dodge obstacles, collect power-ups, and run like a pro athlete!
            </p>

            {highScore > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <div className="text-yellow-300 font-bold text-sm mb-1">HIGH SCORE</div>
                <div className="text-4xl font-bold text-white">{highScore}</div>
              </div>
            )}
          </motion.div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6">
            <h3 className="text-white font-bold mb-4 text-lg">How to Play</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⬅️➡️</div>
                <div className="text-slate-300 text-sm">Use arrows or tap to switch lanes</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚡💧🏆</div>
                <div className="text-slate-300 text-sm">Collect power-ups for points</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🚧</div>
                <div className="text-slate-300 text-sm">Avoid obstacles!</div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Running
          </motion.button>
        </div>
      </div>
    );
  }

  if (gameState === "gameover") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 shadow-2xl text-center">
            <div className="text-8xl mb-6">💥</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Nice Run!
            </h2>
            <p className="text-red-100 text-lg mb-6">
              Showing up matters. That's consistency.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-yellow-300 font-bold text-sm mb-1">SCORE</div>
                <div className="text-3xl font-bold text-white">{score}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-cyan-300 font-bold text-sm mb-1">DISTANCE</div>
                <div className="text-3xl font-bold text-white">{distance}m</div>
              </div>
            </div>

            {score > highScore && (
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-2xl p-4 mb-6">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">NEW HIGH SCORE!</div>
              </div>
            )}

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4 mb-6">
              <div className="text-blue-300 text-sm font-bold mb-1">XP EARNED</div>
              <div className="text-2xl font-bold text-white">+{Math.floor(score / 10)} XP</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-4 bg-white/20 border border-white/30 rounded-xl text-white font-bold"
              >
                Menu
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex-1 py-4 bg-white rounded-xl text-slate-900 font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden relative">
      {/* Stats Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-bold">Score: {score}</span>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-bold">{distance}m</span>
        </div>
      </div>

      {/* Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-full text-xl shadow-2xl border-4 border-white">
              {showPrompt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <div className="absolute inset-0 flex items-end justify-center pb-32">
        {/* 3 Lanes */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2 px-4">
          {[0, 1, 2].map((lane) => (
            <div
              key={lane}
              className={`h-[500px] border-2 border-dashed border-white/30 rounded-xl relative ${
                playerLane === lane ? "bg-cyan-500/20" : "bg-white/5"
              }`}
            >
              {/* Items in this lane */}
              {items
                .filter(item => item.lane === lane)
                .map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute left-1/2 -translate-x-1/2 text-5xl"
                    style={{ top: `${item.position}%` }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    {item.emoji}
                  </motion.div>
                ))}

              {/* Player */}
              {playerLane === lane && (
                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 text-6xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🏃
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => playerLane > 0 && setPlayerLane(l => l - 1)}
            disabled={playerLane === 0}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full text-white text-2xl font-bold shadow-xl border border-white/30 disabled:opacity-30"
          >
            ←
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => playerLane < 2 && setPlayerLane(l => l + 1)}
            disabled={playerLane === 2}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full text-white text-2xl font-bold shadow-xl border border-white/30 disabled:opacity-30"
          >
            →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
