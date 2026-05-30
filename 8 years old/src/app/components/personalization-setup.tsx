import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Trophy } from "lucide-react";

const sports = [
  { id: "football", name: "Football", emoji: "⚽", color: "from-green-600 to-emerald-600" },
  { id: "basketball", name: "Basketball", emoji: "🏀", color: "from-orange-600 to-amber-600" },
  { id: "running", name: "Running", emoji: "🏃", color: "from-blue-600 to-cyan-600" },
  { id: "swimming", name: "Swimming", emoji: "🏊", color: "from-cyan-600 to-blue-600" },
  { id: "cycling", name: "Cycling", emoji: "🚴", color: "from-purple-600 to-pink-600" },
  { id: "tennis", name: "Tennis", emoji: "🎾", color: "from-yellow-600 to-lime-600" },
];

const teams = [
  { id: "arsenal", name: "Arsenal", colors: ["#EF0107", "#FFFFFF"], sport: "football" },
  { id: "chelsea", name: "Chelsea", colors: ["#034694", "#FFFFFF"], sport: "football" },
  { id: "liverpool", name: "Liverpool", colors: ["#C8102E", "#FFFFFF"], sport: "football" },
  { id: "man-city", name: "Man City", colors: ["#6CABDD", "#FFFFFF"], sport: "football" },
  { id: "man-utd", name: "Man United", colors: ["#DA291C", "#FFFFFF"], sport: "football" },
  { id: "lakers", name: "Lakers", colors: ["#552583", "#FDB927"], sport: "basketball" },
  { id: "warriors", name: "Warriors", colors: ["#1D428A", "#FFC72C"], sport: "basketball" },
  { id: "no-team", name: "No Team", colors: ["#1e293b", "#0ea5e9"], sport: "all" },
];

const athletes = [
  { id: "ronaldo", name: "Cristiano Ronaldo", sport: "football", emoji: "⚽" },
  { id: "messi", name: "Lionel Messi", sport: "football", emoji: "⚽" },
  { id: "mbappe", name: "Kylian Mbappé", sport: "football", emoji: "⚽" },
  { id: "lebron", name: "LeBron James", sport: "basketball", emoji: "🏀" },
  { id: "curry", name: "Stephen Curry", sport: "basketball", emoji: "🏀" },
  { id: "bolt", name: "Usain Bolt", sport: "running", emoji: "🏃" },
  { id: "phelps", name: "Michael Phelps", sport: "swimming", emoji: "🏊" },
  { id: "federer", name: "Roger Federer", sport: "tennis", emoji: "🎾" },
];

export function PersonalizationSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState("");

  const handleFinish = () => {
    // Save personalization data
    localStorage.setItem("favoriteSport", selectedSport);
    localStorage.setItem("favoriteTeam", selectedTeam);
    localStorage.setItem("favoriteAthlete", selectedAthlete);
    
    // Apply team colors
    const team = teams.find(t => t.id === selectedTeam);
    if (team) {
      localStorage.setItem("themeColor1", team.colors[0]);
      localStorage.setItem("themeColor2", team.colors[1]);
    }

    navigate("/training");
  };

  const filteredTeams = selectedSport 
    ? teams.filter(t => t.sport === selectedSport || t.sport === "all")
    : teams;

  const filteredAthletes = selectedSport
    ? athletes.filter(a => a.sport === selectedSport)
    : athletes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-full h-2 rounded-full mx-1 transition-all ${
                  s <= step ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-white/60 text-sm text-center">
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Sport Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="mb-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-3xl font-bold text-white mb-3">
                What's Your Sport?
              </h1>
              <p className="text-slate-300 text-lg">
                Let's customize your training experience
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {sports.map((sport) => (
                <motion.button
                  key={sport.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`p-6 rounded-2xl text-center transition-all ${
                    selectedSport === sport.id
                      ? `bg-gradient-to-br ${sport.color} shadow-2xl border-4 border-white/30`
                      : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="text-5xl mb-3">{sport.emoji}</div>
                  <div className={`font-bold text-lg ${
                    selectedSport === sport.id ? "text-white" : "text-slate-300"
                  }`}>
                    {sport.name}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              disabled={!selectedSport}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Team Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="mb-8 text-center">
              <div className="text-6xl mb-4">🎽</div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Favorite Team?
              </h1>
              <p className="text-slate-300 text-lg">
                We'll match your app colors to your team
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {filteredTeams.map((team) => (
                <motion.button
                  key={team.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between ${
                    selectedTeam === team.id
                      ? "bg-gradient-to-r shadow-2xl border-4 border-white/30"
                      : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                  }`}
                  style={
                    selectedTeam === team.id
                      ? {
                          background: `linear-gradient(135deg, ${team.colors[0]}, ${team.colors[1]})`,
                        }
                      : {}
                  }
                >
                  <span className="font-bold text-xl text-white">{team.name}</span>
                  <div className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: team.colors[0] }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: team.colors[1] }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                disabled={!selectedTeam}
                className="flex-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                Continue
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Athlete Selection */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="mb-8 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Who Inspires You?
              </h1>
              <p className="text-slate-300 text-lg">
                Train like the pros you admire
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {filteredAthletes.map((athlete) => (
                <motion.button
                  key={athlete.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAthlete(athlete.id)}
                  className={`w-full p-5 rounded-2xl text-left transition-all flex items-center gap-4 ${
                    selectedAthlete === athlete.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl border-4 border-white/30"
                      : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="text-4xl">{athlete.emoji}</div>
                  <span className="font-bold text-xl text-white flex-1">
                    {athlete.name}
                  </span>
                  {selectedAthlete === athlete.id && (
                    <Trophy className="w-6 h-6 text-yellow-300" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                disabled={!selectedAthlete}
                className="flex-2 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                <Trophy className="w-6 h-6" />
                Start Training
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
