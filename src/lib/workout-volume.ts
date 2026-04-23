import type { WorkoutSessionDetailResponse } from "@/lib/workout-session-to-detail-json";

function parseWeightReps(w: string, r: string) {
  const weight = parseFloat(String(w).replace(",", ".").trim());
  const reps = parseInt(String(r).trim(), 10);
  if (Number.isNaN(weight) || Number.isNaN(reps) || weight <= 0 || reps <= 0) return 0;
  return weight * reps;
}

/** Volume (kg) for one set: weight × reps. */
export function setVolumeKg(weight: string, reps: string): number {
  return parseWeightReps(weight, reps);
}

/** Total training volume (kg) for a logged session. */
export function sessionVolumeKg(session: WorkoutSessionDetailResponse): number {
  let v = 0;
  for (const ex of session.exercises) {
    for (const s of ex.sets) {
      v += setVolumeKg(s.weight, s.reps);
    }
  }
  return Math.round(v * 10) / 10;
}

/** Total volume (kg) for one exercise line in a session. */
export function exerciseVolumeInSession(
  ex: WorkoutSessionDetailResponse["exercises"][0],
): number {
  let v = 0;
  for (const s of ex.sets) {
    v += setVolumeKg(s.weight, s.reps);
  }
  return Math.round(v * 10) / 10;
}

/** Best single-set load (weight × reps) in a session for one exercise (proxy for "top set" work). */
export function exerciseBestSetTonnage(
  ex: WorkoutSessionDetailResponse["exercises"][0],
): number {
  let best = 0;
  for (const s of ex.sets) {
    const v = setVolumeKg(s.weight, s.reps);
    if (v > best) best = v;
  }
  return Math.round(best * 10) / 10;
}
