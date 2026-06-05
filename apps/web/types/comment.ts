export interface TaskCommentAuthor {
  id: string;
  name: string;
  email: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: TaskCommentAuthor;
  createdAt: string;
  updatedAt: string;
}
