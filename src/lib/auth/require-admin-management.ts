import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { userHasPermission } from "@/lib/auth/permissions";

export type AdminMgmtGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

/** Panel & API manajemen: hanya role `super_admin` + permission `admin.manage_users`. */
export async function requireAdminManagement(): Promise<AdminMgmtGuardResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "super_admin") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  const allowed = await userHasPermission(session.user.role, "admin.manage_users");
  if (!allowed) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, session };
}
