import type { UserRole } from "@/types/auth";

/** Role yang boleh membuat/assign/menghapus task (selaras backend). */
export const PRIVILEGED_ROLES: UserRole[] = [
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

export function isPrivileged(role?: UserRole | null): boolean {
  return !!role && PRIVILEGED_ROLES.includes(role);
}

/** Role yang boleh create/edit/delete department. */
export const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export function isAdmin(role?: UserRole | null): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
