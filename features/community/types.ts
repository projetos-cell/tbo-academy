export interface ForumTopic {
  id: string;
  authorName: string;
  authorInitials: string;
  title: string;
  body?: string;
  category: string;
  isPinned: boolean;
  isHot: boolean;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  lastActivityAt: string;
  createdAt: string;
}

export interface CommunityStats {
  totalMembers: number;
  totalTopics: number;
  repliesToday: number;
  onlineNow: number;
}
