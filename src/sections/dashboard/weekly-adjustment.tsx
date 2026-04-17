"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const volumeData = [
  { week: "Week 1", sets: 32 },
  { week: "Week 2", sets: 35 },
  { week: "Week 3", sets: 38 },
  { week: "Week 4", sets: 40 },
];

const strengthData = [
  { week: "Week 1", bench: 75, squat: 95, deadlift: 115 },
  { week: "Week 2", bench: 77.5, squat: 97.5, deadlift: 120 },
  { week: "Week 3", bench: 80, squat: 100, deadlift: 122.5 },
  { week: "Week 4", bench: 80, squat: 100, deadlift: 125 },
];

export function WeeklyAdjustment() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Weekly AI Adjustment</h1>
        <p className="text-muted-foreground">
          AI analysis of your progress with personalized recommendations
        </p>
      </div>

      {/* AI Summary Card */}
      <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Brain className="size-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Analysis - Week 4 Summary</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your workout logs and progress data
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="size-5 text-green-500" />
                <span className="font-semibold">Weight Progress</span>
              </div>
              <div className="text-2xl font-bold text-green-500">-0.6 kg</div>
              <div className="text-sm text-muted-foreground">This week</div>
            </div>
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-5 text-blue-500" />
                <span className="font-semibold">Training Volume</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">+5%</div>
              <div className="text-sm text-muted-foreground">Increase vs last week</div>
            </div>
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-5 text-orange-500" />
                <span className="font-semibold">Recovery Score</span>
              </div>
              <div className="text-2xl font-bold text-orange-500">85%</div>
              <div className="text-sm text-muted-foreground">Good recovery</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            AI Recommendations for Next Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="size-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Increase Training Volume</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're recovering well and progressing steadily. Add 2-3 more sets across your
                    main compound lifts to continue building strength.
                  </p>
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    Recommended: +6 sets per week
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="size-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Increase Calories Slightly</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Weight loss is on track, but energy levels may benefit from a small calorie
                    increase. This will support your increased training volume.
                  </p>
                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                    Recommended: +150 calories (2,600 total)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="size-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Monitor Deadlift Intensity</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your deadlift is progressing quickly. Consider keeping the weight stable for
                    another week to ensure proper form and recovery.
                  </p>
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    Caution: Maintain current weight
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="w-full">
            Apply Recommendations
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Progress Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Volume Progression */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Training Volume Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sets" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">+25% volume increase</span> over 4
                weeks. Excellent progressive overload!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strength Progression */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Strength Progression (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bench"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Bench Press"
                />
                <Line
                  type="monotone"
                  dataKey="squat"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Squat"
                />
                <Line
                  type="monotone"
                  dataKey="deadlift"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Deadlift"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-2 bg-blue-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">Bench</div>
                <div className="font-semibold text-blue-500">+5kg</div>
              </div>
              <div className="p-2 bg-green-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">Squat</div>
                <div className="font-semibold text-green-500">+5kg</div>
              </div>
              <div className="p-2 bg-orange-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">Deadlift</div>
                <div className="font-semibold text-orange-500">+10kg</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Detailed Weekly Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold mb-3">Performance Indicators</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Workout Completion</span>
                  <span className="font-semibold">5/5 sessions</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Volume Target</span>
                  <span className="font-semibold">40/38 sets</span>
                </div>
                <Progress value={105} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Intensity (RPE avg)</span>
                  <span className="font-semibold">7.8/10</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold mb-3">Nutrition Adherence</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Calorie Consistency</span>
                  <span className="font-semibold">6/7 days</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Protein Target</span>
                  <span className="font-semibold">Avg 162g/165g</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Logged Meals</span>
                  <span className="font-semibold">19/21 meals</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
