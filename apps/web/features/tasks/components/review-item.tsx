"use client";

import { CheckCircle2Icon, RotateCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskReview } from "@/types/review";

/** Satu entri pada riwayat review (gaya PR review). */
export function ReviewItem({
  review,
  isLast,
}: {
  review: TaskReview;
  isLast: boolean;
}) {
  const approved = review.decision === "APPROVED";

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-[15px] top-9 bottom-0 w-px bg-border"
          aria-hidden
        />
      )}

      <span
        className={cn(
          "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
          approved
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700",
        )}
        aria-hidden
      >
        {approved ? (
          <CheckCircle2Icon className="size-4" />
        ) : (
          <RotateCcwIcon className="size-4" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              approved ? "text-emerald-700" : "text-amber-700",
            )}
          >
            {approved ? "Approved" : "Revision Requested"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          oleh {review.reviewer.name}
        </p>
        <p className="mt-1 text-sm text-foreground/90">{review.note}</p>
      </div>
    </li>
  );
}
