export type Blocker = {
  meeting_id: number;
  meeting_date: string;
  meeting_type: string;
  file_name: string;
  issue: string;
  severity: "High" | "Medium" | "Low";
  affected_areas: string[];
  mitigation: string;
};

export type BlockersResponse = {
  total_blockers: number;
  high_severity_count: number;
  blockers: Blocker[];
};
