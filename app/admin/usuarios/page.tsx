import { PageHeader } from "@/components/shared";
import { UserTable } from "@/features/admin/components/user-table";

export const dynamic = "force-dynamic";

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description="Gerencie usuários e suas matrículas nos cursos da academy."
      />

      <UserTable />
    </div>
  );
}
