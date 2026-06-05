"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/data-states";
import { UserFilters } from "@/features/users/components/user-filters";
import { UserTable } from "@/features/users/components/user-table";
import { useUsers } from "@/hooks/use-users";
import { useDepartments } from "@/hooks/use-departments";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";
import type { UserRole } from "@/types/auth";

const LIMIT = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [departmentId, setDepartmentId] = useState("");

  const filters = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: search || undefined,
      role: role || undefined,
      departmentId: departmentId || undefined,
    }),
    [page, search, role, departmentId],
  );

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useUsers(filters);

  // Departments dipakai untuk dropdown filter + memetakan departmentId → nama.
  const { data: deptData } = useDepartments({ limit: 100 });
  const departments = useMemo(
    () => (deptData?.data ?? []).map((d) => ({ id: d.id, name: d.name })),
    [deptData],
  );
  const deptMap = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    [departments],
  );
  const getDepartmentName = useCallback(
    (id: string | null | undefined) => (id ? (deptMap.get(id) ?? "—") : "—"),
    [deptMap],
  );

  const onSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);
  const onRoleChange = useCallback((v: UserRole | "") => {
    setRole(v);
    setPage(1);
  }, []);
  const onDepartmentChange = useCallback((v: string) => {
    setDepartmentId(v);
    setPage(1);
  }, []);

  const currentUserRole = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(currentUserRole);

  const forbidden =
    error instanceof AxiosError && error.response?.status === 403;
  const users = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Users" description="Anggota organisasi AWOS." />
        {canManage && (
          <Button asChild>
            <Link href="/users/new">
              <PlusIcon className="size-4" />
              User Baru
            </Link>
          </Button>
        )}
      </div>

      <UserFilters
        search={search}
        role={role}
        departmentId={departmentId}
        departments={departments}
        onSearchChange={onSearchChange}
        onRoleChange={onRoleChange}
        onDepartmentChange={onDepartmentChange}
      />

      {isLoading ? (
        <LoadingState label="Memuat users…" />
      ) : isError ? (
        <ErrorState
          label={
            forbidden
              ? "Anda tidak memiliki akses ke daftar user (butuh role Manager ke atas)."
              : "Gagal memuat users."
          }
          onRetry={forbidden ? undefined : () => refetch()}
        />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div
          className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}
        >
          <UserTable users={users} getDepartmentName={getDepartmentName} />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
              itemLabel="user"
            />
          )}
        </div>
      )}
    </div>
  );
}
