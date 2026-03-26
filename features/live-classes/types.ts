export type LiveClassStatus = "upcoming" | "live" | "recorded" | "cancelled";

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  instructorName: string;
  instructorInitials: string;
  instructorRole?: string;
  category: string;
  scheduledAt: string;
  durationMinutes: number;
  maxAttendees: number;
  attendeesCount: number;
  meetingUrl?: string;
  recordingUrl?: string;
  status: LiveClassStatus;
  isRegistered: boolean;
}
