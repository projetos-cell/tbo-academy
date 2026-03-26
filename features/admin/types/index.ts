export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: unknown | null;
  category: string | null;
  instructor: string | null;
  thumbnail_url: string | null;
  level: "iniciante" | "intermediario" | "avancado" | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  /** Computed counts (from API joins) */
  module_count?: number;
  lesson_count?: number;
}

export interface AdminModule {
  id: string;
  course_id: string;
  title: string;
  description: unknown | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  lessons?: AdminLesson[];
}

export interface AdminLesson {
  id: string;
  module_id: string;
  title: string;
  description: unknown | null;
  video_url: string | null;
  video_duration_sec: number | null;
  sort_order: number;
  is_free: boolean;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface AdminComment {
  id: string;
  lesson_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  created_at: string;
  updated_at: string;
  /** Joined user info */
  user?: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  /** Joined lesson info */
  lesson?: {
    title: string;
    module?: {
      title: string;
      course?: {
        title: string;
      };
    };
  };
}

export interface AdminEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  course?: Pick<AdminCourse, "id" | "title" | "thumbnail_url">;
}

export interface AdminLearningPath {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  courses?: AdminCourse[];
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  enrollment_count: number;
  created_at: string;
}

export interface AdminAnalytics {
  total_users: number;
  total_enrollments: number;
  total_completions: number;
  total_lessons: number;
  events_last_30d: number;
  top_courses: { course_id: string; title: string; enrollment_count: number }[];
  daily_events: { date: string; count: number }[];
}
