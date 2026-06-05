"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/auth";

const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"];

interface Props {
  search: string;
  role: UserRole | "";
  departmentId: string;
  departments: { id: string; name: string }[];
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "") => void;
  onDepartmentChange: (value: string) => void;
}

export function UserFilters({
  search,
  role,
  departmentId,
  departments,
  onSearchChange,
  onRoleChange,
  onDepartmentChange,
}: Props) {
  const [text, setText] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(text), 350);
    return () => clearTimeout(timer);
  }, [text, onSearchChange]);

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cari nama atau email…"
          className="pl-8"
        />
      </div>

      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value as UserRole | "")}
        className={SELECT_CLASS}
        aria-label="Filter role"
      >
        <option value="">Semua role</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        value={departmentId}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className={SELECT_CLASS}
        aria-label="Filter department"
      >
        <option value="">Semua department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
}
