import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getWorkoutSessionForUser } from "@/lib/data/workout-queries";
import { WorkoutSessionDetailView } from "@/sections/dashboard/workout-session-detail-view";

type Props = { params: Promise<{ sessionId: string }> };

export default async function WorkoutSessionDetailPage({ params }: Props) {
  await assertAppFeature("feature.log_workout");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const { sessionId } = await params;
  const result = await getWorkoutSessionForUser(session.user.id, sessionId);
  if (result === "notfound") {
    notFound();
  }
  if (typeof result === "object" && "error" in result) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {result.error}
      </p>
    );
  }
  return <WorkoutSessionDetailView data={result} />;
}
