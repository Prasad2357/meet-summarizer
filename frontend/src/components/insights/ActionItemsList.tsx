import type { ActionItemOverview } from "../../types/actionItemsOverview";
import ActionItemRow from "./ActionItemRow";

type Props = {
  items: ActionItemOverview[];
  loading: boolean;
  total?: number;
};

const ActionItemsList = ({ items, loading, total }: Props) => {
  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading action items...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No pending action items.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {total} pending action items
      </div>

      <div className="rounded-lg border divide-y">
        {items.map((item, index) => (
          <ActionItemRow key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ActionItemsList;
