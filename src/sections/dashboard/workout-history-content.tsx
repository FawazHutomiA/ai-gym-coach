"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { eachDayOfInterval, format, isAfter, isBefore, parseISO, startOfDay, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
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
import {
  Calendar as CalendarIcon,
  ChevronDown,
  LineChart as LineChartIcon,
  Link2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { sessionCalendarDateKey } from "@/lib/workout-date-key";
import { WORKOUT_HISTORY_DEFAULT_CHART_DAYS } from "@/lib/workout-history-constants";
import {
  exerciseBestSetTonnage,
  exerciseVolumeInSession,
  sessionVolumeKg,
} from "@/lib/workout-volume";
import { clampYmd } from "@/lib/workout-history-filters";

function buildHistoryUrl(
  pathname: string,
  next: { dateFrom: string; dateTo: string },
): string {
  const p = new URLSearchParams();
  p.set("dateFrom", next.dateFrom);
  p.set("dateTo", next.dateTo);
  return `${pathname}?${p.toString()}`;
}

type WorkoutHistoryContentProps = {
  dateFrom: string;
  dateTo: string;
  /** Batas data terawal (lookback load dari server) */
  minYmd: string;
  /** Batas akhir: hari ini */
  maxYmd: string;
  sessions: WorkoutSessionDetailResponse[];
  /** Sesi dengan tanggal di [dateFrom, dateTo] (difilter di server) */
  sessionsInDateRange: WorkoutSessionDetailResponse[];
};

export function WorkoutHistoryContent({
  dateFrom,
  dateTo,
  minYmd,
  maxYmd,
  sessions,
  sessionsInDateRange,
}: WorkoutHistoryContentProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const dateLocale = locale === "id" ? localeId : enUS;
  const dash = t("workoutLog.detailSetEmpty");

  const exerciseOptions = useMemo(() => {
    const map = new Map<string, { id: string; labelEn: string; labelId: string; total: number }>();
    for (const s of sessionsInDateRange) {
      for (const ex of s.exercises) {
        const id = ex.catalogExerciseId;
        const vol = exerciseVolumeInSession(ex);
        const prev = map.get(id);
        if (prev) prev.total += vol;
        else map.set(id, { id, labelEn: ex.labelEn, labelId: ex.labelId, total: vol });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [sessionsInDateRange]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  useEffect(() => {
    if (exerciseOptions.length && !exerciseOptions.some((e) => e.id === selectedExerciseId)) {
      setSelectedExerciseId(exerciseOptions[0]?.id ?? "");
    }
  }, [exerciseOptions, selectedExerciseId]);

  const minDateObj = useMemo(
    () => startOfDay(parseISO(`${minYmd}T12:00:00`)),
    [minYmd],
  );
  const maxDateObj = useMemo(
    () => startOfDay(parseISO(`${maxYmd}T12:00:00`)),
    [maxYmd],
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  /** Rentang sementara di popover; `router` hanya di-update setelah "Terapkan". */
  const [pendingDateRange, setPendingDateRange] = useState<DateRange | undefined>(undefined);

  const rangeLabel = useMemo(() => {
    const fromD = parseISO(`${dateFrom}T12:00:00`);
    const toD = parseISO(`${dateTo}T12:00:00`);
    if (dateFrom === dateTo) {
      return format(fromD, "PPP", { locale: dateLocale });
    }
    return `${format(fromD, "d MMM yyyy", { locale: dateLocale })} – ${format(toD, "d MMM yyyy", { locale: dateLocale })}`;
  }, [dateFrom, dateTo, dateLocale]);

  const applyPendingDateRange = () => {
    if (!pendingDateRange?.from) return;
    const fromD = pendingDateRange.from;
    const toD = pendingDateRange.to ?? pendingDateRange.from;
    let a = format(startOfDay(fromD), "yyyy-MM-dd");
    let b = format(startOfDay(toD), "yyyy-MM-dd");
    a = clampYmd(a, minYmd, maxYmd);
    b = clampYmd(b, minYmd, maxYmd);
    if (a > b) [a, b] = [b, a];
    router.push(buildHistoryUrl(pathname, { dateFrom: a, dateTo: b }));
    setDatePickerOpen(false);
  };

  const sessionsByDay = useMemo(() => {
    const m = new Map<string, WorkoutSessionDetailResponse[]>();
    for (const s of sessionsInDateRange) {
      const k = sessionCalendarDateKey(s.session.loggedAt);
      const list = m.get(k) ?? [];
      list.push(s);
      m.set(k, list);
    }
    return Array.from(m.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sessionsInDateRange]);

  const dailyVolumeRows = useMemo(() => {
    const map = new Map<string, { volume: number; sessionCount: number }>();
    for (const s of sessions) {
      const k = sessionCalendarDateKey(s.session.loggedAt);
      if (k < dateFrom || k > dateTo) continue;
      const vol = sessionVolumeKg(s);
      const prev = map.get(k) ?? { volume: 0, sessionCount: 0 };
      map.set(k, {
        volume: Math.round((prev.volume + vol) * 10) / 10,
        sessionCount: prev.sessionCount + 1,
      });
    }
    const from = parseISO(`${dateFrom}T12:00:00`);
    const to = parseISO(`${dateTo}T12:00:00`);
    return eachDayOfInterval({ start: from, end: to }).map((d) => {
      const ymd = format(d, "yyyy-MM-dd");
      const v = map.get(ymd) ?? { volume: 0, sessionCount: 0 };
      return {
        date: ymd,
        label: format(d, "d MMM", { locale: dateLocale }),
        volume: v.volume,
        sessions: v.sessionCount,
      };
    });
  }, [sessions, dateFrom, dateTo, dateLocale]);

  const exerciseDailyRows = useMemo(() => {
    if (!selectedExerciseId) return [];
    const map = new Map<string, { volume: number; bestSet: number }>();
    for (const s of sessionsInDateRange) {
      const k = sessionCalendarDateKey(s.session.loggedAt);
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
    const from = parseISO(`${dateFrom}T12:00:00`);
    const to = parseISO(`${dateTo}T12:00:00`);
    return eachDayOfInterval({ start: from, end: to }).map((d) => {
      const ymd = format(d, "yyyy-MM-dd");
      const v = map.get(ymd) ?? { volume: 0, bestSet: 0 };
      return {
        date: ymd,
        label: format(d, "d MMM", { locale: dateLocale }),
        volume: v.volume,
        bestSet: v.bestSet,
      };
    });
  }, [sessionsInDateRange, selectedExerciseId, dateFrom, dateTo, dateLocale]);

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
        <div className="flex w-full max-w-2xl flex-col gap-3 lg:ml-auto lg:max-w-none">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end sm:gap-x-3 sm:gap-y-2">
            <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[min(100%,16rem)] sm:max-w-sm">
              <Label
                htmlFor="history-date-range"
                className="text-xs font-medium text-muted-foreground"
              >
                {t("workoutHistory.filterByDateLabel")}
              </Label>
              <Popover
                open={datePickerOpen}
                onOpenChange={(open) => {
                  if (open) {
                    setPendingDateRange({
                      from: parseISO(`${dateFrom}T12:00:00`),
                      to: parseISO(`${dateTo}T12:00:00`),
                    });
                  }
                  setDatePickerOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="history-date-range"
                    type="button"
                    variant="outline"
                    className="h-9 w-full min-w-0 justify-between gap-2 px-3 font-normal"
                    aria-expanded={datePickerOpen}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <CalendarIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="truncate text-left text-sm" title={rangeLabel}>
                        {rangeLabel}
                      </span>
                    </span>
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground opacity-60"
                      aria-hidden
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" sideOffset={4}>
                  <div className="flex flex-col">
                    <Calendar
                      key={`${dateFrom}|${dateTo}`}
                      mode="range"
                      defaultMonth={parseISO(`${dateTo}T12:00:00`)}
                      numberOfMonths={1}
                      selected={pendingDateRange}
                      onSelect={setPendingDateRange}
                      disabled={(d) => {
                        const x = startOfDay(d);
                        return isBefore(x, minDateObj) || isAfter(x, maxDateObj);
                      }}
                      locale={dateLocale}
                      initialFocus
                    />
                    <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-3 py-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => setDatePickerOpen(false)}
                      >
                        {t("workoutHistory.cancelDateRange")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8"
                        disabled={!pendingDateRange?.from}
                        onClick={applyPendingDateRange}
                      >
                        {t("workoutHistory.applyDateRange")}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:pb-px">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9"
                onClick={() => {
                  const t0 = new Date();
                  const toYmd = format(t0, "yyyy-MM-dd");
                  const fromYmd = format(
                    subDays(t0, WORKOUT_HISTORY_DEFAULT_CHART_DAYS - 1),
                    "yyyy-MM-dd",
                  );
                  router.push(
                    buildHistoryUrl(pathname, {
                      dateFrom: fromYmd,
                      dateTo: toYmd,
                    }),
                  );
                }}
              >
                <RotateCcw className="size-3.5" />
                {t("workoutHistory.resetAll")}
              </Button>
              <Button variant="outline" size="sm" className="h-9" asChild>
                <Link
                  href="/dashboard/log-workout"
                  className="inline-flex items-center gap-2"
                >
                  <Link2 className="size-4 shrink-0" />
                  {t("workoutHistory.backToLog")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">{t("workoutHistory.empty")}</p>
      ) : (
        <>
          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <Card className="min-w-0 max-w-full border-2 border-border/80">
              <CardHeader>
                <CardTitle className="text-base">{t("workoutHistory.chartVolumeTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartVolumeDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="min-w-0 px-3 pt-0 sm:px-6">
                <ChartContainer
                  config={volumeChartConfig}
                  className="aspect-[4/3] w-full min-h-[200px] max-w-full sm:aspect-[16/9] sm:min-h-[220px]"
                >
                  <LineChart data={dailyVolumeRows} margin={{ left: 4, right: 4, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      height={40}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={36}
                      tick={{ fontSize: 10 }}
                      tickMargin={4}
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

            <Card className="min-w-0 max-w-full border-2 border-border/80">
              <CardHeader>
                <CardTitle className="text-base">{t("workoutHistory.chartSessionsTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartSessionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="min-w-0 px-3 pt-0 sm:px-6">
                <ChartContainer
                  config={sessionChartConfig}
                  className="aspect-[4/3] w-full min-h-[200px] max-w-full sm:aspect-[16/9] sm:min-h-[220px]"
                >
                  <BarChart data={dailyVolumeRows} margin={{ left: 4, right: 4, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      height={40}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      width={28}
                      tick={{ fontSize: 10 }}
                      tickMargin={4}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          className="border-border/60 bg-popover text-popover-foreground shadow-md"
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
                    <Bar
                      dataKey="sessions"
                      fill="var(--color-sessions)"
                      radius={[4, 4, 0, 0]}
                      activeBar={false}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="min-w-0 max-w-full border-2 border-border/80">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{t("workoutHistory.chartExerciseTitle")}</CardTitle>
                <CardDescription>{t("workoutHistory.chartExerciseDesc")}</CardDescription>
              </div>
              {exerciseOptions.length > 0 && (
                <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                  <SelectTrigger className="w-full min-w-0 sm:w-[280px]">
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
            <CardContent className="min-w-0 px-3 sm:px-6">
              {exerciseDailyRows.length === 0 || !selectedExerciseLabel ? (
                <p className="text-sm text-muted-foreground">{t("workoutHistory.exerciseNoData")}</p>
              ) : (
                <div className="min-w-0 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {locale === "id" ? selectedExerciseLabel.labelId : selectedExerciseLabel.labelEn}
                  </p>
                  <ChartContainer
                    config={exerciseChartConfig}
                    className="aspect-[4/3] w-full min-h-[200px] max-w-full sm:aspect-[21/9] sm:min-h-[220px]"
                  >
                    <LineChart
                      data={exerciseDailyRows}
                      margin={{ left: 4, right: 4, top: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10 }}
                        height={40}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={36}
                        tick={{ fontSize: 10 }}
                        tickMargin={4}
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 min-w-0">
              <CalendarIcon className="size-5 shrink-0" />
              {t("workoutHistory.byDateTitle")}
            </h2>
            {sessionsInDateRange.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("workoutHistory.emptyDay")}</p>
            ) : (
              <div className="space-y-8">
                {sessionsByDay.map(([dayKey, daySessions]) => (
                  <section key={dayKey}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 border-b border-border/60 pb-2">
                      {format(parseISO(`${dayKey}T12:00:00`), "EEEE, d MMMM yyyy", {
                        locale: dateLocale,
                      })}
                    </h3>
                    <ul className="space-y-3">
                      {daySessions
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.session.loggedAt).getTime() -
                            new Date(a.session.loggedAt).getTime(),
                        )
                        .map((item) => {
                          const v = sessionVolumeKg(item);
                          return (
                            <li
                              key={item.session.id}
                              className="rounded-lg border border-border/80 bg-muted/25 dark:bg-muted/10 p-3 sm:px-4"
                            >
                              <div className="space-y-1">
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
                              <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                                {item.exercises.map((ex, i) => (
                                  <div
                                    key={`${ex.catalogExerciseId}-${i}`}
                                    className="rounded-lg border border-border/70 bg-card/50 dark:bg-card/30 px-3 py-2"
                                  >
                                    <p className="text-sm font-medium text-foreground">
                                      {locale === "id" ? ex.labelId : ex.labelEn}
                                    </p>
                                    <ul className="mt-2 space-y-1.5 text-sm">
                                      {ex.sets.map((set, j) => (
                                        <li
                                          key={`${ex.catalogExerciseId}-set-${j}`}
                                          className="flex justify-between gap-3 rounded-md bg-muted/50 dark:bg-muted/20 px-2 py-1.5"
                                        >
                                          <span className="text-muted-foreground tabular-nums">
                                            {t("workoutLog.set", { n: j + 1 })}
                                          </span>
                                          <span className="font-medium tabular-nums text-foreground">
                                            {t("workoutLog.detailSetLine", {
                                              weight: set.weight?.trim() ? set.weight.trim() : dash,
                                              reps: set.reps?.trim() ? set.reps.trim() : dash,
                                            })}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
