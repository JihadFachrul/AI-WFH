export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentFilters {
  page?: number;
  limit?: number;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
}
