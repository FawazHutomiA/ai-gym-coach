import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { WorkoutSessionDetailView } from "@/sections/dashboard/workout-session-detail-view";

type Props = { params: Promise<{ sessionId: string }> };

export default async function WorkoutSessionDetailPage({ params }: Props) {
  await assertAppFeature("feature.log_workout");
  const { sessionId } = await params;
  return <WorkoutSessionDetailView sessionId={sessionId} />;
}
