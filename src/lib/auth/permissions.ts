import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rolePermissions } from "@/db/schema";

/** Cek apakah role memiliki permission key (dari tabel `role_permissions`). */
export async function userHasPermission(role: string, permissionKey: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ k: rolePermissions.permissionKey })
    .from(rolePermissions)
    .where(and(eq(rolePermissions.role, role), eq(rolePermissions.permissionKey, permissionKey)))
    .limit(1);
  return rows.length > 0;
}
