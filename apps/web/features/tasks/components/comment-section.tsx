"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import { useTaskComments, useAddComment } from "@/hooks/use-task-comments";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CommentSection({ taskId }: { taskId: string }) {
  const { data, isLoading, isError, refetch } = useTaskComments(taskId);
  const addComment = useAddComment(taskId);
  const [content, setContent] = useState("");

  const comments = data?.data ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = content.trim();
    if (!value) return;
    await addComment.mutateAsync(value);
    setContent("");
  };

  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <h2 className="mb-4 text-sm font-semibold">Komentar</h2>

      <form onSubmit={handleSubmit} className="mb-5 space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis komentar…"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={addComment.isPending || !content.trim()}
          >
            {addComment.isPending ? "Mengirim…" : "Kirim"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <LoadingState label="Memuat komentar…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat komentar." onRetry={() => refetch()} />
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Belum ada komentar.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {initials(c.author.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground/90">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
