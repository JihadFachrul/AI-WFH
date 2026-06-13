import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  isLoading?: boolean;
}

/**
 * Kartu metrik gaya SaaS: kartu putih, label, ikon dalam chip lembut, dan
 * angka besar (font display). Hover memunculkan shadow + aksen brand halus.
 */
export function StatCard({ label, value, icon: Icon, isLoading }: Props) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-[18px]" />
        </span>
      </div>

      <p className="mt-4 font-display text-3xl font-bold leading-none tracking-tight tabular-nums text-foreground">
        {isLoading ? (
          <span className="text-muted-foreground/40">—</span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
