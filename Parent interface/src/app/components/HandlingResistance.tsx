import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface Guide {
  scenario: string;
  doThis: string[];
  avoidThis: string[];
}

const guides: Guide[] = [
  {
    scenario: "Child refuses to try new food",
    doThis: [
      "Put it on the table without pressure - just seeing it helps",
      "Eat it yourself and enjoy it (they watch you!)",
      "Say: 'You don't have to try it today. It's here if you're curious'",
      "Let them touch, smell, or play with it - no eating required",
      "Celebrate tiny steps: 'You looked at the broccoli today, well done!'",
    ],
    avoidThis: [
      "Don't force them to try it or say 'just one bite'",
      "Don't use dessert as a reward for eating it",
      "Don't show frustration or disappointment",
      "Don't make separate meals every time",
    ],
  },
  {
    scenario: "Child says 'I hate this' at the table",
    doThis: [
      "Stay calm: 'That's okay, you don't have to eat it'",
      "Offer a simple choice: 'Would you like bread or some fruit instead?'",
      "Keep the atmosphere light - don't make it a battle",
      "Remember: It can take 10-15 times before they accept a food",
      "Ask later: 'What would you like for dinner tomorrow?'",
    ],
    avoidThis: [
      "Don't argue or get into power struggles",
      "Don't take it personally - they're learning to express preferences",
      "Don't lecture about nutrition or starving children",
      "Don't ban them from the table",
    ],
  },
  {
    scenario: "Child wants snacks all day instead of meals",
    doThis: [
      "Set clear meal and snack times: 'We eat together at 5pm'",
      "Offer water between meals if they say they're hungry",
      "Involve them in meal prep so they're invested",
      "Say: 'Dinner is in 30 minutes. Would you like an apple now or wait?'",
      "Make sure snacks are actually filling (banana, toast, yogurt)",
    ],
    avoidThis: [
      "Don't ban all snacks - kids need them!",
      "Don't give in to crisps and biscuits every hour",
      "Don't make them wait hours if genuinely hungry",
      "Don't guilt them for being hungry",
    ],
  },
  {
    scenario: "Child won't sit at the table",
    doThis: [
      "Start small: 'Can we sit together for 5 minutes?'",
      "Make it fun: Play 'highs and lows' (best/worst part of day)",
      "Turn off screens - including yours",
      "Let them help set the table or choose the playlist",
      "Build up gradually - consistency matters more than length",
    ],
    avoidThis: [
      "Don't force a full 30-minute sit-down immediately",
      "Don't bring phones or tablets to the table",
      "Don't use mealtimes for difficult conversations or discipline",
      "Don't compare them to siblings who sit still",
    ],
  },
  {
    scenario: "Child resists being active",
    doThis: [
      "Find what they enjoy - it doesn't have to be 'sport'",
      "Make it social: Invite a friend to the park",
      "Start with 10 minutes: 'Let's just walk to the corner shop'",
      "Join in yourself - they need to see you move too",
      "Focus on fun, not fitness: 'Let's see who can hop the furthest!'",
    ],
    avoidThis: [
      "Don't force them into organized sports if they hate it",
      "Don't make exercise a punishment",
      "Don't comment on their body or appearance",
      "Don't compare them to sporty kids",
    ],
  },
];

export function HandlingResistance() {
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
            <h1 className="mb-1">Handling Resistance</h1>
            <p className="text-sm text-muted-foreground">
              Gentle, pressure-free approaches
            </p>
          </div>
        </div>

        {/* Intro Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <Heart className="w-10 h-10 text-secondary-foreground mb-3" />
          <h3 className="mb-2">You're doing your best</h3>
          <p className="text-sm text-muted-foreground">
            These situations are completely normal. Every parent faces them. The
            key is patience and consistency, not perfection.
          </p>
        </Card>

        {/* Guides */}
        <div className="space-y-6">
          {guides.map((guide, index) => (
            <Card key={index} className="p-5">
              <h3 className="mb-4 text-primary">{guide.scenario}</h3>

              <div className="mb-4">
                <h4 className="mb-2 flex items-center gap-2">
                  <span className="text-secondary">✅</span> Try this
                </h4>
                <ul className="space-y-2">
                  {guide.doThis.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2">
                  <span className="text-destructive">❌</span> Avoid this
                </h4>
                <ul className="space-y-2">
                  {guide.avoidThis.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Support Card */}
        <Card className="p-5 mt-6 bg-card text-center">
          <h3 className="mb-2">Need more support?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Remember: Progress isn't linear. Some weeks will be harder than
            others, and that's completely okay.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/supportive-responses")}
          >
            View supportive responses guide
          </Button>
        </Card>
      </div>
    </div>
  );
}
