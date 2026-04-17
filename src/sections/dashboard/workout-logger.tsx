"use client";

import { useState } from "react";
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

type Set = {
  id: string;
  weight: string;
  reps: string;
};

type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

const exerciseList = [
  "Bench Press",
  "Incline Dumbbell Press",
  "Shoulder Press",
  "Lateral Raises",
  "Tricep Dips",
  "Cable Tricep Extensions",
  "Squats",
  "Deadlifts",
  "Pull-ups",
  "Barbell Rows",
  "Leg Press",
  "Romanian Deadlifts",
];

export function WorkoutLogger() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState("");

  const addExercise = () => {
    if (!currentExercise) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: currentExercise,
      sets: [
        {
          id: `${Date.now()}-1`,
          weight: "",
          reps: "",
        },
      ],
    };

    setExercises([...exercises, newExercise]);
    setCurrentExercise("");
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
          : ex
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: string
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : ex
      )
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
          : ex
      )
    );
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const saveWorkout = () => {
    // In a real app, this would save to a database
    toast.success("Workout logged successfully!", {
      description: `${exercises.length} exercises saved`,
    });
  };

  const getTotalSets = () => {
    return exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Log Workout</h1>
          <p className="text-muted-foreground">
            Track your sets, reps, and weights for AI-powered adjustments
          </p>
        </div>
        {exercises.length > 0 && (
          <Button onClick={saveWorkout} size="lg">
            <Check className="mr-2 size-5" />
            Save Workout
          </Button>
        )}
      </div>

      {/* Stats */}
      {exercises.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{exercises.length}</div>
              <div className="text-sm text-muted-foreground">Exercises</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{getTotalSets()}</div>
              <div className="text-sm text-muted-foreground">Total Sets</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-green-500" />
                <span className="text-sm text-muted-foreground">On track for weekly volume goal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Exercise */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenSquare className="size-5 text-primary" />
            Add Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={currentExercise} onValueChange={setCurrentExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseList.map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addExercise} disabled={!currentExercise}>
              <Plus className="mr-2 size-4" />
              Add Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercises List */}
      {exercises.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <PenSquare className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No exercises logged yet</h3>
            <p className="text-muted-foreground">
              Start by adding an exercise from the dropdown above
            </p>
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
                    {exercise.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sets Table */}
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-12 gap-4 items-center p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-sm font-semibold text-muted-foreground">
                          Set {setIndex + 1}
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-5">
                        <div className="space-y-1">
                          <Label htmlFor={`weight-${set.id}`} className="text-xs">
                            Weight (kg)
                          </Label>
                          <Input
                            id={`weight-${set.id}`}
                            type="number"
                            placeholder="80"
                            value={set.weight}
                            onChange={(e) =>
                              updateSet(exercise.id, set.id, "weight", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-span-4 md:col-span-5">
                        <div className="space-y-1">
                          <Label htmlFor={`reps-${set.id}`} className="text-xs">
                            Reps
                          </Label>
                          <Input
                            id={`reps-${set.id}`}
                            type="number"
                            placeholder="10"
                            value={set.reps}
                            onChange={(e) =>
                              updateSet(exercise.id, set.id, "reps", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Set Button */}
                <Button
                  variant="outline"
                  onClick={() => addSet(exercise.id)}
                  className="w-full"
                >
                  <Plus className="mr-2 size-4" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Log your workouts consistently for accurate AI recommendations
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                The AI analyzes your volume and intensity trends to optimize your plan
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Track your weight and reps to see progress over time
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
