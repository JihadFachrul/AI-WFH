import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type {
  Department,
  DepartmentFilters,
  DepartmentPayload,
} from "@/types/department";

export const departmentsService = {
  list: async (
    filters?: DepartmentFilters,
  ): Promise<Paginated<Department>> => {
    const { data } = await api.get<Paginated<Department>>("/departments", {
      params: filters,
    });
    return data;
  },

  get: async (id: string): Promise<Department> => {
    const { data } = await api.get<Department>(`/departments/${id}`);
    return data;
  },

  create: async (payload: DepartmentPayload): Promise<Department> => {
    const { data } = await api.post<Department>("/departments", payload);
    return data;
  },

  update: async (
    id: string,
    payload: DepartmentPayload,
  ): Promise<Department> => {
    const { data } = await api.patch<Department>(`/departments/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<{ id: string; deleted: true }> => {
    const { data } = await api.delete<{ id: string; deleted: true }>(
      `/departments/${id}`,
    );
    return data;
  },
};
