import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";

export default function AvatarCreator() {
  const [selectedAvatar, setSelectedAvatar] = useState("😊");
  const [selectedBuddy, setSelectedBuddy] = useState("🐉");
  const [selectedOutfit, setSelectedOutfit] = useState("casual");

  const avatars = [
    { id: "boy", emoji: "😊", label: "Boy" },
    { id: "girl", emoji: "😄", label: "Girl" },
    { id: "neutral", emoji: "🙂", label: "Neutral" },
  ];

  const buddies = [
    { id: "dragon", emoji: "🐉", name: "Dragon" },
    { id: "fox", emoji: "🦊", name: "Fox" },
    { id: "dino", emoji: "🦖", name: "Dinosaur" },
    { id: "monkey", emoji: "🐵", name: "Monkey" },
    { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  ];

  const outfits = [
    { id: "casual", name: "Casual", color: "from-blue-400 to-cyan-400" },
    { id: "sporty", name: "Sporty", color: "from-green-400 to-emerald-400" },
    { id: "magical", name: "Magical", color: "from-purple-400 to-pink-400" },
    { id: "hero", name: "Hero", color: "from-red-400 to-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-purple-900">Create Your Hero</h1>
        <div className="w-10"></div>
      </div>

      {/* Preview */}
      <Card className="p-8 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            key={selectedAvatar + selectedBuddy}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-7xl">{selectedAvatar}</span>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-4 -right-4"
            >
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">{selectedBuddy}</span>
              </div>
            </motion.div>
          </motion.div>
          <h2 className="text-white">Your Adventure Team!</h2>
        </div>
      </Card>

      {/* Avatar Selection */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Choose Your Avatar</h3>
        <div className="grid grid-cols-3 gap-3">
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => setSelectedAvatar(avatar.emoji)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedAvatar === avatar.emoji
                    ? 'bg-purple-100 border-2 border-purple-500 shadow-lg'
                    : 'bg-white border-2 border-transparent'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{avatar.emoji}</span>
                  <span className="text-sm text-purple-700">{avatar.label}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Buddy Selection */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Choose Your Buddy</h3>
        <div className="grid grid-cols-3 gap-3">
          {buddies.map((buddy) => (
            <motion.div
              key={buddy.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => setSelectedBuddy(buddy.emoji)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedBuddy === buddy.emoji
                    ? 'bg-yellow-100 border-2 border-yellow-500 shadow-lg'
                    : 'bg-white border-2 border-transparent'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{buddy.emoji}</span>
                  <span className="text-sm text-purple-700">{buddy.name}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outfit Selection */}
      <div className="mb-6">
        <h3 className="text-purple-900 mb-3">Choose Your Style</h3>
        <div className="grid grid-cols-2 gap-3">
          {outfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => setSelectedOutfit(outfit.id)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedOutfit === outfit.id
                    ? 'border-2 border-purple-500 shadow-lg'
                    : 'border-2 border-transparent'
                }`}
              >
                <div className={`h-16 bg-gradient-to-br ${outfit.color} rounded-lg mb-2`} />
                <p className="text-center text-purple-700">{outfit.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <Link to="/">
        <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl">
          <Sparkles className="w-5 h-5 mr-2" />
          Save & Start Adventure!
        </Button>
      </Link>
    </div>
  );
}
