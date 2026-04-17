"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "@/contexts/i18n-context";

type MuscleKey =
  | "chest"
  | "back"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "rearDelts"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "quadsGlutes";

type ExDef = { id: string; muscleKey: MuscleKey; sets: number; reps: string };

const muscleTone: Record<MuscleKey, string> = {
  chest: "border-blue-500 text-blue-500",
  back: "border-green-500 text-green-500",
  shoulders: "border-purple-500 text-purple-500",
  triceps: "border-primary text-primary",
  biceps: "border-primary text-primary",
  rearDelts: "border-cyan-500 text-cyan-500",
  quads: "border-orange-500 text-orange-500",
  hamstrings: "border-red-500 text-red-500",
  glutes: "border-pink-500 text-pink-500",
  calves: "border-amber-500 text-amber-500",
  quadsGlutes: "border-orange-500 text-orange-500",
};

const workoutSplits: Record<
  "push" | "pull" | "legs",
  { tabKey: string; color: string; exercises: ExDef[] }
> = {
  push: {
    tabKey: "workoutGen.tab.push",
    color: "from-blue-500 to-cyan-500",
    exercises: [
      { id: "benchPress", muscleKey: "chest", sets: 4, reps: "8-10" },
      { id: "inclineDbPress", muscleKey: "chest", sets: 3, reps: "10-12" },
      { id: "cableFlyes", muscleKey: "chest", sets: 3, reps: "12-15" },
      { id: "shoulderPress", muscleKey: "shoulders", sets: 4, reps: "8-10" },
      { id: "lateralRaises", muscleKey: "shoulders", sets: 3, reps: "12-15" },
      { id: "frontRaises", muscleKey: "shoulders", sets: 3, reps: "12-15" },
      { id: "tricepDips", muscleKey: "triceps", sets: 3, reps: "10-12" },
      { id: "cableTricepExt", muscleKey: "triceps", sets: 3, reps: "12-15" },
    ],
  },
  pull: {
    tabKey: "workoutGen.tab.pull",
    color: "from-green-500 to-emerald-500",
    exercises: [
      { id: "deadlifts", muscleKey: "back", sets: 4, reps: "6-8" },
      { id: "pullUps", muscleKey: "back", sets: 4, reps: "8-12" },
      { id: "barbellRows", muscleKey: "back", sets: 4, reps: "8-10" },
      { id: "latPulldowns", muscleKey: "back", sets: 3, reps: "10-12" },
      { id: "facePulls", muscleKey: "rearDelts", sets: 3, reps: "15-20" },
      { id: "barbellCurls", muscleKey: "biceps", sets: 3, reps: "10-12" },
      { id: "hammerCurls", muscleKey: "biceps", sets: 3, reps: "12-15" },
      { id: "cableCurls", muscleKey: "biceps", sets: 3, reps: "12-15" },
    ],
  },
  legs: {
    tabKey: "workoutGen.tab.legs",
    color: "from-purple-500 to-pink-500",
    exercises: [
      { id: "squats", muscleKey: "quads", sets: 4, reps: "8-10" },
      { id: "rdl", muscleKey: "hamstrings", sets: 4, reps: "8-10" },
      { id: "legPress", muscleKey: "quads", sets: 3, reps: "12-15" },
      { id: "walkingLunges", muscleKey: "quadsGlutes", sets: 3, reps: "12-15" },
      { id: "legCurls", muscleKey: "hamstrings", sets: 3, reps: "12-15" },
      { id: "legExtensions", muscleKey: "quads", sets: 3, reps: "12-15" },
      { id: "calfRaises", muscleKey: "calves", sets: 4, reps: "15-20" },
      { id: "hipThrusts", muscleKey: "glutes", sets: 3, reps: "12-15" },
    ],
  },
};

export function WorkoutGenerator() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("push");

  const tips = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        title: t(`workoutGen.tip.${i}.title`),
        description: t(`workoutGen.tip.${i}.desc`),
      })),
    [t],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("workoutGen.title")}</h1>
          <p className="text-muted-foreground">{t("workoutGen.subtitle")}</p>
        </div>
        <Button variant="outline" type="button">
          <RefreshCw className="mr-2 size-4" />
          {t("workoutGen.regenerate")}
        </Button>
      </div>

      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t("workoutGen.bannerTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("workoutGen.bannerDesc")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="push">{t("workoutGen.tab.push")}</TabsTrigger>
          <TabsTrigger value="pull">{t("workoutGen.tab.pull")}</TabsTrigger>
          <TabsTrigger value="legs">{t("workoutGen.tab.legs")}</TabsTrigger>
        </TabsList>

        {(Object.keys(workoutSplits) as Array<keyof typeof workoutSplits>).map((key) => {
          const split = workoutSplits[key];
          return (
            <TabsContent key={key} value={key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div
                          className={`size-12 rounded-xl bg-gradient-to-br ${split.color} flex items-center justify-center`}
                        >
                          <Dumbbell className="size-6 text-white" />
                        </div>
                        {t(split.tabKey)}
                      </CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {t("workoutGen.exercisesCount", { n: split.exercises.length })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {split.exercises.map((exercise, i) => (
                        <motion.div
                          key={exercise.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                          <Card className="bg-muted/50 hover:bg-muted transition-colors border">
                            <CardContent className="p-5">
                              <div className="grid md:grid-cols-12 gap-4 items-center">
                                <div className="md:col-span-1">
                                  <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                                    {i + 1}
                                  </div>
                                </div>
                                <div className="md:col-span-5">
                                  <h4 className="font-semibold text-lg">
                                    {t(`workoutGen.ex.${exercise.id}.name`)}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {t(`workoutGen.ex.${exercise.id}.notes`)}
                                  </p>
                                </div>
                                <div className="md:col-span-2">
                                  <Badge variant="secondary" className="font-mono">
                                    {exercise.sets} {t("workoutGen.sets")}
                                  </Badge>
                                </div>
                                <div className="md:col-span-2">
                                  <Badge variant="secondary" className="font-mono">
                                    {exercise.reps} {t("workoutGen.reps")}
                                  </Badge>
                                </div>
                                <div className="md:col-span-2 text-right">
                                  <Badge
                                    variant="outline"
                                    className={muscleTone[exercise.muscleKey]}
                                  >
                                    {t(`workoutGen.muscle.${exercise.muscleKey}`)}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{split.exercises.length}</div>
                          <div className="text-sm text-muted-foreground">{t("workoutGen.totalExercises")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {split.exercises.reduce((acc, ex) => acc + ex.sets, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">{t("workoutGen.totalSets")}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{t("workoutGen.timeMin")}</div>
                          <div className="text-sm text-muted-foreground">{t("workoutGen.estimatedTime")}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t("workoutGen.tipsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
