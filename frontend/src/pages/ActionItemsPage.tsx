import { useEffect, useState } from "react";
import type { ActionItemsResponse } from "../types/actionItemsOverview";
import { fetchPendingActionItems } from "../lib/api";

import InsightsTab from "../components/insights/InsightsTab";
import ActionItemsList from "../components/insights/ActionItemsList";
import ActionItemsFilters from "../components/insights/ActionItemsFilters";
import Pagination from "../components/common/Pagination";

const ActionItemsPage = () => {
    const [data, setData] = useState<ActionItemsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const owners = Array.from(
        new Set((data?.action_items ?? []).map((i) => i.owner))
    );
    const [priority, setPriority] = useState<string>("All");
    const [owner, setOwner] = useState<string>("All");
    const [status, setStatus] = useState<string>("All");

    const filteredItems = (data?.action_items ?? []).filter((item) => {
        if (priority !== "All" && item.priority !== priority) return false;
        if (owner !== "All" && item.owner !== owner) return false;
        if (status !== "All" && item.status !== status) return false;
        return true;
    });

    const PAGE_SIZE = 5;
const [page, setPage] = useState(1);

const paginatedItems = filteredItems.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
);

    useEffect(() => {
        fetchPendingActionItems()
            .then((res) => setData(res))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
  setPage(1);
}, [priority, owner, status]);

        

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm text-muted-foreground">Insights</p>
                <h1 className="text-2xl font-semibold">Action Items</h1>
            </div>

            {/* Tabs */}
            <InsightsTab active="action-items" />

            <ActionItemsFilters
                priority={priority}
                owner={owner}
                status={status}
                owners={owners}
                onPriorityChange={setPriority}
                onOwnerChange={setOwner}
                onStatusChange={setStatus}
            />

            {/* Content */}
            <ActionItemsList
  items={paginatedItems}
  loading={loading}
  total={filteredItems.length}
/>

        <Pagination
  page={page}
  pageSize={PAGE_SIZE}
  total={filteredItems.length}
  onPageChange={setPage}
/>
        </div>
    );
};

export default ActionItemsPage;
