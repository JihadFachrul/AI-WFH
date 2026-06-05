import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  isLoading?: boolean;
}

/** Kartu angka tunggal (count operasional). */
export function StatCard({ label, value, icon: Icon, isLoading }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums">
            {isLoading ? "…" : value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
