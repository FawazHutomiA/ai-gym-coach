export const WORKOUT_HISTORY_DAY_OPTIONS = [30, 90, 120, 365] as const;

export type WorkoutHistoryDays = (typeof WORKOUT_HISTORY_DAY_OPTIONS)[number];

export function parseWorkoutHistoryDays(
  raw: string | string[] | undefined,
): WorkoutHistoryDays {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(s);
  if (WORKOUT_HISTORY_DAY_OPTIONS.includes(n as WorkoutHistoryDays)) {
    return n as WorkoutHistoryDays;
  }
  return 120;
}
