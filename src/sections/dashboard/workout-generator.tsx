"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

const workoutSplits = {
  push: {
    name: "Push Day",
    color: "from-blue-500 to-cyan-500",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", muscle: "Chest", notes: "Barbell" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", muscle: "Chest", notes: "30° angle" },
      { name: "Cable Flyes", sets: 3, reps: "12-15", muscle: "Chest", notes: "Squeeze at peak" },
      { name: "Shoulder Press", sets: 4, reps: "8-10", muscle: "Shoulders", notes: "Barbell or DB" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", muscle: "Shoulders", notes: "Controlled tempo" },
      { name: "Front Raises", sets: 3, reps: "12-15", muscle: "Shoulders", notes: "Alternating" },
      { name: "Tricep Dips", sets: 3, reps: "10-12", muscle: "Triceps", notes: "Bodyweight or weighted" },
      { name: "Cable Tricep Extensions", sets: 3, reps: "12-15", muscle: "Triceps", notes: "Rope attachment" },
    ],
  },
  pull: {
    name: "Pull Day",
    color: "from-green-500 to-emerald-500",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", muscle: "Back", notes: "Conventional" },
      { name: "Pull-ups", sets: 4, reps: "8-12", muscle: "Back", notes: "Wide grip" },
      { name: "Barbell Rows", sets: 4, reps: "8-10", muscle: "Back", notes: "Pendlay or bent-over" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12", muscle: "Back", notes: "Wide grip" },
      { name: "Face Pulls", sets: 3, reps: "15-20", muscle: "Rear Delts", notes: "Light weight" },
      { name: "Barbell Curls", sets: 3, reps: "10-12", muscle: "Biceps", notes: "Straight bar" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", muscle: "Biceps", notes: "Dumbbells" },
      { name: "Cable Curls", sets: 3, reps: "12-15", muscle: "Biceps", notes: "Rope or straight bar" },
    ],
  },
  legs: {
    name: "Leg Day",
    color: "from-purple-500 to-pink-500",
    exercises: [
      { name: "Squats", sets: 4, reps: "8-10", muscle: "Quads", notes: "Back squat" },
      { name: "Romanian Deadlifts", sets: 4, reps: "8-10", muscle: "Hamstrings", notes: "Barbell" },
      { name: "Leg Press", sets: 3, reps: "12-15", muscle: "Quads", notes: "Full ROM" },
      { name: "Walking Lunges", sets: 3, reps: "12-15", muscle: "Quads/Glutes", notes: "Per leg" },
      { name: "Leg Curls", sets: 3, reps: "12-15", muscle: "Hamstrings", notes: "Lying or seated" },
      { name: "Leg Extensions", sets: 3, reps: "12-15", muscle: "Quads", notes: "Controlled" },
      { name: "Calf Raises", sets: 4, reps: "15-20", muscle: "Calves", notes: "Standing or seated" },
      { name: "Hip Thrusts", sets: 3, reps: "12-15", muscle: "Glutes", notes: "Barbell" },
    ],
  },
};

export function WorkoutGenerator() {
  const [activeTab, setActiveTab] = useState("push");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Workout Plan</h1>
          <p className="text-muted-foreground">
            AI-generated Push/Pull/Legs split optimized for your goals
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 size-4" />
          Regenerate Plan
        </Button>
      </div>

      {/* AI Info Banner */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">AI-Optimized for You</h3>
              <p className="text-sm text-muted-foreground">
                This workout plan is customized based on your cutting goal, 5x/week training frequency,
                and current strength levels. The AI will automatically adjust volume and intensity based
                on your logged progress.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Splits Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="push">Push Day</TabsTrigger>
          <TabsTrigger value="pull">Pull Day</TabsTrigger>
          <TabsTrigger value="legs">Leg Day</TabsTrigger>
        </TabsList>

        {Object.entries(workoutSplits).map(([key, split]) => (
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
                      {split.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      {split.exercises.length} exercises
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {split.exercises.map((exercise, i) => (
                      <motion.div
                        key={i}
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
                                <h4 className="font-semibold text-lg">{exercise.name}</h4>
                                <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                              </div>
                              <div className="md:col-span-2">
                                <Badge variant="secondary" className="font-mono">
                                  {exercise.sets} sets
                                </Badge>
                              </div>
                              <div className="md:col-span-2">
                                <Badge variant="secondary" className="font-mono">
                                  {exercise.reps} reps
                                </Badge>
                              </div>
                              <div className="md:col-span-2 text-right">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    exercise.muscle === "Chest"
                                      ? "border-blue-500 text-blue-500"
                                      : exercise.muscle === "Back"
                                      ? "border-green-500 text-green-500"
                                      : exercise.muscle === "Shoulders"
                                      ? "border-purple-500 text-purple-500"
                                      : exercise.muscle === "Quads"
                                      ? "border-orange-500 text-orange-500"
                                      : exercise.muscle === "Hamstrings"
                                      ? "border-red-500 text-red-500"
                                      : "border-primary text-primary"
                                  }`}
                                >
                                  {exercise.muscle}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Workout Summary */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{split.exercises.length}</div>
                        <div className="text-sm text-muted-foreground">Total Exercises</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {split.exercises.reduce((acc, ex) => acc + ex.sets, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Sets</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">~60 min</div>
                        <div className="text-sm text-muted-foreground">Estimated Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Training Tips */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Training Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Progressive Overload",
                description: "Aim to increase weight or reps each week for consistent progress.",
              },
              {
                title: "Rest Between Sets",
                description: "Take 2-3 minutes for compound lifts, 1-2 minutes for isolation exercises.",
              },
              {
                title: "Form Over Weight",
                description: "Perfect your form before increasing weight to prevent injuries.",
              },
              {
                title: "Track Your Progress",
                description: "Log every workout to help the AI adjust your plan optimally.",
              },
            ].map((tip, i) => (
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
