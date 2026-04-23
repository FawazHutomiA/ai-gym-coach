import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getWorkoutHistorySessions } from "@/lib/data/workout-queries";
import { parseWorkoutHistoryDays } from "@/lib/workout-history-days";
import { WorkoutHistoryContent } from "@/sections/dashboard/workout-history-content";
import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<{ days?: string }> };

export default async function WorkoutHistoryPage({ searchParams }: PageProps) {
  await assertAppFeature("feature.log_workout");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const sp = await searchParams;
  const days = parseWorkoutHistoryDays(sp.days);
  const result = await getWorkoutHistorySessions(session.user.id, days);
  if (Array.isArray(result)) {
    return <WorkoutHistoryContent days={days} sessions={result} />;
  }
  return (
    <p className="text-destructive text-sm" role="alert">
      {result.error}
    </p>
  );
}
