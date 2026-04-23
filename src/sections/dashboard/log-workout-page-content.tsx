"use client";

import Link from "next/link";
import { useState } from "react";
import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";
import { WorkoutSessionList } from "@/sections/dashboard/workout-session-list";

export function LogWorkoutPageContent() {
  const { t } = useI18n();
  const [listKey, setListKey] = useState(0);

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
        <WorkoutLogger onSaved={() => setListKey((k) => k + 1)} />
        <WorkoutSessionList refreshKey={listKey} onChanged={() => setListKey((k) => k + 1)} />
      </div>
    </div>
  );
}
