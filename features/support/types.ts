export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  body: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}
