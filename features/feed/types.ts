export type FeedItemType = "conquista" | "conclusao" | "comentario" | "ranking" | "novo_curso";

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userRole: string;
  type: FeedItemType;
  content: string;
  detail?: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  createdAt: string;
}
