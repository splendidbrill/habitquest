import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface Behavior {
  title: string;
  description: string;
  whatItMeans: string;
  howToRespond: string[];
  longTerm: string;
}

const behaviors: Behavior[] = [
  {
    title: "Food sneaking or hiding",
    description: "Finding wrappers hidden in their room or food stashed away",
    whatItMeans: "They may feel certain foods are 'forbidden' or worry they won't get enough. This often happens when we're too restrictive.",
    howToRespond: [
      "Don't punish or shame them - it will make sneaking worse",
      "Make previously 'forbidden' foods regular and predictable (e.g., biscuits after dinner on Tuesdays)",
      "Say: 'You don't need to hide food. If you're hungry, just ask'",
      "Check if they're genuinely hungry between meals",
    ],
    longTerm: "When treats become regular and predictable, the urge to sneak disappears. This can take weeks, so be patient.",
  },
  {
    title: "Meltdowns at mealtimes",
    description: "Crying, shouting, or refusing to come to the table",
    whatItMeans: "Mealtimes may feel stressful or pressured. They might be overtired, overstimulated, or anxious about being forced to eat.",
    howToRespond: [
      "Stay calm - your reaction shapes theirs",
      "Lower expectations temporarily: 'You don't have to eat, just sit with us for 5 minutes'",
      "Remove pressure: 'I've made dinner. You can eat what you like from the table'",
      "Look for patterns: Is it always at the same time? Same food? Same family member?",
    ],
    longTerm: "Once the pressure is off, mealtimes usually become easier. Focus on connection, not consumption.",
  },
  {
    title: "Constant negotiating or bargaining",
    description: "'If I eat this, can I have...?' or 'How many bites for dessert?'",
    whatItMeans: "They've learned food is transactional. Someone (maybe us!) taught them that eating = rewards.",
    howToRespond: [
      "Stop all food bargaining immediately - it backfires",
      "Say: 'Dessert comes after dinner, but you choose what to eat from your plate'",
      "Offer choices that don't involve rewards: 'Would you like peas or carrots?'",
      "Be consistent - if you cave once, negotiations will increase",
    ],
    longTerm: "Breaking this habit takes 2-3 weeks of absolute consistency. It's hard but worth it.",
  },
  {
    title: "Extreme reactions to body comments",
    description: "Distress when clothes feel tight or someone mentions their size",
    whatItMeans: "They're becoming aware of body image messages from us, peers, media, or school. This is serious and needs gentle handling.",
    howToRespond: [
      "Never dismiss their feelings: 'I hear you. That sounds really hard'",
      "Don't reassure with appearance: Instead of 'You're not fat', try 'Your body is exactly right for you'",
      "Talk about what bodies do, not how they look: 'Your legs are strong for running'",
      "Monitor who/what is giving them these messages",
    ],
    longTerm: "This may need professional support. Speak to your GP if concerns persist. Early intervention prevents bigger problems.",
  },
  {
    title: "Refusing all vegetables or new foods",
    description: "Total shutdown when anything unfamiliar appears",
    whatItMeans: "This is called food neophobia - fear of new foods. It's developmental and very common in 7-11 year olds.",
    howToRespond: [
      "Keep serving them with zero pressure: 'It's here if you're curious'",
      "Eat them yourself with genuine enjoyment",
      "Involve them in cooking without expecting them to eat it",
      "Celebrate tiny steps: 'You touched the broccoli today!'",
      "It can take 15-20 exposures before they try it",
    ],
    longTerm: "Most children grow out of this phase by their teens IF we don't pressure them. Patience is key.",
  },
  {
    title: "Exercise avoidance or complaints",
    description: "'My legs hurt', 'I'm too tired', 'I hate PE'",
    whatItMeans: "They may have had negative experiences (being picked last, feeling watched, comparing themselves to others). Or they're genuinely not interested in structured sport - and that's okay!",
    howToRespond: [
      "Don't force organized sport if they hate it",
      "Find what they DO enjoy: dancing, walking the dog, park play, swimming",
      "Make it social: 'Shall we invite a friend?'",
      "Join them: 'Let's go together'",
      "Focus on fun, not fitness or appearance",
    ],
    longTerm: "The goal is lifelong movement, not being good at sport. Any joyful movement counts.",
  },
];

export function DifficultBehaviors() {
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
            <h1 className="mb-1">Difficult Behaviors</h1>
            <p className="text-sm text-muted-foreground">
              Understanding and responding
            </p>
          </div>
        </div>

        {/* Intro Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <BookOpen className="w-10 h-10 text-secondary-foreground mb-3" />
          <h3 className="mb-2">These behaviors are communication</h3>
          <p className="text-sm text-muted-foreground">
            Children don't act out for no reason. Their behavior is trying to
            tell us something. Our job is to listen and respond with compassion,
            not punishment.
          </p>
        </Card>

        {/* Behaviors */}
        <div className="space-y-6">
          {behaviors.map((behavior, index) => (
            <Card key={index} className="p-5">
              <h3 className="mb-2 text-primary">{behavior.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {behavior.description}
              </p>

              <div className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-3">
                  <p className="text-xs font-medium mb-1">
                    💭 What it might mean:
                  </p>
                  <p className="text-sm">{behavior.whatItMeans}</p>
                </div>

                <div>
                  <p className="text-xs font-medium mb-2">✅ How to respond:</p>
                  <ul className="space-y-2">
                    {behavior.howToRespond.map((response, i) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4">
                        • {response}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
                  <p className="text-xs font-medium text-secondary mb-1">
                    🕐 Long-term outlook:
                  </p>
                  <p className="text-sm">{behavior.longTerm}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* When to get help */}
        <Card className="p-5 mt-6 bg-destructive/10 border-destructive/20">
          <h3 className="mb-2">When to seek professional support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            If you notice any of these, please speak to your GP or school nurse:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Obsessive weighing or body checking</li>
            <li>• Hiding food and lying about eating</li>
            <li>• Severe distress about body or appearance</li>
            <li>• Withdrawing from friends and activities</li>
            <li>• Big changes in mood or behavior</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Early intervention makes a huge difference. You're not overreacting by
            asking for help.
          </p>
        </Card>

        {/* Bottom Card */}
        <Card className="p-5 mt-6 bg-card text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="mb-2">You're not alone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These challenges are hard, but with the right response, they almost
            always improve. Take it one day at a time.
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
              onClick={() => navigate("/supportive-responses")}
            >
              Supportive responses
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
