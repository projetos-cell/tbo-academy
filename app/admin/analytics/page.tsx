import { AnalyticsOverview } from "@/features/admin/components/analytics-overview";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Painel Admin</span>
        <h1 className="font-display mt-1 text-[28px] font-bold tracking-tight">Análises</h1>
        <p className="mt-1 text-sm text-[var(--tbo-gray-500)]">Métricas de engajamento e crescimento da Academy</p>
      </div>

      <AnalyticsOverview />
    </div>
  );
}
