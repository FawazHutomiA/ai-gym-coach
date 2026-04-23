import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { exercises } from "@/db/schema";
import { requireAdminManagement } from "@/lib/auth/require-admin-management";

export const dynamic = "force-dynamic";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, dan tanda hubung");

const postSchema = z.object({
  slug: slugSchema,
  labelEn: z.string().trim().min(1).max(200),
  labelId: z.string().trim().min(1).max(200),
  sortOrder: z.number().int().min(0).max(99999).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const guard = await requireAdminManagement();
  if (!guard.ok) return guard.response;

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(exercises)
      .orderBy(asc(exercises.sortOrder), asc(exercises.slug));

    return NextResponse.json({ exercises: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load exercises" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = await requireAdminManagement();
  if (!guard.ok) return guard.response;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { slug, labelEn, labelId, sortOrder, isActive } = parsed.data;
  const now = new Date();

  try {
    const db = getDb();
    await db.insert(exercises).values({
      slug,
      labelEn,
      labelId,
      sortOrder: sortOrder ?? 100,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    const [row] = await db.select().from(exercises).where(eq(exercises.slug, slug)).limit(1);
    return NextResponse.json({ exercise: row }, { status: 201 });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: string }).code) : "";
    if (code === "23505") {
      return NextResponse.json({ error: "Slug sudah dipakai" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 });
  }
}
