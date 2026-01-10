import type { ActionItemOverview } from "../../types/actionItemsOverview";

type Props = {
  item: ActionItemOverview;
};

const priorityColor = {
  High: "text-red-600",
  Medium: "text-orange-500",
  Low: "text-green-600",
};

const ActionItemRow = ({ item }: Props) => {
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="font-medium">{item.task}</div>
        <div className={`text-sm font-medium ${priorityColor[item.priority]}`}>
          {item.priority}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Owner: {item.owner} • Due: {item.due_date}
      </div>

      <div className="text-xs text-muted-foreground">
        {item.meeting_type} • {item.meeting_date}
      </div>
    </div>
  );
};

export default ActionItemRow;
