import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";

interface LunchItem {
  id: string;
  name: string;
  category: "protein" | "carb" | "fruit" | "veg" | "dairy";
  eaten: boolean | null; // null = not logged yet
}

export function SchoolLunchTracker() {
  const navigate = useNavigate();
  const [todayLunch, setTodayLunch] = useState<LunchItem[]>([
    { id: "1", name: "Sandwich", category: "carb", eaten: true },
    { id: "2", name: "Apple", category: "fruit", eaten: true },
    { id: "3", name: "Yogurt", category: "dairy", eaten: false },
    { id: "4", name: "Carrot sticks", category: "veg", eaten: null },
  ]);

  const toggleEaten = (id: string, status: boolean) => {
    setTodayLunch(
      todayLunch.map((item) => (item.id === id ? { ...item, eaten: status } : item))
    );
  };

  const getMissingNutrients = () => {
    const categories = {
      protein: todayLunch.filter((i) => i.category === "protein" && i.eaten).length,
      carb: todayLunch.filter((i) => i.category === "carb" && i.eaten).length,
      fruit: todayLunch.filter((i) => i.category === "fruit" && i.eaten).length,
      veg: todayLunch.filter((i) => i.category === "veg" && i.eaten).length,
      dairy: todayLunch.filter((i) => i.category === "dairy" && i.eaten).length,
    };

    const missing = [];
    if (categories.protein === 0) missing.push("protein");
    if (categories.veg === 0) missing.push("vegetables");
    if (categories.fruit === 0) missing.push("fruit");

    return missing;
  };

  const getSuggestions = () => {
    const missing = getMissingNutrients();
    const suggestions = [];

    if (missing.includes("protein")) {
      suggestions.push({
        issue: "Your child skipped protein today",
        suggestion: "Consider adding cheese, egg, or chicken to tomorrow's lunch",
        emoji: "🥚",
      });
    }

    if (missing.includes("vegetables")) {
      suggestions.push({
        issue: "No vegetables eaten today",
        suggestion: "Try cucumber sticks, cherry tomatoes, or peppers tomorrow",
        emoji: "🥕",
      });
    }

    if (missing.includes("fruit")) {
      suggestions.push({
        issue: "No fruit eaten today",
        suggestion: "Pack easy options: banana, grapes, or apple slices",
        emoji: "🍎",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        issue: "Balanced lunch today! 🎉",
        suggestion: "Your child ate from all the main food groups. Well done!",
        emoji: "✅",
      });
    }

    return suggestions;
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/parent-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">School Lunch Tracker</h1>
            <p className="text-sm text-muted-foreground">
              What did they actually eat?
            </p>
          </div>
        </div>

        {/* Info */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">💡 For parents:</span> Ask your child to
            tap what they ate at lunch. This helps you plan better dinners and
            snacks.
          </p>
        </Card>

        {/* Today's Lunch */}
        <div className="mb-6">
          <h3 className="mb-3">Today's lunch</h3>
          <div className="space-y-3">
            {todayLunch.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1">{item.name}</h4>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={item.eaten === true ? "default" : "outline"}
                      onClick={() => toggleEaten(item.id, true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Ate it
                    </Button>
                    <Button
                      size="sm"
                      variant={item.eaten === false ? "destructive" : "outline"}
                      onClick={() => toggleEaten(item.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Left it
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <h3 className="mb-3">Lunch summary</h3>
          <div className="space-y-2">
            {todayLunch.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                {item.eaten === true && (
                  <>
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>{item.name}</span>
                  </>
                )}
                {item.eaten === false && (
                  <>
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="line-through text-muted-foreground">
                      {item.name}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Suggestions */}
        <div className="space-y-3">
          <h3 className="mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Suggestions for tomorrow
          </h3>
          {getSuggestions().map((suggestion, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{suggestion.emoji}</span>
                <div className="flex-1">
                  <h4 className="mb-1 text-primary">{suggestion.issue}</h4>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.suggestion}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Child View Info */}
        <Card className="p-5 mt-6 bg-card text-center">
          <h3 className="mb-2">Child view coming soon</h3>
          <p className="text-sm text-muted-foreground">
            Your child will be able to log their own lunch with simple taps,
            making it fun and easy to track.
          </p>
        </Card>
      </div>
    </div>
  );
}
