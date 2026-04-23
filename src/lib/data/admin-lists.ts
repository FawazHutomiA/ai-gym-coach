import { asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { exercises, users } from "@/db/schema";

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export async function getAdminUsersList(): Promise<AdminUserRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export type AdminExerciseRow = {
  id: string;
  slug: string;
  labelEn: string;
  labelId: string;
  sortOrder: number;
  isActive: boolean;
  migrationKey: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminExercisesList(): Promise<AdminExerciseRow[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(exercises)
    .orderBy(asc(exercises.sortOrder), asc(exercises.slug));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    labelEn: r.labelEn,
    labelId: r.labelId,
    sortOrder: r.sortOrder,
    isActive: r.isActive,
    migrationKey: r.migrationKey,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}
