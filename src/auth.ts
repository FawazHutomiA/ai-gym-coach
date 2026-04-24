import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { UserRole } from "@/lib/auth/roles";
import {
  ACCESS_TOKEN_MS,
  REFRESH_TOKEN_MAX_AGE_SEC,
  REFRESH_TOKEN_MS,
} from "@/lib/auth/token-lifetimes";

/** Auth.js v5 membaca AUTH_SECRET; beberapa setup lama pakai NEXTAUTH_SECRET. */
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
  }
  interface Session {
    user: { id: string; role: UserRole } & DefaultSession["user"];
    error?: "RefreshTokenExpired";
  }
}

type TokenWithSession = JWT & {
  sessionId?: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
  error?: "RefreshTokenExpired";
};

/**
 * Access 24h + refresh 7h di `auth_sessions` (DB). JWT membawa `sessionId` untuk revoke/validasi.
 * Cookie `maxAge` = jendela refresh.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: authSecret,
  debug: process.env.AUTH_DEBUG === "1",
  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_MAX_AGE_SEC,
  },
  pages: {
    signIn: "/sign-in",
  },
  events: {
    signOut: async (message) => {
      try {
        if ("token" in message && message.token && typeof message.token === "object") {
          const sid = (message.token as TokenWithSession).sessionId;
          if (typeof sid === "string") {
            const { revokeAuthSession } = await import("@/lib/auth/auth-sessions-db");
            await revokeAuthSession(sid);
          }
        }
      } catch (e) {
        console.error("[auth] signOut revoke session:", e);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }): Promise<TokenWithSession> {
      const now = Date.now();
      const t = token as TokenWithSession;
      const { createAuthSession, getValidAuthSession } = await import("@/lib/auth/auth-sessions-db");

      if (user) {
        const u = user as {
          id: string;
          role: UserRole;
          email?: string | null;
          name?: string | null;
          image?: string | null;
        };
        const row = await createAuthSession(u.id);
        return {
          ...t,
          sub: u.id,
          id: u.id,
          email: u.email,
          name: u.name,
          picture: u.image,
          role: u.role,
          sessionId: row.id,
          accessTokenExpires: now + ACCESS_TOKEN_MS,
          refreshTokenExpires: row.expiresAt.getTime(),
          error: undefined,
        };
      }

      if (t.error === "RefreshTokenExpired") {
        return { ...t };
      }

      if (t.sub && typeof t.sessionId !== "string") {
        const row = await createAuthSession(t.sub);
        return {
          ...t,
          sessionId: row.id,
          accessTokenExpires: now + ACCESS_TOKEN_MS,
          refreshTokenExpires: row.expiresAt.getTime(),
        };
      }

      if (typeof t.sessionId === "string" && t.sub) {
        const row = await getValidAuthSession(t.sessionId, t.sub);
        if (!row) {
          return { ...t, error: "RefreshTokenExpired" as const };
        }
        const refreshCap = row.expiresAt.getTime();
        if (now > refreshCap) {
          return { ...t, error: "RefreshTokenExpired" as const };
        }

        const at = t.accessTokenExpires;

        if (typeof at === "number" && now > at && now <= refreshCap) {
          const newAccess = Math.min(now + ACCESS_TOKEN_MS, refreshCap);
          return {
            ...t,
            accessTokenExpires: newAccess,
            refreshTokenExpires: refreshCap,
            error: undefined,
          };
        }
        if (typeof at !== "number") {
          return {
            ...t,
            accessTokenExpires: Math.min(now + ACCESS_TOKEN_MS, refreshCap),
            refreshTokenExpires: refreshCap,
          };
        }
        return { ...t, refreshTokenExpires: refreshCap };
      }

      return t;
    },
    session({ session, token }): Session {
      const t = token as TokenWithSession;
      if (t.error === "RefreshTokenExpired") {
        return { ...session, user: null as unknown as Session["user"], error: "RefreshTokenExpired" as const };
      }
      if (typeof t.refreshTokenExpires === "number" && Date.now() > t.refreshTokenExpires) {
        return { ...session, user: null as unknown as Session["user"], error: "RefreshTokenExpired" as const };
      }

      if (session.user && typeof t.id === "string") {
        session.user.id = t.id;
        session.user.role = t.role === "super_admin" || t.role === "user" ? t.role : "user";
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;
        try {
          const { verifyCredentials } = await import("@/lib/auth/verify-credentials");
          return await verifyCredentials(email, password);
        } catch (e) {
          console.error("[auth] Credentials authorize error:", e);
          return null;
        }
      },
    }),
  ],
});
