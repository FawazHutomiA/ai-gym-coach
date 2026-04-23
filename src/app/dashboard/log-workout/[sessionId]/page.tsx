import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { WorkoutLogger } from "@/sections/dashboard/workout-logger";

type Props = { params: Promise<{ sessionId: string }> };

export default async function EditLoggedWorkoutPage({ params }: Props) {
  await assertAppFeature("feature.log_workout");
  const { sessionId } = await params;
  return <WorkoutLogger sessionId={sessionId} />;
}
