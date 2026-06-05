import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const ROLE_STYLES: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-indigo-100 text-indigo-700",
  ADMIN: "bg-violet-100 text-violet-700",
  MANAGER: "bg-sky-100 text-sky-700",
  EMPLOYEE: "bg-slate-100 text-slate-700",
};

const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        ROLE_STYLES[role],
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}
