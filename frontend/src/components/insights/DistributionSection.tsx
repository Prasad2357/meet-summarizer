import type { OverviewStats } from "../../types/overview";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  stats: OverviewStats | null;
  loading: boolean;
};

const COLORS = [
  "#6365f1c9", // indigo
  "#22c55ec4", // green
  "#f59f0bbb", // amber
  "#ef4444c5", // red
  "#06B6D4", // cyan
];

const DistributionSection = ({ stats, loading }: Props) => {
    if (loading || !stats) {
    return (
      <div className="rounded-lg border bg-card p-6 h-full">
        <h2 className="text-lg font-medium mb-4">
          Meeting Type Distribution
        </h2>
        <div className="text-sm text-muted-foreground">
          Loading distribution...
        </div>
      </div>
    );
  }

    const data = Object.entries(
    stats.meeting_type_distribution
  ).map(([type, count]) => ({
    name: type.replace("_", " "),
    value: count,
  }));

  return (
    <div className="rounded-lg border bg-card p-6 h-full">
      <h2 className="text-lg font-medium mb-4">
        Meeting Type Distribution
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );


};

export default DistributionSection;
