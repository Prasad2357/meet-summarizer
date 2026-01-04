import { Badge } from "@/components/ui/badge"
import type { ActionItem } from "../../types/actionitem"

type Props = {
    item: ActionItem
}

export default function ActionItemRow({ item }: Props) {
      return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-1">
        <p className="font-medium">{item.task}</p>
        <p className="text-sm text-muted-foreground">
          Owner: {item.owner || "Unassigned"} · Due: {item.due_date}
        </p>
      </div>

      <Badge
        variant={
          item.priority === "High"
            ? "destructive"
            : item.priority === "Medium"
            ? "default"
            : "secondary"
        }
      >
        {item.priority}
      </Badge>
    </div>
  )
}
