import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getActiveExercisesCatalog } from "@/lib/data/exercises-catalog";
import { getWorkoutSessionForUser } from "@/lib/data/workout-queries";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";

type Props = { params: Promise<{ sessionId: string }> };

export default async function EditLoggedWorkoutPage({ params }: Props) {
  await assertAppFeature("feature.log_workout");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const { sessionId } = await params;
  const [initialCatalog, detailResult] = await Promise.all([
    getActiveExercisesCatalog(),
    getWorkoutSessionForUser(session.user.id, sessionId),
  ]);
  if (detailResult === "notfound") {
    notFound();
  }
  if (typeof detailResult === "object" && "error" in detailResult) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {detailResult.error}
      </p>
    );
  }
  return (
    <WorkoutLogger
      sessionId={sessionId}
      initialCatalog={initialCatalog}
      initialDetail={detailResult}
    />
  );
}
