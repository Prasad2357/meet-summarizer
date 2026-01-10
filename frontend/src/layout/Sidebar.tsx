import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Settings, Lightbulb } from "lucide-react"

export default function Sidebar() {
    const location = useLocation()

    const items = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            to: "/",
        },

        {
            label: "Settings",
            icon: Settings,
            to: "/settings",
        },
        {
            label: "Insights",
            icon: Lightbulb,
            to: "/insights",
        }

    ]

    return (
        <aside className="w-64 border-r bg-background p-4">
            <h2 className="mb-6 text=xl font-semibold"> Meet Summarizer</h2>

            <nav className="space-y-1">
                {items.map((item) => {
                    const active = location.pathname === item.to
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={
                                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                                ${active ? "bg-muted font-medium" : "hover:bg-muted"}
                                `}>
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}