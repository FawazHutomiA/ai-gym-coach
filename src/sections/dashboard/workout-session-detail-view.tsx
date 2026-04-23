"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/i18n-context";
import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";

function formatSessionWhen(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

type WorkoutSessionDetailViewProps = {
  data: WorkoutSessionDetailResponse;
};

export function WorkoutSessionDetailView({ data }: WorkoutSessionDetailViewProps) {
  const { t, locale } = useI18n();
  const sessionId = data.session.id;
  const dash = t("workoutLog.detailSetEmpty");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
            <Link href="/dashboard/log-workout">
              <ArrowLeft className="mr-2 size-4" />
              {t("workoutLog.backToLog")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {data.session.title?.trim() || t("workoutLog.detailTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {formatSessionWhen(data.session.loggedAt, locale)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{t("workoutLog.detailHint")}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/log-workout/${sessionId}`}>
            <Pencil className="mr-2 size-4" />
            {t("workoutLog.edit")}
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {data.exercises.map((ex, i) => (
          <Card key={`${ex.catalogExerciseId}-${i}`} className="border-2 dark:border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {locale === "id" ? ex.labelId : ex.labelEn}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {ex.sets.map((set, j) => (
                  <li
                    key={`${ex.catalogExerciseId}-set-${j}`}
                    className="flex justify-between gap-4 rounded-md bg-muted/50 dark:bg-muted/20 px-3 py-2"
                  >
                    <span className="text-muted-foreground">{t("workoutLog.set", { n: j + 1 })}</span>
                    <span className="font-medium tabular-nums">
                      {t("workoutLog.detailSetLine", {
                        weight: set.weight?.trim() ? set.weight.trim() : dash,
                        reps: set.reps?.trim() ? set.reps.trim() : dash,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
