"use client";

import { useRef, useState, type FormEvent } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUploadEvidence } from "@/hooks/use-task-evidence";

/** Upload evidence sederhana (input file biasa, bukan drag&drop). */
export function EvidenceUpload({ taskId }: { taskId: string }) {
  const upload = useUploadEvidence(taskId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await upload.mutateAsync({ file, description: description.trim() || undefined });
    setFile(null);
    setDescription("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-dashed border-border p-3">
      <input
        ref={fileRef}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi evidence (opsional)"
        className="min-h-16"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={!file || upload.isPending}>
          <UploadIcon className="size-4" />
          {upload.isPending ? "Mengunggah…" : "Upload Evidence"}
        </Button>
        {upload.isError && (
          <span className="text-xs text-destructive">
            Gagal mengunggah evidence.
          </span>
        )}
      </div>
    </form>
  );
}
