"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { departmentsService } from "@/services/departments.service";
import type { DepartmentFilters } from "@/types/department";

export function useDepartments(filters: DepartmentFilters = {}) {
  return useQuery({
    queryKey: ["departments", filters],
    queryFn: () => departmentsService.list(filters),
    placeholderData: keepPreviousData,
  });
}
