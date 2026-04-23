"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/contexts/i18n-context";
import type { CatalogExerciseRow } from "@/lib/data/exercises-catalog";
import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";

function formatSessionDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

type WorkoutSessionListProps = {
  sessions: WorkoutSessionDetailResponse[];
  exerciseCatalog: CatalogExerciseRow[];
};

export function WorkoutSessionList({ sessions, exerciseCatalog }: WorkoutSessionListProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const deleteSession = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("workoutLog.toast.error"));
        return;
      }
      toast.success(t("workoutLog.toast.deleted"));
      router.refresh();
    } catch {
      toast.error(t("workoutLog.toast.error"));
    } finally {
      setDeletingId(null);
    }
  };

  const dash = t("workoutLog.detailSetEmpty");
  const editDetail = editId ? sessions.find((s) => s.session.id === editId) ?? null : null;

  return (
    <>
      <Card className="border-2 border-border dark:border-border">
        <CardHeader>
          <CardTitle className="text-lg">{t("workoutLog.historyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("workoutLog.historyEmpty")}</p>
          ) : (
            <ul className="space-y-4">
              {sessions.map((item) => {
                const s = item.session;
                return (
                  <li
                    key={s.id}
                    className="rounded-xl border border-border/80 bg-muted/30 dark:bg-muted/15 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <div className="font-medium">
                          {s.title?.trim() || formatSessionDate(s.loggedAt, locale)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.title?.trim() ? `${formatSessionDate(s.loggedAt, locale)} · ` : ""}
                          {t("workoutLog.exerciseCount", { n: item.exercises.length })}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-1 sm:pt-0.5">
                        <Button variant="outline" size="sm" type="button" onClick={() => setEditId(s.id)}>
                          <Pencil className="mr-1.5 size-3.5" />
                          {t("workoutLog.edit")}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingId === s.id}
                              type="button"
                            >
                              <Trash2 className="mr-1.5 size-3.5" />
                              {t("workoutLog.delete")}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("workoutLog.deleteConfirmTitle")}</AlertDialogTitle>
                              <AlertDialogDescription>{t("workoutLog.deleteConfirmDesc")}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("workoutLog.deleteCancel")}</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteSession(s.id)}
                              >
                                {t("workoutLog.deleteConfirm")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent className="max-h-[min(90vh,880px)] max-w-3xl gap-0 overflow-y-auto p-0 sm:max-w-3xl">
          <DialogHeader className="border-b border-border px-6 py-4 text-left">
            <DialogTitle>{t("workoutLog.editTitle")}</DialogTitle>
          </DialogHeader>
          {editId && editDetail ? (
            <div className="px-6 pb-6 pt-2">
              <WorkoutLogger
                key={editId}
                sessionId={editId}
                compact
                initialCatalog={exerciseCatalog}
                initialDetail={editDetail}
                onSaved={() => setEditId(null)}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
