import {
  ListChecksIcon,
  UsersIcon,
  GaugeIcon,
  ClipboardCheckIcon,
} from "lucide-react";

const STATS = [
  { label: "Active Tasks", value: "24", icon: ListChecksIcon },
  { label: "Team Online", value: "8/12", icon: UsersIcon },
  { label: "Avg KPI", value: "78.4", icon: GaugeIcon },
];

const ROWS = [
  { t: "Q4 Market Analysis", who: "SJ", st: "IN_PROGRESS", w: "65%" },
  { t: "Onboarding Flow", who: "MR", st: "REVIEW", w: "90%" },
  { t: "Database Migration", who: "DT", st: "DONE", w: "100%" },
];

const ST_STYLE: Record<string, string> = {
  IN_PROGRESS: "bg-secondary text-secondary-foreground",
  REVIEW: "bg-amber-100 text-amber-800",
  DONE: "bg-primary text-primary-foreground",
};

/** Mock preview dashboard AWOS untuk hero (statis, ilustrasi). */
export function ProductPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-primary/10">
      {/* chrome */}
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="size-2.5 rounded-full bg-destructive/40" />
        <span className="size-2.5 rounded-full bg-amber-400/50" />
        <span className="size-2.5 rounded-full bg-emerald-400/50" />
        <span className="ml-2 text-[11px] text-muted-foreground">
          app.awos.id/dashboard
        </span>
      </div>

      <div className="rounded-xl bg-background p-3">
        {/* stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-card p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {s.label}
                  </span>
                  <Icon className="size-3.5 text-primary" />
                </div>
                <p className="mt-1 font-display text-lg font-bold tabular-nums">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* mini task table */}
        <div className="mt-2 overflow-hidden rounded-lg border border-border bg-card">
          {ROWS.map((r, i) => (
            <div
              key={r.t}
              className={`flex items-center gap-2 px-2.5 py-2 text-[11px] ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground">
                {r.who}
              </span>
              <span className="flex-1 truncate font-medium">{r.t}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${ST_STYLE[r.st]}`}
              >
                {r.st}
              </span>
              <span className="hidden w-12 sm:block">
                <span className="block h-1.5 rounded-full bg-muted">
                  <span
                    className="block h-1.5 rounded-full bg-primary"
                    style={{ width: r.w }}
                  />
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* activity */}
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
          <ClipboardCheckIcon className="size-4 text-primary" />
          <span className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Rina</span> upload
            evidence untuk Task #42 · 10m lalu
          </span>
        </div>
      </div>
    </div>
  );
}
