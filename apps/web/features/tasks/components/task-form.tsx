"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TaskPriority, TaskStatus } from "@/types/task";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

const taskFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(255),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"]),
  assignedToId: z.string(),
  dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

/** Payload ternormalisasi yang dikirim ke parent (string kosong → undefined). */
export interface TaskFormSubmit {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: string;
  dueDate?: string;
}

interface Props {
  mode: "create" | "edit";
  defaultValues: TaskFormValues;
  users: { id: string; name: string }[];
  canAssign: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: TaskFormSubmit) => void | Promise<void>;
}

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "CANCELLED",
];

export function TaskForm({
  mode,
  defaultValues,
  users,
  canAssign,
  isSubmitting,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const submit = (values: TaskFormValues) => {
    return onSubmit({
      title: values.title,
      description: values.description?.trim() || undefined,
      priority: values.priority,
      status: values.status,
      assignedToId: values.assignedToId || undefined,
      dueDate: values.dueDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Judul
        </label>
        <Input id="title" placeholder="Judul task" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Deskripsi
        </label>
        <Textarea
          id="description"
          placeholder="Deskripsi task (opsional)"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            className={SELECT_CLASS}
            {...register("priority")}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {mode === "edit" && (
          <div className="space-y-1.5">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select id="status" className={SELECT_CLASS} {...register("status")}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="assignedToId" className="text-sm font-medium">
            Assignee
          </label>
          <select
            id="assignedToId"
            className={SELECT_CLASS}
            disabled={!canAssign}
            {...register("assignedToId")}
          >
            <option value="">— Tidak ditugaskan —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {!canAssign && (
            <p className="text-xs text-muted-foreground">
              Hanya manager/admin yang dapat meng-assign.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan…" : submitLabel}
      </Button>
    </form>
  );
}
