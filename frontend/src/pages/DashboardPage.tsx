import MeetingCard from "../components/meeting/MeetingCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MeetingListItem } from "../types/meeting";
import { fetchMeetings } from "../lib/api";
import NewAnalysisModal from "../components/new-analysis/NewAnalysisModal";
import { Button } from "../components/ui/button";

export default function DashboardPage() {
    const [meetings, setMeetings] = useState<MeetingListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        async function loadMeetings() {
            try {
                const data = await fetchMeetings()
                setMeetings(data)
            }
            catch (err) {
                setError("Failed to load meetings.")
            }
            finally {
                setLoading(false)
            }
        }

        loadMeetings()
    }, [])

    if (loading) {
        return <p className="p-8 text-muted-foreground">Loading meetings...</p>
    }

    if (error) {
        return <p className="p-8 text-red-500">{error}</p>
    }

    return (

        <div className="p-8 space-y-6">
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
                onClose={() => setOpen(false)} />


        </div>


    )

}