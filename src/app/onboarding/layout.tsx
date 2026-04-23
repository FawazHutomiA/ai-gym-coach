import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role === "super_admin") {
    redirect("/admin/users");
  }
  return children;
}
