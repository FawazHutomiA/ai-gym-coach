import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { userHasPermission } from "@/lib/auth/permissions";
import { AdminShell } from "@/sections/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (session.user.role !== "super_admin") {
    redirect("/admin/forbidden");
  }
  const ok = await userHasPermission(session.user.role, "admin.manage_users");
  if (!ok) {
    redirect("/admin/forbidden");
  }

  return <AdminShell>{children}</AdminShell>;
}
