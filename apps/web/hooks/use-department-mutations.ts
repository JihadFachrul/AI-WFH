"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsService } from "@/services/departments.service";
import type { DepartmentPayload } from "@/types/department";

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) =>
      departmentsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useUpdateDepartment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) =>
      departmentsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["department", id] });
    },
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}
