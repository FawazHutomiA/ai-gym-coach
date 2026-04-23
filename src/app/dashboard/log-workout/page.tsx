import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { LogWorkoutPageContent } from "@/sections/dashboard/log-workout-page-content";

export default async function LogWorkoutPage() {
  await assertAppFeature("feature.log_workout");
  return <LogWorkoutPageContent />;
}
