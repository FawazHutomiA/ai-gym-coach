"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import type { CatalogExerciseRow } from "@/lib/data/exercises-catalog";
import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";
import { WorkoutSessionList } from "@/sections/dashboard/workout-session-list";

type LogWorkoutPageContentProps = {
  exerciseCatalog: CatalogExerciseRow[];
  recentSessions: WorkoutSessionDetailResponse[];
};

export function LogWorkoutPageContent({
  exerciseCatalog,
  recentSessions,
}: LogWorkoutPageContentProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-end sm:text-right">
        <div className="space-y-1 sm:ml-auto">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/workout-history" className="inline-flex items-center gap-2">
              <LineChart className="size-4 shrink-0" />
              {t("workoutLog.openHistory")}
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm sm:max-w-xs">{t("workoutLog.openHistoryHint")}</p>
        </div>
      </div>
      <div className="space-y-12">
        <WorkoutLogger initialCatalog={exerciseCatalog} />
        <WorkoutSessionList exerciseCatalog={exerciseCatalog} sessions={recentSessions} />
      </div>
    </div>
  );
}
