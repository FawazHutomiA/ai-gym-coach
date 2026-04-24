import { format, subDays } from "date-fns";
import { NextResponse } from "next/server";
import { getWorkoutHistorySessions } from "@/lib/data/workout-queries";
import { requireAppFeature } from "@/lib/auth/require-app-feature";
import { sessionCalendarDateKey } from "@/lib/workout-date-key";
import { getWorkoutHistoryDateRangeFromQuery } from "@/lib/workout-history-filters";
import { WORKOUT_HISTORY_FETCH_LOOKBACK_DAYS } from "@/lib/workout-history-constants";

/**
 * Sesi log dengan lookback tetap, detail penuh.
 * Query opsional: `dateFrom` + `dateTo` (yyyy-MM-dd), atau `date` = satu hari. Tanpa param tanggal: semua sesi lookback.
 */
export async function GET(req: Request) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const lookback = WORKOUT_HISTORY_FETCH_LOOKBACK_DAYS;
  const since = subDays(new Date(), lookback);
  const todayYmd = format(new Date(), "yyyy-MM-dd");
  const minYmd = format(subDays(new Date(), lookback), "yyyy-MM-dd");

  const range = getWorkoutHistoryDateRangeFromQuery(
    {
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      date: searchParams.get("date"),
    },
    { minYmd, maxYmd: todayYmd, fallbackYmd: todayYmd },
  );

  try {
    const result = await getWorkoutHistorySessions(guard.session.user.id, lookback);
    if (!Array.isArray(result)) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const sessions = range
      ? result.filter((row) => {
          const k = sessionCalendarDateKey(row.session.loggedAt);
          return k >= range.from && k <= range.to;
        })
      : result;
    return NextResponse.json({
      sessions,
      lookbackDays: lookback,
      since: since.toISOString(),
      ...(range ? { dateFrom: range.from, dateTo: range.to } : {}),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
