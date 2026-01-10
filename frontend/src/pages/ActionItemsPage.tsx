import { useEffect, useState } from "react";
import type { ActionItemsResponse } from "../types/actionItemsOverview";
import { fetchPendingActionItems } from "../lib/api";

import InsightsTab from "../components/insights/InsightsTab";
import ActionItemsList from "../components/insights/ActionItemsList";

const ActionItemsPage = () => {
  const [data, setData] = useState<ActionItemsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingActionItems()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Insights</p>
        <h1 className="text-2xl font-semibold">Action Items</h1>
      </div>

      {/* Tabs */}
      <InsightsTab active="action-items" />

      {/* Content */}
      <ActionItemsList
        items={data?.action_items ?? []}
        loading={loading}
        total={data?.total_pending}
      />
    </div>
  );
};

export default ActionItemsPage;
