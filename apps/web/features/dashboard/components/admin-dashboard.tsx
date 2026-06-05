"use client";

import { useMemo } from "react";
import {
  UsersIcon,
  UserCheckIcon,
  Building2Icon,
  ListChecksIcon,
  BellIcon,
} from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useDepartments } from "@/hooks/use-departments";
import { useTasks } from "@/hooks/use-tasks";
import { useUnreadNotifications, useNotifications } from "@/hooks/use-notifications";
import { StatCard } from "./stat-card";
import { ActivityWidget } from "./activity-widget";

export function AdminDashboard() {
  const usersQ = useUsers({ limit: 100 });
  const deptQ = useDepartments({ limit: 1 });
  const tasksQ = useTasks({ limit: 1 });
  const unreadQ = useUnreadNotifications();
  const activityQ = useNotifications(5);

  // Active count dihitung dari user yang ter-fetch (akurat untuk skala internal).
  const activeUsers = useMemo(
    () => (usersQ.data?.data ?? []).filter((u) => u.isActive !== false).length,
    [usersQ.data],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Users"
          value={usersQ.data?.meta.total ?? 0}
          icon={UsersIcon}
          isLoading={usersQ.isLoading}
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={UserCheckIcon}
          isLoading={usersQ.isLoading}
        />
        <StatCard
          label="Departments"
          value={deptQ.data?.meta.total ?? 0}
          icon={Building2Icon}
          isLoading={deptQ.isLoading}
        />
        <StatCard
          label="Total Tasks"
          value={tasksQ.data?.meta.total ?? 0}
          icon={ListChecksIcon}
          isLoading={tasksQ.isLoading}
        />
        <StatCard
          label="Unread Notifications"
          value={unreadQ.data?.meta.total ?? 0}
          icon={BellIcon}
          isLoading={unreadQ.isLoading}
        />
      </div>

      <ActivityWidget
        notifications={activityQ.data?.data ?? []}
        isLoading={activityQ.isLoading}
        isError={activityQ.isError}
      />
    </div>
  );
}
