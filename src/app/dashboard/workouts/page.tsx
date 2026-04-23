import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { WorkoutGenerator } from "@/sections/dashboard/workout-generator";

export default async function WorkoutsPage() {
  await assertAppFeature("feature.workouts");
  return <WorkoutGenerator />;
}
