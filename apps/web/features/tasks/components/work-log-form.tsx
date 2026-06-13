"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateWorkLog } from "@/hooks/use-work-logs";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const PROGRESS_OPTIONS = [0, 25, 50, 75, 100];

const schema = z.object({
  activity: z
    .string()
    .min(10, "Aktivitas minimal 10 karakter")
    .max(1000, "Maksimal 1000 karakter"),
  progress: z.string(),
  blocker: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function WorkLogForm({ taskId }: { taskId: string }) {
  const createWorkLog = useCreateWorkLog(taskId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { activity: "", progress: "25", blocker: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await createWorkLog.mutateAsync({
      activity: values.activity,
      progress: Number(values.progress),
      blocker: values.blocker?.trim() || undefined,
    });
    reset({ activity: "", progress: "25", blocker: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="space-y-1.5">
        <label htmlFor="activity" className="text-sm font-medium">
          Aktivitas
        </label>
        <Textarea
          id="activity"
          placeholder="Apa yang Anda kerjakan? (mis. menyelesaikan analisis data cabang)"
          {...register("activity")}
        />
        {errors.activity && (
          <p className="text-xs text-destructive">{errors.activity.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
        <div className="space-y-1.5">
          <label htmlFor="progress" className="text-sm font-medium">
            Progress
          </label>
          <select id="progress" className={SELECT_CLASS} {...register("progress")}>
            {PROGRESS_OPTIONS.map((p) => (
              <option key={p} value={String(p)}>
                {p}%
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="blocker" className="text-sm font-medium">
            Blocker <span className="text-muted-foreground">(opsional)</span>
          </label>
          <Textarea
            id="blocker"
            placeholder="Hambatan, jika ada"
            className="min-h-8"
            {...register("blocker")}
          />
        </div>
      </div>

      {createWorkLog.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Gagal menyimpan progress. Coba lagi.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="sm" disabled={createWorkLog.isPending}>
        <PlusIcon className="size-4" />
        {createWorkLog.isPending ? "Menyimpan…" : "Tambah Progress"}
      </Button>
    </form>
  );
}
