import { IconStack2 } from "@tabler/icons-react";
import { LearningPathEditor } from "@/features/admin/components/learning-path-editor";

export default function AdminTrilhasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <IconStack2 className="size-6" />
          Trilhas de Aprendizado
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Organize cursos em sequências estruturadas de aprendizado</p>
      </div>

      <LearningPathEditor />
    </div>
  );
}
