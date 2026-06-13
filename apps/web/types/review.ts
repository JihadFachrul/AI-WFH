export type ReviewDecision = "APPROVED" | "REVISION";

export interface ReviewReviewer {
  id: string;
  name: string;
  email: string;
}

export interface TaskReview {
  id: string;
  taskId: string;
  reviewerId: string;
  decision: ReviewDecision;
  note: string;
  createdAt: string;
  reviewer: ReviewReviewer;
}

export interface CreateReviewPayload {
  decision: ReviewDecision;
  note: string;
}
