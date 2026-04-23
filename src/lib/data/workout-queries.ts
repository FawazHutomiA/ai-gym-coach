import { and, desc, eq, gte } from "drizzle-orm";
import { subDays } from "date-fns";
import { getDb } from "@/db";
import { workoutSessions } from "@/db/schema";
import {
  type WorkoutSessionDetailResponse,
  workoutSessionToDetailJson,
} from "@/lib/workout-session-to-detail-json";

async function mapRowsToDetails(
  rows: {
    id: string;
    title: string | null;
    loggedAt: Date;
    exercises: {
      catalogExerciseId: string | null;
      exerciseKey: string;
      catalogExercise: { id: string; labelEn: string; labelId: string } | null;
      sets: { weightKg: number | null; reps: number | null }[];
    }[];
  }[],
  db: ReturnType<typeof getDb>,
): Promise<{ ok: true; data: WorkoutSessionDetailResponse[] } | { ok: false; error: string; status: number }> {
  const out: WorkoutSessionDetailResponse[] = [];
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
      return { ok: false, error: built.error, status: built.status };
    }
    out.push(built.data);
  }
  return { ok: true, data: out };
}

export async function getRecentWorkoutSessionsDetailed(
  userId: string,
  limit: number,
): Promise<WorkoutSessionDetailResponse[] | { error: string; status: number }> {
  const db = getDb();
  const take = Math.min(30, Math.max(1, limit));
  const rows = await db.query.workoutSessions.findMany({
    where: (ws, { eq: eqFn }) => eqFn(ws.userId, userId),
    orderBy: (ws, { desc: d }) => [d(ws.loggedAt)],
    limit: take,
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
  const mapped = await mapRowsToDetails(rows, db);
  if (!mapped.ok) return { error: mapped.error, status: mapped.status };
  return mapped.data;
}

export async function getWorkoutHistorySessions(
  userId: string,
  days: number,
): Promise<WorkoutSessionDetailResponse[] | { error: string; status: number }> {
  const db = getDb();
  const d = Math.min(730, Math.max(1, days));
  const since = subDays(new Date(), d);
  const rows = await db.query.workoutSessions.findMany({
    where: (ws, { and: andFn, eq: eqFn, gte: gteFn }) =>
      andFn(eqFn(ws.userId, userId), gteFn(ws.loggedAt, since)),
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
  const mapped = await mapRowsToDetails(rows, db);
  if (!mapped.ok) return { error: mapped.error, status: mapped.status };
  return mapped.data;
}

export async function getWorkoutSessionForUser(
  userId: string,
  sessionId: string,
): Promise<WorkoutSessionDetailResponse | "notfound" | { error: string; status: number }> {
  const db = getDb();
  const row = await db.query.workoutSessions.findFirst({
    where: (ws, { and: andFn, eq: eqFn }) =>
      andFn(eqFn(ws.id, sessionId), eqFn(ws.userId, userId)),
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

  if (!row) return "notfound";

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
    return { error: built.error, status: built.status };
  }
  return built.data;
}
