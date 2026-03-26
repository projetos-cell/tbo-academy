import { IconChartBar } from "@tabler/icons-react";
import { AnalyticsOverview } from "@/features/admin/components/analytics-overview";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <IconChartBar className="size-6" />
          Análises
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Métricas de engajamento e crescimento da Academy</p>
      </div>

      <AnalyticsOverview />
    </div>
  );
}
