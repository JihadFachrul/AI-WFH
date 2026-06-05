import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type {
  User,
  UserFilters,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/auth";

export const usersService = {
  list: async (filters?: UserFilters): Promise<Paginated<User>> => {
    const { data } = await api.get<Paginated<User>>("/users", {
      params: filters,
    });
    return data;
  },

  get: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await api.post<User>("/users", payload);
    return data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },
};
