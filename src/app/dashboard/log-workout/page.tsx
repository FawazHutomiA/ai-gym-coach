import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getActiveExercisesCatalog } from "@/lib/data/exercises-catalog";
import { getRecentWorkoutSessionsDetailed } from "@/lib/data/workout-queries";
import { LogWorkoutPageContent } from "@/sections/dashboard/log-workout-page-content";
import { redirect } from "next/navigation";

export default async function LogWorkoutPage() {
  await assertAppFeature("feature.log_workout");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const [exerciseCatalog, recentResult] = await Promise.all([
    getActiveExercisesCatalog(),
    getRecentWorkoutSessionsDetailed(session.user.id, 30),
  ]);
  if (!Array.isArray(recentResult)) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {recentResult.error}
      </p>
    );
  }
  return (
    <LogWorkoutPageContent exerciseCatalog={exerciseCatalog} recentSessions={recentResult} />
  );
}
