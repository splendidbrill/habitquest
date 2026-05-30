import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingDown, PiggyBank, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface Swap {
  from: string;
  to: string;
  savedPerWeek: number;
  timesUsed: number;
}

export function BudgetTracker() {
  const navigate = useNavigate();

  const weeklyGroceryCost = 45.2;
  const previousWeekCost = 52.8;
  const monthlySavings = 28.6;

  const swapsMade: Swap[] = [
    {
      from: "Fizzy drinks",
      to: "Fruit water",
      savedPerWeek: 3.2,
      timesUsed: 4,
    },
    {
      from: "Shop-bought juice",
      to: "Diluted juice",
      savedPerWeek: 2.4,
      timesUsed: 3,
    },
    {
      from: "Crisps",
      to: "Homemade popcorn",
      savedPerWeek: 1.8,
      timesUsed: 2,
    },
  ];

  const totalSavedThisWeek = swapsMade.reduce(
    (total, swap) => total + swap.savedPerWeek,
    0
  );

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
            <h1 className="mb-1">Healthy Budget Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Save money, eat better
            </p>
          </div>
        </div>

        {/* This Week's Savings */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30 text-center">
          <TrendingDown className="w-12 h-12 text-secondary mx-auto mb-3" />
          <h2 className="mb-2">Money saved this week</h2>
          <div className="text-5xl font-bold text-secondary mb-2">
            £{totalSavedThisWeek.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Through healthier swaps
          </p>
        </Card>

        {/* Weekly Grocery Cost */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5 text-primary" />
              <h4>This week</h4>
            </div>
            <div className="text-3xl font-bold text-primary">
              £{weeklyGroceryCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated grocery cost
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-secondary" />
              <h4>Saved</h4>
            </div>
            <div className="text-3xl font-bold text-secondary">
              £{(previousWeekCost - weeklyGroceryCost).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. last week</p>
          </Card>
        </div>

        {/* Monthly Projection */}
        <Card className="p-5 mb-6 bg-accent/50 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1">Monthly savings projection</h3>
              <p className="text-sm text-muted-foreground">
                Based on current swaps
              </p>
            </div>
            <div className="text-3xl font-bold text-accent-foreground">
              £{monthlySavings.toFixed(2)}
            </div>
          </div>
        </Card>

        {/* Swaps Made This Week */}
        <div className="mb-6">
          <h3 className="mb-3">Your healthy swaps this week</h3>
          <div className="space-y-3">
            {swapsMade.map((swap, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="text-sm line-through text-muted-foreground">
                        {swap.from}
                      </h4>
                      <span className="text-xs">→</span>
                      <h4 className="text-sm text-primary">{swap.to}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Used {swap.timesUsed} time{swap.timesUsed !== 1 ? "s" : ""} this
                      week
                    </p>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-secondary">
                        Saved £{swap.savedPerWeek.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add More Swaps CTA */}
        <Card className="p-5 bg-card text-center">
          <h3 className="mb-2">Want to save even more?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check out our full list of healthy swaps to find more ways to save money
            while eating better.
          </p>
          <Button onClick={() => navigate("/healthy-swaps")}>
            View all healthy swaps
          </Button>
        </Card>

        {/* Annual Projection */}
        <Card className="p-5 mt-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              If you keep this up for a year:
            </p>
            <div className="text-4xl font-bold text-primary mb-2">
              £{(monthlySavings * 12).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              saved annually - that's money for family treats, holidays, or
              savings!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
