export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TaskUserRef {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedToId: string | null;
  createdById: string;
  assignedTo: TaskUserRef | null;
  createdBy: TaskUserRef;
  createdAt: string;
  updatedAt: string;
}

/** Query GET /api/tasks (filter & pagination dilakukan di backend). */
export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  dueDate?: string;
}
