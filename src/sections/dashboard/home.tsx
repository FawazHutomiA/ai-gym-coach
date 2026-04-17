"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Target,
  TrendingUp,
  PenSquare,
  Utensils,
  Calendar,
  Flame,
  Trophy,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WEIGHT_CHART_POINTS = [75, 74.5, 74, 73.5, 73, 72.5] as const;

const TODAY_EXERCISES = [
  { nameKey: "logger.ex.benchPress", sets: "4 x 8-10", weight: "80kg" },
  { nameKey: "logger.ex.inclineDb", sets: "3 x 10-12", weight: "32kg" },
  { nameKey: "logger.ex.shoulderPress", sets: "4 x 8-10", weight: "60kg" },
  { nameKey: "logger.ex.lateralRaises", sets: "3 x 12-15", weight: "12kg" },
  { nameKey: "logger.ex.tricepDips", sets: "3 x 10-12", weight: "bodyweight" as const },
  { nameKey: "logger.ex.cableTricep", sets: "3 x 12-15", weight: "25kg" },
] as const;

export function DashboardHome() {
  const { t } = useI18n();

  const weightData = useMemo(
    () =>
      WEIGHT_CHART_POINTS.map((weight, i) => ({
        date: t("dashboard.week.short", { n: i + 1 }),
        weight,
      })),
    [t],
  );

  const activities = useMemo(
    () => [
      { type: "workout" as const, text: t("dashboard.activity.0.text"), time: t("dashboard.activity.0.time") },
      { type: "nutrition" as const, text: t("dashboard.activity.1.text"), time: t("dashboard.activity.1.time") },
      { type: "ai" as const, text: t("dashboard.activity.2.text"), time: t("dashboard.activity.2.time") },
      { type: "workout" as const, text: t("dashboard.activity.3.text"), time: t("dashboard.activity.3.time") },
    ],
    [t],
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <Link href="/dashboard/profile">
          <Button variant="outline" className="gap-2 shrink-0">
            <User className="size-4" />
            {t("dashboard.profileBtn")}
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Flame className="size-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">2,450</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.stat.calories")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="size-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">165g</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.stat.protein")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="size-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">-2.5kg</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.stat.weightChange")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Trophy className="size-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">18/20</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.stat.workoutsMonth")}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="size-5 text-primary" />
                {t("dashboard.todayWorkout")}
              </CardTitle>
              <Link href="/dashboard/log-workout">
                <Button size="sm">
                  <PenSquare className="mr-2 size-4" />
                  {t("dashboard.logWorkout")}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {TODAY_EXERCISES.map((exercise, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold">{t(exercise.nameKey)}</div>
                  <div className="text-sm text-muted-foreground">{exercise.sets}</div>
                </div>
                <div className="text-sm font-medium text-primary">
                  {exercise.weight === "bodyweight"
                    ? t("dashboard.home.bodyweight")
                    : exercise.weight}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/log-workout">
                <Button variant="outline" className="w-full justify-start">
                  <PenSquare className="mr-2 size-4" />
                  {t("dashboard.logWorkout")}
                </Button>
              </Link>
              <Link href="/dashboard/nutrition">
                <Button variant="outline" className="w-full justify-start">
                  <Utensils className="mr-2 size-4" />
                  {t("dashboard.trackNutrition")}
                </Button>
              </Link>
              <Link href="/dashboard/adjustment">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 size-4" />
                  {t("dashboard.viewAiInsights")}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t("dashboard.thisWeek")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("dashboard.workoutsCompleted")}</span>
                  <span className="font-semibold">3/5</span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("dashboard.nutritionLogged")}</span>
                  <span className="font-semibold">{t("dashboard.home.nutritionDays")}</span>
                </div>
                <Progress value={71} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weight Progress Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            {t("dashboard.weightProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[70, 76]} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            {t("dashboard.recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div
                  className={`size-10 rounded-lg flex items-center justify-center ${
                    activity.type === "workout"
                      ? "bg-primary/10"
                      : activity.type === "nutrition"
                      ? "bg-green-500/10"
                      : "bg-blue-500/10"
                  }`}
                >
                  {activity.type === "workout" && <Dumbbell className="size-5 text-primary" />}
                  {activity.type === "nutrition" && <Utensils className="size-5 text-green-500" />}
                  {activity.type === "ai" && <TrendingUp className="size-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
