import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MessageCircle, Zap } from "lucide-react";

interface CoachQuestion {
  id: string;
  question: string;
  emoji: string;
  answer: string;
  tip: string;
}

const coachQuestions: CoachQuestion[] = [
  {
    id: "before-football",
    question: "What should I eat before football?",
    emoji: "⚽",
    answer: "Eat 1-2 hours before playing. Best choices: banana, toast with peanut butter, or a small bowl of porridge. These give you energy that lasts the whole game!",
    tip: "Pro footballers eat bananas 30 mins before kickoff. It's quick energy that won't make you feel heavy!"
  },
  {
    id: "pizza-bad",
    question: "Is pizza bad?",
    emoji: "🍕",
    answer: "Pizza isn't 'bad'! It has carbs (crust), protein (cheese), and can have veggies too. The key is: how often and what type. Homemade or thin-crust veggie pizza = better choice than deep-dish pepperoni every day.",
    tip: "Pro athletes eat pizza sometimes! They just balance it out with training and other healthy meals. It's about the big picture, not one food."
  },
  {
    id: "after-school-snack",
    question: "What's a good after-school snack?",
    emoji: "🎒",
    answer: "You need energy + protein after school! Try: apple with peanut butter, cheese and crackers, yogurt with berries, or a smoothie. These keep you full and give you power for homework and sports.",
    tip: "After school is when your body needs fuel most. Smart snacking prevents energy crashes and overeating at dinner!"
  },
  {
    id: "junk-food-cravings",
    question: "Why do I crave junk food?",
    emoji: "🍟",
    answer: "Your brain loves sugar and salt because they give quick energy. But here's the trick: junk food makes you crave MORE junk food! When you eat healthy regularly, cravings decrease. Plus, you can still have treats sometimes!",
    tip: "Athletes use the 80/20 rule: eat healthy 80% of the time, enjoy treats 20%. Balance is key!"
  },
  {
    id: "water-amount",
    question: "How much water should I drink?",
    emoji: "💧",
    answer: "Aim for 6-8 glasses a day, more if you're active! Your body is 60% water - it needs constant refills. Drink BEFORE you're thirsty, especially when playing sports.",
    tip: "Check your pee color: pale yellow = well hydrated. Dark yellow = drink more water!"
  },
  {
    id: "breakfast-skip",
    question: "Can I skip breakfast?",
    emoji: "🥣",
    answer: "Never skip breakfast! Your body has been fasting all night. Breakfast literally 'breaks the fast' and fires up your metabolism. Athletes who eat breakfast perform better in training AND school!",
    tip: "Even if you're not hungry, try something small: banana, yogurt, or a smoothie. Your brain needs fuel to focus in class!"
  },
  {
    id: "protein-muscles",
    question: "Do I need protein for muscles?",
    emoji: "💪",
    answer: "YES! Protein is the building block of muscles. After training, your muscles need protein to repair and grow stronger. Aim for protein in every meal: eggs, chicken, fish, dal, paneer, yogurt, nuts.",
    tip: "Eat protein within 30 mins after training for maximum muscle growth. Chocolate milk is actually a great recovery drink!"
  },
  {
    id: "energy-drinks",
    question: "What about energy drinks?",
    emoji: "⚡",
    answer: "Energy drinks are NOT for kids! They have massive amounts of caffeine and sugar that can mess with your heart, sleep, and focus. Real energy comes from good food, water, and sleep.",
    tip: "Want real energy? Eat complex carbs (oats, rice, bread), stay hydrated, and get 9-10 hours sleep. That's what pro athletes do!"
  },
  {
    id: "fast-food",
    question: "Is fast food always bad?",
    emoji: "🍔",
    answer: "Fast food CAN be okay occasionally. The problem is: it's usually high in salt, fat, and low in nutrients. If you do eat fast food, pick better options: grilled over fried, water over soda, side salad over fries.",
    tip: "Elite athletes sometimes eat fast food on the road. They just make smarter choices and don't make it a habit!"
  },
  {
    id: "tired-sports",
    question: "Why am I tired during sports?",
    emoji: "😴",
    answer: "Could be: not eating enough before activity, dehydration, not enough sleep, or low iron. Make sure you eat a good snack 1-2 hours before sports, drink water throughout the day, and sleep 9-10 hours!",
    tip: "Pro athletes track sleep like they track training. Sleep is when your body recovers and gets stronger!"
  },
  {
    id: "vegetables-boring",
    question: "Vegetables are boring. Help!",
    emoji: "🥦",
    answer: "Try different preparations! Roasted veggies taste completely different than boiled. Add spices, dips (hummus!), or mix them into foods you already like. Even pro athletes didn't love veggies at first!",
    tip: "Challenge: try ONE new vegetable each week prepared a different way. You might find favorites you never knew you had!"
  },
  {
    id: "hunger-games",
    question: "I'm always hungry after games!",
    emoji: "🏃",
    answer: "That's normal! You burned tons of energy. Have a recovery snack within 30 mins: chocolate milk, banana + peanut butter, or yogurt. Then eat a proper meal with carbs + protein within 2 hours.",
    tip: "Your hunger is your body saying 'I need fuel to recover!' Listen to it and eat quality food, not junk!"
  },
];

export function AskCoach() {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<CoachQuestion | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 py-12">
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
          <h1 className="text-2xl font-bold text-white">Ask Coach 🏆</h1>
          <div className="w-12" />
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="text-5xl">👨‍🏫</div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Got Questions?
              </h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                Tap any question to get expert advice from your virtual coach. Real answers for real athletes!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Questions Grid */}
        <div className="space-y-3 mb-6">
          {coachQuestions.map((q, index) => (
            <motion.button
              key={q.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedQuestion(q)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:border-purple-400 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl flex-shrink-0">{q.emoji}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white leading-snug">
                    {q.question}
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Keep Learning!</h4>
              <p className="text-blue-100 text-sm">
                The more you understand about nutrition and training, the better athlete you become. Knowledge = power! 💪
              </p>
            </div>
          </div>
        </motion.div>

        {/* Answer Modal */}
        <AnimatePresence>
          {selectedQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setSelectedQuestion(null)}
            >
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-md w-full my-8 border border-white/20"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-8xl mb-4"
                  >
                    {selectedQuestion.emoji}
                  </motion.div>

                  <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {selectedQuestion.question}
                    </h3>
                  </div>
                </div>

                {/* Answer */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/10">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="text-2xl">👨‍🏫</div>
                    <div className="font-bold text-blue-300">Coach Says:</div>
                  </div>
                  <p className="text-white leading-relaxed text-sm">
                    {selectedQuestion.answer}
                  </p>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <div className="font-bold text-orange-300 text-sm">Pro Tip</div>
                  </div>
                  <p className="text-orange-100 text-sm leading-relaxed">
                    {selectedQuestion.tip}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-lg"
                >
                  Thanks, Coach! 💪
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
