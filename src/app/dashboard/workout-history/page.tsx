import { format, subDays } from "date-fns";
import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getWorkoutHistorySessions } from "@/lib/data/workout-queries";
import { sessionCalendarDateKey } from "@/lib/workout-date-key";
import { resolveWorkoutHistoryDateRange } from "@/lib/workout-history-filters";
import { WORKOUT_HISTORY_FETCH_LOOKBACK_DAYS } from "@/lib/workout-history-constants";
import { WorkoutHistoryContent } from "@/sections/dashboard/workout-history-content";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{
    days?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

function hasDaysInUrl(sp: { days?: string }): boolean {
  const d = sp.days;
  if (d == null) return false;
  const s = Array.isArray(d) ? d[0] : d;
  return String(s).trim() !== "";
}

export default async function WorkoutHistoryPage({ searchParams }: PageProps) {
  await assertAppFeature("feature.log_workout");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const sp = await searchParams;
  const lookback = WORKOUT_HISTORY_FETCH_LOOKBACK_DAYS;
  const todayYmd = format(new Date(), "yyyy-MM-dd");
  const minYmd = format(subDays(new Date(), lookback), "yyyy-MM-dd");

  const range = resolveWorkoutHistoryDateRange(sp, {
    minYmd,
    maxYmd: todayYmd,
    fallbackYmd: todayYmd,
  });
  if (range.shouldRedirect) {
    const qs = new URLSearchParams(range.canonicalQuery);
    redirect(`/dashboard/workout-history?${qs.toString()}`);
  }

  const { from: dateFrom, to: dateTo } = range;

  if (hasDaysInUrl(sp)) {
    const qs = new URLSearchParams();
    qs.set("dateFrom", dateFrom);
    qs.set("dateTo", dateTo);
    redirect(`/dashboard/workout-history?${qs.toString()}`);
  }

  const result = await getWorkoutHistorySessions(session.user.id, lookback);
  if (Array.isArray(result)) {
    const sessionsInDateRange = result.filter((row) => {
      const k = sessionCalendarDateKey(row.session.loggedAt);
      return k >= dateFrom && k <= dateTo;
    });
    return (
      <WorkoutHistoryContent
        dateFrom={dateFrom}
        dateTo={dateTo}
        minYmd={minYmd}
        maxYmd={todayYmd}
        sessions={result}
        sessionsInDateRange={sessionsInDateRange}
      />
    );
  }
  return (
    <p className="text-destructive text-sm" role="alert">
      {result.error}
    </p>
  );
}
