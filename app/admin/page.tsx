import { IconLayoutDashboard } from "@tabler/icons-react";
import { AnalyticsOverview } from "@/features/admin/components/analytics-overview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <IconLayoutDashboard className="size-6" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Visão geral da TBO Academy</p>
      </div>

      <AnalyticsOverview mini />
    </div>
  );
}
