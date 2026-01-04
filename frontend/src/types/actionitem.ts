export type ActionItem = {
  task: string
  owner: string
  due_date: string
  priority: "High" | "Medium" | "Low" | string
  status: string
}
