export interface MeetingUserRef {
  id: string;
  name: string;
  email: string;
}

export interface MeetingParticipant {
  id: string;
  user: MeetingUserRef;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  meetingUrl: string | null;
  createdById: string;
  createdBy: MeetingUserRef;
  participants: MeetingParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFilters {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  meetingUrl?: string;
  participantIds?: string[];
}

export type UpdateMeetingPayload = Partial<CreateMeetingPayload>;
