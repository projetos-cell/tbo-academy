import { UserTable } from "@/features/admin/components/user-table";

export const dynamic = "force-dynamic";

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground mt-1 text-sm">Gerencie usuários e suas matrículas nos cursos da academy.</p>
      </div>

      <UserTable />
    </div>
  );
}
