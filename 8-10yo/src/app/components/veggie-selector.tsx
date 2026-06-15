import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Lock, Eye, Hand, Ear, Zap, Brain, Heart } from "lucide-react";

const veggies = [
  {
    id: "carrot",
    emoji: "🥕",
    name: "Carrot",
    color: "from-orange-400 to-orange-600",
    funFact: "Carrots help you see better in the dark! They're full of vitamin A that keeps your eyes super strong.",
    benefits: [
      { icon: "👀", text: "Beta-carotene helps your eyes work better - perfect for seeing the ball when playing cricket!" },
      { icon: "💪", text: "Vitamins make your immune system strong so you don't miss playtime when friends are sick" },
      { icon: "🦷", text: "Crunching carrots cleans your teeth naturally - nature's toothbrush!" },
    ],
    sensoryTips: [
      { sense: "👀", tip: "Look at the bright orange color - so cheerful!" },
      { sense: "✋", tip: "Feel how smooth and cool it is in your hand" },
      { sense: "👂", tip: "Listen to the CRUNCH when you bite - so satisfying!" },
      { sense: "👃", tip: "Smell the fresh, sweet scent" },
      { sense: "👅", tip: "Taste the natural sweetness - no sugar added!" },
    ],
    whyBetter: "Carrots give you lasting energy for sports, while candy makes you tired and slow after 30 minutes!",
    challenge: "Try carrots twice this week - raw with lunch or cooked with dinner!",
  },
  {
    id: "broccoli",
    emoji: "🥦",
    name: "Broccoli",
    color: "from-green-400 to-green-600",
    funFact: "Broccoli looks like tiny trees! It's packed with power to help you grow strong and healthy.",
    benefits: [
      { icon: "🧠", text: "Vitamin K helps your brain remember things better - great for learning at school!" },
      { icon: "💪", text: "Protein builds strong muscles for running, climbing, and playing" },
      { icon: "🛡️", text: "Vitamin C protects you from getting sick - like a shield for your body!" },
    ],
    sensoryTips: [
      { sense: "👀", tip: "See the tiny tree-like florets - like a mini forest!" },
      { sense: "✋", tip: "Touch the bumpy texture - so interesting!" },
      { sense: "👃", tip: "Fresh broccoli smells green and earthy" },
      { sense: "👅", tip: "Taste gets sweeter when cooked - try it with cheese!" },
    ],
    whyBetter: "Broccoli fills you up with nutrients that make you smarter and stronger, unlike chips that just make you thirsty!",
    challenge: "Try broccoli twice this week - maybe with some tasty cheese on top!",
  },
  {
    id: "tomato",
    emoji: "🍅",
    name: "Tomato",
    color: "from-red-400 to-red-600",
    funFact: "Tomatoes are actually fruits, not vegetables! They're juicy and full of vitamins.",
    benefits: [
      { icon: "❤️", text: "Lycopene keeps your heart strong so you can run and play all day!" },
      { icon: "☀️", text: "Vitamins protect your skin from the sun naturally" },
      { icon: "💧", text: "Full of water to keep you hydrated - important for hot days!" },
    ],
    sensoryTips: [
      { sense: "👀", tip: "Look at the bright red color - shows it's ripe and ready!" },
      { sense: "✋", tip: "Feel how firm and smooth the skin is" },
      { sense: "👃", tip: "Smell the fresh garden scent - like summer!" },
      { sense: "👅", tip: "Taste both sweet and tangy flavors together" },
    ],
    whyBetter: "Tomatoes give you vitamins AND water to stay energized, while sodas just give you sugar that makes you crash!",
    challenge: "Try tomatoes twice this week - in curry, salad, or just sliced!",
  },
  {
    id: "cucumber",
    emoji: "🥒",
    name: "Cucumber",
    color: "from-green-300 to-teal-500",
    funFact: "Cucumbers are 96% water! They're super crunchy and refreshing, especially on hot days.",
    benefits: [
      { icon: "💧", text: "Keeps you hydrated like drinking water, but with a fun crunch!" },
      { icon: "😊", text: "Cooling effect makes you feel fresh on hot days" },
      { icon: "🏃", text: "Low calories, high energy - perfect snack before playing!" },
    ],
    sensoryTips: [
      { sense: "👀", tip: "See the cool green color - looks refreshing!" },
      { sense: "✋", tip: "Feel the bumpy skin and cool temperature" },
      { sense: "👂", tip: "CRUNCH! One of the crunchiest veggies!" },
      { sense: "👅", tip: "Taste how light and refreshing it is" },
    ],
    whyBetter: "Cucumbers refresh you without sugar, while juice boxes have as much sugar as several teaspoons!",
    challenge: "Try cucumber twice this week - perfect for a crunchy snack!",
  },
  {
    id: "bell-pepper",
    emoji: "🫑",
    name: "Bell Pepper",
    color: "from-lime-400 to-green-500",
    funFact: "Bell peppers come in rainbow colors - green, yellow, orange, and red! Each color tastes a bit different.",
    benefits: [
      { icon: "🧠", text: "More vitamin C than oranges - helps your brain work super fast!" },
      { icon: "👀", text: "Vitamins A and C help your eyes stay healthy" },
      { icon: "⚡", text: "B vitamins give you energy that lasts all day for playing" },
    ],
    sensoryTips: [
      { sense: "👀", tip: "Spot all the colors - green, red, yellow, orange!" },
      { sense: "✋", tip: "Feel the smooth, shiny skin" },
      { sense: "👂", tip: "Hear the crispy crunch when you bite" },
      { sense: "👅", tip: "Green is earthy, red is sweet - which do you like?" },
    ],
    whyBetter: "Bell peppers give you vitamins that help you think clearly and play better than snacks that make you sluggish!",
    challenge: "Try bell peppers twice this week - see which color you like best!",
  },
];

export function VeggieSelector() {
  const navigate = useNavigate();
  const [selectedVeggie, setSelectedVeggie] = useState<string | null>(null);
  const [showFunFact, setShowFunFact] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [weekVeggie, setWeekVeggie] = useState<string | null>(null);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [pendingAttempt, setPendingAttempt] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("veggieOfWeek");
    const savedAttempts = parseInt(localStorage.getItem("veggieAttempts") || "0");
    if (saved) {
      setWeekVeggie(saved);
      setAttempts(savedAttempts);
    }
  }, []);

  const handleSelectVeggie = (veggieId: string) => {
    setSelectedVeggie(veggieId);
    setShowFunFact(true);
  };

  const handleAcceptChallenge = () => {
    if (selectedVeggie) {
      localStorage.setItem("veggieOfWeek", selectedVeggie);
      localStorage.setItem("veggieAttempts", "0");
      setWeekVeggie(selectedVeggie);
      setAttempts(0);
      setShowFunFact(false);
      
      const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
      localStorage.setItem("familyPoints", String(currentPoints + 1));
    }
  };

  const handleMarkAttempt = () => {
    if (attempts < 2) {
      setPendingAttempt(true);
      setShowPinPrompt(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === "👍" || pin === "1234") {
      if (pendingAttempt) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem("veggieAttempts", String(newAttempts));
        
        const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
        localStorage.setItem("familyPoints", String(currentPoints + 1));
        
        if (newAttempts === 2) {
          const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
          if (!badges.includes("veggie-explorer")) {
            badges.push("veggie-explorer");
            localStorage.setItem("earnedBadges", JSON.stringify(badges));
          }
        }
        
        setPendingAttempt(false);
      }
      setShowPinPrompt(false);
      setPin("");
    } else {
      setPin("");
    }
  };

  const selectedVeggieData = veggies.find(v => v.id === selectedVeggie);
  const currentVeggieData = veggies.find(v => v.id === weekVeggie);
  const progress = (attempts / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/home")}
            className="bg-white rounded-full p-3 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">Veggie Explorer</h1>
          <div className="w-12" />
        </div>

        {/* Current Challenge Progress */}
        {weekVeggie && currentVeggieData && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-600" />
              Your Veggie This Week
            </h2>

            <div className={`bg-gradient-to-r ${currentVeggieData.color} rounded-2xl p-6 mb-4 text-center relative`}>
              <div className="text-7xl mb-2">{currentVeggieData.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentVeggieData.name}
              </h3>
              
              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto mt-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 352" }}
                    animate={{ strokeDasharray: `${progress * 3.52} 352` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{attempts}</div>
                    <div className="text-sm text-white/90">/ 2</div>
                  </div>
                </div>
              </div>
            </div>

            {attempts < 2 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAttempt}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Ask Parent: I Tried It! +1
              </motion.button>
            ) : (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-bold text-amber-800 mb-1">Challenge Complete!</div>
                <div className="text-sm text-amber-700">
                  You're becoming a veggie explorer! Your body is getting stronger! 🌟
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">🥬</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Pick Your Veggie Adventure!
              </h2>
              <p className="text-gray-600 text-sm">
                Tap to learn how veggies make you stronger and smarter
              </p>
            </div>
          </div>
        </motion.div>

        {/* Veggie Selection Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {veggies.map((veggie, index) => (
            <motion.button
              key={veggie.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectVeggie(veggie.id)}
              className={`bg-gradient-to-br ${veggie.color} rounded-3xl p-6 shadow-xl text-center relative overflow-hidden`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="text-6xl mb-2"
              >
                {veggie.emoji}
              </motion.div>
              <h3 className="text-lg font-bold text-white">
                {veggie.name}
              </h3>
              
              <div className="absolute top-2 right-2 text-2xl opacity-30">✨</div>
            </motion.button>
          ))}
        </div>

        {/* Fun Fact Modal */}
        <AnimatePresence>
          {showFunFact && selectedVeggieData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setShowFunFact(false)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full my-8"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-8xl mb-4"
                  >
                    {selectedVeggieData.emoji}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedVeggieData.name}
                  </h3>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-gray-800">How This Helps You:</h4>
                  </div>
                  
                  {selectedVeggieData.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {benefit.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sensory Exploration */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Eye className="w-5 h-5 text-purple-700 flex-shrink-0" />
                    <div className="font-bold text-purple-800">Use Your Senses!</div>
                  </div>
                  <div className="space-y-2">
                    {selectedVeggieData.sensoryTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-purple-900">
                        <span className="text-lg flex-shrink-0">{tip.sense}</span>
                        <span>{tip.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Brain className="w-5 h-5 text-amber-700 flex-shrink-0" />
                    <div className="font-bold text-amber-800">Fun Fact!</div>
                  </div>
                  <p className="text-sm text-amber-900">
                    {selectedVeggieData.funFact}
                  </p>
                </div>

                {/* Why Better */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-700 flex-shrink-0" />
                    <div className="font-bold text-green-800">Smart Choice!</div>
                  </div>
                  <p className="text-sm text-green-900">
                    {selectedVeggieData.whyBetter}
                  </p>
                </div>

                {/* Challenge */}
                <div className={`bg-gradient-to-r ${selectedVeggieData.color} rounded-2xl p-4 mb-6`}>
                  <div className="flex items-start gap-2 mb-2">
                    <div className="text-2xl">🎯</div>
                    <div className="font-bold text-white">Your Challenge</div>
                  </div>
                  <p className="text-white/95 text-sm">
                    {selectedVeggieData.challenge}
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAcceptChallenge}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Let's Try It! +1
                  </motion.button>
                  
                  <button
                    onClick={() => setShowFunFact(false)}
                    className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                  >
                    Pick Another Veggie
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Prompt Modal */}
        <AnimatePresence>
          {showPinPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
              onClick={() => setShowPinPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Ask a Parent!
                  </h3>
                  <p className="text-gray-600">
                    Did you try the veggie?
                  </p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center mb-3">
                    Parent PIN: Type <strong>1234</strong> or tap 👍
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPin("👍");
                      setTimeout(handlePinSubmit, 100);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg mb-3"
                  >
                    👍 Child Tried It
                  </motion.button>

                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="Or type PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handlePinSubmit()}
                    className="w-full px-4 py-3 rounded-full border-2 border-gray-300 text-center font-bold text-lg mb-3"
                    maxLength={4}
                  />

                  <button
                    onClick={handlePinSubmit}
                    className="w-full py-3 bg-orange-500 rounded-full text-white font-bold shadow-lg"
                  >
                    Submit PIN
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowPinPrompt(false);
                    setPin("");
                    setPendingAttempt(false);
                  }}
                  className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
