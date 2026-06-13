"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTimeRange } from "../lib/datetime";
import type { Meeting } from "@/types/meeting";

export function MeetingTable({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead className="text-center">Peserta</TableHead>
            <TableHead>Organizer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((m) => (
            <TableRow
              key={m.id}
              className="cursor-pointer"
              onClick={() => router.push(`/meetings/${m.id}`)}
            >
              <TableCell className="font-medium">{m.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(m.startAt)}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {formatTimeRange(m.startAt, m.endAt)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {m.participants.length}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {m.createdBy.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
