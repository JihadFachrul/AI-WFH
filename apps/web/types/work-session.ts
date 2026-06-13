import type { UserRole } from "@/types/auth";

export interface WorkSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  createdAt: string;
}

export interface TeamMemberStatus {
  id: string;
  name: string;
  role: UserRole;
  activeSession: { id: string; startedAt: string } | null;
}
