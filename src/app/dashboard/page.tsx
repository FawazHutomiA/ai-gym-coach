import { auth } from "@/auth";
import { assertAppFeature } from "@/lib/auth/assert-app-feature";
import { getDashboardPayload } from "@/lib/data/dashboard-payload";
import { DashboardHome } from "@/sections/dashboard/home";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  await assertAppFeature("feature.dashboard");
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const data = await getDashboardPayload(session.user.id, session.user.name ?? "");
  return <DashboardHome data={data} />;
}
