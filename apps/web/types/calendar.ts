export type CalendarEventType =
  | "MEETING"
  | "COMPANY_EVENT"
  | "TRAINING"
  | "HOLIDAY"
  | "DIRECTOR_SCHEDULE"
  | "ANNOUNCEMENT";

export interface CalendarUserRef {
  id: string;
  name: string;
  email: string;
}

/** CalendarEvent murni (hasil CRUD /calendar/events). */
export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  type: CalendarEventType;
  startAt: string;
  endAt: string;
  createdById: string;
  createdBy: CalendarUserRef;
  createdAt: string;
  updatedAt: string;
}

/** Item terpadu pada timeline (gabungan Meeting 6.1 + CalendarEvent 6.2). */
export interface CalendarItem {
  id: string;
  source: "MEETING" | "EVENT";
  type: CalendarEventType;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  organizer: { id: string; name: string };
  meetingUrl: string | null;
}

export interface CalendarEventFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: CalendarEventType;
}

export interface CreateCalendarEventPayload {
  title: string;
  description?: string;
  type: CalendarEventType;
  startAt: string;
  endAt: string;
}

export type UpdateCalendarEventPayload = Partial<CreateCalendarEventPayload>;
