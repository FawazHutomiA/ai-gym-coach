import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { exercises, workoutSessions } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";
import { normalizeSessionTitle, workoutUpsertBodySchema } from "@/lib/workout-log-body";
import { replaceSessionExercises } from "@/lib/workout-session-write";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  const db = getDb();

  try {
    const row = await db.query.workoutSessions.findFirst({
      where: (ws, { and: andFn, eq: eqFn }) =>
        andFn(eqFn(ws.id, id), eqFn(ws.userId, guard.session.user.id)),
      with: {
        exercises: {
          orderBy: (we, { asc }) => [asc(we.sortOrder)],
          with: {
            catalogExercise: true,
            sets: { orderBy: (s, { asc }) => [asc(s.setIndex)] },
          },
        },
      },
    });

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const exercisesOut: {
      catalogExerciseId: string;
      labelEn: string;
      labelId: string;
      sets: { weight: string; reps: string }[];
    }[] = [];

    for (const line of row.exercises) {
      let catalogExerciseId = line.catalogExerciseId ?? line.catalogExercise?.id ?? null;
      let labelEn = line.catalogExercise?.labelEn ?? line.exerciseKey;
      let labelId = line.catalogExercise?.labelId ?? line.exerciseKey;

      if (!catalogExerciseId) {
        const [bySlug] = await db
          .select({
            id: exercises.id,
            labelEn: exercises.labelEn,
            labelId: exercises.labelId,
          })
          .from(exercises)
          .where(eq(exercises.slug, line.exerciseKey))
          .limit(1);
        if (bySlug) {
          catalogExerciseId = bySlug.id;
          labelEn = bySlug.labelEn;
          labelId = bySlug.labelId;
        }
      }

      if (!catalogExerciseId) {
        return NextResponse.json(
          { error: "Session has exercises that could not be matched to the catalog." },
          { status: 422 },
        );
      }

      exercisesOut.push({
        catalogExerciseId,
        labelEn,
        labelId,
        sets: line.sets.map((s) => ({
          weight: s.weightKg != null ? String(s.weightKg) : "",
          reps: s.reps != null ? String(s.reps) : "",
        })),
      });
    }

    return NextResponse.json({
      session: {
        id: row.id,
        title: row.title,
        loggedAt: row.loggedAt.toISOString(),
      },
      exercises: exercisesOut,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load workout" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { id } = await context.params;

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
  const db = getDb();

  try {
    const [owned] = await db
      .select({ id: workoutSessions.id })
      .from(workoutSessions)
      .where(and(eq(workoutSessions.id, id), eq(workoutSessions.userId, guard.session.user.id)))
      .limit(1);

    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db
      .update(workoutSessions)
      .set({
        title: normalizeSessionTitle(title),
        ...(loggedAt ? { loggedAt: new Date(loggedAt) } : {}),
      })
      .where(eq(workoutSessions.id, id));

    const replaced = await replaceSessionExercises(db, id, exerciseList);
    if (!replaced.ok) {
      return NextResponse.json({ error: replaced.error }, { status: replaced.status });
    }

    return NextResponse.json({ ok: true, sessionId: id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update workout" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  const db = getDb();

  try {
    const deleted = await db
      .delete(workoutSessions)
      .where(and(eq(workoutSessions.id, id), eq(workoutSessions.userId, guard.session.user.id)))
      .returning({ id: workoutSessions.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
  }
}
