import { getAdminUsersList } from "@/lib/data/admin-lists";
import { AdminUsersPage } from "@/sections/admin/admin-users-page";

export default async function Page() {
  const users = await getAdminUsersList();
  return <AdminUsersPage initialUsers={users} />;
}
