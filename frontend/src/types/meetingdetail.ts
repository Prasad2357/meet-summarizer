export type MeetingDetail = {
  id: number
  file_name: string
  transcript: string
  meeting_type: string
  created_at: string
  summary_json: {
    executive_summary: string
    action_items: any[]
    blockers_and_risks: any[]
    discussion_points: any[]
    sentiment_analysis: {
      overall_mood: string
      concerns_level: string
      team_confidence: string
    }
    red_flags: string[]
  }
}
