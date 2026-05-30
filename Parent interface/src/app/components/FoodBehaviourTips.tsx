import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";

interface BehaviourTip {
  id: string;
  scenario: string;
  tip: string;
  emoji: string;
  why: string;
}

const behaviourTips: BehaviourTip[] = [
  {
    id: "1",
    scenario: "Child refusing vegetables?",
    tip: "Serve a very small portion alongside familiar foods. No pressure to eat it.",
    emoji: "🥦",
    why: "Small portions feel less overwhelming. Seeing it regularly builds familiarity without force.",
  },
  {
    id: "2",
    scenario: "Child demanding sugary snacks?",
    tip: "Offer a structured snack time (e.g., 3pm) rather than constant grazing.",
    emoji: "🍪",
    why: "Predictable snack times reduce pestering and help them learn to wait.",
  },
  {
    id: "3",
    scenario: "Child refusing dinner?",
    tip: "Avoid making a second meal. Offer the same meal again later if they're hungry.",
    emoji: "🍽️",
    why: "Making alternatives teaches them refusal = special treatment. Stay calm and consistent.",
  },
  {
    id: "4",
    scenario: "Child eating too fast?",
    tip: "Put cutlery down between bites. Make mealtimes relaxed, not rushed.",
    emoji: "⏱️",
    why: "It takes 20 minutes for fullness signals to reach the brain. Slowing down prevents overeating.",
  },
  {
    id: "5",
    scenario: "Child won't try new foods?",
    tip: "Let them explore without eating: touch it, smell it, help cook it.",
    emoji: "👀",
    why: "Interaction builds curiosity. No pressure = more likely to eventually try it.",
  },
  {
    id: "6",
    scenario: "Child wants dessert first?",
    tip: "Say 'Dessert comes after dinner, but you choose what to eat from your plate.'",
    emoji: "🍰",
    why: "Gives them control without making dessert a reward. Keeps it neutral.",
  },
  {
    id: "7",
    scenario: "Child says 'I'm full' immediately?",
    tip: "Say 'That's fine. Stay at the table with us for a few minutes.'",
    emoji: "😌",
    why: "They learn mealtimes are social, not battles. Often they'll nibble once pressure is off.",
  },
  {
    id: "8",
    scenario: "Child comparing food to friends?",
    tip: "Say 'Different families eat different foods. Both are okay.'",
    emoji: "🤝",
    why: "Validates their feelings without changing your approach. Normalizes variety.",
  },
  {
    id: "9",
    scenario: "Child sneaking food?",
    tip: "Don't punish. Say 'You don't need to hide food. If you're hungry, just ask.'",
    emoji: "🙈",
    why: "Sneaking means they feel restricted. Making food predictable stops the behavior.",
  },
  {
    id: "10",
    scenario: "Child complaining about packed lunch?",
    tip: "Let them choose 1-2 items to pack. Give options: 'Apple or banana?'",
    emoji: "🎒",
    why: "Involvement increases acceptance. Bounded choice (not unlimited) works best.",
  },
  {
    id: "11",
    scenario: "Child drinking too much juice?",
    tip: "Dilute juice 50/50 with water. Gradually increase water ratio over weeks.",
    emoji: "🧃",
    why: "Gradual change is less noticeable. Reduces sugar without battles.",
  },
  {
    id: "12",
    scenario: "Child refusing breakfast?",
    tip: "Offer something small and portable: banana, toast, yogurt.",
    emoji: "🌅",
    why: "Some kids aren't hungry early. Something small is better than nothing.",
  },
];

export function FoodBehaviourTips() {
  const navigate = useNavigate();

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
            <h1 className="mb-1">Food Behaviour Tips</h1>
            <p className="text-sm text-muted-foreground">
              Quick, actionable advice
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <Lightbulb className="w-10 h-10 text-secondary-foreground mb-3" />
          <h3 className="mb-2">One tip at a time</h3>
          <p className="text-sm text-muted-foreground">
            You don't need to tackle everything at once. Pick one tip to try this
            week and see how it goes. Small changes add up.
          </p>
        </Card>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 gap-4">
          {behaviourTips.map((tip) => (
            <Card key={tip.id} className="p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-3">
                <span className="text-4xl">{tip.emoji}</span>
                <div className="flex-1">
                  <h3 className="mb-1 text-primary">{tip.scenario}</h3>
                </div>
              </div>

              <div className="bg-secondary/10 rounded-lg p-4 mb-3 border-l-4 border-secondary">
                <p className="text-sm font-medium">💡 {tip.tip}</p>
              </div>

              <div className="bg-accent/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Why this works:</span> {tip.why}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="p-5 mt-6 bg-card text-center">
          <h3 className="mb-2">Need more in-depth support?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check out our comprehensive guides for handling resistance and
            difficult behaviors.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/handling-resistance")}
            >
              Handling resistance
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/difficult-behaviors")}
            >
              Difficult behaviors
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
