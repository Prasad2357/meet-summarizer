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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* High Severity */}
                <div className="rounded-lg border bg-red-50 p-4">
                    <div className="text-sm text-red-600 font-medium">
                        High Severity
                    </div>
                    <div className="text-2xl font-semibold text-red-700">
                        {highSeverityCount ?? "--"}
                    </div>
                </div>

                {/* Total Active */}
                <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground font-medium">
                        Total Active
                    </div>
                    <div className="text-2xl font-semibold">
                        {total ?? "--"}
                    </div>
                </div>
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
