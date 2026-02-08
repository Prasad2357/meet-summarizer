import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

export default function AppLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Topbar />

                <main className="flex-1 overflow-auto">
                    <Outlet />

                </main>
            </div>
        </div>
    )
}