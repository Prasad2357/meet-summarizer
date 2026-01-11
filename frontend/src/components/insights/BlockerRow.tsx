import type { Blocker } from "../../types/blockers";
import { useNavigate } from "react-router-dom";

type Props = {
  blocker: Blocker;
};

const severityStyles = {
  High: "text-red-600",
  Medium: "text-orange-500",
  Low: "text-green-600",
};

const BlockerRow = ({ blocker }: Props) => {
    const navigate = useNavigate();
  return (
    <div
      className="p-4 space-y-2 cursor-pointer hover:bg-muted"
      onClick={() => navigate(`/meetings/${blocker.meeting_id}`)}
    >
      <div className="flex justify-between">
        <div className="font-medium">{blocker.issue}</div>
        <div className={`text-sm font-medium ${severityStyles[blocker.severity]}`}>
          {blocker.severity}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Affected: {blocker.affected_areas.join(", ")}
      </div>

      <div className="text-sm">
        <span className="font-medium">Mitigation:</span>{" "}
        {blocker.mitigation}
      </div>

      <div className="text-xs text-muted-foreground">
        {blocker.meeting_type} • {blocker.meeting_date}
      </div>
    </div>
  );
};

export default BlockerRow;
