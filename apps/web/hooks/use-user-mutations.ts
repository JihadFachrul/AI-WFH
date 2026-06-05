"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { UpdateUserPayload } from "@/types/auth";

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}
