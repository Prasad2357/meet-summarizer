import type { OverviewStats } from "../../types/overview";

type Props = {
  stats: OverviewStats | null;
  loading: boolean;
};

const DistributionSection = ({ stats, loading }: Props) => {
  return (
    <div className="rounded-lg border bg-card p-6 h-full">
      <h2 className="text-lg font-medium mb-4">
        Meeting Type Distribution
      </h2>

      {loading || !stats ? (
        <div className="text-sm text-muted-foreground">
          Loading distribution...
        </div>
      ) : (
        <ul className="space-y-2 text-sm">
          {Object.entries(stats.meeting_type_distribution).map(
            ([type, count]) => (
              <li key={type} className="flex justify-between">
                <span className="capitalize">{type}</span>
                <span className="font-medium">{count}</span>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default DistributionSection;
