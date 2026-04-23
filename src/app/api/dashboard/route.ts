import { and, asc, count, desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bodyMetricEntries, workoutSessions } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAppFeature("feature.dashboard");
  if (!guard.ok) return guard.response;
  const session = guard.session;

  const userId = session.user.id;
  const db = getDb();

  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [monthRow] = await db
      .select({ n: count() })
      .from(workoutSessions)
      .where(and(eq(workoutSessions.userId, userId), gte(workoutSessions.loggedAt, startOfMonth)));

    const weightRows = await db
      .select({
        recordedAt: bodyMetricEntries.recordedAt,
        weightKg: bodyMetricEntries.weightKg,
      })
      .from(bodyMetricEntries)
      .where(eq(bodyMetricEntries.userId, userId))
      .orderBy(asc(bodyMetricEntries.recordedAt));

    const weightSeries = weightRows.map((r) => ({
      at: r.recordedAt.toISOString(),
      weightKg: r.weightKg,
    }));

    let weightChangeKg: number | null = null;
    if (weightRows.length >= 2) {
      const first = weightRows[0].weightKg;
      const last = weightRows[weightRows.length - 1].weightKg;
      weightChangeKg = Math.round((last - first) * 10) / 10;
    }

    const recentSessions = await db
      .select({
        id: workoutSessions.id,
        loggedAt: workoutSessions.loggedAt,
        title: workoutSessions.title,
      })
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.loggedAt))
      .limit(5);

    const lastSession = await db.query.workoutSessions.findFirst({
      where: (ws, { eq: eqFn }) => eqFn(ws.userId, userId),
      orderBy: (ws, { desc: d }) => [d(ws.loggedAt)],
      with: {
        exercises: {
          orderBy: (we, { asc: a }) => [a(we.sortOrder)],
          with: {
            catalogExercise: true,
            sets: {
              orderBy: (s, { asc: a }) => [a(s.setIndex)],
            },
          },
        },
      },
    });

    type ExerciseOut = {
      labelEn: string;
      labelId: string;
      /** Jika tidak ada relasi katalog (data sangat lama), UI bisa fallback ke t(). */
      legacyNameKey: string | null;
      setsSummary: string;
      topWeightLabel: string | null;
    };

    let lastSessionOut: {
      id: string;
      loggedAt: string;
      exercises: ExerciseOut[];
    } | null = null;

    if (lastSession && lastSession.exercises.length > 0) {
      const exercises: ExerciseOut[] = lastSession.exercises.map((ex) => {
        const n = ex.sets.length;
        const weights = ex.sets.map((s) => s.weightKg).filter((w): w is number => w != null && !Number.isNaN(w));
        const maxW = weights.length ? Math.max(...weights) : null;
        const cat = ex.catalogExercise;
        const legacy =
          ex.exerciseKey.startsWith("logger.ex.") && !cat ? ex.exerciseKey : null;
        return {
          labelEn: cat?.labelEn ?? ex.exerciseKey,
          labelId: cat?.labelId ?? ex.exerciseKey,
          legacyNameKey: legacy,
          setsSummary: `${n}`,
          topWeightLabel: maxW !== null ? `${maxW}` : null,
        };
      });
      lastSessionOut = {
        id: lastSession.id,
        loggedAt: lastSession.loggedAt.toISOString(),
        exercises,
      };
    }

    return NextResponse.json({
      userName: session.user.name ?? "",
      weightSeries,
      workoutsThisMonth: monthRow?.n ?? 0,
      weightChangeKg,
      lastSession: lastSessionOut,
      recentWorkouts: recentSessions.map((r) => ({
        id: r.id,
        at: r.loggedAt.toISOString(),
        label: r.title?.trim() || "Workout",
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
