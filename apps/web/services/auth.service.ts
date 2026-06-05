import { api } from "@/lib/api";
import type { AuthResponse, LoginPayload, User } from "@/types/auth";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  /** Profil user dari token aktif (GET /api/auth/me). */
  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};
