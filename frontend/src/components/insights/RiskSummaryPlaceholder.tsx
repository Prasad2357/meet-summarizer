import { useNavigate } from "react-router-dom";
import type { OverviewStats } from "../../types/overview";

type Props = {
  stats: OverviewStats | null;
  loading: boolean;
};

const RiskSummarySection = ({ stats, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card p-6 h-full">
      <h2 className="text-lg font-medium mb-4">
        Risk Summary
      </h2>

      <ul className="space-y-3 text-sm">
        <li
          className="flex justify-between cursor-pointer hover:underline"
          onClick={() => navigate("/insights?tab=blockers")}
        >
          <span>Meetings with Blockers</span>
          <span className="font-medium">
            {loading ? "--" : stats?.meetings_with_blockers ?? "--"}
          </span>
        </li>

        <li
          className="flex justify-between cursor-pointer hover:underline"
          onClick={() => navigate("/insights?tab=blockers")}
        >
          <span>Meetings with Red Flags</span>
          <span className="font-medium">
            {loading ? "--" : stats?.meetings_with_red_flags ?? "--"}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default RiskSummarySection;
