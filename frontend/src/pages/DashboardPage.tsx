import MeetingCard from "../components/meeting/MeetingCard";
import MeetingListRow from "../components/meeting/MeetingListRow";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MeetingListItem } from "../types/meeting";
import type { UploadResponse } from "../types/meeting";
import { fetchMeetings, deleteMeeting } from "../lib/api";
import NewAnalysisModal from "../components/new-analysis/NewAnalysisModal";
import { Button } from "../components/ui/button";
import Pagination from "../components/common/Pagination";

export default function DashboardPage() {
    const [meetings, setMeetings] = useState<MeetingListItem[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'grid' | 'list'>('grid')
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

    // Polling effect for processing meetings
    useEffect(() => {
        const processingMeetings = meetings.filter(
            m => m.status === "PENDING" || m.status === "PROCESSING"
        );

        if (processingMeetings.length === 0) {
            return; // No polling needed
        }

        console.log(`Polling ${processingMeetings.length} processing meetings...`);

        const pollInterval = setInterval(async () => {
            // Fetch updated data for all meetings to get latest status/progress
            try {
                const data = await fetchMeetings(PAGE_SIZE, (page - 1) * PAGE_SIZE);
                const items = data.items ?? data;
                setMeetings(items);
                setTotal(data.total ?? items.length);

                // Log progress for debugging
                items.forEach((m: any) => {
                    if (m.status === "PENDING" || m.status === "PROCESSING") {
                        console.log(`Meeting ${m.id}: ${m.status} - ${m.progress}%`);
                    }
                });
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(pollInterval);
    }, [meetings, page]);

    // Delete handler
    const handleDelete = async (id: number) => {
        try {
            await deleteMeeting(id);
            // Refresh the meetings list after deletion
            const data = await fetchMeetings(PAGE_SIZE, (page - 1) * PAGE_SIZE);
            const items = data.items ?? data;
            setMeetings(items);
            setTotal(data.total ?? items.length);
        } catch (err) {
            console.error('Failed to delete meeting:', err);
            setError('Failed to delete meeting');
        }
    };

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

                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView('grid')}
                            className={`px-3 py-2 transition-all ${view === 'grid'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            title="Grid View"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 py-2 transition-all ${view === 'list'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            title="List View"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <Button onClick={() => setOpen(true)}>
                        New Meeting Analysis
                    </Button>
                </div>
            </div>


            {/* Conditional rendering based on view */}
            {view === 'grid' ? (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meetings.map((meeting) => (
                        <Link
                            key={meeting.id}
                            to={`/meetings/${meeting.id}`}
                        >
                            <MeetingCard
                                id={meeting.id}
                                title={meeting.file_name}
                                date={new Date(meeting.created_at).toDateString()}
                                tags={[meeting.meeting_type]}
                                summary={meeting.executive_summary}
                                status={meeting.status}
                                progress={meeting.progress}
                                onDelete={handleDelete}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-8">
                    {/* List View Table Headers */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_3fr_auto] gap-4 px-6 py-3 mb-2 font-semibold text-sm text-gray-600 border-b-2 border-gray-200">
                        <div>Meeting Title</div>
                        <div>Date</div>
                        <div>Category</div>
                        <div>Summary</div>
                        <div>Actions</div>
                    </div>

                    {/* List View Rows */}
                    <div className="space-y-0">
                        {meetings.map((meeting) => (
                            <Link
                                key={meeting.id}
                                to={`/meetings/${meeting.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <MeetingListRow
                                    id={meeting.id}
                                    title={meeting.file_name}
                                    date={new Date(meeting.created_at).toDateString()}
                                    category={meeting.meeting_type}
                                    summary={meeting.executive_summary}
                                    status={meeting.status}
                                    progress={meeting.progress}
                                    onDelete={handleDelete}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            <NewAnalysisModal
                open={open}
                onClose={() => setOpen(false)}
                onCreated={(response: UploadResponse) => {
                    console.log("Meeting upload started:", response);
                    // Close modal and refresh the meetings list
                    setOpen(false);
                    // Refresh meetings to show the new processing item
                    fetchMeetings(PAGE_SIZE, (page - 1) * PAGE_SIZE)
                        .then((data) => {
                            const items = data.items ?? data;
                            setMeetings(items);
                            setTotal(data.total ?? items.length);
                        })
                        .catch(() => setError("Failed to refresh meetings."));
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