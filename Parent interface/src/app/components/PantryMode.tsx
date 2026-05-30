import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Checkbox } from "./ui/checkbox";
import { RecipeCard } from "./RecipeCard";
import { indianRecipes } from "../data/recipes";

const commonIngredients = [
  "Rice",
  "Pasta",
  "Potatoes",
  "Onions",
  "Garlic",
  "Tomatoes",
  "Eggs",
  "Chicken",
  "Lentils",
  "Peas",
  "Carrots",
  "Beans",
  "Cheese",
  "Yogurt",
  "Bread",
  "Flour",
  "Spices",
];

export function PantryMode() {
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<typeof indianRecipes>([]);

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const findRecipes = () => {
    // Simple matching logic - find recipes that use any of the selected ingredients
    const matched = indianRecipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.join(" ").toLowerCase();
      return selectedIngredients.some((ingredient) =>
        recipeIngredients.includes(ingredient.toLowerCase())
      );
    });
    setMatchedRecipes(matched);
  };

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
            <h1 className="mb-1">Pantry Mode</h1>
            <p className="text-sm text-muted-foreground">
              Find meals using what you have
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">💡 How it works:</span> Select the
            ingredients you have at home, and we'll suggest recipes you can make
            right now. Great for using up what's in the fridge!
          </p>
        </Card>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3">Your ingredients ({selectedIngredients.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <div
                  key={ingredient}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{ingredient}</span>
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => toggleIngredient(ingredient)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Ingredients */}
        <div className="mb-6">
          <h3 className="mb-3">Common ingredients</h3>
          <div className="grid grid-cols-2 gap-2">
            {commonIngredients.map((ingredient) => (
              <Card
                key={ingredient}
                className={`p-3 cursor-pointer transition-all ${
                  selectedIngredients.includes(ingredient)
                    ? "bg-primary/10 border-primary"
                    : "hover:shadow-sm"
                }`}
                onClick={() => toggleIngredient(ingredient)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={selectedIngredients.includes(ingredient)} />
                  <span className="text-sm">{ingredient}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Find Recipes Button */}
        <Button
          onClick={findRecipes}
          disabled={selectedIngredients.length === 0}
          className="w-full mb-6"
          size="lg"
        >
          Find recipes
        </Button>

        {/* Matched Recipes */}
        {matchedRecipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="mb-3">
              We found {matchedRecipes.length} recipe{matchedRecipes.length !== 1 ? "s" : ""}
            </h3>
            {matchedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {matchedRecipes.length === 0 && selectedIngredients.length > 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No exact matches yet, but you might be close!
            </p>
            <Button variant="outline" onClick={() => navigate("/recipes")}>
              Browse all recipes
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
