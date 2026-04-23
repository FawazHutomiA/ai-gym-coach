import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { exercises } from "@/db/schema";

export type CatalogExerciseRow = {
  id: string;
  slug: string;
  labelEn: string;
  labelId: string;
  sortOrder: number;
};

export async function getActiveExercisesCatalog(): Promise<CatalogExerciseRow[]> {
  const db = getDb();
  return db
    .select({
      id: exercises.id,
      slug: exercises.slug,
      labelEn: exercises.labelEn,
      labelId: exercises.labelId,
      sortOrder: exercises.sortOrder,
    })
    .from(exercises)
    .where(eq(exercises.isActive, true))
    .orderBy(asc(exercises.sortOrder), asc(exercises.labelEn));
}
