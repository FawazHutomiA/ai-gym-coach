"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Sparkles, Plus, Trash2, Apple } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useI18n } from "@/contexts/i18n-context";
import type { Locale } from "@/i18n/dictionaries";

type Meal = {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

function timeLocale(locale: Locale): string {
  return locale === "id" ? "id-ID" : "en-US";
}

export function NutritionTracker() {
  const { t, locale } = useI18n();
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
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  const quickFoodKeys = useMemo(() => [0, 1, 2, 3, 4, 5, 6, 7] as const, []);

  const tips = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        title: t(`nutrition.tip.${i}.title`),
        desc: t(`nutrition.tip.${i}.desc`),
      })),
    [t],
  );

  const analyzeMeal = () => {
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
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
      toast.success(t("nutrition.toast.title"), {
        description: t("nutrition.toast.desc", { cal: mockCalories, p: mockProtein }),
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
      <div>
        <h1 className="text-4xl font-bold mb-2">{t("nutrition.title")}</h1>
        <p className="text-muted-foreground">{t("nutrition.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("nutrition.calories")}</span>
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
                <span className="text-sm text-muted-foreground">{t("nutrition.proteinG")}</span>
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
                <span className="text-sm text-muted-foreground">{t("nutrition.carbsG")}</span>
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
                <span className="text-sm text-muted-foreground">{t("nutrition.fatsG")}</span>
                <Badge variant={totals.fats > dailyTargets.fats ? "destructive" : "secondary"}>
                  {totals.fats}/{dailyTargets.fats}
                </Badge>
              </div>
              <Progress value={getPercentage(totals.fats, dailyTargets.fats)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            {t("nutrition.analyzerTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-input">{t("nutrition.whatEat")}</Label>
            <Textarea
              id="meal-input"
              placeholder={t("nutrition.mealPlaceholder")}
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              rows={3}
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground">{t("nutrition.mealHint")}</p>
          </div>
          <Button
            onClick={analyzeMeal}
            disabled={!mealInput.trim() || isAnalyzing}
            size="lg"
            className="w-full"
            type="button"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 size-4 animate-spin" />
                {t("nutrition.analyzing")}
              </>
            ) : (
              <>
                <Plus className="mr-2 size-4" />
                {t("nutrition.analyzeLog")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="size-5 text-primary" />
            {t("nutrition.todayMeals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="text-center py-12">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Apple className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("nutrition.emptyTitle")}</h3>
              <p className="text-muted-foreground">{t("nutrition.emptyDesc")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <Card key={meal.id} className="bg-muted/50 border">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{t("nutrition.mealN", { n: index + 1 })}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleTimeString(timeLocale(locale), {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mb-4">{meal.description}</p>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t("nutrition.calories")}</div>
                            <div className="font-bold text-primary">{meal.calories}</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t("dashboard.stat.protein")}</div>
                            <div className="font-bold text-blue-500">{meal.protein}g</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t("nutrition.carbsG")}</div>
                            <div className="font-bold text-green-500">{meal.carbs}g</div>
                          </div>
                          <div className="p-3 bg-background rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{t("nutrition.fatsG")}</div>
                            <div className="font-bold text-orange-500">{meal.fats}g</div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t("nutrition.tipsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606859191214-25806e8e2423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbnV0cml0aW9uJTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzc2NDA4Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt={t("nutrition.mealImgAlt")}
            className="w-full h-full object-cover"
          />
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t("nutrition.quickAddTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickFoodKeys.map((i) => (
              <Button
                key={i}
                variant="outline"
                type="button"
                onClick={() => setMealInput(t(`nutrition.quick.${i}`))}
                className="justify-start"
              >
                <Plus className="mr-2 size-4" />
                {t(`nutrition.quick.${i}`)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
