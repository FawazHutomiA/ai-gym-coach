export const USER_ROLES = ["user", "super_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(v: string): v is UserRole {
  return USER_ROLES.includes(v as UserRole);
}
