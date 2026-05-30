import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Sparkles, Clock, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router";

interface DinnerOption {
  id: string;
  name: string;
  time: number;
  ingredients: string[];
  missingIngredients: string[];
  instructions: string[];
}

export function DinnerRescue() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [addedToList, setAddedToList] = useState<string[]>([]);

  // These would be dynamically generated based on pantry items
  const dinnerOptions: DinnerOption[] = [
    {
      id: "1",
      name: "15-Minute Vegetable Pasta",
      time: 15,
      ingredients: ["Pasta", "Frozen vegetables", "Garlic", "Olive oil", "Parmesan"],
      missingIngredients: [],
      instructions: [
        "Boil pasta according to packet instructions",
        "In the last 3 minutes, add frozen vegetables to the pasta water",
        "Drain and toss with olive oil and crushed garlic",
        "Top with grated parmesan and serve",
      ],
    },
    {
      id: "2",
      name: "Egg Fried Rice",
      time: 12,
      ingredients: ["Cooked rice", "2 eggs", "Frozen peas", "Soy sauce"],
      missingIngredients: ["Soy sauce"],
      instructions: [
        "Heat oil in a pan, scramble eggs and set aside",
        "Add rice and frozen peas, stir-fry for 5 minutes",
        "Add eggs back in with soy sauce",
        "Stir well and serve hot",
      ],
    },
    {
      id: "3",
      name: "Bean Tacos",
      time: 10,
      ingredients: ["Tortillas", "Tin of beans", "Cheese", "Lettuce", "Salsa"],
      missingIngredients: ["Salsa"],
      instructions: [
        "Heat beans in a pan and mash slightly",
        "Warm tortillas in a dry pan",
        "Fill with beans, cheese, and shredded lettuce",
        "Top with salsa and serve",
      ],
    },
  ];

  const handleAddToList = (mealId: string, ingredients: string[]) => {
    setAddedToList([...addedToList, mealId]);
    // In a real app, this would add to the grocery list
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Dinner Rescue 🚨</h1>
            <p className="text-sm text-muted-foreground">
              Quick ideas for tonight
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="mb-1">Based on what you have at home...</h3>
              <p className="text-sm text-muted-foreground">
                Here are 3 quick meals you can make right now (or with just 1-2
                missing items)
              </p>
            </div>
          </div>
        </Card>

        {/* Dinner Options */}
        <div className="space-y-4">
          {dinnerOptions.map((option) => (
            <Card key={option.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-2">{option.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{option.time} minutes</span>
                  </div>
                </div>
                {option.missingIngredients.length === 0 && (
                  <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                    Ready to cook!
                  </div>
                )}
              </div>

              {/* What you have */}
              <div className="mb-3">
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  ✅ You have:
                </p>
                <div className="flex flex-wrap gap-1">
                  {option.ingredients
                    .filter((ing) => !option.missingIngredients.includes(ing))
                    .map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-xs bg-accent px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                </div>
              </div>

              {/* Missing ingredients */}
              {option.missingIngredients.length > 0 && (
                <div className="mb-3 bg-destructive/10 rounded-lg p-3">
                  <p className="text-xs font-medium mb-2 text-destructive">
                    Missing:
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {option.missingIngredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-xs bg-card border border-destructive/20 px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  {addedToList.includes(option.id) ? (
                    <div className="flex items-center gap-2 text-secondary text-sm">
                      <Check className="w-4 h-4" />
                      <span>Added to shopping list</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddToList(option.id, option.missingIngredients)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add missing items to shopping list
                    </Button>
                  )}
                </div>
              )}

              {/* Instructions */}
              {selectedOption === option.id ? (
                <div className="mb-3 pt-3 border-t border-border">
                  <h4 className="mb-2">Quick instructions:</h4>
                  <ol className="space-y-2">
                    {option.instructions.map((instruction, i) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4">
                        {i + 1}. {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/* Action Button */}
              <Button
                className="w-full"
                onClick={() =>
                  setSelectedOption(selectedOption === option.id ? null : option.id)
                }
              >
                {selectedOption === option.id
                  ? "Hide instructions"
                  : "Show instructions"}
              </Button>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="p-5 mt-6 bg-card text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need more ideas? Check out Quick Meal Mode for even more options
          </p>
          <Button variant="outline" onClick={() => navigate("/quick-meal-mode")}>
            View Quick Meal Mode
          </Button>
        </Card>
      </div>
    </div>
  );
}
