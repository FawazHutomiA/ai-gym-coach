import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { NutritionTracker } from "@/sections/dashboard/nutrition-tracker";

export default async function NutritionPage() {
  await assertAppFeature("feature.nutrition");
  return <NutritionTracker />;
}
