"use client";

import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { roleMeta } from "@/config/roles";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
    const { role } = useAuth();
    const meta = role ? roleMeta[role] : null;

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-md px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-5" />

            {/* Portal label */}
            {meta && (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                        {meta.label} Portal
                    </span>
                </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div className="hidden md:flex items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="h-8 w-56 pl-8 bg-muted/50 border-0 text-sm focus:bg-background focus:border-border transition-all"
                    />
                </div>
            </div>

            {/* Notifications */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon" className="relative h-8 w-8" />
                    }
                >
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                    <div className="px-3 py-2.5 border-b">
                        <p className="text-sm font-semibold">Notifications</p>
                    </div>
                    <DropdownMenuItem className="py-3 cursor-pointer">
                        <div>
                            <p className="text-sm">New lab results available</p>
                            <p className="text-xs text-muted-foreground mt-0.5">2 minutes ago</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 cursor-pointer">
                        <div>
                            <p className="text-sm">Appointment confirmed</p>
                            <p className="text-xs text-muted-foreground mt-0.5">1 hour ago</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-3 cursor-pointer">
                        <div>
                            <p className="text-sm">System update completed</p>
                            <p className="text-xs text-muted-foreground mt-0.5">3 hours ago</p>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
