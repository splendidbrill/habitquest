import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Target, Zap } from "lucide-react";

type Beat = {
  id: number;
  lane: number;
  color: string;
};

export function ReflexRhythm() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const beatIdRef = useRef(0);
  const gameLoopRef = useRef<number>();

  const laneColors = [
    { lane: 0, color: 'from-purple-500 to-purple-600', glow: 'glow-purple' },
    { lane: 1, color: 'from-cyan-500 to-cyan-600', glow: 'glow-cyan' },
    { lane: 2, color: 'from-pink-500 to-pink-600', glow: 'glow-pink' },
    { lane: 3, color: 'from-blue-500 to-blue-600', glow: 'glow-blue' },
  ];

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setBeats([]);
    beatIdRef.current = 0;
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    // Save high score
    const highScore = parseInt(localStorage.getItem("reflexRhythmHighScore") || "0");
    if (score > highScore) {
      localStorage.setItem("reflexRhythmHighScore", score.toString());
    }
    
    // Award XP based on combo
    const currentXP = parseInt(localStorage.getItem("playerXP") || "0");
    localStorage.setItem("playerXP", (currentXP + combo).toString());
  };

  const hitBeat = (lane: number) => {
    if (!isPlaying) return;
    
    // Find beats in the target zone
    const targetBeats = beats.filter(b => 
      b.lane === lane && 
      beatIdRef.current - b.id >= 8 && 
      beatIdRef.current - b.id <= 12
    );
    
    if (targetBeats.length > 0) {
      // Hit!
      const points = 10 + (combo * 2);
      setScore(s => s + points);
      setCombo(c => c + 1);
      setBeats(prev => prev.filter(b => b.id !== targetBeats[0].id));
    } else {
      // Miss - break combo
      setCombo(0);
    }
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const spawnRate = difficulty === 'easy' ? 600 : difficulty === 'medium' ? 400 : 250;
    
    const loop = setInterval(() => {
      // Spawn new beat
      if (Math.random() < 0.7) {
        const laneConfig = laneColors[Math.floor(Math.random() * laneColors.length)];
        setBeats(prev => [...prev, {
          id: beatIdRef.current++,
          lane: laneConfig.lane,
          color: laneConfig.color,
        }]);
      }

      // Remove old beats (missed)
      setBeats(prev => {
        const filtered = prev.filter(b => beatIdRef.current - b.id < 15);
        const missedCount = prev.length - filtered.length;
        if (missedCount > 0) {
          setCombo(0); // Break combo on miss
        }
        return filtered;
      });
    }, spawnRate);

    gameLoopRef.current = loop as unknown as number;
    
    // Auto-end after 30 seconds
    const endTimer = setTimeout(() => {
      endGame();
    }, 30000);

    return () => {
      clearInterval(loop);
      clearTimeout(endTimer);
    };
  }, [isPlaying, difficulty]);

  const highScore = parseInt(localStorage.getItem("reflexRhythmHighScore") || "0");

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <Zap className="w-20 h-20 mx-auto text-cyan-400" />
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Session Complete!
          </h2>
          <p className="text-gray-400 mb-8">
            Small reps build big confidence.
          </p>

          <div className="bg-[#1a1a24] rounded-2xl p-6 mb-6 border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-cyan-400">{score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Best Combo</p>
                <p className="text-2xl font-bold text-purple-400">{combo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-1">High Score</p>
                <p className="text-xl font-bold text-pink-400">{Math.max(score, highScore)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-4 font-semibold glow-cyan"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex-1 bg-[#1a1a24] text-white rounded-xl py-4 font-semibold border border-white/10"
            >
              Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
        <div className="max-w-md mx-auto">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Target className="w-24 h-24 mx-auto text-cyan-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Reflex & Rhythm
            </h1>
            <p className="text-gray-400 mb-2">
              Quick taps, clean focus
            </p>
            <p className="text-sm text-gray-500 mb-8">
              30 seconds of flow state
            </p>

            {highScore > 0 && (
              <div className="bg-[#1a1a24] rounded-xl p-4 mb-8 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Your Best</p>
                <p className="text-2xl font-bold text-cyan-400">{highScore}</p>
              </div>
            )}

            {/* Difficulty selection */}
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-3">Choose intensity</p>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 rounded-xl py-3 font-semibold transition-all ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-[#1a1a24] text-gray-400 border border-white/10'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-6 font-bold text-lg glow-cyan flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6" />
              Start Session
            </motion.button>

            <p className="text-xs text-gray-500 mt-6">
              Tap the button when the beat reaches the line
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Score display */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400">Score</p>
            <p className="text-2xl font-bold text-cyan-400">{score}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Combo</p>
            <p className="text-2xl font-bold text-purple-400">{combo}x</p>
          </div>
        </div>

        {/* Game area */}
        <div className="bg-[#1a1a24] rounded-2xl p-4 relative h-[400px] border border-white/10 overflow-hidden mb-6">
          {/* Target line */}
          <div className="absolute bottom-24 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 glow-purple" />

          {/* Lanes */}
          <div className="absolute inset-0 flex gap-1">
            {laneColors.map((_, index) => (
              <div key={index} className="flex-1 border-r border-white/5 last:border-r-0" />
            ))}
          </div>

          {/* Beats falling */}
          <AnimatePresence>
            {beats.map((beat) => {
              const laneConfig = laneColors[beat.lane];
              return (
                <motion.div
                  key={beat.id}
                  initial={{ top: -50 }}
                  animate={{ top: `${(beatIdRef.current - beat.id) * 30}px` }}
                  exit={{ opacity: 0 }}
                  className="absolute"
                  style={{ 
                    left: `${beat.lane * 25}%`,
                    width: '25%',
                  }}
                >
                  <div className="flex items-center justify-center p-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${beat.color} ${laneConfig.glow} flex items-center justify-center`}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-4 gap-2">
          {laneColors.map((laneConfig, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => hitBeat(index)}
              className={`bg-gradient-to-br ${laneConfig.color} rounded-xl py-8 font-bold text-white ${laneConfig.glow}`}
            >
              <Zap className="w-6 h-6 mx-auto" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
