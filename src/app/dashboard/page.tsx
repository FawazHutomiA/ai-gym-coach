import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { DashboardHome } from "@/sections/dashboard/home";

export default async function DashboardPage() {
  await assertAppFeature("feature.dashboard");
  return <DashboardHome />;
}
