import type { Props } from "../../types/actionItemsFIlters";

const ActionItemsFilters = ({
  priority,
  owner,
  status,
  owners,
  onPriorityChange,
  onOwnerChange,
  onStatusChange,
}: Props) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <select
        value={owner}
        onChange={(e) => onOwnerChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        {owners.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
    </div>
  );
};

export default ActionItemsFilters;
