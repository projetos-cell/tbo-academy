import { LearningPathEditor } from "@/features/admin/components/learning-path-editor";

export default function AdminTrilhasPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Conteúdo</span>
        <h1 className="font-display mt-1 text-[28px] font-bold tracking-tight">Trilhas de Aprendizado</h1>
        <p className="mt-1 text-[var(--tbo-gray-500)]">Organize cursos em sequências estruturadas de aprendizado</p>
      </div>

      <LearningPathEditor />
    </div>
  );
}
