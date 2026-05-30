import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const feedbackCategories = [
  { id: "helpful", label: "Helpful", icon: ThumbsUp },
  { id: "not-helpful", label: "Not helpful", icon: ThumbsDown },
  { id: "confusing", label: "Confusing", icon: MessageSquare },
];

export function FeedbackScreen() {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const features = [
    "Daily check-in",
    "Movement choices",
    "Private journal",
    "Wellbeing tracking",
    "Weekly planner",
    "Support resources",
    "Food guidance",
    "Motivational quotes",
  ];

  const toggleLike = (feature: string) => {
    if (likes.includes(feature)) {
      setLikes(likes.filter(f => f !== feature));
    } else {
      setLikes([...likes, feature]);
      setDislikes(dislikes.filter(f => f !== feature));
    }
  };

  const toggleDislike = (feature: string) => {
    if (dislikes.includes(feature)) {
      setDislikes(dislikes.filter(f => f !== feature));
    } else {
      setDislikes([...dislikes, feature]);
      setLikes(likes.filter(f => f !== feature));
    }
  };

  const handleSubmit = () => {
    // Save feedback (in a real app, this would send to a server)
    const feedback = {
      date: new Date().toISOString(),
      likes,
      dislikes,
      suggestions: suggestions.trim(),
    };
    
    const allFeedback = JSON.parse(localStorage.getItem("userFeedback") || "[]");
    allFeedback.push(feedback);
    localStorage.setItem("userFeedback", JSON.stringify(allFeedback));
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="text-6xl">✓</div>
          </motion.div>
          
          <h2 className="text-2xl font-light text-neutral-800 mb-3">
            Thank you
          </h2>
          <p className="text-neutral-600 mb-8">
            Your feedback helps make this better for everyone.
          </p>

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
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            What do you think?
          </h1>
          <p className="text-neutral-500">
            Tell us what's working and what isn't. Be honest.
          </p>
        </motion.div>

        {/* Features feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-sm font-medium text-neutral-600 mb-4">
            Features you've tried
          </h2>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{feature}</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(feature)}
                      className={`p-2 rounded-lg transition-colors ${
                        likes.includes(feature)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDislike(feature)}
                      className={`p-2 rounded-lg transition-colors ${
                        dislikes.includes(feature)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="text-sm font-medium text-neutral-600 mb-3 block">
            What would make this better? (optional)
          </label>
          <textarea
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Be as specific or vague as you want..."
            rows={5}
            className="w-full bg-white rounded-2xl p-5 text-neutral-800 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300 border border-neutral-100"
          />
        </motion.div>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={likes.length === 0 && dislikes.length === 0 && !suggestions.trim()}
          className={`w-full rounded-full py-4 font-medium ${
            likes.length === 0 && dislikes.length === 0 && !suggestions.trim()
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-800 text-white'
          }`}
        >
          Send feedback
        </motion.button>

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-neutral-400">
            Your feedback is anonymous
          </p>
        </motion.div>
      </div>
    </div>
  );
}
