import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingDown, Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface Swap {
  id: string;
  from: string;
  to: string;
  why: string;
  savings: string;
  emoji: string;
}

const healthySwaps: Swap[] = [
  {
    id: "1",
    from: "Fizzy drinks/soda",
    to: "Water with sliced fruit (lemon, cucumber, berries)",
    why: "Same refreshment, no sugar, much cheaper",
    savings: "Save £10-15/month",
    emoji: "🥤➡️💧",
  },
  {
    id: "2",
    from: "Shop-bought juice",
    to: "Homemade fruit water or diluted juice (1:3 ratio)",
    why: "Less sugar, better teeth, costs pennies",
    savings: "Save £8-12/month",
    emoji: "🧃➡️🍊",
  },
  {
    id: "3",
    from: "Crisps as snacks",
    to: "Popcorn (plain, air-popped with a tiny bit of butter)",
    why: "More filling, fun to make together, 1/3 the price",
    savings: "Save £5-8/month",
    emoji: "🥔➡️🍿",
  },
  {
    id: "4",
    from: "Shop-bought biscuits",
    to: "Homemade chapati with a little jam or cheese",
    why: "Lower sugar, uses ingredients you have, kids can help make it",
    savings: "Save £6-10/month",
    emoji: "🍪➡️🫓",
  },
  {
    id: "5",
    from: "Breakfast cereal (sugary)",
    to: "Porridge with banana or jam",
    why: "Fills them up longer, costs less, no mid-morning hunger",
    savings: "Save £10-15/month",
    emoji: "🥣➡️🍚",
  },
  {
    id: "6",
    from: "Chicken nuggets (frozen)",
    to: "Homemade chicken strips (chicken breast, breadcrumbs, mild spices)",
    why: "Better quality protein, let kids coat them, similar price",
    savings: "Same cost, better quality",
    emoji: "🍗➡️🍖",
  },
  {
    id: "7",
    from: "Chocolate bars",
    to: "Fruit with a small square of chocolate or yogurt",
    why: "Still feels like a treat, adds vitamins, costs less",
    savings: "Save £5-8/month",
    emoji: "🍫➡️🍓",
  },
  {
    id: "8",
    from: "White bread",
    to: "50/50 or wholemeal bread (start gradually)",
    why: "More filling, more fiber, same price or cheaper",
    savings: "Same cost, better nutrition",
    emoji: "🍞➡️🍞",
  },
  {
    id: "9",
    from: "Individual yogurt pots",
    to: "Large tub of natural yogurt + fruit or jam",
    why: "Much cheaper per serving, less packaging",
    savings: "Save £8-12/month",
    emoji: "🥛➡️🫙",
  },
  {
    id: "10",
    from: "Takeaway pizza",
    to: "Chapati pizza made at home",
    why: "Fun to make together, much cheaper, you control the toppings",
    savings: "Save £15-20/month",
    emoji: "🍕➡️🫓",
  },
];

export function HealthySwaps() {
  const navigate = useNavigate();

  const totalSavings = "£50-80/month";

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
            <h1 className="mb-1">Healthy Swaps</h1>
            <p className="text-sm text-muted-foreground">
              Simple, budget-friendly alternatives
            </p>
          </div>
        </div>

        {/* Savings Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="mb-1">Potential Savings</h3>
              <p className="text-2xl font-bold text-secondary mb-2">
                {totalSavings}
              </p>
              <p className="text-sm text-muted-foreground">
                If you make just half these swaps consistently
              </p>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">💡 Remember:</span> Make changes
            gradually. Even one or two swaps make a real difference to health and
            budget. No need to do everything at once!
          </p>
        </Card>

        {/* Swaps List */}
        <div className="space-y-4">
          {healthySwaps.map((swap) => (
            <Card key={swap.id} className="p-5">
              <div className="flex items-start gap-4 mb-3">
                <span className="text-3xl">{swap.emoji}</span>
                <div className="flex-1">
                  <h4 className="mb-1 text-muted-foreground line-through">
                    {swap.from}
                  </h4>
                  <h3 className="mb-2 text-primary">{swap.to}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{swap.why}</p>
              <div className="flex items-center gap-2 text-secondary">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">{swap.savings}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="p-5 mt-6 bg-card text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="mb-2">Every small change counts</h3>
          <p className="text-sm text-muted-foreground">
            You're not expected to be perfect. Pick one or two swaps to try this
            week and see how it goes.
          </p>
        </Card>
      </div>
    </div>
  );
}
