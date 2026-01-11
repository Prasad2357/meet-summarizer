import MeetingCard from "../components/meeting/MeetingCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MeetingListItem } from "../types/meeting";
import type { UploadResponse } from "../types/meeting";
import { fetchMeetings } from "../lib/api";
import NewAnalysisModal from "../components/new-analysis/NewAnalysisModal";
import { Button } from "../components/ui/button";
import Pagination from "../components/common/Pagination";

export default function DashboardPage() {
    const [meetings, setMeetings] = useState<MeetingListItem[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);


    useEffect(() => {
  setLoading(true);

  fetchMeetings(PAGE_SIZE, (page - 1) * PAGE_SIZE)
    .then((data) => {
      const items = data.items ?? data;
      setMeetings(items);
      setTotal(data.total ?? items.length);
      setError(null);
    })
    .catch(() => setError("Failed to load meetings."))
    .finally(() => setLoading(false));
}, [page]);


    if (loading) {
        return <p className="p-8 text-muted-foreground">Loading meetings...</p>
    }

    if (error) {
        return <p className="p-8 text-red-500">{error}</p>
    }


    return (

        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>

                <Button onClick={() => setOpen(true)}>
                    New Meeting Analysis
                </Button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                    <Link
                        key={meeting.id}
                        to={`/meetings/${meeting.id}`}
                    >
                        <MeetingCard
                            key={meeting.id}
                            title={meeting.file_name}
                            date={new Date(meeting.created_at).toDateString()}
                            tags={[meeting.meeting_type]}
                            summary={meeting.executive_summary}
                        />
                    </Link>
                ))}

            </div>

            {/* Modal */}
            <NewAnalysisModal
                open={open}
                onClose={() => setOpen(false)}
                onCreated={(newMeeting: UploadResponse) => {
                    const newItem: MeetingListItem = {
                        id: newMeeting.id,
                        file_name: newMeeting.file_name,
                        meeting_type: newMeeting.meeting_type,
                        executive_summary: newMeeting.summary?.executive_summary ?? "Meeting summary generated",
                        action_items_count: newMeeting.metadata.action_items,
                        blockers_count: newMeeting.metadata.blockers,
                        created_at: new Date().toISOString(),
                    };
                    setMeetings((prev) => [newItem, ...prev]);
                }}
            />

            <Pagination
  page={page}
  pageSize={PAGE_SIZE}
  total={total}
  onPageChange={setPage}
/>
        </div>


    )

}