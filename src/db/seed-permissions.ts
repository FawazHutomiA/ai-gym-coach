/**
 * Jalankan setelah `bun run db:push`:
 *   bun run db:seed
 *
 * - user: semua `feature.*` (akses penuh ke fitur app; ke depan bisa dicabut per user lewat DB).
 * - super_admin: hanya `admin.manage_users` (panel admin terpisah; tanpa fitur app user).
 * - Akun super_admin@gmail.com dijamin ada (password: env atau default dev).
 * - Semua user lain dengan role super_admin dikembalikan ke user (satu akun admin khusus).
 */
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { hashPassword } from "@/lib/password";
import { getDb } from "./index";
import { permissions, rolePermissions, users } from "./schema";
import { APP_FEATURE_KEYS } from "@/lib/auth/app-features";
import { SUPER_ADMIN_ACCOUNT_EMAIL } from "@/lib/auth/super-admin-account";
import { seedExercisesAndBackfill } from "./seed-exercises";

type SeedPerm = { key: string; labelEn: string; labelId: string };

const FEATURE_PERM_ROWS: SeedPerm[] = APP_FEATURE_KEYS.map((key) => {
  const short = key.replace("feature.", "");
  return {
    key,
    labelEn: `Feature: ${short}`,
    labelId: `Fitur: ${short}`,
  };
});

const FIXED: SeedPerm[] = [
  ...FEATURE_PERM_ROWS,
  {
    key: "admin.manage_users",
    labelEn: "Manage users (admin)",
    labelId: "Kelola pengguna (admin)",
  },
];

const OBSOLETE_PERMISSION_KEYS = [
  "app.use",
  "admin.access",
  "admin.users.read",
  "admin.users.write",
  "admin.roles.read",
  "admin.roles.write",
] as const;

const USER_PERMISSION_KEYS = [...APP_FEATURE_KEYS] as const;
const SUPER_ADMIN_PERMISSION_KEYS = ["admin.manage_users"] as const;

const DEFAULT_SUPER_ADMIN_PASSWORD = "admin123";

export async function seedPermissionsAndRoles() {
  const db = getDb();

  await db.delete(rolePermissions).where(inArray(rolePermissions.permissionKey, [...OBSOLETE_PERMISSION_KEYS]));
  await db.delete(permissions).where(inArray(permissions.key, [...OBSOLETE_PERMISSION_KEYS]));

  for (const p of FIXED) {
    await db
      .insert(permissions)
      .values({
        key: p.key,
        labelEn: p.labelEn,
        labelId: p.labelId,
      })
      .onConflictDoNothing();
  }

  for (const key of USER_PERMISSION_KEYS) {
    await db
      .insert(rolePermissions)
      .values({ role: "user", permissionKey: key })
      .onConflictDoNothing();
  }

  for (const key of SUPER_ADMIN_PERMISSION_KEYS) {
    await db
      .insert(rolePermissions)
      .values({ role: "super_admin", permissionKey: key })
      .onConflictDoNothing();
  }

  await db
    .delete(rolePermissions)
    .where(
      and(eq(rolePermissions.role, "user"), notInArray(rolePermissions.permissionKey, [...USER_PERMISSION_KEYS])),
    );

  await db
    .delete(rolePermissions)
    .where(
      and(
        eq(rolePermissions.role, "super_admin"),
        notInArray(rolePermissions.permissionKey, [...SUPER_ADMIN_PERMISSION_KEYS]),
      ),
    );
}

export async function seedSuperAdminAccount() {
  const db = getDb();
  const passwordPlain = process.env.SUPER_ADMIN_SEED_PASSWORD ?? DEFAULT_SUPER_ADMIN_PASSWORD;
  const passwordHash = await hashPassword(passwordPlain);

  await db.update(users).set({ role: "user" }).where(eq(users.role, "super_admin"));

  const normalized = SUPER_ADMIN_ACCOUNT_EMAIL.toLowerCase();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      email: normalized,
      name: "Super Admin",
      passwordHash,
      role: "super_admin",
    });
  } else {
    await db
      .update(users)
      .set({
        role: "super_admin",
        passwordHash,
        name: "Super Admin",
      })
      .where(eq(users.email, normalized));
  }
}

async function main() {
  await seedPermissionsAndRoles();
  await seedSuperAdminAccount();
  await seedExercisesAndBackfill();
  console.log("db:seed — permissions, super_admin, exercises & backfill OK");
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
