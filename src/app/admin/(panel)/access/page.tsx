import { redirect } from "next/navigation";

/** Matriks permission tidak dipakai di UI; super_admin hanya kelola pengguna. */
export default function Page() {
  redirect("/admin/users");
}
