"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/contexts/i18n-context";
import type { DashboardPayload } from "@/lib/data/dashboard-payload";
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

type Props = { data: DashboardPayload };

export function DashboardHome({ data }: Props) {
  const { t, locale } = useI18n();

  const dateLocale = locale === "id" ? idLocale : enUS;
  const dateOpts = useMemo(
    () => ({ month: "short" as const, day: "numeric" as const }),
    [],
  );

  const weightData = useMemo(() => {
    if (!data.weightSeries.length) return [];
    const slice = data.weightSeries.slice(-12);
    return slice.map((p) => ({
      date: new Date(p.at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", dateOpts),
      weight: p.weightKg,
    }));
  }, [data.weightSeries, locale, dateOpts]);

  const yDomain = useMemo(() => {
    if (!data.weightSeries.length) return [0, 100];
    const w = data.weightSeries.map((p) => p.weightKg);
    const lo = Math.min(...w);
    const hi = Math.max(...w);
    const pad = Math.max(1, (hi - lo) * 0.15 || 2);
    return [Math.floor((lo - pad) * 10) / 10, Math.ceil((hi + pad) * 10) / 10];
  }, [data.weightSeries]);

  const activities = useMemo(() => {
    if (!data.recentWorkouts.length) return [];
    return data.recentWorkouts.map((r) => ({
      id: r.id,
      text: r.label,
      time: formatDistanceToNow(new Date(r.at), { addSuffix: true, locale: dateLocale }),
    }));
  }, [data.recentWorkouts, dateLocale]);

  const welcomeTitle = data.userName?.trim()
    ? t("dashboard.welcomeNamed", { name: data.userName.trim() })
    : t("dashboard.welcome");

  const weightDeltaLabel =
    data.weightChangeKg != null
      ? `${data.weightChangeKg > 0 ? "+" : ""}${data.weightChangeKg} kg`
      : t("dashboard.statPlaceholder");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{welcomeTitle}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Flame className="size-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{t("dashboard.statPlaceholder")}</div>
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
              <div className="text-2xl font-bold">{t("dashboard.statPlaceholder")}</div>
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
              <div className="text-2xl font-bold">{weightDeltaLabel}</div>
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
              <div className="text-2xl font-bold">{data.workoutsThisMonth}</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.stat.workoutsMonth")}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 dark:border-border">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="size-5 text-primary shrink-0" />
                  {t("dashboard.todayWorkout")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard.todayWorkoutHint")}</p>
              </div>
              <Link href="/dashboard/log-workout" className="shrink-0">
                <Button size="sm">
                  <PenSquare className="mr-2 size-4" />
                  {t("dashboard.logWorkout")}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!data.lastSession?.exercises.length ? (
              <p className="text-sm text-muted-foreground py-4">{t("dashboard.todayWorkoutEmpty")}</p>
            ) : (
              <>
                {data.lastSession.exercises.map((exercise, i) => (
                  <div
                    key={`${exercise.labelEn}-${exercise.labelId}-${i}`}
                    className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/20 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        {exercise.legacyNameKey
                          ? t(exercise.legacyNameKey)
                          : locale === "id"
                            ? exercise.labelId
                            : exercise.labelEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("dashboard.setsCount", { n: exercise.setsSummary })}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-primary shrink-0">
                      {exercise.topWeightLabel != null ? `${exercise.topWeightLabel} kg` : "—"}
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/log-workout/${data.lastSession.id}/detail`}>
                      {t("dashboard.viewWorkoutDetail")}
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

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
                  <span className="font-semibold">
                    {Math.min(data.workoutsThisMonth, 5)}/5
                  </span>
                </div>
                <Progress value={Math.min(100, (Math.min(data.workoutsThisMonth, 5) / 5) * 100)} />
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

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            {t("dashboard.weightProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!weightData.length ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t("dashboard.weightChartEmpty")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={yDomain as [number, number]} className="text-xs" />
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
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            {t("dashboard.recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activities.length ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.recentEmpty")}</p>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/dashboard/log-workout/${activity.id}/detail`}
                  className="flex items-start gap-4 rounded-lg p-3 border border-transparent hover:bg-muted/60 dark:hover:bg-muted/20 hover:border-border/60 transition-colors cursor-pointer"
                >
                  <div className="size-10 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
                    <Dumbbell className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
