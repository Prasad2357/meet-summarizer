export type OverviewStats = {
  total_meetings: number;
  recent_meetings_7days: number;
  total_action_items: number;
  meetings_with_blockers: number;
  meetings_with_red_flags: number;
  blocker_rate: number;
  meeting_type_distribution: Record<string, number>;
};