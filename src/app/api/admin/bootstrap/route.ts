import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { seedPermissionsAndRoles, seedSuperAdminAccount } from "@/db/seed-permissions";

/**
 * Satu kali (secret benar): sync permission + pastikan akun super_admin@gmail.com ada.
 * Header: x-admin-bootstrap-secret: ADMIN_BOOTSTRAP_SECRET
 */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!secret || req.headers.get("x-admin-bootstrap-secret") !== secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await seedPermissionsAndRoles();
    const db = getDb();

    const [{ n: superCount } = { n: 0 }] = await db
      .select({ n: count() })
      .from(users)
      .where(eq(users.role, "super_admin"));

    if (superCount > 0) {
      return NextResponse.json({ error: "Already initialized (super_admin exists)" }, { status: 403 });
    }

    await seedSuperAdminAccount();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Bootstrap failed" }, { status: 500 });
  }
}
