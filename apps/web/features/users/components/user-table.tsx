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
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";
import type { User } from "@/types/auth";

interface Props {
  users: User[];
  getDepartmentName: (id: string | null | undefined) => string;
}

export function UserTable({ users, getDepartmentName }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer"
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getDepartmentName(user.departmentId)}
              </TableCell>
              <TableCell>
                <UserStatusBadge isActive={user.isActive ?? true} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
