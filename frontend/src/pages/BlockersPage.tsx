import { useEffect, useState } from "react";
import type { BlockersResponse } from "../types/blockers";
import { fetchActiveBlockers } from "../lib/api";

import InsightsTabs from "../components/insights/InsightsTab";
import BlockersList from "../components/insights/BlockersList";
import BlockersFilters from "../components/insights/BlockersFilters";
import Pagination from "../components/common/Pagination";

const BlockersPage = () => {
    const [data, setData] = useState<BlockersResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [severity, setSeverity] = useState("All");
    const [meetingType, setMeetingType] = useState("All");
    const [area, setArea] = useState("All");
    const PAGE_SIZE = 5;
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchActiveBlockers()
            .then((res) => setData(res))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredBlockers = (data?.blockers ?? []).filter((b) => {
        if (severity !== "All" && b.severity !== severity) return false;
        if (meetingType !== "All" && b.meeting_type !== meetingType) return false;
        if (area !== "All" && !b.affected_areas.includes(area)) return false;
        return true;
    });

    const meetingTypes = Array.from(
        new Set((data?.blockers ?? []).map((b) => b.meeting_type))
    );

    const affectedAreas = Array.from(
        new Set((data?.blockers ?? []).flatMap((b) => b.affected_areas))
    );

    const paginatedBlockers = filteredBlockers.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
);

useEffect(() => {
  setPage(1);
}, [severity, meetingType, area]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm text-muted-foreground">Insights</p>
                <h1 className="text-2xl font-semibold">Blockers</h1>
            </div>

            {/* Tabs */}
            <InsightsTabs active="blockers" />

            <BlockersFilters
                severity={severity}
                meetingType={meetingType}
                area={area}
                meetingTypes={meetingTypes}
                areas={affectedAreas}
                onSeverityChange={setSeverity}
                onMeetingTypeChange={setMeetingType}
                onAreaChange={setArea}
            />

            {/* Content */}
            <BlockersList
                blockers={paginatedBlockers}
                loading={loading}
                total={filteredBlockers.length}
                highSeverityCount={
                    filteredBlockers.filter((b) => b.severity === "High").length
                }
            />

            <Pagination
  page={page}
  pageSize={PAGE_SIZE}
  total={filteredBlockers.length}
  onPageChange={setPage}
/>
        </div>
    );
};

export default BlockersPage;
