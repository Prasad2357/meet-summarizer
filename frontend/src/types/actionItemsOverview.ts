export type ActionItemOverview = {
  meeting_id: number;
  meeting_date: string;
  meeting_type: string;
  file_name: string;
  task: string;
  owner: string;
  due_date: string;
  priority: "High" | "Medium" | "Low";
  dependencies: string;
  status: string;
};

export type ActionItemsResponse = {
  total_pending: number;
  action_items: ActionItemOverview[];
};
