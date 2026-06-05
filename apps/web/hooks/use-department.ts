"use client";

import { useQuery } from "@tanstack/react-query";
import { departmentsService } from "@/services/departments.service";

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentsService.get(id),
    enabled: !!id,
  });
}
