import { useEffect, useState } from "react";
import type { BlockersResponse } from "../types/blockers";
import { fetchActiveBlockers } from "../lib/api";

import InsightsTabs from "../components/insights/InsightsTab";
import BlockersList from "../components/insights/BlockersList";

const BlockersPage = () => {
  const [data, setData] = useState<BlockersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBlockers()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Insights</p>
        <h1 className="text-2xl font-semibold">Blockers</h1>
      </div>

      {/* Tabs */}
      <InsightsTabs active="blockers" />

      {/* Content */}
      <BlockersList
        blockers={data?.blockers ?? []}
        loading={loading}
        total={data?.total_blockers}
        highSeverityCount={data?.high_severity_count}
      />
    </div>
  );
};

export default BlockersPage;
