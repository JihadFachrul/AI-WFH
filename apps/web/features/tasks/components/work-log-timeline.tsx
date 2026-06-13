"use client";

import { ActivityIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkLogItem } from "./work-log-item";
import { WorkLogForm } from "./work-log-form";
import { useWorkLogs, useDeleteWorkLog } from "@/hooks/use-work-logs";

interface Props {
  taskId: string;
  currentUserId?: string;
  isAdmin: boolean;
  /** Boleh menambah/menghapus progress (assignee atau admin). */
  canContribute: boolean;
}

export function WorkLogTimeline({
  taskId,
  currentUserId,
  isAdmin,
  canContribute,
}: Props) {
  const { data, isLoading, isError, refetch } = useWorkLogs(taskId);
  const deleteWorkLog = useDeleteWorkLog(taskId);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="mt-1.5 size-2.5 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 py-0.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
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
          <span>Gagal memuat timeline progress.</span>
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

  const workLogs = data ?? [];
  // Timeline urut terbaru di atas → item pertama = progress terkini.
  const isComplete = workLogs[0]?.progress === 100;

  return (
    <div className="space-y-5">
      {canContribute &&
        (isComplete ? (
          <Alert>
            <CheckCircle2Icon className="text-emerald-600" />
            <AlertDescription>
              Progress sudah <span className="font-medium">100%</span>. Task
              dianggap selesai — tidak ada progress baru yang bisa ditambahkan.
            </AlertDescription>
          </Alert>
        ) : (
          <WorkLogForm taskId={taskId} />
        ))}

      {workLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ActivityIcon className="size-5" />
          </div>
          <p className="text-sm font-medium">Belum ada progress yang dicatat</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Mulai dokumentasikan pekerjaan agar manager dapat melihat
            perkembangan task.
          </p>
        </div>
      ) : (
        <ul className="pl-1">
          {workLogs.map((wl, index) => (
            <WorkLogItem
              key={wl.id}
              workLog={wl}
              canDelete={isAdmin || wl.userId === currentUserId}
              onDelete={(id) => deleteWorkLog.mutate(id)}
              isDeleting={deleteWorkLog.isPending}
              isLast={index === workLogs.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
