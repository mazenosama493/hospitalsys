"use client";

import { ClipboardList, ArrowRight, Sun, Moon, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandoffCard } from "@/features/nurse/components/HandoffCard";
import { mockHandoffs } from "@/features/nurse/mock/data";

const shiftIcons = { day: Sun, evening: Sunset, night: Moon };

export default function HandoffPage() {
    const shiftType = mockHandoffs[0]?.shiftType || "day";
    const ShiftIcon = shiftIcons[shiftType];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shift Handoff</h1>
                    <p className="text-sm text-muted-foreground mt-1">SBAR-based patient handoff for shift change</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-medium capitalize">
                    <ShiftIcon className="h-3.5 w-3.5" /> {shiftType} Shift Handoff
                </div>
            </div>

            {/* Handoff summary */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        Handoff Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">From: </span>
                            <span className="font-medium">{mockHandoffs[0]?.fromNurse}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <span className="text-muted-foreground">To: </span>
                            <span className="font-medium">{mockHandoffs[0]?.toNurse}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{mockHandoffs.length} patient{mockHandoffs.length > 1 ? "s" : ""}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{mockHandoffs[0]?.shiftDate}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* SBAR handoff cards */}
            <div className="space-y-4">
                {mockHandoffs.map((handoff) => (
                    <HandoffCard key={handoff.id} handoff={handoff} />
                ))}
            </div>
        </div>
    );
}
