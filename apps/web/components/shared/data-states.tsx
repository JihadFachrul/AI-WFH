import type { ReactNode } from "react";

/** State loading/empty/error reusable agar konsisten di semua halaman. */

export function LoadingState({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ErrorState({
  label = "Gagal memuat data.",
  onRetry,
}: {
  label?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 py-16 text-sm text-destructive">
      <span>{label}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-destructive/30 px-3 py-1 text-xs font-medium hover:bg-destructive/10"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Belum ada data",
  description,
  icon,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-16 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
