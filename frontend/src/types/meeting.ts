export type MeetingListItem = {
  id: number
  file_name: string
  meeting_type: string
  status: string
  progress: number
  executive_summary: string
  action_items_count: number
  blockers_count: number
  created_at: string
}

export type UploadResponse = {
  id: number;
  status: string;  // "processing", "done", "failed"
};