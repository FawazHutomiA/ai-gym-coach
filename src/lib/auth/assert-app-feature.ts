import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { userHasAppFeature } from "@/lib/auth/app-features";

export async function assertAppFeature(featureKey: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    redirect("/sign-in");
  }
  const ok = await userHasAppFeature(session.user.role, featureKey);
  if (!ok) {
    redirect("/dashboard/forbidden");
  }
}
