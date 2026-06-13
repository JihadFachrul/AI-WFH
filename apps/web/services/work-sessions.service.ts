import { api } from "@/lib/api";
import type { WorkSession, TeamMemberStatus } from "@/types/work-session";

export const workSessionsService = {
  startSession: async (): Promise<WorkSession> => {
    const { data } = await api.post<WorkSession>("/work-sessions/start");
    return data;
  },

  endSession: async (): Promise<WorkSession> => {
    const { data } = await api.post<WorkSession>("/work-sessions/end");
    return data;
  },

  getMySession: async (): Promise<WorkSession | null> => {
    const { data } = await api.get<WorkSession | null>("/work-sessions/me");
    return data;
  },

  getTeamSessions: async (): Promise<TeamMemberStatus[]> => {
    const { data } = await api.get<TeamMemberStatus[]>("/work-sessions/team");
    return data;
  },
};
