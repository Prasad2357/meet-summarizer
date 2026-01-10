import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMeetingById } from "../lib/api";
import type { MeetingDetail } from "../types/meeting";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ActionItemRow from "@/components/meeting/ActionItemRow"
import type { ActionItem } from "../types/actionitem";
import FollowUpList from "@/components/meeting/FollowUpList";


export default function MeetingDetailPage() {
  const { id } = useParams()
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const actionItems: ActionItem[] = meeting?.summary_json.action_items ?? []
  const followUps = meeting?.summary_json.follow_up_needed
  const immediate = followUps?.immediate ??[]
  const thisWeek = followUps?.this_week ??[]
  const later = followUps?.later ??[]

  useEffect(() => {
    async function loadMeeting() {
      if (!id) return

      try {
        const data = await fetchMeetingById(id)
        setMeeting(data)
      } catch (error) {
        console.error("Failed to fetch meeting:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMeeting()
  }, [id])


  if (loading) {
    return <div className="p-8">Loading meeting...</div>
  }

  if (!meeting) {
    return <div className="p-8">Meeting not found</div>
  }

  const summary = meeting.summary_json

  return (


    <div className="p-6 h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

        {/* LEFT PANEL */}
        <div className="rounded-xl border bg-background p-4 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Transcript</h2>

          {meeting.transcript ? (

            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {meeting.transcript}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No transcript available.
            </p>
          )

          }

        </div>


        {/* RIGHT PANEL */}
        <div className="rounded-xl border bg-background p-4 overflow-y-auto">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Executive Summary</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
              <TabsTrigger value="followups">Follow Ups</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <p className="text-sm leading-relaxed">
                {meeting?.summary_json?.executive_summary}
              </p>
            </TabsContent>

            <TabsContent value="actions">
              <h3 className="text-lg font-semibold mb-2">
                Action Items ({actionItems.length})
              </h3>
              <div className="space-y-3">
                {actionItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No action items found.
                  </p>
                ) : (
                  actionItems.map((item, index) => (
                    <ActionItemRow key={index} item={item} />
                  )
                  )
                )}

              </div>
            </TabsContent>

            <TabsContent value="followups">
              <div className="space-y-6">
                <FollowUpList title="Immediate" items={immediate} />
                <FollowUpList title="This Week" items={thisWeek} />
                <FollowUpList title="Later" items={later} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Tabs go here */}
        </div>

      </div>
    </div>

  )
}