import { and, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { workoutSessions } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";
import {
  type WorkoutSessionDetailResponse,
  workoutSessionToDetailJson,
} from "@/lib/workout-session-to-detail-json";

/**
 * Sesi log dalam jangka waktu (default 120 hari), dengan detail penuh — untuk history per tanggal & grafik.
 * Query: `days` = panjang hari ke belakang (1–730).
 */
export async function GET(req: Request) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const daysRaw = parseInt(searchParams.get("days") ?? "120", 10) || 120;
  const days = Math.min(730, Math.max(1, daysRaw));
  const since = subDays(new Date(), days);

  try {
    const db = getDb();
    const rows = await db.query.workoutSessions.findMany({
      where: (ws, { and: andFn, eq: eqFn, gte: gteFn }) =>
        andFn(eqFn(ws.userId, guard.session.user.id), gteFn(ws.loggedAt, since)),
      orderBy: (ws, { desc: d }) => [d(ws.loggedAt)],
      limit: 2000,
      with: {
        exercises: {
          orderBy: (we, { asc: a }) => [a(we.sortOrder)],
          with: {
            catalogExercise: true,
            sets: { orderBy: (s, { asc: a }) => [a(s.setIndex)] },
          },
        },
      },
    });

    const sessions: WorkoutSessionDetailResponse[] = [];
    for (const row of rows) {
      const built = await workoutSessionToDetailJson(db, {
        id: row.id,
        title: row.title,
        loggedAt: row.loggedAt,
        exercises: row.exercises.map((line) => ({
          catalogExerciseId: line.catalogExerciseId,
          exerciseKey: line.exerciseKey,
          catalogExercise: line.catalogExercise,
          sets: line.sets.map((s) => ({ weightKg: s.weightKg, reps: s.reps })),
        })),
      });
      if (!built.ok) {
        return NextResponse.json({ error: built.error }, { status: built.status });
      }
      sessions.push(built.data);
    }

    return NextResponse.json({ sessions, days, since: since.toISOString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
