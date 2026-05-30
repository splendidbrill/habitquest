import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router";
import {
  Heart,
  ShoppingCart,
  RefrigeratorIcon as Fridge,
  Camera,
  Lightbulb,
  TrendingUp,
  Users,
  BookOpen,
  CheckCircle,
  Award,
  Sparkles,
} from "lucide-react";

export function ParentDashboard() {
  const navigate = useNavigate();
  const [parentStreak, setParentStreak] = useState(4);
  const [childStreak, setChildStreak] = useState(3);
  const [thisWeekMeals, setThisWeekMeals] = useState(2); // Out of 3
  const [thisWeekWorkouts, setThisWeekWorkouts] = useState(1); // Out of 2

  const progressToBonus = thisWeekMeals >= 3 && thisWeekWorkouts >= 2;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Your participation helps the whole family succeed
          </p>
        </div>

        {/* Co-Participation Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">Family Participation</h3>
              <p className="text-sm text-muted-foreground">
                Your child can see your progress too! Lead by example.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-card/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍👩‍👧</span>
                <span className="font-medium">Your streak</span>
              </div>
              <div className="text-2xl font-bold text-primary">{parentStreak} days</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧒</span>
                <span className="font-medium">Child's streak</span>
              </div>
              <div className="text-2xl font-bold text-secondary">{childStreak} days</div>
            </div>
          </div>

          {/* Weekly goals */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium">This week's goals:</p>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-5 h-5 ${
                  thisWeekMeals >= 3 ? "text-secondary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm">
                Home-cooked meals: {thisWeekMeals}/3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-5 h-5 ${
                  thisWeekWorkouts >= 2 ? "text-secondary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm">Your workouts: {thisWeekWorkouts}/2</span>
            </div>
          </div>

          {progressToBonus ? (
            <div className="bg-secondary/20 rounded-lg p-3 flex items-center gap-3">
              <Award className="w-6 h-6 text-secondary-foreground" />
              <p className="text-sm font-medium">
                Amazing! Your child has earned a bonus reward this week! 🎉
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Complete your goals this week to unlock a bonus reward for your child
            </p>
          )}
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/grocery-list")}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h4 className="mb-1">Grocery List</h4>
            <p className="text-xs text-muted-foreground">
              One-click list for this week's meals
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/pantry-mode")}
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
              <Fridge className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h4 className="mb-1">Pantry Mode</h4>
            <p className="text-xs text-muted-foreground">
              Meals from what you have
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/healthy-swaps")}
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h4 className="mb-1">Healthy Swaps</h4>
            <p className="text-xs text-muted-foreground">
              Cheap, simple alternatives
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/photo-rewards")}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h4 className="mb-1">Photo Rewards</h4>
            <p className="text-xs text-muted-foreground">
              Upload & earn vouchers
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/quick-meal-mode")}
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
              <Lightbulb className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h4 className="mb-1">Quick Meals</h4>
            <p className="text-xs text-muted-foreground">
              Under 15 min & £5
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/budget-tracker")}
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h4 className="mb-1">Budget Tracker</h4>
            <p className="text-xs text-muted-foreground">
              See money saved
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/parent-rewards")}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h4 className="mb-1">Your Rewards</h4>
            <p className="text-xs text-muted-foreground">
              Points & prizes
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/weekly-report")}
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h4 className="mb-1">Weekly Report</h4>
            <p className="text-xs text-muted-foreground">
              Family progress
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/school-lunch-tracker")}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h4 className="mb-1">Lunch Tracker</h4>
            <p className="text-xs text-muted-foreground">
              What they ate today
            </p>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/food-behaviour-tips")}
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
            </div>
            <h4 className="mb-1">Behaviour Tips</h4>
            <p className="text-xs text-muted-foreground">
              Quick advice cards
            </p>
          </Card>
        </div>

        {/* Weekly Mood Summary */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3>This Week's Mood Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Monday</span>
              <span className="text-2xl">😊</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Wednesday</span>
              <span className="text-2xl">😐</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Friday</span>
              <span className="text-2xl">😊</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Your child has been mostly happy this week. Keep celebrating the small wins!
          </p>
        </Card>

        {/* Support Resources */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3>Support & Guidance</h3>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/handling-resistance")}
            >
              <span className="text-left">
                Handling resistance to new foods
              </span>
              <Lightbulb className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/supportive-responses")}
            >
              <span className="text-left">
                Supportive responses guide
              </span>
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/difficult-behaviors")}
            >
              <span className="text-left">
                Dealing with difficult behaviors
              </span>
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Gentle Alert Example */}
        <div className="bg-accent/50 border border-accent rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium">💡 Gentle reminder:</span> It's been 2 days since you logged a family meal together. No pressure – when you're ready, the app is here to support you.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}