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
import type { Department } from "@/types/department";

export function DepartmentTable({
  departments,
}: {
  departments: Department[];
}) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Dibuat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow
              key={dept.id}
              className="cursor-pointer"
              onClick={() => router.push(`/departments/${dept.id}`)}
            >
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {dept.description ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(dept.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
