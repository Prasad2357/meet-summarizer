import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useAuthStore } from "../state/authStore";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function TopBar() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <header className="w-full border-b bg-background p-4 flex items-center justify-between">
            <input
                placeholder="Search past meetings..."
                className="w-72 rounded-md border px-3 py-1.5 text-sm bg-muted"
            />

            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground mr-2">
                    Local Server Online
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{initial}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "user@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    )
}