"use client";

import { useMemo } from "react";
import {
  ListChecksIcon,
  ClockIcon,
  AlertTriangleIcon,
  BellIcon,
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useUnreadNotifications, useNotifications } from "@/hooks/use-notifications";
import { deriveTaskStats } from "@/features/dashboard/task-stats";
import { StatCard } from "./stat-card";
import { TaskListWidget } from "./task-list-widget";
import { ActivityWidget } from "./activity-widget";
import { SessionStatusCard } from "@/features/work-sessions/components/session-status-card";
import { KpiCard } from "@/features/kpi/components/kpi-card";
import { TodayMeetingsWidget } from "@/features/meetings/components/today-meetings-widget";
import { UpcomingEventsWidget } from "@/features/calendar/components/upcoming-events-widget";

export function EmployeeDashboard() {
  // Backend otomatis membatasi EMPLOYEE hanya ke task miliknya.
  const tasksQ = useTasks({ limit: 100 });
  const unreadQ = useUnreadNotifications();
  const activityQ = useNotifications(5);

  const tasks = useMemo(() => tasksQ.data?.data ?? [], [tasksQ.data]);
  const stats = useMemo(() => deriveTaskStats(tasks, Date.now()), [tasks]);

  return (
    <div className="dash-stagger space-y-4">
      <SessionStatusCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Tasks"
          value={tasksQ.data?.meta.total ?? 0}
          icon={ListChecksIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Pending Tasks"
          value={stats.pending}
          icon={ClockIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Overdue Tasks"
          value={stats.overdue}
          icon={AlertTriangleIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Unread Notifications"
          value={unreadQ.data?.meta.total ?? 0}
          icon={BellIcon}
          isLoading={unreadQ.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskListWidget
          title="My Tasks"
          tasks={tasks}
          isLoading={tasksQ.isLoading}
          isError={tasksQ.isError}
          emptyLabel="No tasks assigned to you"
        />
        <KpiCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodayMeetingsWidget />
        <UpcomingEventsWidget />
      </div>

      <ActivityWidget
        notifications={activityQ.data?.data ?? []}
        isLoading={activityQ.isLoading}
        isError={activityQ.isError}
      />
    </div>
  );
}
