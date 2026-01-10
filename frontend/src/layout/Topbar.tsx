import { Button } from "../components/ui/button";

export default function TopBar() {
    return (
        <header className="w-full border-b bg-background p-4 flex items-center justify-between">
            <input 
                placeholder = "Search past meetings..."
                className="w-72 rounded-md border px-3 py-1.5 text-sm bg-muted"
            />

            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    Local Server Online
                </span>

            <Button size="sm" variant="outline">
                User Profile
            </Button>

            </div>
        </header>
    )

}