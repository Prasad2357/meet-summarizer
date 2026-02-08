import type { ActionItem } from "./actionitem";

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

export type MeetingDetail = {
  id: number;
  file_name: string;
  meeting_type: string;
  status: string;
  transcript: string;
  summary_json: {
    executive_summary: string;
    action_items: ActionItem[];
    follow_up_needed: {
      immediate: string[];
      this_week: string[];
      later: string[];
    };
  };
  created_at: string;
};