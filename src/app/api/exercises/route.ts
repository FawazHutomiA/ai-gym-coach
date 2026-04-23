import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { exercises } from "@/db/schema";
import { requireAppFeature } from "@/lib/auth/require-app-feature";

export const dynamic = "force-dynamic";

/** Daftar gerakan aktif untuk log latihan (dari katalog DB). */
export async function GET() {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  try {
    const db = getDb();
    const rows = await db
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

    return NextResponse.json({ exercises: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load exercises" }, { status: 500 });
  }
}
