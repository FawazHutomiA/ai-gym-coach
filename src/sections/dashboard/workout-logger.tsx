"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CatalogExerciseRow } from "@/lib/data/exercises-catalog";
import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Loader2, PenSquare, Plus, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/i18n-context";
import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

type Set = {
  id: string;
  weight: string;
  reps: string;
};

type CatalogExercise = {
  id: string;
  slug: string;
  labelEn: string;
  labelId: string;
  sortOrder: number;
};

type Exercise = {
  id: string;
  catalogExerciseId: string;
  labelEn: string;
  labelId: string;
  sets: Set[];
};

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formStateFromDetail(d: WorkoutSessionDetailResponse) {
  return {
    sessionTitle: d.session.title ?? "",
    sessionLoggedAt: toDatetimeLocalValue(new Date(d.session.loggedAt)),
    exercises: d.exercises.map((ex, i) => ({
      id: `loaded-${i}-${ex.catalogExerciseId}`,
      catalogExerciseId: ex.catalogExerciseId,
      labelEn: ex.labelEn,
      labelId: ex.labelId,
      sets: ex.sets.map((s, j) => ({
        id: `loaded-set-${i}-${j}`,
        weight: s.weight,
        reps: s.reps,
      })),
    })),
  };
}

export type WorkoutLoggerProps = {
  sessionId?: string;
  onSaved?: () => void;
  /** Form ringkas untuk dialog: tanpa navigasi setelah simpan, tanpa tips & header penuh. */
  compact?: boolean;
  initialCatalog?: CatalogExerciseRow[];
  initialDetail?: WorkoutSessionDetailResponse | null;
};

export function WorkoutLogger({
  sessionId,
  onSaved,
  compact = false,
  initialCatalog,
  initialDetail = null,
}: WorkoutLoggerProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const fromDetail = sessionId && initialDetail ? formStateFromDetail(initialDetail) : null;
  const [catalog, setCatalog] = useState<CatalogExercise[]>(() => initialCatalog ?? []);
  const [catalogLoading, setCatalogLoading] = useState(() => initialCatalog === undefined);
  const [exercises, setExercises] = useState<Exercise[]>(() => fromDetail?.exercises ?? []);
  const [currentExerciseId, setCurrentExerciseId] = useState("");
  const [sessionTitle, setSessionTitle] = useState(() => fromDetail?.sessionTitle ?? "");
  const [sessionLoggedAt, setSessionLoggedAt] = useState(
    () => fromDetail?.sessionLoggedAt ?? toDatetimeLocalValue(new Date()),
  );
  const [loadingSession, setLoadingSession] = useState(() => Boolean(sessionId && !initialDetail));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCatalog !== undefined) {
      setCatalog(initialCatalog);
      setCatalogLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/exercises");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { exercises: CatalogExercise[] };
        if (!cancelled) setCatalog(data.exercises);
      } catch {
        if (!cancelled) toast.error(t("workoutLog.catalogError"));
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialCatalog, t]);

  useEffect(() => {
    if (!sessionId || initialDetail) return;
    let cancelled = false;
    (async () => {
      setLoadingSession(true);
      try {
        const res = await fetch(`/api/workouts/${sessionId}`);
        const data = (await res.json()) as {
          error?: string;
          session?: { title: string | null; loggedAt: string };
          exercises?: {
            catalogExerciseId: string;
            labelEn: string;
            labelId: string;
            sets: { weight: string; reps: string }[];
          }[];
        };
        if (res.status === 404) {
          toast.error(t("workoutLog.notFound"));
          if (!compact) router.replace("/dashboard/log-workout");
          return;
        }
        if (!res.ok) {
          toast.error(data.error ?? t("workoutLog.loadError"));
          return;
        }
        if (!data.session || !data.exercises) return;
        if (cancelled) return;
        setSessionTitle(data.session.title ?? "");
        setSessionLoggedAt(toDatetimeLocalValue(new Date(data.session.loggedAt)));
        setExercises(
          data.exercises.map((ex, i) => ({
            id: `loaded-${i}-${ex.catalogExerciseId}`,
            catalogExerciseId: ex.catalogExerciseId,
            labelEn: ex.labelEn,
            labelId: ex.labelId,
            sets: ex.sets.map((s, j) => ({
              id: `loaded-set-${i}-${j}`,
              weight: s.weight,
              reps: s.reps,
            })),
          })),
        );
      } catch {
        if (!cancelled) toast.error(t("workoutLog.loadError"));
      } finally {
        if (!cancelled) setLoadingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, initialDetail, t, router, compact]);

  const tips = useMemo(
    () => [t("workoutLog.tip.0"), t("workoutLog.tip.1"), t("workoutLog.tip.2")],
    [t],
  );

  const labelFor = (ex: Pick<Exercise, "labelEn" | "labelId">) =>
    locale === "id" ? ex.labelId : ex.labelEn;

  const addExercise = () => {
    if (!currentExerciseId) return;
    const meta = catalog.find((c) => c.id === currentExerciseId);
    if (!meta) return;

    const newExercise: Exercise = {
      id: `${Date.now()}`,
      catalogExerciseId: meta.id,
      labelEn: meta.labelEn,
      labelId: meta.labelId,
      sets: [
        {
          id: `${Date.now()}-1`,
          weight: "",
          reps: "",
        },
      ],
    };

    setExercises([...exercises, newExercise]);
    setCurrentExerciseId("");
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
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        if (ex.sets.length <= 1) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((set) => set.id !== setId),
        };
      }),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const payloadBody = () => ({
    title: sessionTitle,
    loggedAt: sessionLoggedAt ? new Date(sessionLoggedAt).toISOString() : undefined,
    exercises: exercises.map((ex) => ({
      catalogExerciseId: ex.catalogExerciseId,
      sets: ex.sets.map((s) => ({ weight: s.weight, reps: s.reps })),
    })),
  });

  const saveWorkout = async () => {
    if (exercises.length === 0) return;
    setSaving(true);
    try {
      const body = payloadBody();
      const url = sessionId ? `/api/workouts/${sessionId}` : "/api/workouts";
      const method = sessionId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("workoutLog.toast.error"));
        return;
      }
      if (sessionId) {
        toast.success(t("workoutLog.toast.updated"));
        if (!compact) router.push("/dashboard/log-workout");
        onSaved?.();
        router.refresh();
      } else {
        toast.success(t("workoutLog.toast.title"), {
          description: t("workoutLog.toast.desc", { n: exercises.length }),
        });
        setExercises([]);
        setSessionTitle("");
        setSessionLoggedAt(toDatetimeLocalValue(new Date()));
        onSaved?.();
        router.refresh();
      }
    } catch {
      toast.error(t("workoutLog.toast.error"));
    } finally {
      setSaving(false);
    }
  };

  const getTotalSets = () => exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  if (sessionId && loadingSession) {
    return (
      <div className={compact ? "space-y-4" : "space-y-8"}>
        <PageLoadingSkeleton variant={compact ? "minimal" : "default"} />
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-8"}>
      {compact ? (
        <div className="flex justify-end">
          {exercises.length > 0 && (
            <Button onClick={saveWorkout} disabled={saving} type="button" className="shrink-0">
              {saving ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 size-4" />
                  {t("workoutLog.update")}
                </>
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {sessionId ? (
              <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
                <Link href="/dashboard/log-workout">
                  <ArrowLeft className="mr-2 size-4" />
                  {t("workoutLog.backToLog")}
                </Link>
              </Button>
            ) : null}
            <h1 className="text-4xl font-bold mb-2">
              {sessionId ? t("workoutLog.editTitle") : t("workoutLog.title")}
            </h1>
            <p className="text-muted-foreground">{t("workoutLog.subtitle")}</p>
          </div>
          {exercises.length > 0 && (
            <Button onClick={saveWorkout} disabled={saving} size="lg" type="button">
              {saving ? (
                <Loader2 className="mr-2 size-5 shrink-0 animate-spin" />
              ) : (
                <Check className="mr-2 size-5" />
              )}
              {saving ? null : sessionId ? t("workoutLog.update") : t("workoutLog.save")}
            </Button>
          )}
        </div>
      )}

      <Card className="border-2 border-border dark:border-border bg-card/50 dark:bg-card/30">
        <CardContent className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="session-title">{t("workoutLog.sessionTitle")}</Label>
            <Input
              id="session-title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder=""
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-datetime">{t("workoutLog.sessionDate")}</Label>
            <Input
              id="session-datetime"
              type="datetime-local"
              value={sessionLoggedAt}
              onChange={(e) => setSessionLoggedAt(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {exercises.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-2 dark:border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{exercises.length}</div>
              <div className="text-sm text-muted-foreground">{t("workoutLog.exercises")}</div>
            </CardContent>
          </Card>
          <Card className="border-2 dark:border-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{getTotalSets()}</div>
              <div className="text-sm text-muted-foreground">{t("workoutLog.totalSets")}</div>
            </CardContent>
          </Card>
          <Card className="border-2 dark:border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-green-500" />
                <span className="text-sm text-muted-foreground">{t("workoutLog.volumeHint")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-600/5 dark:from-primary/10 dark:to-purple-600/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenSquare className="size-5 text-primary" />
            {t("workoutLog.addExerciseCard")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {catalogLoading ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Skeleton className="h-10 w-full sm:flex-1 rounded-md" />
              <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Select
                  value={currentExerciseId}
                  onValueChange={setCurrentExerciseId}
                  disabled={catalog.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        catalog.length === 0
                          ? t("workoutLog.catalogEmpty")
                          : t("workoutLog.selectPlaceholder")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {locale === "id" ? c.labelId : c.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={addExercise}
                disabled={!currentExerciseId}
                type="button"
                className="shrink-0"
              >
                <Plus className="mr-2 size-4" />
                {t("workoutLog.addExerciseBtn")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {exercises.length === 0 ? (
        <Card className="border-2 border-dashed dark:border-border">
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
            <Card key={exercise.id} className="border-2 dark:border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Badge variant="outline" className="size-8 rounded-full font-bold">
                      {exerciseIndex + 1}
                    </Badge>
                    {labelFor(exercise)}
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
                      className="grid grid-cols-12 gap-4 items-center p-4 bg-muted/50 dark:bg-muted/20 rounded-lg"
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
                          disabled={exercise.sets.length <= 1}
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

      {!compact ? (
        <Card className="border-2 dark:border-border">
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
      ) : null}
    </div>
  );
}
