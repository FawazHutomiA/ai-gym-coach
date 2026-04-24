import { and, eq, isNull, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { authSessions } from "@/db/schema";
import { REFRESH_TOKEN_MS } from "@/lib/auth/token-lifetimes";

export type AuthSessionRow = typeof authSessions.$inferSelect;

/**
 * Baru login: buat baris refresh (7 hari). JWT menyimpan `sessionId` = id.
 */
export async function createAuthSession(userId: string): Promise<AuthSessionRow> {
  const db = getDb();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
  const [row] = await db
    .insert(authSessions)
    .values({ userId, expiresAt })
    .returning();
  if (!row) throw new Error("createAuthSession: insert failed");
  return row;
}

/**
 * Sesi valid: ada, bukan `revoked`, `expiresAt` &gt; sekarang, `userId` cocok.
 */
export async function getValidAuthSession(
  sessionId: string,
  userId: string,
): Promise<AuthSessionRow | null> {
  const db = getDb();
  const now = new Date();
  const [row] = await db
    .select()
    .from(authSessions)
    .where(
      and(
        eq(authSessions.id, sessionId),
        eq(authSessions.userId, userId),
        isNull(authSessions.revokedAt),
        gt(authSessions.expiresAt, now),
      ),
    )
    .limit(1);
  return row ?? null;
}

/** Logout / revoke satu sesi. */
export async function revokeAuthSession(sessionId: string): Promise<void> {
  const db = getDb();
  await db
    .update(authSessions)
    .set({ revokedAt: new Date() })
    .where(eq(authSessions.id, sessionId));
}
