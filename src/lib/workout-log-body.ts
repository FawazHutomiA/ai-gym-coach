import { z } from "zod";

export const workoutSetSchema = z.object({
  weight: z.string().optional(),
  reps: z.string().optional(),
});

export const workoutExerciseSchema = z.object({
  catalogExerciseId: z.string().uuid(),
  sets: z.array(workoutSetSchema).min(1),
});

export const workoutUpsertBodySchema = z.object({
  title: z.string().trim().max(120).default(""),
  loggedAt: z
    .string()
    .optional()
    .refine((s) => !s || !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  exercises: z.array(workoutExerciseSchema).min(1),
});

export type WorkoutUpsertBody = z.infer<typeof workoutUpsertBodySchema>;

export function parseWeightKg(s: string | undefined): number | null {
  if (s === undefined || s.trim() === "") return null;
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function parseRepsInt(s: string | undefined): number | null {
  if (s === undefined || s.trim() === "") return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

export function normalizeSessionTitle(title: string | undefined) {
  const t = title?.trim();
  return t ? t : null;
}
