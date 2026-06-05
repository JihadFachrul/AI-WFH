"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/data-states";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { TaskTable } from "@/features/tasks/components/task-table";
import { Pagination } from "@/components/shared/pagination";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskRealtime } from "@/hooks/use-task-realtime";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";
import type { TaskStatus, TaskPriority } from "@/types/task";

const LIMIT = 10;

export default function TasksPage() {
  useTaskRealtime();

  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");

  const filters = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: search || undefined,
      status: status || undefined,
      priority: priority || undefined,
    }),
    [page, search, status, priority],
  );

  const { data, isLoading, isError, refetch, isPlaceholderData } =
    useTasks(filters);

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);
  const onStatusChange = useCallback((value: TaskStatus | "") => {
    setStatus(value);
    setPage(1);
  }, []);
  const onPriorityChange = useCallback((value: TaskPriority | "") => {
    setPriority(value);
    setPage(1);
  }, []);

  const tasks = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Tasks" description="Kelola dan pantau task tim." />
        {canCreate && (
          <Button asChild>
            <Link href="/tasks/new">
              <PlusIcon className="size-4" />
              Task Baru
            </Link>
          </Button>
        )}
      </div>

      <TaskFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onPriorityChange={onPriorityChange}
      />

      {isLoading ? (
        <LoadingState label="Memuat task…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat task." onRetry={() => refetch()} />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="Tidak ada task"
          description="Belum ada task yang cocok dengan filter saat ini."
        />
      ) : (
        <div
          className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}
        >
          <TaskTable tasks={tasks} />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
              itemLabel="task"
            />
          )}
        </div>
      )}
    </div>
  );
}
