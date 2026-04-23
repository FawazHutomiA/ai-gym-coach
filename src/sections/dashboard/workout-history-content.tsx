"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { enUS, id as localeId } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, LineChart as LineChartIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/contexts/i18n-context";
import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";
import {
  WORKOUT_HISTORY_DAY_OPTIONS,
  type WorkoutHistoryDays,
} from "@/lib/workout-history-days";
import {
  exerciseBestSetTonnage,
  exerciseVolumeInSession,
  sessionVolumeKg,
} from "@/lib/workout-volume";

export { WORKOUT_HISTORY_DAY_OPTIONS, parseWorkoutHistoryDays } from "@/lib/workout-history-days";

function dateKeyLocal(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}

type WorkoutHistoryContentProps = {
  days: WorkoutHistoryDays;
  sessions: WorkoutSessionDetailResponse[];
};

export function WorkoutHistoryContent({ days, sessions }: WorkoutHistoryContentProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const dateLocale = locale === "id" ? localeId : enUS;

  const exerciseOptions = useMemo(() => {
    const map = new Map<string, { id: string; labelEn: string; labelId: string; total: number }>();
    for (const s of sessions) {
      for (const ex of s.exercises) {
        const id = ex.catalogExerciseId;
        const vol = exerciseVolumeInSession(ex);
        const prev = map.get(id);
        if (prev) prev.total += vol;
        else map.set(id, { id, labelEn: ex.labelEn, labelId: ex.labelId, total: vol });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [sessions]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  useEffect(() => {
    if (exerciseOptions.length && !exerciseOptions.some((e) => e.id === selectedExerciseId)) {
      setSelectedExerciseId(exerciseOptions[0]?.id ?? "");
    }
  }, [exerciseOptions, selectedExerciseId]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, WorkoutSessionDetailResponse[]>();
    for (const s of sessions) {
      const k = dateKeyLocal(s.session.loggedAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    for (const arr of map.values()) {
      arr.sort(
        (a, b) =>
          new Date(b.session.loggedAt).getTime() - new Date(a.session.loggedAt).getTime(),
      );
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sessions]);

  const dailyVolumeRows = useMemo(() => {
    const map = new Map<string, { volume: number; sessionCount: number }>();
    for (const s of sessions) {
      const k = dateKeyLocal(s.session.loggedAt);
      const vol = sessionVolumeKg(s);
      const prev = map.get(k) ?? { volume: 0, sessionCount: 0 };
      map.set(k, {
        volume: Math.round((prev.volume + vol) * 10) / 10,
        sessionCount: prev.sessionCount + 1,
      });
    }
    return Array.from(map.entries())
      .map(([date, v]) => ({
        date,
        label: format(parseISO(`${date}T12:00:00`), "d MMM", { locale: dateLocale }),
        volume: v.volume,
        sessions: v.sessionCount,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [sessions, dateLocale]);

  const exerciseDailyRows = useMemo(() => {
    if (!selectedExerciseId) return [];
    const map = new Map<string, { volume: number; bestSet: number }>();
    for (const s of sessions) {
      const k = dateKeyLocal(s.session.loggedAt);
      const ex = s.exercises.find((e) => e.catalogExerciseId === selectedExerciseId);
      if (!ex) continue;
      const vol = exerciseVolumeInSession(ex);
      const best = exerciseBestSetTonnage(ex);
      const prev = map.get(k) ?? { volume: 0, bestSet: 0 };
      map.set(k, {
        volume: Math.round((prev.volume + vol) * 10) / 10,
        bestSet: Math.max(prev.bestSet, best),
      });
    }
    return Array.from(map.entries())
      .map(([date, v]) => ({
        date,
        label: format(parseISO(`${date}T12:00:00`), "d MMM", { locale: dateLocale }),
        volume: v.volume,
        bestSet: v.bestSet,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [sessions, selectedExerciseId, dateLocale]);

  const selectedExerciseLabel =
    exerciseOptions.find((e) => e.id === selectedExerciseId) ?? null;

  const volumeChartConfig = {
    volume: {
      label: t("workoutHistory.legendVolume"),
      color: "var(--chart-1)",
    },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];

  const sessionChartConfig = {
    sessions: {
      label: t("workoutHistory.legendSessions"),
      color: "var(--chart-2)",
    },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];

  const exerciseChartConfig = {
    volume: {
      label: t("workoutHistory.legendVolume"),
      color: "var(--chart-3)",
    },
  } satisfies Parameters<typeof ChartContainer>[0]["config"];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LineChartIcon className="size-8 text-primary shrink-0" />
            {t("workoutHistory.title")}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{t("workoutHistory.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("workoutHistory.rangeLabel")}</span>
          <Select
            value={String(days)}
            onValueChange={(v) => {
              const d = Number(v) as WorkoutHistoryDays;
              router.push(`${pathname}?days=${d}`);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORKOUT_HISTORY_DAY_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {t("workoutHistory.daysOption", { n: d })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/log-workout">
              <Link2 className="mr-2 size-4" />
              {t("workoutHistory.backToLog")}
            </Link>
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">{t("workoutHistory.empty")}</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-border/80">
              <CardHeader>
                <CardTitle className="text-base">{t("workoutHistory.chartVolumeTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartVolumeDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <ChartContainer config={volumeChartConfig} className="aspect-[16/9] w-full min-h-[220px]">
                  <LineChart data={dailyVolumeRows} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11 }} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, p) => {
                            const r = p?.[0]?.payload as { date?: string } | undefined;
                            if (r?.date) {
                              return format(parseISO(`${r.date}T12:00:00`), "PPP", { locale: dateLocale });
                            }
                            return null;
                          }}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="var(--color-volume)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/80">
              <CardHeader>
                <CardTitle className="text-base">{t("workoutHistory.chartSessionsTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartSessionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <ChartContainer config={sessionChartConfig} className="aspect-[16/9] w-full min-h-[220px]">
                  <BarChart data={dailyVolumeRows} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, p) => {
                            const r = p?.[0]?.payload as { date?: string } | undefined;
                            if (r?.date) {
                              return format(parseISO(`${r.date}T12:00:00`), "PPP", { locale: dateLocale });
                            }
                            return null;
                          }}
                        />
                      }
                    />
                    <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-border/80">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{t("workoutHistory.chartExerciseTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartExerciseDesc")}</CardDescription>
              </div>
              {exerciseOptions.length > 0 && (
                <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder={t("workoutHistory.selectExercise")} />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {locale === "id" ? o.labelId : o.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardHeader>
            <CardContent className="pl-0">
              {exerciseDailyRows.length === 0 || !selectedExerciseLabel ? (
                <p className="text-sm text-muted-foreground pl-2">{t("workoutHistory.exerciseNoData")}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm pl-2 text-muted-foreground">
                    {locale === "id" ? selectedExerciseLabel.labelId : selectedExerciseLabel.labelEn}
                  </p>
                  <ChartContainer
                    config={exerciseChartConfig}
                    className="aspect-[21/9] w-full min-h-[220px]"
                  >
                    <LineChart
                      data={exerciseDailyRows}
                      margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11 }} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelFormatter={(_, p) => {
                              const r = p?.[0]?.payload as { date?: string } | undefined;
                              if (r?.date) {
                                return format(parseISO(`${r.date}T12:00:00`), "PPP", { locale: dateLocale });
                              }
                              return null;
                            }}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="var(--color-volume)"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="size-5" />
              {t("workoutHistory.byDateTitle")}
            </h2>
            <div className="space-y-6">
              {groupedByDate.map(([dateKey, list]) => (
                <section key={dateKey}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 border-b border-border/60 pb-2">
                    {format(parseISO(`${dateKey}T12:00:00`), "EEEE, d MMMM yyyy", { locale: dateLocale })}
                  </h3>
                  <ul className="space-y-3">
                    {list.map((item) => {
                      const v = sessionVolumeKg(item);
                      return (
                        <li
                          key={item.session.id}
                          className="rounded-lg border border-border/80 bg-muted/25 dark:bg-muted/10 p-3 sm:px-4"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="font-medium">
                                {item.session.title?.trim() ||
                                  format(
                                    parseISO(item.session.loggedAt),
                                    "p",
                                    { locale: dateLocale },
                                  )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {t("workoutHistory.sessionVolume", { kg: v })}{" "}
                                · {t("workoutLog.exerciseCount", { n: item.exercises.length })}
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button variant="secondary" size="sm" asChild>
                                <Link href={`/dashboard/log-workout/${item.session.id}/detail`}>
                                  {t("workoutLog.viewDetail")}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
