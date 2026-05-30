import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Zap, Play, Pause } from "lucide-react";

type Obstacle = {
  id: number;
  lane: number;
  type: 'dodge' | 'jump';
};

type Collectible = {
  id: number;
  lane: number;
  type: 'hydration' | 'snack' | 'beat';
  icon: string;
};

export function UrbanRunner() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);
  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const collectibleIdRef = useRef(0);

  const collectibleTypes = [
    { type: 'hydration' as const, icon: '💧', points: 10 },
    { type: 'snack' as const, icon: '🥜', points: 15 },
    { type: 'beat' as const, icon: '🎵', points: 20 },
  ];

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDistance(0);
    setPlayerLane(1);
    setObstacles([]);
    setCollectibles([]);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    // Save score
    const highScore = parseInt(localStorage.getItem("urbanRunnerHighScore") || "0");
    if (score > highScore) {
      localStorage.setItem("urbanRunnerHighScore", score.toString());
    }
    
    // Award XP
    const currentXP = parseInt(localStorage.getItem("playerXP") || "0");
    localStorage.setItem("playerXP", (currentXP + Math.floor(score / 10)).toString());
  };

  const moveLane = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    setPlayerLane(prev => {
      if (direction === 'left' && prev > 0) return prev - 1;
      if (direction === 'right' && prev < 2) return prev + 1;
      return prev;
    });
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const loop = setInterval(() => {
      setDistance(d => d + 1);

      // Spawn obstacles
      if (Math.random() < 0.15) {
        setObstacles(prev => [...prev, {
          id: obstacleIdRef.current++,
          lane: Math.floor(Math.random() * 3),
          type: Math.random() > 0.5 ? 'dodge' : 'jump',
        }]);
      }

      // Spawn collectibles
      if (Math.random() < 0.2) {
        const collectible = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
        setCollectibles(prev => [...prev, {
          id: collectibleIdRef.current++,
          lane: Math.floor(Math.random() * 3),
          type: collectible.type,
          icon: collectible.icon,
        }]);
      }

      // Move obstacles and collectibles down
      setObstacles(prev => prev.filter(o => o.id > obstacleIdRef.current - 20));
      setCollectibles(prev => prev.filter(c => c.id > collectibleIdRef.current - 20));

    }, 200);

    gameLoopRef.current = loop as unknown as number;
    return () => clearInterval(loop);
  }, [isPlaying]);

  // Check collisions and collections
  useEffect(() => {
    // Check obstacle collisions
    const currentObstacles = obstacles.slice(-3);
    const collision = currentObstacles.some(o => 
      o.lane === playerLane && 
      obstacleIdRef.current - o.id < 2
    );
    
    if (collision && isPlaying) {
      endGame();
    }

    // Check collectible pickups
    const currentCollectibles = collectibles.slice(-3);
    currentCollectibles.forEach(c => {
      if (c.lane === playerLane && collectibleIdRef.current - c.id < 2) {
        const collectible = collectibleTypes.find(ct => ct.type === c.type);
        if (collectible) {
          setScore(s => s + collectible.points);
          setCollectibles(prev => prev.filter(item => item.id !== c.id));
        }
      }
    });
  }, [playerLane, obstacles, collectibles, isPlaying]);

  const highScore = parseInt(localStorage.getItem("urbanRunnerHighScore") || "0");

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a24] p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Zap className="w-20 h-20 mx-auto text-purple-400" />
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Run Complete!
          </h2>
          <p className="text-gray-400 mb-8">
            You showed up — that counts.
          </p>

          <div className="bg-[#1a1a24] rounded-2xl p-6 mb-6 border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Distance</p>
                <p className="text-2xl font-bold text-white">{distance}m</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-purple-400">{score}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-1">High Score</p>
                <p className="text-xl font-bold text-cyan-400">{Math.max(score, highScore)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-4 font-semibold glow-purple"
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
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-xl font-bold text-purple-400">{score}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Distance</p>
              <p className="text-xl font-bold text-cyan-400">{distance}m</p>
            </div>
          </div>
        </div>

        {!isPlaying ? (
          /* Start screen */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Zap className="w-24 h-24 mx-auto text-purple-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Urban Runner
            </h1>
            <p className="text-gray-400 mb-2">
              Quick reflexes, urban vibes
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Collect hydration 💧, snacks 🥜, and beats 🎵
            </p>

            {highScore > 0 && (
              <div className="bg-[#1a1a24] rounded-xl p-4 mb-8 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Your Best</p>
                <p className="text-2xl font-bold text-cyan-400">{highScore}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl py-6 font-bold text-lg glow-purple flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Start Run
            </motion.button>

            <p className="text-xs text-gray-500 mt-6">
              Swipe or tap left/right to dodge
            </p>
          </motion.div>
        ) : (
          /* Game screen */
          <div className="relative">
            {/* Game area */}
            <div className="bg-[#1a1a24] rounded-2xl p-4 relative overflow-hidden h-[500px] border border-white/10">
              {/* Road lanes */}
              <div className="absolute inset-0 flex">
                {[0, 1, 2].map(lane => (
                  <div key={lane} className="flex-1 border-r border-white/5 last:border-r-0" />
                ))}
              </div>

              {/* Player */}
              <motion.div
                animate={{ left: `${playerLane * 33.33}%` }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-8 w-1/3 flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="text-4xl"
                >
                  🏃‍♀️
                </motion.div>
              </motion.div>

              {/* Obstacles */}
              <AnimatePresence>
                {obstacles.map((obstacle, index) => (
                  <motion.div
                    key={obstacle.id}
                    initial={{ top: -50 }}
                    animate={{ top: `${(obstacleIdRef.current - obstacle.id) * 40}px` }}
                    exit={{ opacity: 0 }}
                    className="absolute w-1/3"
                    style={{ left: `${obstacle.lane * 33.33}%` }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="bg-red-500 rounded-lg px-4 py-2 text-xl">
                        {obstacle.type === 'jump' ? '🚧' : '⚠️'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Collectibles */}
              <AnimatePresence>
                {collectibles.map(collectible => (
                  <motion.div
                    key={collectible.id}
                    initial={{ top: -50 }}
                    animate={{ top: `${(collectibleIdRef.current - collectible.id) * 40}px` }}
                    exit={{ opacity: 0 }}
                    className="absolute w-1/3"
                    style={{ left: `${collectible.lane * 33.33}%` }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center justify-center text-2xl"
                    >
                      {collectible.icon}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Action prompts */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-4 left-0 right-0 text-center text-cyan-400 text-sm font-semibold"
              >
                Power steps! 💪
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => moveLane('left')}
                className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl py-6 font-bold text-lg"
              >
                ← Left
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => moveLane('right')}
                className="flex-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl py-6 font-bold text-lg"
              >
                Right →
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
