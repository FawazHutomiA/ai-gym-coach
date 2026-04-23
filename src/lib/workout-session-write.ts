import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { exercises, workoutExercises, workoutSets } from "@/db/schema";
import { parseRepsInt, parseWeightKg, type WorkoutUpsertBody } from "@/lib/workout-log-body";

type Db = ReturnType<typeof getDb>;

/** Hapus semua baris latihan + set untuk sesi, lalu tulis ulang dari payload. */
export async function replaceSessionExercises(
  db: Db,
  sessionId: string,
  exerciseList: WorkoutUpsertBody["exercises"],
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  await db.delete(workoutExercises).where(eq(workoutExercises.sessionId, sessionId));

  for (let i = 0; i < exerciseList.length; i++) {
    const ex = exerciseList[i];
    const [catalog] = await db
      .select({ id: exercises.id, slug: exercises.slug })
      .from(exercises)
      .where(and(eq(exercises.id, ex.catalogExerciseId), eq(exercises.isActive, true)))
      .limit(1);
    if (!catalog) {
      return { ok: false, error: "Unknown or inactive exercise", status: 400 };
    }

    const [exRow] = await db
      .insert(workoutExercises)
      .values({
        sessionId,
        catalogExerciseId: catalog.id,
        exerciseKey: catalog.slug,
        sortOrder: i,
      })
      .returning({ id: workoutExercises.id });

    if (!exRow) continue;

    for (let j = 0; j < ex.sets.length; j++) {
      const st = ex.sets[j];
      await db.insert(workoutSets).values({
        exerciseId: exRow.id,
        setIndex: j,
        weightKg: parseWeightKg(st.weight),
        reps: parseRepsInt(st.reps),
      });
    }
  }

  return { ok: true };
}
