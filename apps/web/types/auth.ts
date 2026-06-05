export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  departmentId?: string;
  isActive?: boolean;
}

/** Response POST /api/auth/login */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Query GET /api/users (filter & pagination di backend). */
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  departmentId?: string;
}
