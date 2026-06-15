import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Palette, Sparkles } from "lucide-react";

const avatarEmojis: { [key: string]: string } = {
  tiger: "🐯",
  monkey: "🐵",
  elephant: "🐘",
};

const colors = [
  { id: "orange", name: "Sunset", class: "bg-orange-500", ring: "ring-orange-500" },
  { id: "teal", name: "Ocean", class: "bg-teal-500", ring: "ring-teal-500" },
  { id: "purple", name: "Sky", class: "bg-purple-500", ring: "ring-purple-500" },
  { id: "red", name: "Fire", class: "bg-red-500", ring: "ring-red-500" },
  { id: "green", name: "Forest", class: "bg-green-500", ring: "ring-green-500" },
  { id: "blue", name: "River", class: "bg-blue-500", ring: "ring-blue-500" },
];

const accessories = [
  { id: "cape", emoji: "🦸", name: "Super Cape" },
  { id: "backpack", emoji: "🎒", name: "Explorer Pack" },
  { id: "hat", emoji: "🧢", name: "Cool Hat" },
  { id: "trainers", emoji: "👟", name: "Fast Trainers" },
  { id: "sunglasses", emoji: "😎", name: "Sun Shades" },
  { id: "cricket", emoji: "🏏", name: "Cricket Bat" },
];

export function AvatarCustomize() {
  const navigate = useNavigate();
  const selectedAvatar = localStorage.getItem("selectedAvatar") || "tiger";
  
  const [selectedColor, setSelectedColor] = useState("orange");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    localStorage.setItem("avatarColor", selectedColor);
    localStorage.setItem("avatarAccessories", JSON.stringify(selectedAccessories));
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-amber-100 to-orange-100 flex flex-col items-center p-6 py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-orange-900 mb-2">
          Make Your Buddy Special!
        </h1>
        <p className="text-lg text-orange-700">
          Choose colours and gear
        </p>
      </motion.div>

      {/* Avatar Preview */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 relative"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`w-48 h-48 rounded-full ${colors.find(c => c.id === selectedColor)?.class} flex items-center justify-center shadow-2xl relative`}
        >
          <div className="text-8xl">
            {avatarEmojis[selectedAvatar]}
          </div>
          
          {/* Accessories display */}
          {selectedAccessories.map((accId, index) => {
            const accessory = accessories.find(a => a.id === accId);
            return (
              <motion.div
                key={accId}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute text-4xl"
                style={{
                  top: `${20 + index * 15}%`,
                  right: `-${10 + index * 5}%`,
                }}
              >
                {accessory?.emoji}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Color Selection */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">Choose a Colour</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color.id)}
              className={`h-20 rounded-2xl ${color.class} transition-all ${
                selectedColor === color.id
                  ? `ring-4 ${color.ring} ring-offset-2 shadow-lg`
                  : "shadow"
              }`}
            >
              {selectedColor === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white text-3xl"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Accessories Selection */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-800">Add Some Gear</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {accessories.map((accessory, index) => (
            <motion.button
              key={accessory.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleAccessory(accessory.id)}
              className={`aspect-square rounded-2xl transition-all ${
                selectedAccessories.includes(accessory.id)
                  ? "bg-gradient-to-br from-orange-400 to-teal-400 shadow-lg ring-2 ring-white"
                  : "bg-gray-100 shadow"
              }`}
            >
              <div className="text-4xl mb-1">{accessory.emoji}</div>
              <div
                className={`text-xs font-bold ${
                  selectedAccessories.includes(accessory.id)
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {accessory.name}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleContinue}
        className="w-full max-w-md py-6 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 rounded-full text-2xl font-bold text-white shadow-2xl"
      >
        Start My Adventure! 🚀
      </motion.button>
    </div>
  );
}