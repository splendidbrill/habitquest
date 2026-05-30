import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Lock, Lightbulb, Heart, Users } from "lucide-react";

const tasks = [
  {
    id: "wash-veggies",
    emoji: "🥬",
    title: "Washed Vegetables",
    description: "Help wash the veggies for cooking",
    tips: [
      "🚿 Use cold water to rinse vegetables clean",
      "✋ Rub gently to remove dirt - be gentle!",
      "👀 Check both sides - dirt likes to hide!",
      "💧 Pat dry with a clean towel after washing",
    ],
    whyItHelps: "Washing removes dirt and germs so the food is safe to eat. You're helping keep the family healthy!",
    skillLearned: "Food Safety & Cleanliness",
  },
  {
    id: "stir",
    emoji: "🥄",
    title: "Stirred Ingredients",
    description: "Stir the pot (with adult help!)",
    tips: [
      "🥄 Use a long wooden spoon so you don't get burned",
      "🔄 Stir slowly in circles - not too fast!",
      "👃 Smell the yummy spices as you stir",
      "⚠️ Never touch the pot - it's HOT! Ask an adult",
    ],
    whyItHelps: "Stirring mixes flavors together and stops food from burning. You're learning real cooking skills!",
    skillLearned: "Cooking Technique & Kitchen Safety",
  },
  {
    id: "set-table",
    emoji: "🍽️",
    title: "Set the Table",
    description: "Put out plates, spoons, and cups",
    tips: [
      "🍽️ Plate goes in front of each chair",
      "🥄 Spoon on the right, fork on the left",
      "🥤 Glass goes above the plate",
      "😊 Make it look nice - you're creating a happy mealtime!",
    ],
    whyItHelps: "Setting the table shows care for your family and makes mealtimes special. You're being responsible!",
    skillLearned: "Responsibility & Family Care",
  },
];

export function KitchenHelper() {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastCompleted = localStorage.getItem("kitchenHelperDate");
    
    if (lastCompleted === today) {
      setHasCompletedToday(true);
      const savedTasks = JSON.parse(localStorage.getItem("todaysKitchenTasks") || "[]");
      setCompletedTasks(savedTasks);
    }
  }, []);

  const handleTaskClick = (taskId: string) => {
    if (completedTasks.includes(taskId) || hasCompletedToday) return;
    
    setCurrentTask(taskId);
    setShowTipsModal(true);
  };

  const handleStartTask = () => {
    setShowTipsModal(false);
    setShowPinPrompt(true);
  };

  const handlePinSubmit = () => {
    if (pin === "👍" || pin === "1234") { // Simple emoji or number PIN
      if (currentTask && !completedTasks.includes(currentTask)) {
        const newCompleted = [...completedTasks, currentTask];
        setCompletedTasks(newCompleted);
        
        // Save progress
        localStorage.setItem("todaysKitchenTasks", JSON.stringify(newCompleted));
        
        // Add family point
        const currentPoints = parseInt(localStorage.getItem("familyPoints") || "0");
        localStorage.setItem("familyPoints", String(currentPoints + 1));
        
        // Check if all tasks complete
        if (newCompleted.length === tasks.length) {
          const today = new Date().toDateString();
          localStorage.setItem("kitchenHelperDate", today);
          
          // Add badge
          const badges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
          if (!badges.includes("kitchen-champion")) {
            badges.push("kitchen-champion");
            localStorage.setItem("earnedBadges", JSON.stringify(badges));
          }
          
          setHasCompletedToday(true);
          setShowSuccess(true);
        }
      }
      
      setShowPinPrompt(false);
      setPin("");
      setCurrentTask(null);
    } else {
      // Wrong PIN - shake animation
      setPin("");
    }
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-gray-800">Kitchen Helper</h1>
          <div className="w-12" />
        </div>

        {!showSuccess ? (
          <>
            {/* Instructions */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-6 shadow-xl mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">👨‍🍳</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Help Cook Today!
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Ask a parent to approve each task
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {completedTasks.length} / {tasks.length} tasks done
              </p>

              {hasCompletedToday && (
                <div className="bg-green-100 rounded-2xl p-3 text-center mt-4">
                  <p className="text-green-800 font-bold text-sm">
                    ✓ All done for today!
                  </p>
                  <p className="text-green-700 text-xs">
                    Come back tomorrow to help again
                  </p>
                </div>
              )}
            </motion.div>

            {/* Task Checklist */}
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id);
                
                return (
                  <motion.button
                    key={task.id}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: hasCompletedToday ? 1 : 1.02 }}
                    whileTap={{ scale: hasCompletedToday ? 1 : 0.98 }}
                    onClick={() => handleTaskClick(task.id)}
                    disabled={hasCompletedToday}
                    className={`w-full bg-white rounded-3xl p-6 shadow-xl text-left relative overflow-hidden ${
                      isCompleted ? "bg-gradient-to-r from-green-50 to-emerald-50" : ""
                    } ${hasCompletedToday && !isCompleted ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{task.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {task.description}
                        </p>
                      </div>
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    {/* Decorative element */}
                    {!isCompleted && (
                      <div className="absolute top-2 right-2 text-3xl opacity-20">
                        ⭐
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            {/* Confetti */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * 400 - 200, opacity: 1 }}
                animate={{ y: 600, rotate: 720, opacity: 0 }}
                transition={{ duration: 2.5, delay: Math.random() * 0.5 }}
                className="absolute text-3xl"
              >
                {i % 4 === 0 ? "⭐" : i % 4 === 1 ? "✨" : i % 4 === 2 ? "🌟" : "🎉"}
              </motion.div>
            ))}

            <motion.div
              animate={{
                rotate: [0, 15, -15, 15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="text-9xl mb-6"
            >
              🏆
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              Kitchen Champion!
            </h2>

            <p className="text-xl text-gray-700 mb-8 text-center px-6">
              You helped so much today! 🌟
            </p>

            {/* Rewards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full mb-8"
            >
              <div className="space-y-4">
                {/* Badge */}
                <div className="flex items-center justify-between bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">👨‍🍳</div>
                    <div>
                      <div className="font-bold text-orange-800 text-lg">New Badge!</div>
                      <div className="text-sm text-orange-600">Kitchen Champion</div>
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>

                {/* Family Points */}
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold text-amber-800 mb-1">
                    +{tasks.length} Family Points!
                  </div>
                  <div className="text-sm text-amber-700">
                    You're an amazing helper! 🎉
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="w-full py-6 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-full text-xl font-bold text-white shadow-2xl"
            >
              Back to Home 🏠
            </motion.button>
          </motion.div>
        )}

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
                    Let them approve this task
                  </p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center mb-3">
                    Parent PIN: Type <strong>1234</strong> or tap 👍
                  </p>
                  
                  {/* Emoji PIN Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setPin("👍");
                      setTimeout(() => {
                        setPin("👍");
                        handlePinSubmit();
                      }, 100);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg mb-3"
                  >
                    👍 Parent Approves
                  </motion.button>

                  {/* Number PIN Input */}
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
                  }}
                  className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Modal */}
        <AnimatePresence>
          {showTipsModal && currentTask && (() => {
            const task = tasks.find(t => t.id === currentTask)!;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                onClick={() => setShowTipsModal(false)}
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
                      {task.emoji}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>

                  {/* Cooking Tips */}
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-700" />
                      <div className="font-bold text-blue-800">Cooking Tips</div>
                    </div>
                    <div className="space-y-2">
                      {task.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm text-blue-900 leading-relaxed"
                        >
                          {tip}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Why It Helps */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Heart className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-green-800 mb-1">Why This Helps</div>
                        <p className="text-sm text-green-900">
                          {task.whyItHelps}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skill Learned */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-purple-800 mb-1">Skill You're Learning</div>
                        <p className="text-sm text-purple-900">
                          {task.skillLearned}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartTask}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold shadow-lg"
                    >
                      I'm Ready! Start Task 🚀
                    </motion.button>
                    
                    <button
                      onClick={() => setShowTipsModal(false)}
                      className="w-full py-3 bg-gray-200 rounded-full text-gray-700 font-bold"
                    >
                      Not Yet
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}