import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { workoutExercises, workoutSessions } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";
import { normalizeSessionTitle, workoutUpsertBodySchema } from "@/lib/workout-log-body";
import {
  type WorkoutSessionDetailResponse,
  workoutSessionToDetailJson,
} from "@/lib/workout-session-to-detail-json";
import { replaceSessionExercises } from "@/lib/workout-session-write";

export async function POST(req: Request) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;
  const session = guard.session;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = workoutUpsertBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { title, loggedAt, exercises: exerciseList } = parsed.data;
  const userId = session.user.id;
  const db = getDb();

  try {
    const [sessionRow] = await db
      .insert(workoutSessions)
      .values({
        userId,
        title: normalizeSessionTitle(title),
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      })
      .returning({ id: workoutSessions.id });

    if (!sessionRow) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    const sessionId = sessionRow.id;
    const replaced = await replaceSessionExercises(db, sessionId, exerciseList);
    if (!replaced.ok) {
      await db.delete(workoutSessions).where(eq(workoutSessions.id, sessionId));
      return NextResponse.json({ error: replaced.error }, { status: replaced.status });
    }

    return NextResponse.json({ ok: true, sessionId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 });
  }
}

/** Daftar sesi terbaru (ringkas) + jumlah gerakan per sesi. */
export async function GET(req: Request) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(30, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10));
  const withDetails = searchParams.get("details") === "1" || searchParams.get("details") === "true";

  try {
    const db = getDb();

    if (withDetails) {
      const rows = await db.query.workoutSessions.findMany({
        where: (ws, { eq: eqFn }) => eqFn(ws.userId, guard.session.user.id),
        orderBy: (ws, { desc: d }) => [d(ws.loggedAt)],
        limit,
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

      return NextResponse.json({ sessions });
    }

    const rows = await db
      .select({
        id: workoutSessions.id,
        loggedAt: workoutSessions.loggedAt,
        title: workoutSessions.title,
        exerciseCount: count(workoutExercises.id),
      })
      .from(workoutSessions)
      .leftJoin(workoutExercises, eq(workoutExercises.sessionId, workoutSessions.id))
      .where(eq(workoutSessions.userId, guard.session.user.id))
      .groupBy(workoutSessions.id)
      .orderBy(desc(workoutSessions.loggedAt))
      .limit(limit);

    return NextResponse.json({ sessions: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list workouts" }, { status: 500 });
  }
}
