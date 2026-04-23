import { NextResponse } from "next/server";
import { requireAdminManagement } from "@/lib/auth/require-admin-management";

export const dynamic = "force-dynamic";

/** Cek apakah sesi super_admin + hak kelola (`admin.manage_users`). */
export async function GET() {
  const guard = await requireAdminManagement();
  if (!guard.ok) return guard.response;
  return NextResponse.json({ ok: true, role: guard.session.user?.role });
}
