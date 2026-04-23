import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import type { UserRole } from "@/lib/auth/roles";
import { isUserRole } from "@/lib/auth/roles";

export async function verifyCredentials(email: string, password: string) {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const rows = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  if (rows.length === 0) return null;

  const user = rows[0];
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const role: UserRole = isUserRole(user.role) ? user.role : "user";

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role,
    image: null as string | null,
  };
}
