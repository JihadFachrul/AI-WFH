"use client";

import { useQuery } from "@tanstack/react-query";
import { kpiService } from "@/services/kpi.service";

export function useMyKpi() {
  return useQuery({
    queryKey: ["kpi", "me"],
    queryFn: () => kpiService.getMyKpi(),
  });
}

export function useTeamKpi() {
  return useQuery({
    queryKey: ["kpi", "team"],
    queryFn: () => kpiService.getTeamKpi(),
  });
}
