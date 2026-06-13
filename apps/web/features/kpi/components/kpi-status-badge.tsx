import { cn } from "@/lib/utils";
import type { KpiStatus } from "@/types/kpi";

const STYLES: Record<KpiStatus, string> = {
  EXCELLENT: "bg-emerald-100 text-emerald-700",
  GOOD: "bg-indigo-100 text-indigo-700",
  NEEDS_ATTENTION: "bg-amber-100 text-amber-700",
};

const LABEL: Record<KpiStatus, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  NEEDS_ATTENTION: "Needs Attention",
};

export function KpiStatusBadge({ status }: { status: KpiStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STYLES[status],
      )}
    >
      {LABEL[status]}
    </span>
  );
}
