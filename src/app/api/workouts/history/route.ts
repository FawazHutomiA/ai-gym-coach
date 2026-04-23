import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { getWorkoutHistorySessions } from "@/lib/data/workout-queries";
import { requireAppFeature } from "@/lib/auth/require-app-feature";

/**
 * Sesi log dalam jangka waktu (default 120 hari), dengan detail penuh — untuk history per tanggal & grafik.
 * Query: `days` = panjang hari ke belakang (1–730).
 */
export async function GET(req: Request) {
  const guard = await requireAppFeature("feature.log_workout");
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const daysRaw = parseInt(searchParams.get("days") ?? "120", 10) || 120;
  const days = Math.min(730, Math.max(1, daysRaw));
  const since = subDays(new Date(), days);

  try {
    const result = await getWorkoutHistorySessions(guard.session.user.id, days);
    if (!Array.isArray(result)) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ sessions: result, days, since: since.toISOString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
