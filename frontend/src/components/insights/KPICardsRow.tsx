import KPICard from "./KPICard";
import type { OverviewStats } from "../../types/overview";

type Props = {
  stats: OverviewStats | null;
  loading: boolean;
};

const KPICardsRow = ({ stats, loading }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Total Meetings"
        value={stats?.total_meetings}
        loading={loading}
      />
      <KPICard
        label="Recent Meetings (7 days)"
        value={stats?.recent_meetings_7days}
        loading={loading}
      />
      <KPICard
        label="Action Items"
        value={stats?.total_action_items}
        loading={loading}
      />
      <KPICard
        label="Blocker Rate"
        value={stats ? `${stats.blocker_rate.toFixed(2)}%` : undefined}
        loading={loading}
      />
    </div>
  );
};

export default KPICardsRow;
