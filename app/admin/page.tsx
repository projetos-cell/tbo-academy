import { AnalyticsOverview } from "@/features/admin/components/analytics-overview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Painel Admin</span>
        <h1 className="font-display mt-1 text-[28px] font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[var(--tbo-gray-500)]">Visão geral da TBO Academy</p>
      </div>

      <AnalyticsOverview mini />
    </div>
  );
}
