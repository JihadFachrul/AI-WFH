"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/data-states";
import { MeetingTable } from "@/features/meetings/components/meeting-table";
import { useMeetings } from "@/hooks/use-meetings";
import { useMeetingRealtime } from "@/hooks/use-meeting-realtime";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";

const LIMIT = 10;

export default function MeetingsPage() {
  useMeetingRealtime();
  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const filters = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: search || undefined,
      date: date ? new Date(date).toISOString() : undefined,
    }),
    [page, search, date],
  );

  const { data, isLoading, isError, refetch, isPlaceholderData } =
    useMeetings(filters);
  const meetings = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <PageHeader title="Meetings" description="Jadwal meeting tim Anda." />
        {canCreate && (
          <Button asChild>
            <Link href="/meetings/new">
              <PlusIcon className="size-4" />
              Meeting Baru
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari judul meeting…"
            className="pl-8"
          />
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="sm:w-44"
          aria-label="Filter tanggal"
        />
      </div>

      {isLoading ? (
        <LoadingState label="Memuat meeting…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat meeting." onRetry={() => refetch()} />
      ) : meetings.length === 0 ? (
        <EmptyState
          title="Belum ada meeting"
          description="Meeting yang melibatkan Anda akan muncul di sini."
        />
      ) : (
        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
          <MeetingTable meetings={meetings} />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
              itemLabel="meeting"
            />
          )}
        </div>
      )}
    </div>
  );
}
