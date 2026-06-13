import type { UserRole } from "@/types/auth";

export type KpiStatus = "EXCELLENT" | "GOOD" | "NEEDS_ATTENTION";

export interface Kpi {
  completionRate: number;
  approvalRate: number;
  revisionRate: number;
  evidenceCompliance: number;
  workLogConsistency: number;
  sessionConsistency: number;
  status: KpiStatus;
  hasData: boolean;
}

export interface MemberKpi {
  id: string;
  name: string;
  role: UserRole;
  kpi: Kpi;
}
