export interface WorkLogUser {
  id: string;
  name: string;
  email: string;
}

export interface WorkLog {
  id: string;
  taskId: string;
  userId: string;
  activity: string;
  progress: number | null;
  blocker: string | null;
  createdAt: string;
  user: WorkLogUser;
}

export interface CreateWorkLogPayload {
  activity: string;
  progress?: number;
  blocker?: string;
}
