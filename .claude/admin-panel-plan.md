# Admin Panel - Plano de Execução por Lotes

## Status de Execução
- [x] BATCH 1: Database Migration + Admin Layout Shell
- [x] BATCH 2: Course CRUD API Routes + List Page
- [x] BATCH 3: Course Editor + Module/Lesson CRUD
- [x] BATCH 4: Drag-and-Drop Reordering
- [x] BATCH 5: Video Upload + Rich Text Editor
- [x] BATCH 6: Comment Moderation Queue
- [x] BATCH 7: User & Enrollment Management
- [x] BATCH 8: Analytics Dashboard
- [x] BATCH 9: Learning Paths Management
- [x] BATCH 10: Integration + Polish

## Princípio Core
**EXTREMAMENTE INTUITIVO** — Notion-like simplicity. Click-to-edit, drag-to-reorder, zero fricção.

## Stack (tudo já instalado)
- @dnd-kit/core + sortable + modifiers (drag-and-drop)
- @tiptap/react + starter-kit + extensions (rich text)
- react-dropzone (file upload)
- recharts (charts)
- @tanstack/react-query + react-table (data fetching + tables)
- zod + react-hook-form (forms)
- sonner (toasts)
- Shadcn UI components

## Auth Pattern (todas as API routes)
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
// Check role via tenant_members -> roles join
// Or SUPER_ADMIN_EMAILS check
const service = createServiceClient(); // for data ops
```

## Database Tables
- academy_courses (title, slug, description JSONB, category, instructor, thumbnail_url, level, status, sort_order, tags)
- academy_modules (course_id, title, description JSONB, sort_order)
- academy_lessons (module_id, title, description JSONB, video_url, video_duration_sec, sort_order, is_free, status)
- academy_learning_paths (title, slug, description, thumbnail_url, sort_order, status)
- academy_learning_path_courses (learning_path_id, course_id, sort_order)
- academy_enrollments (user_id, course_id, enrolled_at, completed_at)
- academy_lesson_progress (user_id, lesson_id, completed, progress_pct, last_position_sec)
- academy_comments (lesson_id, user_id, parent_id, body, status: pending/approved/rejected/flagged)
- academy_analytics_events (user_id, event_type, entity_type, entity_id, metadata JSONB)

## File Structure
```
app/admin/
  layout.tsx
  page.tsx (dashboard)
  cursos/page.tsx + [courseId]/page.tsx
  trilhas/page.tsx
  comentarios/page.tsx
  usuarios/page.tsx
  analytics/page.tsx

app/api/admin/
  courses/ modules/ lessons/ learning-paths/ comments/ users/ analytics/ upload/

features/admin/
  components/ hooks/ types/ lib/
```
