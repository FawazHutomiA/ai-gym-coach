/**
 * Katalog gerakan + backfill `workout_exercises.catalog_exercise_id`.
 * Dipanggil dari `bun run db:seed` setelah permission.
 */
import { eq, isNull, sql } from "drizzle-orm";
import { getDb } from "./index";
import { exercises, workoutExercises } from "./schema";

const INITIAL: {
  slug: string;
  labelEn: string;
  labelId: string;
  migrationKey: string;
  sortOrder: number;
}[] = [
  { slug: "bench-press", labelEn: "Bench Press", labelId: "Bench press", migrationKey: "logger.ex.benchPress", sortOrder: 10 },
  { slug: "incline-db-press", labelEn: "Incline Dumbbell Press", labelId: "Incline dumbbell press", migrationKey: "logger.ex.inclineDb", sortOrder: 20 },
  { slug: "shoulder-press", labelEn: "Shoulder Press", labelId: "Shoulder press", migrationKey: "logger.ex.shoulderPress", sortOrder: 30 },
  { slug: "lateral-raises", labelEn: "Lateral Raises", labelId: "Lateral raise", migrationKey: "logger.ex.lateralRaises", sortOrder: 40 },
  { slug: "tricep-dips", labelEn: "Tricep Dips", labelId: "Tricep dips", migrationKey: "logger.ex.tricepDips", sortOrder: 50 },
  { slug: "cable-tricep-extensions", labelEn: "Cable Tricep Extensions", labelId: "Cable tricep extensions", migrationKey: "logger.ex.cableTricep", sortOrder: 60 },
  { slug: "squats", labelEn: "Squats", labelId: "Squat", migrationKey: "logger.ex.squats", sortOrder: 70 },
  { slug: "deadlifts", labelEn: "Deadlifts", labelId: "Deadlift", migrationKey: "logger.ex.deadlifts", sortOrder: 80 },
  { slug: "pull-ups", labelEn: "Pull-ups", labelId: "Pull-up", migrationKey: "logger.ex.pullUps", sortOrder: 90 },
  { slug: "barbell-rows", labelEn: "Barbell Rows", labelId: "Barbell row", migrationKey: "logger.ex.barbellRows", sortOrder: 100 },
  { slug: "leg-press", labelEn: "Leg Press", labelId: "Leg press", migrationKey: "logger.ex.legPress", sortOrder: 110 },
  { slug: "romanian-deadlifts", labelEn: "Romanian Deadlifts", labelId: "Romanian deadlift", migrationKey: "logger.ex.rdl", sortOrder: 120 },
];

export async function seedExercisesAndBackfill() {
  const db = getDb();
  const now = new Date();

  for (const row of INITIAL) {
    await db
      .insert(exercises)
      .values({
        slug: row.slug,
        labelEn: row.labelEn,
        labelId: row.labelId,
        sortOrder: row.sortOrder,
        isActive: true,
        migrationKey: row.migrationKey,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: exercises.slug,
        set: {
          labelEn: row.labelEn,
          labelId: row.labelId,
          sortOrder: row.sortOrder,
          migrationKey: row.migrationKey,
          updatedAt: now,
        },
      });
  }

  await db.execute(sql`
    UPDATE workout_exercises we
    SET catalog_exercise_id = e.id
    FROM exercises e
    WHERE we.catalog_exercise_id IS NULL
      AND e.migration_key IS NOT NULL
      AND we.exercise_key = e.migration_key
  `);

  await db.execute(sql`
    UPDATE workout_exercises we
    SET catalog_exercise_id = e.id
    FROM exercises e
    WHERE we.catalog_exercise_id IS NULL
      AND we.exercise_key = e.slug
  `);

  const orphans = await db.select().from(workoutExercises).where(isNull(workoutExercises.catalogExerciseId));

  for (const line of orphans) {
    const [byMigration] = await db
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.migrationKey, line.exerciseKey))
      .limit(1);
    if (byMigration) {
      await db
        .update(workoutExercises)
        .set({ catalogExerciseId: byMigration.id })
        .where(eq(workoutExercises.id, line.id));
      continue;
    }

    const legacySlug = `legacy-${line.id.replace(/-/g, "").slice(0, 12)}`;
    const label =
      line.exerciseKey.replace(/^logger\.ex\./, "").replace(/([A-Z])/g, " $1").trim() || line.exerciseKey;

    await db.insert(exercises).values({
      slug: legacySlug,
      labelEn: label,
      labelId: label,
      sortOrder: 999,
      isActive: true,
      migrationKey: line.exerciseKey,
      createdAt: now,
      updatedAt: now,
    });

    const [created] = await db.select({ id: exercises.id }).from(exercises).where(eq(exercises.slug, legacySlug)).limit(1);
    if (created) {
      await db
        .update(workoutExercises)
        .set({ catalogExerciseId: created.id })
        .where(eq(workoutExercises.id, line.id));
    }
  }
}
