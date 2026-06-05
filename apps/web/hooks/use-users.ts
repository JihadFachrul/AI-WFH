"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { UserFilters } from "@/types/auth";

/** Daftar user ter-paginasi. Filter/search/pagination dilakukan di backend. */
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersService.list(filters),
    placeholderData: keepPreviousData,
  });
}
