import { userHasPermission } from "@/lib/auth/permissions";

/** Hak akses per area aplikasi (role `user` — di DB per baris). */
export const APP_FEATURE_KEYS = [
  "feature.dashboard",
  "feature.profile",
  "feature.workouts",
  "feature.log_workout",
  "feature.adjustment",
  "feature.nutrition",
] as const;

export type AppFeatureKey = (typeof APP_FEATURE_KEYS)[number];

/** Akses fitur app hanya lewat `feature.*` di DB (super_admin tidak pakai app user). */
export async function userHasAppFeature(role: string, featureKey: string): Promise<boolean> {
  return userHasPermission(role, featureKey);
}
