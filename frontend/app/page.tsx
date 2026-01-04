import MeetingCard from "@/components/meeting/meeting-card"

export default function Page() {
  return (
    <div className="p-8">
      <MeetingCard
        title="Weekly Engineering Sync"
        date="2023-06-23"
        tags={["Dev", "Product"]}
        summary="Discussion on roadmap, blockers, and release timeline."
      />
    </div>
  )
}
