"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Plus, Trash2, Check, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/i18n-context";

type Set = {
  id: string;
  weight: string;
  reps: string;
};

type Exercise = {
  id: string;
  nameKey: string;
  sets: Set[];
};

const exerciseKeys = [
  "logger.ex.benchPress",
  "logger.ex.inclineDb",
  "logger.ex.shoulderPress",
  "logger.ex.lateralRaises",
  "logger.ex.tricepDips",
  "logger.ex.cableTricep",
  "logger.ex.squats",
  "logger.ex.deadlifts",
  "logger.ex.pullUps",
  "logger.ex.barbellRows",
  "logger.ex.legPress",
  "logger.ex.rdl",
] as const;

export function WorkoutLogger() {
  const { t } = useI18n();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseKey, setCurrentExerciseKey] = useState("");

  const tips = useMemo(
    () => [t("workoutLog.tip.0"), t("workoutLog.tip.1"), t("workoutLog.tip.2")],
    [t],
  );

  const addExercise = () => {
    if (!currentExerciseKey) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      nameKey: currentExerciseKey,
      sets: [
        {
          id: `${Date.now()}-1`,
          weight: "",
          reps: "",
        },
      ],
    };

    setExercises([...exercises, newExercise]);
    setCurrentExerciseKey("");
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: `${Date.now()}-${ex.sets.length + 1}`,
                  weight: "",
                  reps: "",
                },
              ],
            }
          : ex,
      ),
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: "weight" | "reps", value: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set)),
            }
          : ex,
      ),
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter((set) => set.id !== setId),
            }
          : ex,
      ),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const saveWorkout = () => {
    toast.success(t("workoutLog.toast.title"), {
      description: t("workoutLog.toast.desc", { n: exercises.length }),
    });
  };

  const getTotalSets = () => {
    return exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("workoutLog.title")}</h1>
          <p className="text-muted-foreground">{t("workoutLog.subtitle")}</p>
        </div>
        {exercises.length > 0 && (
          <Button onClick={saveWorkout} size="lg" type="button">
            <Check className="mr-2 size-5" />
            {t("workoutLog.save")}
          </Button>
        )}
      </div>

      {exercises.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{exercises.length}</div>
              <div className="text-sm text-muted-foreground">{t("workoutLog.exercises")}</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{getTotalSets()}</div>
              <div className="text-sm text-muted-foreground">{t("workoutLog.totalSets")}</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{t("workoutLog.volumeHint")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenSquare className="size-5 text-primary" />
            {t("workoutLog.addExerciseCard")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Select value={currentExerciseKey} onValueChange={setCurrentExerciseKey}>
                <SelectTrigger>
                  <SelectValue placeholder={t("workoutLog.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {exerciseKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addExercise} disabled={!currentExerciseKey} type="button" className="shrink-0">
              <Plus className="mr-2 size-4" />
              {t("workoutLog.addExerciseBtn")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {exercises.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <PenSquare className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("workoutLog.emptyTitle")}</h3>
            <p className="text-muted-foreground">{t("workoutLog.emptyDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.id} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Badge variant="outline" className="size-8 rounded-full font-bold">
                      {exerciseIndex + 1}
                    </Badge>
                    {t(exercise.nameKey)}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-12 gap-4 items-center p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-sm font-semibold text-muted-foreground">
                          {t("workoutLog.set", { n: setIndex + 1 })}
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-5">
                        <div className="space-y-1">
                          <Label htmlFor={`weight-${set.id}`} className="text-xs">
                            {t("workoutLog.weightKg")}
                          </Label>
                          <Input
                            id={`weight-${set.id}`}
                            type="number"
                            placeholder="80"
                            value={set.weight}
                            onChange={(e) => updateSet(exercise.id, set.id, "weight", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-5">
                        <div className="space-y-1">
                          <Label htmlFor={`reps-${set.id}`} className="text-xs">
                            {t("workoutLog.reps")}
                          </Label>
                          <Input
                            id={`reps-${set.id}`}
                            type="number"
                            placeholder="10"
                            value={set.reps}
                            onChange={(e) => updateSet(exercise.id, set.id, "reps", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" type="button" onClick={() => addSet(exercise.id)} className="w-full">
                  <Plus className="mr-2 size-4" />
                  {t("workoutLog.addSet")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t("workoutLog.tipsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {tips.map((tip, i) => (
              <p key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
