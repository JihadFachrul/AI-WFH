"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2Icon, RotateCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateReview } from "@/hooks/use-task-reviews";
import type { ReviewDecision } from "@/types/review";

/** Form keputusan manager: Approve / Request Revision + catatan. */
export function ReviewForm({ taskId }: { taskId: string }) {
  const createReview = useCreateReview(taskId);
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!decision) {
      setError("Pilih keputusan: Approve atau Request Revision.");
      return;
    }
    if (note.trim().length < 10) {
      setError("Catatan review minimal 10 karakter.");
      return;
    }
    setError(null);
    await createReview.mutateAsync({ decision, note: note.trim() });
    setDecision(null);
    setNote("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="space-y-1.5">
        <span className="text-sm font-medium">Decision</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDecision("APPROVED")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              decision === "APPROVED"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-border hover:bg-muted",
            )}
          >
            <CheckCircle2Icon className="size-4" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setDecision("REVISION")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              decision === "REVISION"
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-border hover:bg-muted",
            )}
          >
            <RotateCcwIcon className="size-4" />
            Request Revision
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-note" className="text-sm font-medium">
          Review Note
        </label>
        <Textarea
          id="review-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan untuk employee (minimal 10 karakter)…"
        />
      </div>

      {(error || createReview.isError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {error ?? "Gagal mengirim review. Coba lagi."}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="sm" disabled={createReview.isPending}>
        {createReview.isPending ? "Mengirim…" : "Submit Review"}
      </Button>
    </form>
  );
}
