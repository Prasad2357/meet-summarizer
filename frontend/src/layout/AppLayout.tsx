import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <TopBar />

                <main className="flex-1 overflow-auto">
                    <Outlet />

                </main>
            </div>
        </div>
    )
}