import { eq } from "drizzle-orm";
import type { getDb } from "@/db";
import { exercises } from "@/db/schema";

type Db = ReturnType<typeof getDb>;

type SessionForDetail = {
  id: string;
  title: string | null;
  loggedAt: Date;
  exercises: {
    catalogExerciseId: string | null;
    exerciseKey: string;
    catalogExercise: { id: string; labelEn: string; labelId: string } | null;
    sets: { weightKg: number | null; reps: number | null }[];
  }[];
};

export type WorkoutSessionDetailResponse = {
  session: { id: string; title: string | null; loggedAt: string };
  exercises: {
    catalogExerciseId: string;
    labelEn: string;
    labelId: string;
    sets: { weight: string; reps: string }[];
  }[];
};

/**
 * Sama dengan payload GET `/api/workouts/[id]` — dipakai untuk detail tunggal & daftar dengan `?details=1`.
 */
export async function workoutSessionToDetailJson(
  db: Db,
  row: SessionForDetail,
): Promise<{ ok: true; data: WorkoutSessionDetailResponse } | { ok: false; error: string; status: number }> {
  const exercisesOut: WorkoutSessionDetailResponse["exercises"] = [];

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
      return { ok: false, error: "Session has exercises that could not be matched to the catalog.", status: 422 };
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

  return {
    ok: true,
    data: {
      session: {
        id: row.id,
        title: row.title,
        loggedAt: row.loggedAt.toISOString(),
      },
      exercises: exercisesOut,
    },
  };
}
