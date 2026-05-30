import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BottomNav } from "./BottomNav";
import { Heart, Apple, Footprints, Droplets, Check, Zap, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { RecipeCard } from "./RecipeCard";
import { indianRecipes, Recipe } from "../data/recipes";
import { 
  getOnboardingData, 
  hasCulturalBackground, 
  hasEquipment, 
  hasSpace,
  getActivityLevel,
  needsQuickMeals,
  getChildAge,
  OnboardingData
} from "../utils/personalization";

export function Home() {
  const navigate = useNavigate();
  const [todaysRecipe, setTodaysRecipe] = useState<Recipe | null>(null);
  const [personalizedTasks, setPersonalizedTasks] = useState<any[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState("Good morning! 👋");
  const [weeklyFocus, setWeeklyFocus] = useState({
    title: "This week's focus",
    description: "Adding colour to meals – no pressure, just exploring new foods together"
  });
  const [coachingTip, setCoachingTip] = useState("");

  useEffect(() => {
    const data = getOnboardingData();
    
    // Set personalized welcome
    const childAge = data ? getChildAge(data) : null;
    const timeOfDay = new Date().getHours();
    let greeting = "Good morning! 👋";
    if (timeOfDay >= 12 && timeOfDay < 17) greeting = "Good afternoon! 👋";
    if (timeOfDay >= 17) greeting = "Good evening! 👋";
    setWelcomeMessage(greeting);

    // Set weekly coaching tip
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 10;
    const coachingTips = [
      "Children copy what parents eat. Try eating fruit together.",
      "Keep healthy snacks visible and junk food out of sight.",
      "Offer water before sugary drinks.",
      "Let children help in the kitchen - they're more likely to try foods they've helped prepare.",
      "It can take 10-15 tries before a child accepts a new food. Keep offering without pressure.",
      "Make mealtimes screen-free zones for the whole family.",
      "Offer new foods alongside familiar favorites to reduce anxiety.",
      "Use small plates and let children ask for more if still hungry.",
      "Avoid using dessert as a reward - it makes sweet foods seem more special.",
      "Regular family meals are linked to better nutrition and mental health in children.",
    ];
    setCoachingTip(coachingTips[weekNumber]);

    // Set personalized weekly focus based on goals
    if (data && data[2]) {
      const goals = data[2];
      if (goals.includes("Create more balanced family meals")) {
        setWeeklyFocus({
          title: "This week's focus",
          description: "Building balanced plates – adding protein, veg, and grains to meals you already love"
        });
      } else if (goals.includes("Support my child to be more active")) {
        setWeeklyFocus({
          title: "This week's focus",
          description: "Moving more as a family – finding fun ways to be active together"
        });
      } else if (goals.includes("Encourage my child to eat more variety")) {
        setWeeklyFocus({
          title: "This week's focus",
          description: "Trying new foods – exploring one new ingredient this week, no pressure"
        });
      }
    }

    // Select today's recipe based on cultural preferences
    let recipePool = indianRecipes;
    if (data && data[3]) {
      const cultures = data[3];
      // Filter recipes based on cultural preferences
      if (cultures.some(c => c.includes("South Asian"))) {
        recipePool = indianRecipes; // Already Indian recipes
      }
    }
    
    // Select recipe based on prep time if needed
    if (data && needsQuickMeals(data)) {
      const quickRecipes = recipePool.filter(r => 
        r.prepTime.includes("10") || r.prepTime.includes("15") || r.prepTime.includes("20")
      );
      const dayIndex = new Date().getDate() % quickRecipes.length;
      setTodaysRecipe(quickRecipes[dayIndex]);
    } else {
      const dayIndex = new Date().getDate() % recipePool.length;
      setTodaysRecipe(recipePool[dayIndex]);
    }

    // Generate personalized tasks
    const tasks = [];

    // Task 1: Today's recipe
    if (todaysRecipe) {
      tasks.push({
        id: 1,
        icon: Apple,
        title: todaysRecipe.title,
        subtitle: "Tap to see the full recipe",
        completed: false,
        hasRecipe: true,
      });
    }

    // Task 2: Movement activity based on preferences
    if (data) {
      let movementTask = {
        id: 2,
        icon: Footprints,
        title: "30 minutes of active play",
        subtitle: "Any movement counts!",
        completed: false,
      };

      const activityLevel = getActivityLevel(data);
      const favouriteActivities = data[16]?.toLowerCase() || "";

      // Personalize based on space and equipment
      if (hasSpace(data, "Local park") && hasEquipment(data, "Ball")) {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Park football session",
          subtitle: favouriteActivities.includes("football") 
            ? "Your child loves this - 30 mins at the park" 
            : "Head to the park with a ball - 30 minutes",
          completed: false,
        };
      } else if (hasSpace(data, "Garden") && hasEquipment(data, "Trampoline")) {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Trampoline time - 20 minutes",
          subtitle: "Bouncing, jumping, or making up games",
          completed: false,
        };
      } else if (hasEquipment(data, "Bike")) {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Bike ride around the block",
          subtitle: "Even 15 minutes counts as great exercise",
          completed: false,
        };
      } else if (favouriteActivities.includes("dance") || favouriteActivities.includes("dancing")) {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Dance to 3 favourite songs",
          subtitle: "Let them pick the music and lead!",
          completed: false,
        };
      } else if (favouriteActivities.includes("swim")) {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Swimming session",
          subtitle: "Great for building confidence and fitness",
          completed: false,
        };
      } else if (activityLevel === "low") {
        movementTask = {
          id: 2,
          icon: Footprints,
          title: "Gentle 15 minute walk",
          subtitle: "Start small - to the shops or around the block",
          completed: false,
        };
      }

      tasks.push(movementTask);
    }

    // Task 3: Hydration or routine
    tasks.push({
      id: 3,
      icon: Droplets,
      title: "Water with meals today",
      subtitle: "Keep a jug on the table at dinner",
      completed: false,
    });

    setPersonalizedTasks(tasks);
  }, [todaysRecipe]);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">{today}</p>
            <h1 className="mt-1">{welcomeMessage}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Heart className="w-5 h-5 text-secondary-foreground" />
          </div>
        </div>

        {/* Dinner Rescue Button */}
        <Card
          className="p-5 mb-6 bg-gradient-to-br from-destructive/10 to-primary/10 border-destructive/20 cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate("/dinner-rescue")}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-7 h-7 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">What do I cook tonight? 🚨</h3>
              <p className="text-sm text-muted-foreground">
                Get instant meal ideas based on what you have at home
              </p>
            </div>
          </div>
        </Card>

        {/* Weekly Coaching Tip */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-accent-foreground mb-1">
                This week's coaching tip:
              </p>
              <p className="text-sm text-accent-foreground">{coachingTip}</p>
            </div>
          </div>
        </Card>

        {/* Weekly focus card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Apple className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{weeklyFocus.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {weeklyFocus.description}
              </p>
              <div className="flex gap-2">
                <div className="text-xs bg-card px-3 py-1 rounded-full">
                  Day 4 of 7
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Encouragement message */}
        <div className="bg-accent border border-accent rounded-lg p-4 mb-6">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">Brilliant!</span> You've ticked off activities this week. Remember, every small step counts and you're doing great.
          </p>
        </div>

        {/* Today's plan */}
        <div className="mb-6">
          <h2 className="mb-4">Today's plan</h2>
          <div className="space-y-3">
            {personalizedTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 transition-all ${
                  task.completed
                    ? "bg-accent/50 border-secondary"
                    : "hover:shadow-md"
                }`}
              >
                {task.hasRecipe && todaysRecipe ? (
                  <RecipeCard recipe={todaysRecipe} compact />
                ) : (
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        task.completed
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.completed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <task.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={
                          task.completed ? "line-through text-muted-foreground" : ""
                        }
                      >
                        {task.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick tips */}
        <Card className="p-5 bg-card">
          <h3 className="mb-3">💡 Today's tip</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Let your child help in the kitchen - even small tasks like washing vegetables or stirring makes them more likely to try new foods. It's about the experience, not perfection!
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/recipes")}>
            View recipe library
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}