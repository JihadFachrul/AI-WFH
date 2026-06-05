import { cn } from "@/lib/utils";

export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-600",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-slate-400",
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
