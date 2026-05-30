import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Heart } from "lucide-react";

const colorMoods = [
  { id: "yellow", color: "bg-yellow-200", label: "Bright" },
  { id: "blue", color: "bg-blue-200", label: "Calm" },
  { id: "grey", color: "bg-neutral-300", label: "Neutral" },
  { id: "pink", color: "bg-pink-200", label: "Soft" },
  { id: "green", color: "bg-green-200", label: "Growing" },
  { id: "purple", color: "bg-purple-200", label: "Creative" },
  { id: "red", color: "bg-red-200", label: "Intense" },
  { id: "orange", color: "bg-orange-200", label: "Energetic" },
];

export function ReflectionScreen() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");
  const [thanksPerson, setThanksPerson] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selectedColor || note.trim() || gratitude1.trim() || gratitude2.trim() || gratitude3.trim() || thanksPerson.trim()) {
      // Save reflection (private)
      const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
      reflections.push({
        date: new Date().toISOString(),
        color: selectedColor,
        note: note.trim(),
        gratitude: [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(Boolean),
        thanksPerson: thanksPerson.trim(),
      });
      localStorage.setItem("reflections", JSON.stringify(reflections));
      setSaved(true);
    }
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <Lock className="w-16 h-16 mx-auto text-neutral-400 stroke-[1.5]" />
          </motion.div>
          
          <h2 className="text-2xl font-light text-neutral-800 mb-3">
            Saved privately.
          </h2>
          <p className="text-neutral-600 mb-8">
            Only you can see this.
          </p>

          {thanksPerson.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-8"
            >
              <Heart className="w-8 h-8 mx-auto text-pink-400 mb-3" />
              <p className="text-sm text-neutral-600 mb-2">
                You wanted to thank <span className="font-medium">{thanksPerson}</span>
              </p>
              <p className="text-xs text-neutral-500">
                Maybe tell them? It might make their day.
              </p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full bg-neutral-800 text-white rounded-full py-4 font-medium"
          >
            Back to today
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-neutral-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-neutral-400 hover:text-neutral-600"
          >
            Skip
          </button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Your private space
          </h1>
          <p className="text-neutral-500 mb-1">
            No one else will see this.
          </p>
          <p className="text-xs text-neutral-400">
            Not your parents, not your friends. Just you.
          </p>
        </motion.div>

        {/* Color mood selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="text-sm text-neutral-600 mb-3 block">
            Pick a colour for today (optional)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorMoods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(mood.id)}
                className={`${mood.color} rounded-2xl p-4 text-center relative ${
                  selectedColor === mood.id ? 'ring-2 ring-neutral-800 ring-offset-2' : ''
                }`}
              >
                <span className="text-xs text-neutral-700">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gratitude section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <label className="text-sm text-neutral-600 mb-3 block">
            3 things you're grateful for today (optional)
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={gratitude1}
              onChange={(e) => setGratitude1(e.target.value)}
              placeholder="1. Something small counts..."
              className="w-full bg-white rounded-xl p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
            />
            <input
              type="text"
              value={gratitude2}
              onChange={(e) => setGratitude2(e.target.value)}
              placeholder="2. Or something big..."
              className="w-full bg-white rounded-xl p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
            />
            <input
              type="text"
              value={gratitude3}
              onChange={(e) => setGratitude3(e.target.value)}
              placeholder="3. Whatever feels true..."
              className="w-full bg-white rounded-xl p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
            />
          </div>
        </motion.div>

        {/* Thank someone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="text-sm text-neutral-600 mb-3 block">
            Someone you'd like to thank today (optional)
          </label>
          <input
            type="text"
            value={thanksPerson}
            onChange={(e) => setThanksPerson(e.target.value)}
            placeholder="Maybe tell them later..."
            className="w-full bg-white rounded-xl p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
          />
          <p className="text-xs text-neutral-400 mt-2">
            Saying thanks (even small ones) can feel good for both of you.
          </p>
        </motion.div>

        {/* Note area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <label className="text-sm text-neutral-600 mb-3 block">
            Write something if you want (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How you're feeling, what's on your mind, or nothing at all..."
            rows={6}
            className="w-full bg-white rounded-2xl p-6 text-neutral-800 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
          />
        </motion.div>

        {/* Save button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!selectedColor && !note.trim() && !gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim() && !thanksPerson.trim()}
          className={`w-full rounded-full py-4 font-medium ${
            !selectedColor && !note.trim() && !gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim() && !thanksPerson.trim()
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-800 text-white'
          }`}
        >
          Save privately
        </motion.button>

        {/* Privacy reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <Lock className="w-3 h-3" />
            <span>Private to you only</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}