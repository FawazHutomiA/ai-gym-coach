"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Sparkles, Plus, Trash2, Apple } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

type Meal = {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export function NutritionTracker() {
  const [mealInput, setMealInput] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dailyTargets = {
    calories: 2450,
    protein: 165,
    carbs: 280,
    fats: 70,
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const analyzeMeal = () => {
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI processing
    setTimeout(() => {
      // Mock AI calculation - in reality this would call an AI API
      const mockCalories = Math.floor(Math.random() * 400) + 300;
      const mockProtein = Math.floor(Math.random() * 35) + 25;
      const mockCarbs = Math.floor(Math.random() * 50) + 30;
      const mockFats = Math.floor(Math.random() * 20) + 10;

      const newMeal: Meal = {
        id: Date.now().toString(),
        description: mealInput,
        calories: mockCalories,
        protein: mockProtein,
        carbs: mockCarbs,
        fats: mockFats,
      };

      setMeals([...meals, newMeal]);
      setMealInput("");
      setIsAnalyzing(false);
      toast.success("Meal analyzed and logged!", {
        description: `${mockCalories} calories, ${mockProtein}g protein`,
      });
    }, 1500);
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Nutrition Tracker</h1>
        <p className="text-muted-foreground">
          Track your meals with AI-powered nutrition analysis
        </p>
      </div>

      {/* Daily Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Calories</span>
                <Badge variant={totals.calories > dailyTargets.calories ? "destructive" : "secondary"}>
                  {totals.calories}/{dailyTargets.calories}
                </Badge>
              </div>
              <Progress value={getPercentage(totals.calories, dailyTargets.calories)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Protein (g)</span>
                <Badge variant={totals.protein > dailyTargets.protein ? "destructive" : "secondary"}>
                  {totals.protein}/{dailyTargets.protein}
                </Badge>
              </div>
              <Progress value={getPercentage(totals.protein, dailyTargets.protein)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carbs (g)</span>
                <Badge variant={totals.carbs > dailyTargets.carbs ? "destructive" : "secondary"}>
                  {totals.carbs}/{dailyTargets.carbs}
                </Badge>
              </div>
              <Progress value={getPercentage(totals.carbs, dailyTargets.carbs)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fats (g)</span>
                <Badge variant={totals.fats > dailyTargets.fats ? "destructive" : "secondary"}>
                  {totals.fats}/{dailyTargets.fats}
                </Badge>
              </div>
              <Progress value={getPercentage(totals.fats, dailyTargets.fats)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Input */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Nutrition Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-input">What did you eat?</Label>
            <Textarea
              id="meal-input"
              placeholder="e.g., 200g chicken breast with rice and broccoli"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              rows={3}
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground">
              Just describe your meal naturally. AI will calculate the macros for you.
            </p>
          </div>
          <Button
            onClick={analyzeMeal}
            disabled={!mealInput.trim() || isAnalyzing}
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Plus className="mr-2 size-4" />
                Analyze & Log Meal
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="size-5 text-primary" />
            Today's Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="text-center py-12">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Apple className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No meals logged yet</h3>
              <p className="text-muted-foreground">
                Start tracking your nutrition by adding your first meal above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <Card key={meal.id} className="bg-muted/50 border">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Meal {index + 1}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mb-4">{meal.description}</p>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Calories</div>
                            <div className="font-bold text-primary">{meal.calories}</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Protein</div>
                            <div className="font-bold text-blue-500">{meal.protein}g</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Carbs</div>
                            <div className="font-bold text-green-500">{meal.carbs}g</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Fats</div>
                            <div className="font-bold text-orange-500">{meal.fats}g</div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMeal(meal.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Tips with Image */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Nutrition Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Hit Your Protein Target</h4>
              <p className="text-sm text-muted-foreground">
                Aim for 165g protein daily to support muscle growth and recovery during your cut.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Timing Matters</h4>
              <p className="text-sm text-muted-foreground">
                Try to eat protein-rich meals within 2 hours after your workout for optimal recovery.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Stay Consistent</h4>
              <p className="text-sm text-muted-foreground">
                Log your meals daily for accurate AI recommendations and better results.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606859191214-25806e8e2423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbnV0cml0aW9uJTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzc2NDA4Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Healthy meal prep"
            className="w-full h-full object-cover"
          />
        </Card>
      </div>

      {/* Quick Add Suggestions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Quick Add Common Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "200g chicken breast",
              "100g white rice",
              "2 whole eggs",
              "1 protein shake",
              "150g salmon",
              "100g oats",
              "1 banana",
              "200g Greek yogurt",
            ].map((food) => (
              <Button
                key={food}
                variant="outline"
                onClick={() => setMealInput(food)}
                className="justify-start"
              >
                <Plus className="mr-2 size-4" />
                {food}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
