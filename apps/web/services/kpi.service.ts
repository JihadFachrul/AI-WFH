import { api } from "@/lib/api";
import type { Kpi, MemberKpi } from "@/types/kpi";

export const kpiService = {
  getMyKpi: async (): Promise<Kpi> => {
    const { data } = await api.get<Kpi>("/kpi/me");
    return data;
  },

  getUserKpi: async (id: string): Promise<Kpi> => {
    const { data } = await api.get<Kpi>(`/kpi/users/${id}`);
    return data;
  },

  getTeamKpi: async (): Promise<MemberKpi[]> => {
    const { data } = await api.get<MemberKpi[]>("/kpi/team");
    return data;
  },
};
