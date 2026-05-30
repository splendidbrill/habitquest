import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Clock, Users, ExternalLink, ChevronRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
  externalLink?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted/20 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🍛</span>
            </div>
            <span className="flex-1 text-sm">{recipe.title}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-4 max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{recipe.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Recipe details including ingredients and instructions
            </DialogDescription>
          </DialogHeader>
          <RecipeDetails recipe={recipe} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="mb-2">{recipe.title}</h3>
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
      </div>

      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.prepTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{recipe.servings}</span>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            View recipe
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-4 max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{recipe.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Recipe details including ingredients and instructions
            </DialogDescription>
          </DialogHeader>
          <RecipeDetails recipe={recipe} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function RecipeDetails({ recipe }: { recipe: Recipe }) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">{recipe.description}</p>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2">Ingredients</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2">Instructions</h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="flex-1 pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips && (
          <div className="bg-accent rounded-lg p-4">
            <h4 className="mb-2">💡 Tip for parents</h4>
            <p className="text-sm text-accent-foreground">{recipe.tips}</p>
          </div>
        )}

        {recipe.externalLink && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(recipe.externalLink, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View full recipe online
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}