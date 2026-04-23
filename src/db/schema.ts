import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Akun login (Auth.js Credentials) */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  /** `super_admin` | `user` */
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Profil fitness 1:1 dengan user (bukan kredensial login).
 * `users.name` dipakai sebagai nama tampilan utama; baris ini untuk preferensi & metrik form.
 */
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone").notNull().default(""),
  goal: text("goal").notNull().default("maintenance"),
  bio: text("bio").notNull().default(""),
  heightCm: text("height_cm").notNull().default(""),
  weightKg: text("weight_kg").notNull().default(""),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Daftar hak akses (permission) — bisa dikaitkan ke role lewat `role_permissions`. */
export const permissions = pgTable("permissions", {
  key: text("key").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelId: text("label_id").notNull(),
});

/** Mapping role → permission. */
export const rolePermissions = pgTable(
  "role_permissions",
  {
    role: text("role").notNull(),
    permissionKey: text("permission_key")
      .notNull()
      .references(() => permissions.key, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.role, t.permissionKey] }),
  }),
);

/** Riwayat berat untuk grafik progres (boleh banyak entri per user). */
export const bodyMetricEntries = pgTable("body_metric_entries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recordedAt: timestamp("recorded_at", { mode: "date" }).defaultNow().notNull(),
  weightKg: real("weight_kg").notNull(),
});

/**
 * Katalog gerakan (CRUD admin). `workout_exercises.catalog_exercise_id` → baris ini.
 */
export const exercises = pgTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  labelEn: text("label_en").notNull(),
  labelId: text("label_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  /** Untuk backfill dari log lama (`workout_exercises.exercise_key` bekas i18n). */
  migrationKey: text("migration_key").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Satu kali sesi log latihan di gym. */
export const workoutSessions = pgTable("workout_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  loggedAt: timestamp("logged_at", { mode: "date" }).defaultNow().notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id")
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  /** Referensi katalog (wajib untuk log baru). */
  catalogExerciseId: text("catalog_exercise_id").references(() => exercises.id, { onDelete: "restrict" }),
  /** Snapshot / legacy: kunci lama atau slug; tetap diisi untuk kompatibilitas. */
  exerciseKey: text("exercise_key").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workoutSets = pgTable("workout_sets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  setIndex: integer("set_index").notNull(),
  weightKg: real("weight_kg"),
  reps: integer("reps"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  bodyMetrics: many(bodyMetricEntries),
  workoutSessions: many(workoutSessions),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  permission: one(permissions, {
    fields: [rolePermissions.permissionKey],
    references: [permissions.key],
  }),
}));

export const bodyMetricEntriesRelations = relations(bodyMetricEntries, ({ one }) => ({
  user: one(users, {
    fields: [bodyMetricEntries.userId],
    references: [users.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutLines: many(workoutExercises),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutSessions.userId],
    references: [users.id],
  }),
  exercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  session: one(workoutSessions, {
    fields: [workoutExercises.sessionId],
    references: [workoutSessions.id],
  }),
  catalogExercise: one(exercises, {
    fields: [workoutExercises.catalogExerciseId],
    references: [exercises.id],
  }),
  sets: many(workoutSets),
}));

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  exercise: one(workoutExercises, {
    fields: [workoutSets.exerciseId],
    references: [workoutExercises.id],
  }),
}));

/** Satu objek untuk Drizzle `schema` (tabel + relasi). */
export const dbSchema = {
  users,
  userProfiles,
  permissions,
  rolePermissions,
  bodyMetricEntries,
  exercises,
  workoutSessions,
  workoutExercises,
  workoutSets,
  usersRelations,
  userProfilesRelations,
  permissionsRelations,
  rolePermissionsRelations,
  bodyMetricEntriesRelations,
  exercisesRelations,
  workoutSessionsRelations,
  workoutExercisesRelations,
  workoutSetsRelations,
};

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
