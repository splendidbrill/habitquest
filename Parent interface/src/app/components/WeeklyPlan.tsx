import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router";
import {
  Apple,
  Footprints,
  Moon,
  Plus,
  Edit,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { RecipeCard } from "./RecipeCard";
import { indianRecipes } from "../data/recipes";

interface Activity {
  id: string;
  type: "food" | "movement" | "routine";
  title: string;
  icon: typeof Apple;
  recipeId?: string;
}

interface DayPlan {
  day: string;
  date: string;
  activities: Activity[];
}

const activityIcons = {
  food: Apple,
  movement: Footprints,
  routine: Moon,
};

// Tailored plan for 8-year-old Indian boy with ball and park access
const indianBoyWeeklyPlan: DayPlan[] = [
  {
    day: "Monday",
    date: "10 Feb",
    activities: [
      {
        id: "1",
        type: "food",
        title: "Simple Dal Tadka with Vegetables",
        icon: Apple,
        recipeId: "dal-tadka",
      },
      {
        id: "2",
        type: "movement",
        title: "Park football - 30 minutes",
        icon: Footprints,
      },
    ],
  },
  {
    day: "Tuesday",
    date: "11 Feb",
    activities: [
      {
        id: "3",
        type: "food",
        title: "Mild Chicken Tikka Wraps",
        icon: Apple,
        recipeId: "chicken-tikka-wraps",
      },
      {
        id: "4",
        type: "movement",
        title: "Ball skills practice - keepy-uppy challenge",
        icon: Footprints,
      },
      {
        id: "5",
        type: "routine",
        title: "Water with all meals today",
        icon: Moon,
      },
    ],
  },
  {
    day: "Wednesday",
    date: "12 Feb",
    activities: [
      {
        id: "6",
        type: "food",
        title: "Colourful Vegetable Pulao",
        icon: Apple,
        recipeId: "veggie-pulao",
      },
      {
        id: "7",
        type: "movement",
        title: "Walk or cycle to the park",
        icon: Footprints,
      },
    ],
  },
  {
    day: "Thursday",
    date: "13 Feb",
    activities: [
      {
        id: "8",
        type: "food",
        title: "Chapati Pizza with Vegetables",
        icon: Apple,
        recipeId: "chapati-pizza",
      },
      {
        id: "9",
        type: "movement",
        title: "Park visit - play on equipment then football",
        icon: Footprints,
      },
    ],
  },
  {
    day: "Friday",
    date: "14 Feb",
    activities: [
      {
        id: "10",
        type: "food",
        title: "Aloo Matar (Potato & Pea Curry)",
        icon: Apple,
        recipeId: "aloo-matar",
      },
      {
        id: "11",
        type: "movement",
        title: "Football with friends after school",
        icon: Footprints,
      },
      {
        id: "12",
        type: "routine",
        title: "Bedtime at 8:30pm",
        icon: Moon,
      },
    ],
  },
  {
    day: "Saturday",
    date: "15 Feb",
    activities: [
      {
        id: "13",
        type: "food",
        title: "Make samosa parcels together",
        icon: Apple,
        recipeId: "vegetable-samosa-filling",
      },
      {
        id: "14",
        type: "movement",
        title: "Park football match - 45 minutes",
        icon: Footprints,
      },
    ],
  },
  {
    day: "Sunday",
    date: "16 Feb",
    activities: [
      {
        id: "15",
        type: "food",
        title: "Masala Omelette for breakfast",
        icon: Apple,
        recipeId: "masala-omelette",
      },
      {
        id: "16",
        type: "movement",
        title: "Family park visit - football or frisbee",
        icon: Footprints,
      },
      {
        id: "17",
        type: "routine",
        title: "Prep lunches for the week",
        icon: Moon,
      },
    ],
  },
];

export function WeeklyPlan() {
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [customActivity, setCustomActivity] = useState("");
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(indianBoyWeeklyPlan);
  const navigate = useNavigate();

  const handleAddActivity = (day: string) => {
    if (!customActivity.trim()) return;

    setWeekPlan(
      weekPlan.map((dayPlan) => {
        if (dayPlan.day === day) {
          return {
            ...dayPlan,
            activities: [
              ...dayPlan.activities,
              {
                id: Date.now().toString(),
                type: "food",
                title: customActivity,
                icon: Apple,
              },
            ],
          };
        }
        return dayPlan;
      })
    );

    setCustomActivity("");
    setEditingDay(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Your weekly plan</h1>
          <p className="text-muted-foreground">
            Indian-inspired meals and park activities - tap any recipe to see full details
          </p>
        </div>

        {/* Info card */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">🍛 Tip:</span> All recipes have been tailored for your family's preferences. Tap any meal to see ingredients, instructions, and links to detailed recipes online.
          </p>
        </Card>

        {/* Weekly cards */}
        <div className="space-y-4">
          {weekPlan.map((dayPlan) => (
            <Card key={dayPlan.day} className="overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div>
                  <h3>{dayPlan.day}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dayPlan.date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDay(dayPlan.day)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              <div className="p-4 space-y-3">
                {dayPlan.activities.map((activity) => {
                  const Icon = activityIcons[activity.type];
                  
                  // If it's a food activity with a recipe, show recipe card
                  if (activity.type === "food" && activity.recipeId) {
                    const recipe = indianRecipes.find(r => r.id === activity.recipeId);
                    if (recipe) {
                      return (
                        <div key={activity.id}>
                          <RecipeCard recipe={recipe} compact />
                        </div>
                      );
                    }
                  }
                  
                  // Otherwise show regular activity
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="flex-1 text-sm">{activity.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditingDay(dayPlan.day)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add your own
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Helpful suggestions */}
        <Card className="p-5 mt-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
          <h3 className="mb-2">⚽ Park activity ideas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>With a ball:</strong> Football dribbling, keepy-uppy challenges, target practice, "pig in the middle", wall kicks<br/><br/>
            <strong>Other ideas:</strong> Tag games, races, playground equipment, nature scavenger hunt
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/activity-ideas")}>
            More activity ideas
          </Button>
        </Card>
      </div>

      {/* Edit dialog */}
      <Dialog open={editingDay !== null} onOpenChange={() => setEditingDay(null)}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Add to {editingDay}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                What would you like to add to this day?
              </p>
              <Textarea
                placeholder="e.g., Try paneer tikka, Basketball at park, Drink lassi"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="min-h-24"
              />
            </div>
            <Button
              onClick={() => editingDay && handleAddActivity(editingDay)}
              disabled={!customActivity.trim()}
              className="w-full"
            >
              Add activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}