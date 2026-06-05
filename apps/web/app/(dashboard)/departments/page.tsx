"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/data-states";
import { DepartmentTable } from "@/features/departments/components/department-table";
import { useDepartments } from "@/hooks/use-departments";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

const LIMIT = 10;

export default function DepartmentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useDepartments({
    page,
    limit: LIMIT,
  });

  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);

  const departments = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader
          title="Departments"
          description="Struktur departemen organisasi."
        />
        {canManage && (
          <Button asChild>
            <Link href="/departments/new">
              <PlusIcon className="size-4" />
              Department Baru
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingState label="Memuat departemen…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat departemen." onRetry={() => refetch()} />
      ) : departments.length === 0 ? (
        <EmptyState title="No departments found" />
      ) : (
        <>
          <DepartmentTable departments={departments} />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
              itemLabel="department"
            />
          )}
        </>
      )}
    </div>
  );
}
