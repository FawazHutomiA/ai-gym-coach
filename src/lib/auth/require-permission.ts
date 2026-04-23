import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { userHasPermission } from "@/lib/auth/permissions";

export type AdminGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

export async function requirePermission(permissionKey: string): Promise<AdminGuardResult> {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const allowed = await userHasPermission(session.user.role, permissionKey);
  if (!allowed) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, session };
}
