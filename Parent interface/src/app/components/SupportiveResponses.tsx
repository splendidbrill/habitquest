import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface Response {
  situation: string;
  insteadOfSaying: string;
  trySaying: string;
  why: string;
}

const responses: Response[] = [
  {
    situation: "When encouraging eating",
    insteadOfSaying: "Eat your vegetables or no dessert!",
    trySaying: "The broccoli is here if you'd like to try it. No pressure.",
    why: "Rewards/punishments make food about control, not health. Offering choice without pressure works better long-term.",
  },
  {
    situation: "When they're feeling full",
    insteadOfSaying: "Finish your plate - there are starving children!",
    trySaying: "Listen to your tummy. If you're full, you can stop.",
    why: "Teaching them to listen to fullness cues helps prevent overeating. It's a life skill.",
  },
  {
    situation: "When they're being picky",
    insteadOfSaying: "You're so fussy! Why can't you just eat normally?",
    trySaying: "I know you're still learning what foods you like. That's okay.",
    why: "Labels like 'fussy eater' become part of their identity. Normalizing their exploration helps them stay open.",
  },
  {
    situation: "When they want treats",
    insteadOfSaying: "You've been bad today, so no sweets.",
    trySaying: "We have treats sometimes, not every day. Let's have some on Saturday.",
    why: "Linking food to behavior creates guilt. Regular, planned treats reduce obsession and secrecy.",
  },
  {
    situation: "When they refuse activity",
    insteadOfSaying: "You're so lazy! Get off that screen!",
    trySaying: "Let's pause the screen and go to the park together for 20 minutes.",
    why: "Shame doesn't motivate. Joining them shows movement is something you do together, not a punishment.",
  },
  {
    situation: "About their body",
    insteadOfSaying: "You need to lose weight / You're getting chubby.",
    trySaying: "Your body is growing and changing - that's healthy and normal.",
    why: "Comments about weight harm self-esteem and can trigger disordered eating. Focus on behaviors, not bodies.",
  },
  {
    situation: "When they're reluctant to try",
    insteadOfSaying: "Just try it! One tiny bite won't kill you!",
    trySaying: "You don't have to eat it. Would you like to help me cook it?",
    why: "Pressure backfires. Involvement (cooking, shopping) builds curiosity without force.",
  },
  {
    situation: "When comparing siblings",
    insteadOfSaying: "Why can't you be like your sister? She eats everything!",
    trySaying: "Everyone has different tastes. That's what makes us interesting.",
    why: "Comparisons damage relationships and self-worth. Celebrating differences reduces rivalry.",
  },
  {
    situation: "When you're frustrated",
    insteadOfSaying: "I've had enough of this! I'm not cooking for you anymore!",
    trySaying: "I'm feeling frustrated. Let's take a break and try again tomorrow.",
    why: "Modeling emotional regulation teaches them it's okay to struggle. Consistency matters more than one meal.",
  },
  {
    situation: "When celebrating progress",
    insteadOfSaying: "Well done for finishing your plate!",
    trySaying: "I noticed you tried the carrots today - that's brave!",
    why: "Praising plate-cleaning ignores fullness cues. Praising trying new things builds curiosity.",
  },
];

export function SupportiveResponses() {
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
            <h1 className="mb-1">Supportive Responses</h1>
            <p className="text-sm text-muted-foreground">
              What to say (and why it helps)
            </p>
          </div>
        </div>

        {/* Intro Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <MessageCircle className="w-10 h-10 text-secondary-foreground mb-3" />
          <h3 className="mb-2">Language matters</h3>
          <p className="text-sm text-muted-foreground">
            The way we talk about food, bodies, and movement shapes how children
            see themselves. These small shifts in language can make a big
            difference.
          </p>
        </Card>

        {/* Responses */}
        <div className="space-y-4">
          {responses.map((response, index) => (
            <Card key={index} className="p-5">
              <div className="mb-4">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {response.situation}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                  <p className="text-xs font-medium text-destructive mb-1">
                    ❌ Instead of:
                  </p>
                  <p className="text-sm">&quot;{response.insteadOfSaying}&quot;</p>
                </div>

                <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
                  <p className="text-xs font-medium text-secondary mb-1">
                    ✅ Try saying:
                  </p>
                  <p className="text-sm">&quot;{response.trySaying}&quot;</p>
                </div>

                <div className="bg-accent/50 rounded-lg p-3">
                  <p className="text-xs font-medium mb-1">💡 Why this helps:</p>
                  <p className="text-sm text-accent-foreground">{response.why}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Card */}
        <Card className="p-5 mt-6 bg-card text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="mb-2">You won't get it perfect</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We all slip into old patterns sometimes. What matters is trying,
            repairing when needed, and being gentle with yourself too.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/handling-resistance")}
          >
            View handling resistance guide
          </Button>
        </Card>
      </div>
    </div>
  );
}
