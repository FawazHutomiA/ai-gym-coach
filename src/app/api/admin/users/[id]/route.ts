import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { isUserRole } from "@/lib/auth/roles";
import { requireAdminManagement } from "@/lib/auth/require-admin-management";
import { SUPER_ADMIN_ACCOUNT_EMAIL } from "@/lib/auth/super-admin-account";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["user", "super_admin"]).optional(),
});

export const dynamic = "force-dynamic";

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
  if (!body.name && body.role === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const db = getDb();
    const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body.role !== undefined && !isUserRole(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const targetEmail = target.email.toLowerCase();
    const superEmail = SUPER_ADMIN_ACCOUNT_EMAIL.toLowerCase();

    if (body.role === "super_admin" && targetEmail !== superEmail) {
      return NextResponse.json(
        { error: "Hanya akun super_admin@gmail.com yang boleh menjadi super_admin" },
        { status: 400 },
      );
    }

    if (body.role === "user" && targetEmail === superEmail) {
      return NextResponse.json(
        { error: "Akun administrator utama tidak boleh diubah ke user" },
        { status: 400 },
      );
    }

    if (body.role === "user" && target.role === "super_admin") {
      const [{ n }] = await db.select({ n: count() }).from(users).where(eq(users.role, "super_admin"));
      if (n <= 1) {
        return NextResponse.json({ error: "Cannot demote the last super_admin" }, { status: 400 });
      }
    }

    const updates: { name?: string; role?: string } = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.role !== undefined) updates.role = body.role;

    await db.update(users).set(updates).where(eq(users.id, id));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
