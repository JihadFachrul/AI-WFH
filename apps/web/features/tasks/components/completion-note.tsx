"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCompletionNote } from "@/hooks/use-completion-note";

interface Props {
  taskId: string;
  initialNote: string | null;
  completedAt: string | null;
  /** Hanya assignee/admin yang boleh menyunting (selain itu read-only). */
  canEdit: boolean;
}

export function CompletionNote({
  taskId,
  initialNote,
  completedAt,
  canEdit,
}: Props) {
  const mutation = useCompletionNote(taskId);
  const [note, setNote] = useState(initialNote ?? "");

  if (!canEdit) {
    return (
      <div>
        <h3 className="mb-2 text-sm font-semibold">Completion Note</h3>
        {initialNote ? (
          <p className="text-sm text-foreground/90">{initialNote}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Belum ada completion note.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Completion Note</h3>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jelaskan ringkas pekerjaan yang telah diselesaikan…"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button
          size="sm"
          onClick={() => mutation.mutate(note)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Menyimpan…" : "Simpan Note"}
        </Button>
        {completedAt && (
          <span className="text-xs text-muted-foreground">
            Ditandai selesai: {new Date(completedAt).toLocaleString()}
          </span>
        )}
        {mutation.isError && (
          <span className="text-xs text-destructive">Gagal menyimpan.</span>
        )}
      </div>
    </div>
  );
}
