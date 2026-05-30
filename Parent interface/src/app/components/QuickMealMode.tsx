import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Clock, PoundSterling, Home, ChefHat } from "lucide-react";
import { useNavigate } from "react-router";
import { Checkbox } from "./ui/checkbox";

interface QuickMeal {
  id: string;
  name: string;
  prepTime: number; // minutes
  cost: number; // pounds
  ingredients: string[];
  usesCommonIngredients: boolean;
  instructions: string[];
}

const quickMeals: QuickMeal[] = [
  {
    id: "1",
    name: "Egg Fried Rice with Vegetables",
    prepTime: 12,
    cost: 2.5,
    ingredients: ["Cooked rice", "2 eggs", "Frozen peas", "Carrots", "Soy sauce", "Oil"],
    usesCommonIngredients: true,
    instructions: [
      "Heat oil in a pan or wok",
      "Scramble the eggs and set aside",
      "Stir-fry frozen peas and diced carrots for 3 minutes",
      "Add cooked rice and eggs, stir well",
      "Add a splash of soy sauce and serve",
    ],
  },
  {
    id: "2",
    name: "Wraps with Hummus and Salad",
    prepTime: 8,
    cost: 3.0,
    ingredients: ["Tortilla wraps", "Hummus", "Lettuce", "Tomatoes", "Cucumber", "Grated cheese"],
    usesCommonIngredients: true,
    instructions: [
      "Lay out wraps on plates",
      "Spread hummus on each wrap",
      "Add chopped lettuce, tomatoes, cucumber",
      "Sprinkle grated cheese",
      "Roll up and serve",
    ],
  },
  {
    id: "3",
    name: "Pasta with Tomato Sauce and Beans",
    prepTime: 15,
    cost: 2.8,
    ingredients: ["Pasta", "Tin of chopped tomatoes", "Tin of beans", "Garlic", "Mixed herbs"],
    usesCommonIngredients: true,
    instructions: [
      "Cook pasta according to packet instructions",
      "Heat chopped tomatoes in a pan",
      "Add drained beans and crushed garlic",
      "Season with mixed herbs",
      "Drain pasta and mix with sauce",
    ],
  },
  {
    id: "4",
    name: "Cheese and Bean Quesadillas",
    prepTime: 10,
    cost: 2.2,
    ingredients: ["Tortillas", "Grated cheese", "Tin of beans", "Optional: peppers"],
    usesCommonIngredients: true,
    instructions: [
      "Mash beans slightly with a fork",
      "Spread beans on half of each tortilla",
      "Add grated cheese",
      "Fold tortilla in half",
      "Toast in a dry pan for 2 minutes each side",
    ],
  },
  {
    id: "5",
    name: "Omelette with Toast and Veg",
    prepTime: 10,
    cost: 1.8,
    ingredients: ["3 eggs", "Milk", "Grated cheese", "Frozen peas or spinach", "Bread"],
    usesCommonIngredients: true,
    instructions: [
      "Beat eggs with a splash of milk",
      "Heat a little oil in a pan",
      "Pour in eggs, add frozen peas",
      "When nearly set, add cheese and fold",
      "Serve with buttered toast",
    ],
  },
  {
    id: "6",
    name: "Simple Chicken Stir-Fry",
    prepTime: 15,
    cost: 4.2,
    ingredients: ["Chicken breast", "Frozen mixed vegetables", "Soy sauce", "Rice or noodles"],
    usesCommonIngredients: false,
    instructions: [
      "Cook rice or noodles according to packet",
      "Cut chicken into small pieces",
      "Stir-fry chicken until cooked through",
      "Add frozen vegetables and cook for 5 minutes",
      "Add soy sauce and serve with rice/noodles",
    ],
  },
  {
    id: "7",
    name: "Tomato Soup with Cheese Sandwiches",
    prepTime: 8,
    cost: 2.0,
    ingredients: ["Tin of tomato soup", "Bread", "Cheese", "Butter"],
    usesCommonIngredients: true,
    instructions: [
      "Heat soup in a pan according to instructions",
      "Butter bread slices",
      "Make cheese sandwiches",
      "Toast in a pan until golden (optional)",
      "Serve soup with sandwiches for dipping",
    ],
  },
  {
    id: "8",
    name: "Baked Beans on Toast with Egg",
    prepTime: 8,
    cost: 1.5,
    ingredients: ["Tin of baked beans", "Bread", "2 eggs", "Butter"],
    usesCommonIngredients: true,
    instructions: [
      "Heat baked beans in a pan",
      "Toast bread",
      "Poach or fry eggs",
      "Place egg on toast",
      "Spoon beans around and serve",
    ],
  },
];

export function QuickMealMode() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    under15min: false,
    under5pounds: false,
    commonIngredients: false,
  });
  const [selectedMeal, setSelectedMeal] = useState<QuickMeal | null>(null);

  const filteredMeals = quickMeals.filter((meal) => {
    if (filters.under15min && meal.prepTime > 15) return false;
    if (filters.under5pounds && meal.cost > 5) return false;
    if (filters.commonIngredients && !meal.usesCommonIngredients) return false;
    return true;
  });

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
            <h1 className="mb-1">Quick Meal Mode</h1>
            <p className="text-sm text-muted-foreground">
              Fast, budget-friendly meals
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <h3 className="mb-3">Filter by:</h3>
          <div className="space-y-3">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setFilters({ ...filters, under15min: !filters.under15min })}
            >
              <Checkbox checked={filters.under15min} />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Under 15 minutes</span>
              </div>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setFilters({ ...filters, under5pounds: !filters.under5pounds })}
            >
              <Checkbox checked={filters.under5pounds} />
              <div className="flex items-center gap-2">
                <PoundSterling className="w-4 h-4 text-secondary" />
                <span className="text-sm">Under £5 per meal</span>
              </div>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                setFilters({ ...filters, commonIngredients: !filters.commonIngredients })
              }
            >
              <Checkbox checked={filters.commonIngredients} />
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm">Uses ingredients I already have</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMeals.length} meal{filteredMeals.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          {filteredMeals.map((meal) => (
            <Card
              key={meal.id}
              className="p-5 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedMeal(selectedMeal?.id === meal.id ? null : meal)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-2">{meal.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{meal.prepTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PoundSterling className="w-4 h-4" />
                      <span>£{meal.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <ChefHat className="w-6 h-6 text-primary" />
              </div>

              {selectedMeal?.id === meal.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="mb-4">
                    <h4 className="mb-2">Ingredients:</h4>
                    <ul className="space-y-1">
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-sm text-muted-foreground pl-4">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2">Instructions:</h4>
                    <ol className="space-y-2">
                      {meal.instructions.map((instruction, i) => (
                        <li key={i} className="text-sm text-muted-foreground pl-4">
                          {i + 1}. {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Add to this week's plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Add ingredients to list
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No meals match your filters. Try adjusting your criteria.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
