import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { exercises, workoutExercises } from "@/db/schema";
import { requireAdminManagement } from "@/lib/auth/require-admin-management";

export const dynamic = "force-dynamic";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, dan tanda hubung");

const patchSchema = z.object({
  slug: slugSchema.optional(),
  labelEn: z.string().trim().min(1).max(200).optional(),
  labelId: z.string().trim().min(1).max(200).optional(),
  sortOrder: z.number().int().min(0).max(99999).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminManagement();
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const body = parsed.data;
  if (Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const db = getDb();
    const [existing] = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextSlug = body.slug ?? existing.slug;
    const updates: Partial<typeof exercises.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.labelEn !== undefined) updates.labelEn = body.labelEn;
    if (body.labelId !== undefined) updates.labelId = body.labelId;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    await db.update(exercises).set(updates).where(eq(exercises.id, id));

    if (body.slug !== undefined && body.slug !== existing.slug) {
      await db
        .update(workoutExercises)
        .set({ exerciseKey: nextSlug })
        .where(eq(workoutExercises.catalogExerciseId, id));
    }

    const [row] = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
    return NextResponse.json({ exercise: row });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: string }).code) : "";
    if (code === "23505") {
      return NextResponse.json({ error: "Slug sudah dipakai" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/** Nonaktifkan gerakan (soft delete). Referensi log tetap aman (RESTRICT). */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminManagement();
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;

  try {
    const db = getDb();
    const [existing] = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [{ n }] = await db
      .select({ n: count() })
      .from(workoutExercises)
      .where(eq(workoutExercises.catalogExerciseId, id));

    if (n > 0) {
      await db.update(exercises).set({ isActive: false, updatedAt: new Date() }).where(eq(exercises.id, id));
      return NextResponse.json({ ok: true, mode: "deactivated" });
    }

    await db.delete(exercises).where(eq(exercises.id, id));
    return NextResponse.json({ ok: true, mode: "deleted" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
