export interface EvidenceUploader {
  id: string;
  name: string;
  email: string;
}

export interface TaskEvidence {
  id: string;
  taskId: string;
  uploadedById: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  description: string | null;
  createdAt: string;
  uploadedBy: EvidenceUploader;
}
