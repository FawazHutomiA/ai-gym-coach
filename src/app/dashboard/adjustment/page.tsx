import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { WeeklyAdjustment } from "@/sections/dashboard/weekly-adjustment";

export default async function AdjustmentPage() {
  await assertAppFeature("feature.adjustment");
  return <WeeklyAdjustment />;
}
