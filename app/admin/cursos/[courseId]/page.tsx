import { CourseEditor } from "@/features/admin/components/course-editor";

export const metadata = {
  title: "Editar Curso | TBO Academy Admin",
};

export default async function AdminCourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseEditor courseId={courseId} />;
}
