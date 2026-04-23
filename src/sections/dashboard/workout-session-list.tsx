"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { useI18n } from "@/contexts/i18n-context";

type SessionRow = {
  id: string;
  loggedAt: string;
  title: string | null;
  exerciseCount: number;
};

function formatSessionDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

type WorkoutSessionListProps = {
  refreshKey: number;
  onChanged?: () => void;
};

export function WorkoutSessionList({ refreshKey, onChanged }: WorkoutSessionListProps) {
  const { t, locale } = useI18n();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/workouts?limit=30");
        const data = (await res.json()) as { sessions?: SessionRow[]; error?: string };
        if (!res.ok) {
          if (!cancelled) toast.error(data.error ?? t("workoutLog.toast.error"));
          return;
        }
        if (!cancelled) setSessions(data.sessions ?? []);
      } catch {
        if (!cancelled) toast.error(t("workoutLog.toast.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, t]);

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
      setSessions((prev) => prev.filter((s) => s.id !== id));
      onChanged?.();
    } catch {
      toast.error(t("workoutLog.toast.error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="border-2 border-border dark:border-border">
      <CardHeader>
        <CardTitle className="text-lg">{t("workoutLog.historyTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">…</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("workoutLog.historyEmpty")}</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 dark:bg-muted/15 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {s.title?.trim() || formatSessionDate(s.loggedAt, locale)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.title?.trim() ? `${formatSessionDate(s.loggedAt, locale)} · ` : ""}
                    {t("workoutLog.exerciseCount", { n: s.exerciseCount })}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/log-workout/${s.id}/detail`}>
                      <Eye className="mr-1.5 size-3.5" />
                      {t("workoutLog.viewDetail")}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/log-workout/${s.id}`}>
                      <Pencil className="mr-1.5 size-3.5" />
                      {t("workoutLog.edit")}
                    </Link>
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
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
