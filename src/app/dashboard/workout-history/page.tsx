import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { WorkoutHistoryContent } from "@/sections/dashboard/workout-history-content";

export default async function WorkoutHistoryPage() {
  await assertAppFeature("feature.log_workout");
  return <WorkoutHistoryContent />;
}
