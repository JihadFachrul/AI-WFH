"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

/** Kontrol pagination generik (dipakai tasks, users, departments). */
export function Pagination({ meta, onPageChange, itemLabel = "item" }: Props) {
  const { page, totalPages, total } = meta;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Halaman {page} dari {Math.max(totalPages, 1)} · {total} {itemLabel}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
