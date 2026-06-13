"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewItem } from "./review-item";
import { useTaskReviews } from "@/hooks/use-task-reviews";

interface Props {
  taskId: string;
  /** Menentukan pesan empty state. */
  audience: "reviewer" | "employee";
}

export function ReviewHistory({ taskId, audience }: Props) {
  const { data, isLoading, isError, refetch } = useTaskReviews(taskId);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy>
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>Gagal memuat riwayat review.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium underline"
          >
            Coba lagi
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  const reviews = data ?? [];

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
        {audience === "reviewer"
          ? "Task siap direview."
          : "Belum ada review dari manager."}
      </p>
    );
  }

  return (
    <ul className="pl-1">
      {reviews.map((review, index) => (
        <ReviewItem
          key={review.id}
          review={review}
          isLast={index === reviews.length - 1}
        />
      ))}
    </ul>
  );
}
