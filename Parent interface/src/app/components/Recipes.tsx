import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { RecipeCard } from "./RecipeCard";
import { indianRecipes } from "../data/recipes";
import { Input } from "./ui/input";

export function Recipes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = indianRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Recipe Library</h1>
            <p className="text-sm text-muted-foreground">
              Indian-inspired family meals
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Info card */}
        <Card className="p-4 mb-6 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">🍛 About these recipes:</span> All meals are designed for families with children aged 7-11, using familiar Indian ingredients and mild spices. Each recipe includes links to detailed cooking guides.
          </p>
        </Card>

        {/* Recipes grid */}
        <div className="space-y-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No recipes found. Try a different search term.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
