/** Setelah login sukses: super_admin hanya panel admin; user biasa ke app. */
export function postSignInPathForRole(role: string | undefined): "/admin/users" | "/dashboard" {
  return role === "super_admin" ? "/admin/users" : "/dashboard";
}
