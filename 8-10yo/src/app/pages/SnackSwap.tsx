import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function SnackSwap() {
  const [selectedSwap, setSelectedSwap] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const swaps = [
    {
      id: 1,
      from: { emoji: "🍟", name: "Crisps" },
      to: { emoji: "🍿", name: "Popcorn" },
      why: "Popcorn is a whole grain that gives you longer-lasting energy without the heavy grease!",
      boost: "Better focus in class and more energy for sports practice!",
    },
    {
      id: 2,
      from: { emoji: "🍫", name: "Chocolate Bar" },
      to: { emoji: "🍌🥜", name: "Banana + Peanut Butter" },
      why: "Natural sugars from banana plus protein from peanut butter = steady energy that lasts!",
      boost: "No sugar crash during afternoon lessons!",
    },
    {
      id: 3,
      from: { emoji: "🥤", name: "Fizzy Drink" },
      to: { emoji: "💧🍋", name: "Flavoured Water" },
      why: "Hydration without sugar spikes! Add lemon or berries for natural flavor.",
      boost: "Better hydration means better concentration and performance!",
    },
    {
      id: 4,
      from: { emoji: "🍩", name: "Donut" },
      to: { emoji: "🥯", name: "Whole Grain Bagel" },
      why: "Whole grains provide complex carbs that fuel your brain and muscles!",
      boost: "Energy that lasts through morning classes!",
    },
    {
      id: 5,
      from: { emoji: "🍬", name: "Sweets" },
      to: { emoji: "🍇", name: "Frozen Grapes" },
      why: "Sweet and refreshing with natural sugars plus vitamins!",
      boost: "Satisfies sweet cravings while giving you real nutrients!",
    },
    {
      id: 6,
      from: { emoji: "🧃", name: "Juice Box" },
      to: { emoji: "🍎", name: "Fresh Fruit" },
      why: "Whole fruit has fiber that helps you feel full and gives steady energy!",
      boost: "Natural energy without the sugar rush!",
    },
    {
      id: 7,
      from: { emoji: "🍪", name: "Cookies" },
      to: { emoji: "🥜", name: "Mixed Nuts" },
      why: "Protein and healthy fats keep you satisfied longer!",
      boost: "Brain power for tests and focus for homework!",
    },
    {
      id: 8,
      from: { emoji: "🍰", name: "Cake" },
      to: { emoji: "🍓🥛", name: "Yogurt & Berries" },
      why: "Protein from yogurt plus antioxidants from berries = athlete fuel!",
      boost: "Builds strong muscles and boosts recovery!",
    },
  ];

  const currentSwap = swaps.find((s) => s.id === selectedSwap);

  const handleSwapClick = (id: number) => {
    setSelectedSwap(id);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-orange-50 p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Snack Swap Explorer</h1>
        <div className="w-10"></div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-3"
        >
          🔄
        </motion.div>
        <h2 className="text-white mb-2">Athlete Upgrades!</h2>
        <p className="text-purple-100">Smart swaps for better performance</p>
      </Card>

      <Card className="p-4 mb-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            These swaps help you perform better in sports and school! Tap any swap to learn more.
          </p>
        </div>
      </Card>

      <div className="space-y-4 mb-6">
        {swaps.map((swap) => (
          <motion.div
            key={swap.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: swap.id * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => handleSwapClick(swap.id)}
              className="p-4 bg-white shadow-lg border-2 border-purple-200 cursor-pointer hover:border-purple-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-center">
                    <div className="text-4xl mb-1">{swap.from.emoji}</div>
                    <p className="text-xs text-gray-600">{swap.from.name}</p>
                  </div>

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </motion.div>

                  <div className="text-center">
                    <div className="text-4xl mb-1">{swap.to.emoji}</div>
                    <p className="text-xs text-green-600">{swap.to.name}</p>
                  </div>
                </div>

                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Learn More
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-xl text-center">
        <div className="text-5xl mb-3">💪⚽🏃</div>
        <h3 className="text-white mb-2">Making Smart Choices!</h3>
        <p className="text-green-100 text-sm">
          Every upgrade helps you become a better athlete and student
        </p>
      </Card>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-xl">
              Athlete Upgrade!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-6xl mb-2">{currentSwap?.from.emoji}</div>
                <p className="text-white">{currentSwap?.from.name}</p>
              </div>
              <ArrowRight className="w-8 h-8 text-yellow-300" />
              <div className="text-center">
                <div className="text-6xl mb-2">{currentSwap?.to.emoji}</div>
                <p className="text-white">{currentSwap?.to.name}</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <h4 className="text-white mb-2">💡 Why It's Better:</h4>
              <p className="text-white text-sm">{currentSwap?.why}</p>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="text-white mb-2">⚡ Performance Boost:</h4>
              <p className="text-white text-sm">{currentSwap?.boost}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
