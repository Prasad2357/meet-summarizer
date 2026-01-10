import { useNavigate } from "react-router-dom";

type Props = {
    active: "overview" | "action-items" | "blockers"
}

const InsightsTab = ({ active }: Props) => {
    const navigate = useNavigate();
    const base = "px-4 py-2 rounded-md text-sm font-medium cursor-pointer"

    const activeClass = "bg-primary text-primary-foreground"

    const inactiveClass = "text-muted-foreground hover:bg-muted"

    return (
        <div className="flex gap-2">
            <div
                className={`${base} ${active === "overview" ? activeClass : inactiveClass}`}
                onClick={() => navigate("/insights")}
            >
                Overview
            </div>

            <div
                className={`${base} ${active === "action-items" ? activeClass : inactiveClass}`}
                onClick={() => navigate("/insights/action-items")}
            >
                Action Items
            </div>

            <div
                className={`${base} ${active === "blockers" ? activeClass : inactiveClass}`}
                onClick={() => navigate("/insights/blockers")}
            >
                Blockers
            </div>


        </div>



    )


}

export default InsightsTab