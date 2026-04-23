import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardLayout } from "@/sections/dashboard/layout";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  if (session.user.role === "super_admin") {
    redirect("/admin/users");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
