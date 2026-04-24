import { format, isValid, parse, subDays } from "date-fns";
import { WORKOUT_HISTORY_DEFAULT_CHART_DAYS } from "@/lib/workout-history-constants";

const YMD = /^\d{4}-\d{2}-\d{2}$/;

function first(raw: string | string[] | undefined): string | undefined {
  if (raw == null) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Param `date` (yyyy-MM-dd) di URL. Jika tidak valid, kembalikan `fallback`.
 */
export function parseWorkoutHistoryDateParam(
  raw: string | string[] | undefined,
  fallback: string,
): string {
  const s = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  if (!YMD.test(s)) return fallback;
  const d = parse(s, "yyyy-MM-dd", new Date());
  if (!isValid(d)) return fallback;
  return s;
}

/** Batasi yyyy-MM-dd ke [minYmd, maxYmd] (inklusif) — cocok untuk string ISO tanggal. */
export function clampYmd(ymd: string, minYmd: string, maxYmd: string): string {
  if (ymd < minYmd) return minYmd;
  if (ymd > maxYmd) return maxYmd;
  return ymd;
}

export type WorkoutHistorySearchParams = {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
};

type ResolveRangeOptions = {
  minYmd: string;
  maxYmd: string;
  fallbackYmd: string;
};

/**
 * Baca `dateFrom` + `dateTo` (opsional: legacy `date` = satu hari, from=to).
 * Selalu clamp ke [minYmd, maxYmd] dan tukar jika from > to.
 */
export function resolveWorkoutHistoryDateRange(
  sp: WorkoutHistorySearchParams,
  options: ResolveRangeOptions,
): { from: string; to: string; shouldRedirect: boolean; canonicalQuery: string } {
  const { minYmd, maxYmd, fallbackYmd } = options;
  const fromRaw = first(sp.dateFrom)?.trim();
  const toRaw = first(sp.dateTo)?.trim();
  const legacy = first(sp.date)?.trim();
  const hasFrom = fromRaw != null && fromRaw !== "";
  const hasTo = toRaw != null && toRaw !== "";
  const hasLegacy = legacy != null && legacy !== "";

  let a: string;
  let b: string;

  if (hasFrom && hasTo) {
    a = parseWorkoutHistoryDateParam(fromRaw, fallbackYmd);
    b = parseWorkoutHistoryDateParam(toRaw, fallbackYmd);
  } else if (hasFrom) {
    a = parseWorkoutHistoryDateParam(fromRaw, fallbackYmd);
    b = a;
  } else if (hasTo) {
    b = parseWorkoutHistoryDateParam(toRaw, fallbackYmd);
    a = b;
  } else if (hasLegacy) {
    const d = parseWorkoutHistoryDateParam(legacy, fallbackYmd);
    a = d;
    b = d;
  } else {
    // Default: 7 hari (inklusif) terakhir ke hari ini
    const t = parse(fallbackYmd, "yyyy-MM-dd", new Date());
    a = format(subDays(t, WORKOUT_HISTORY_DEFAULT_CHART_DAYS - 1), "yyyy-MM-dd");
    b = fallbackYmd;
  }

  a = clampYmd(a, minYmd, maxYmd);
  b = clampYmd(b, minYmd, maxYmd);
  if (a > b) {
    [a, b] = [b, a];
  }

  const canonicalQuery = `dateFrom=${a}&dateTo=${b}`;

  // Redirect: legacy `date`, hanya from atau hanya to, klamp/urutan diperbaiki, atau nilai disamakan
  const shouldRedirect =
    hasLegacy ||
    !hasFrom ||
    !hasTo ||
    (hasFrom && fromRaw !== a) ||
    (hasTo && toRaw !== b);

  return { from: a, to: b, shouldRedirect, canonicalQuery };
}

/**
 * Untuk API: rentang [from, to] jika ada `date` / `dateFrom` / `dateTo`,
 * atau `null` bila tak ada param tanggal (pakai full lookback, tanpa filter hari).
 */
export function getWorkoutHistoryDateRangeFromQuery(
  sp: { dateFrom?: string | null; dateTo?: string | null; date?: string | null },
  options: ResolveRangeOptions,
): { from: string; to: string } | null {
  const { minYmd, maxYmd, fallbackYmd } = options;
  const fromQ = (sp.dateFrom ?? undefined)?.trim();
  const toQ = (sp.dateTo ?? undefined)?.trim();
  const leg = (sp.date ?? undefined)?.trim();
  const hasFrom = fromQ != null && fromQ !== "";
  const hasTo = toQ != null && toQ !== "";
  const hasLeg = leg != null && leg !== "";
  if (!hasFrom && !hasTo && !hasLeg) return null;

  const r = resolveWorkoutHistoryDateRange(
    { dateFrom: fromQ, dateTo: toQ, date: leg },
    options,
  );
  return { from: r.from, to: r.to };
}
