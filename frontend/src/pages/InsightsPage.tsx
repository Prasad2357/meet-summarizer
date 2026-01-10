import { useEffect, useState } from "react";
import type { OverviewStats } from "../types/overview";
import { fetchOverviewStats } from "../lib/api";

import InsightsTab from "../components/insights/InsightsTab";
import KPICardsRow from "../components/insights/KPICardsRow";
import DistributionSection from "../components/insights/DistributionSection";
import RiskSummarySection from "../components/insights/RiskSummaryPlaceholder";

const InsightsPage = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewStats()
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Insights</p>
        <h1 className="text-2xl font-semibold">Overview</h1>
      </div>

      {/* Tabs */}
      <InsightsTab active="overview" />

      {/* KPI Cards */}
      <KPICardsRow stats={stats} loading={loading} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DistributionSection stats={stats} loading={loading} />
        </div>
        <div>
          <RiskSummarySection stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
