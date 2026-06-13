"use client";

import { FileIcon, Trash2Icon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import { useTaskEvidence, useDeleteEvidence } from "@/hooks/use-task-evidence";
import { FILE_BASE_URL } from "@/services/task-evidence.service";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  taskId: string;
  currentUserId?: string;
  isAdmin: boolean;
}

export function EvidenceList({ taskId, currentUserId, isAdmin }: Props) {
  const { data, isLoading, isError, refetch } = useTaskEvidence(taskId);
  const deleteEvidence = useDeleteEvidence(taskId);

  const evidences = data ?? [];

  if (isLoading) return <LoadingState label="Memuat evidence…" />;
  if (isError)
    return <ErrorState label="Gagal memuat evidence." onRetry={() => refetch()} />;
  if (evidences.length === 0)
    return (
      <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
        Belum ada evidence yang diunggah.
      </p>
    );

  return (
    <ul className="space-y-2">
      {evidences.map((ev) => {
        const canDelete = isAdmin || ev.uploadedById === currentUserId;
        return (
          <li
            key={ev.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <FileIcon className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{ev.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(ev.fileSize)} · {ev.uploadedBy.name} ·{" "}
                {new Date(ev.createdAt).toLocaleDateString()}
              </p>
              {ev.description && (
                <p className="mt-0.5 text-xs text-foreground/80">
                  {ev.description}
                </p>
              )}
            </div>
            <a
              href={`${FILE_BASE_URL}${ev.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="ghost" size="icon-sm" type="button">
                <ExternalLinkIcon className="size-4" />
              </Button>
            </a>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                onClick={() => deleteEvidence.mutate(ev.id)}
                disabled={deleteEvidence.isPending}
                aria-label="Hapus evidence"
              >
                <Trash2Icon className="size-4 text-destructive" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
