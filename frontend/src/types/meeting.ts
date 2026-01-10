export type MeetingListItem = {
  id: number
  file_name: string
  meeting_type: string
  executive_summary: string
  action_items_count: number
  blockers_count: number
  created_at: string
}

export type UploadResponse = {
  id: number;
  file_name: string;
  meeting_type: string;
  summary: {
    executive_summary: string;
    // Add other summary fields as needed for type safety
  };
  metadata: {
    action_items: number;
    blockers: number;
    red_flags: number;
    key_decisions: number;
    questions_raised: number;
  };
};