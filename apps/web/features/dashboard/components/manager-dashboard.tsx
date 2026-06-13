"use client";

import { useMemo } from "react";
import { ListChecksIcon, AlertTriangleIcon, Building2Icon } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useDepartments } from "@/hooks/use-departments";
import { useNotifications } from "@/hooks/use-notifications";
import { deriveTaskStats } from "@/features/dashboard/task-stats";
import { StatCard } from "./stat-card";
import { TasksByStatusWidget } from "./tasks-by-status-widget";
import { DepartmentSummaryWidget } from "./department-summary-widget";
import { ActivityWidget } from "./activity-widget";
import { SessionStatusCard } from "@/features/work-sessions/components/session-status-card";
import { TeamActivityWidget } from "@/features/work-sessions/components/team-activity-widget";
import { TeamKpiTable } from "@/features/kpi/components/team-kpi-table";
import { TodayMeetingsWidget } from "@/features/meetings/components/today-meetings-widget";
import { UpcomingEventsWidget } from "@/features/calendar/components/upcoming-events-widget";

export function ManagerDashboard() {
  // MANAGER (privileged) melihat seluruh task yang dapat diaksesnya.
  const tasksQ = useTasks({ limit: 100 });
  const deptQ = useDepartments({ limit: 100 });
  const activityQ = useNotifications(5);

  const tasks = useMemo(() => tasksQ.data?.data ?? [], [tasksQ.data]);
  const stats = useMemo(() => deriveTaskStats(tasks, Date.now()), [tasks]);

  return (
    <div className="dash-stagger space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Team Tasks"
          value={tasksQ.data?.meta.total ?? 0}
          icon={ListChecksIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Overdue Tasks"
          value={stats.overdue}
          icon={AlertTriangleIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Departments"
          value={deptQ.data?.meta.total ?? 0}
          icon={Building2Icon}
          isLoading={deptQ.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SessionStatusCard />
        <TeamActivityWidget />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TasksByStatusWidget
          byStatus={stats.byStatus}
          isLoading={tasksQ.isLoading}
          isError={tasksQ.isError}
        />
        <DepartmentSummaryWidget
          departments={deptQ.data?.data ?? []}
          total={deptQ.data?.meta.total ?? 0}
          isLoading={deptQ.isLoading}
          isError={deptQ.isError}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodayMeetingsWidget />
        <UpcomingEventsWidget />
      </div>

      <TeamKpiTable />

      <ActivityWidget
        notifications={activityQ.data?.data ?? []}
        isLoading={activityQ.isLoading}
        isError={activityQ.isError}
      />
    </div>
  );
}
