import type { Blocker } from "../../types/blockers";
import BlockerRow from "./BlockerRow";

type Props = {
  blockers: Blocker[];
  loading: boolean;
  total?: number;
  highSeverityCount?: number;
};

const BlockersList = ({
  blockers,
  loading,
  total,
  highSeverityCount,
}: Props) => {
  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading blockers...
      </div>
    );
  }

  if (!blockers.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No active blockers.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{total} active blockers</span>
        <span className="text-red-600">
          {highSeverityCount} high severity
        </span>
      </div>

      {/* List */}
      <div className="rounded-lg border divide-y">
        {blockers.map((blocker, index) => (
          <BlockerRow key={index} blocker={blocker} />
        ))}
      </div>
    </div>
  );
};

export default BlockersList;
