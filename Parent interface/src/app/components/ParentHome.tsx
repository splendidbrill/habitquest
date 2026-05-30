import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BottomNav } from "./BottomNav";
import {
  Heart,
  Clock,
  PoundSterling,
  ShoppingCart,
  ChevronRight,
  TrendingUp,
  Check,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";

interface MealOption {
  id: string;
  name: string;
  time: number;
  cost: number;
  ingredients: string[];
}

interface ShoppingItem {
  category: string;
  items: string[];
}

export function ParentHome() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const todayCoachingTip = {
    message: "Small habits make big changes.",
    tip: "Children are more likely to try new foods if they see parents eating them.",
  };

  const mealOptions: MealOption[] = [
    {
      id: "1",
      name: "Vegetable Pasta",
      time: 15,
      cost: 3.0,
      ingredients: ["Pasta", "Mixed vegetables", "Tomato sauce", "Garlic", "Olive oil"],
    },
    {
      id: "2",
      name: "Chicken Wraps",
      time: 20,
      cost: 4.0,
      ingredients: ["Tortilla wraps", "Chicken breast", "Lettuce", "Tomatoes", "Mayo"],
    },
    {
      id: "3",
      name: "Bean Tacos",
      time: 15,
      cost: 2.0,
      ingredients: ["Taco shells", "Black beans", "Cheese", "Salsa", "Lettuce"],
    },
  ];

  const shoppingList: ShoppingItem[] = [
    {
      category: "Fruit & Vegetables",
      items: ["Apples", "Bananas", "Carrots", "Lettuce", "Tomatoes"],
    },
    {
      category: "Dairy",
      items: ["Milk", "Cheese", "Yogurt", "Butter"],
    },
    {
      category: "Grains",
      items: ["Wholegrain bread", "Pasta", "Rice", "Oats"],
    },
    {
      category: "Proteins",
      items: ["Chicken breast", "Eggs", "Black beans", "Lentils"],
    },
  ];

  const healthySwaps = [
    { from: "Sugary cereal", to: "Oats + fruit" },
    { from: "Crisps", to: "Homemade popcorn" },
    { from: "Fizzy drinks", to: "Fruit water" },
  ];

  const lunchboxIdeas = [
    "Wholegrain sandwich",
    "Apple slices",
    "Yogurt pot",
    "Carrot sticks",
    "Water bottle",
  ];

  const weeklyProgress = {
    familyMeals: { completed: 6, total: 7 },
    activityMissions: { completed: 8, total: 10 },
    healthySwaps: { completed: 5, total: 7 },
  };

  const totalItems = shoppingList.reduce((acc, cat) => acc + cat.items.length, 0);
  const estimatedCost = 28.5;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-1">Parent Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Supporting you every step of the way
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* 1. Daily Coaching Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2">{todayCoachingTip.message}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">Today's tip:</span>{" "}
                {todayCoachingTip.tip}
              </p>
            </div>
          </div>
          <Button className="w-full">Try this today</Button>
        </Card>

        {/* 2. Tonight's Meal Helper */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <h3>What could we cook tonight?</h3>
          </div>

          <div className="space-y-3">
            {mealOptions.map((meal) => (
              <div
                key={meal.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-all cursor-pointer"
                onClick={() =>
                  setSelectedMeal(selectedMeal === meal.id ? null : meal.id)
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <h4>{meal.name}</h4>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      selectedMeal === meal.id ? "rotate-90" : ""
                    }`}
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{meal.time} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PoundSterling className="w-4 h-4" />
                    <span>£{meal.cost.toFixed(2)}</span>
                  </div>
                </div>

                {selectedMeal === meal.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium mb-2 text-muted-foreground">
                      Ingredients:
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {meal.ingredients.map((ingredient, i) => (
                        <span
                          key={i}
                          className="text-xs bg-accent px-2 py-1 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add ingredients to shopping list
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* 3. Smart Shopping List */}
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Smart Shopping List</h3>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{totalItems} items</p>
              <p className="text-sm font-medium text-primary">
                ~£{estimatedCost.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            {shoppingList.map((category, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium mb-2 text-primary">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-4 h-4 rounded border border-border" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Healthy Swap Suggestions */}
          <div className="bg-secondary/10 rounded-lg p-4 mb-4 border border-secondary/20">
            <h4 className="mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              Healthy swap suggestions
            </h4>
            <div className="space-y-2">
              {healthySwaps.map((swap, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="line-through text-muted-foreground">
                    {swap.from}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-secondary font-medium">{swap.to}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/grocery-list")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View full shopping list
          </Button>
        </Card>

        {/* 4. Lunchbox Planner */}
        <Card className="p-5 mb-6">
          <h3 className="mb-3">Lunchbox Planner</h3>

          <div className="bg-accent/50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium mb-3">Today's lunch idea:</p>
            <div className="space-y-2">
              {lunchboxIdeas.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-secondary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent border border-accent rounded-lg p-3">
            <p className="text-xs text-accent-foreground">
              <span className="font-medium">💡 Quick tip:</span> Children often
              need to try foods 10–15 times before liking them. Keep offering
              without pressure!
            </p>
          </div>
        </Card>

        {/* 5. Weekly Family Progress */}
        <Card className="p-5 mb-6">
          <h3 className="mb-4">Weekly Family Progress</h3>

          <div className="space-y-4">
            {/* Family Meals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Family meals cooked</span>
                <span className="text-sm font-medium">
                  {weeklyProgress.familyMeals.completed}/
                  {weeklyProgress.familyMeals.total}
                </span>
              </div>
              <div className="bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${
                      (weeklyProgress.familyMeals.completed /
                        weeklyProgress.familyMeals.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Activity Missions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Activity missions completed</span>
                <span className="text-sm font-medium">
                  {weeklyProgress.activityMissions.completed}/
                  {weeklyProgress.activityMissions.total}
                </span>
              </div>
              <div className="bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-secondary h-full transition-all"
                  style={{
                    width: `${
                      (weeklyProgress.activityMissions.completed /
                        weeklyProgress.activityMissions.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Healthy Swaps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Healthy snack swaps</span>
                <span className="text-sm font-medium">
                  {weeklyProgress.healthySwaps.completed}/
                  {weeklyProgress.healthySwaps.total}
                </span>
              </div>
              <div className="bg-accent rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent-foreground h-full transition-all"
                  style={{
                    width: `${
                      (weeklyProgress.healthySwaps.completed /
                        weeklyProgress.healthySwaps.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">
                You're building great routines for your family.
              </span>{" "}
              Keep going! 💪
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate("/weekly-report")}
          >
            View full weekly report
          </Button>
        </Card>

        {/* Quick Access to More Tools */}
        <Card className="p-5 mb-6 text-center">
          <h3 className="mb-2">Need more tools?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Access Quick Meal Mode, Budget Tracker, Photo Rewards, and more
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/parent-dashboard")}
          >
            View all parent tools
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}