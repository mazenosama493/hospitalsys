"use client";

import { useState } from "react";
import { Activity, Users, Clock, Timer, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/molecules/StatCard";
import { QueueTicket } from "@/features/frontdesk/components/QueueTicket";
import { mockQueue } from "@/features/frontdesk/data/mock-data";
import type { ServiceType, QueueStatus } from "@/types";

const serviceFilters: Array<{ label: string; value: string }> = [
    { label: "All Services", value: "all" },
    { label: "Registration", value: "registration" },
    { label: "Insurance", value: "insurance" },
    { label: "Consultation", value: "consultation" },
    { label: "Lab", value: "lab" },
    { label: "Radiology", value: "radiology" },
    { label: "Pharmacy", value: "pharmacy" },
    { label: "Billing", value: "billing" },
];

const statusFilters: Array<{ label: string; value: string }> = [
    { label: "Active", value: "active" },
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
];

export default function QueuePage() {
    const [serviceFilter, setServiceFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("active");

    const [queue, setQueue] = useState(mockQueue);

    const filtered = queue.filter((q) => {
        const serviceMatch = serviceFilter === "all" || q.service === serviceFilter;
        const statusMatch =
            statusFilter === "all" ? true :
                statusFilter === "active" ? ["waiting", "serving", "called"].includes(q.status) :
                    q.status === statusFilter;
        return serviceMatch && statusMatch;
    });

    const waiting = queue.filter((q) => q.status === "waiting").length;
    const serving = queue.filter((q) => q.status === "serving" || q.status === "called").length;
    const completed = queue.filter((q) => q.status === "completed").length;
    const avgWait = queue.filter((q) => q.status === "waiting" && q.estimatedWait).reduce((sum, q) => sum + (q.estimatedWait || 0), 0) / Math.max(waiting, 1);

    const handleCall = (id: string) => {
        setQueue((prev) => prev.map((q) => q.id === id ? { ...q, status: "called" as QueueStatus, window: "Window 3" } : q));
    };

    const handleComplete = (id: string) => {
        setQueue((prev) => prev.map((q) => q.id === id ? { ...q, status: "completed" as QueueStatus } : q));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Service Queue</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage patient service window assignments and wait times</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Waiting" value={waiting} icon={Users} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="Being Served" value={serving} icon={Activity} iconClassName="bg-cyan-500/10 text-cyan-600" />
                <StatCard title="Completed" value={completed} icon={Clock} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="Avg Wait" value={`${Math.round(avgWait)} min`} icon={Timer} iconClassName="bg-sky-500/10 text-sky-600" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {statusFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${statusFilter === f.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1.5 flex-wrap">
                    {serviceFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setServiceFilter(f.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${serviceFilter === f.value
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Queue list */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Queue ({filtered.length} {statusFilter === "active" ? "active" : "total"})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filtered.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No entries matching current filters.</p>
                    ) : (
                        <div className="space-y-2">
                            {filtered
                                .sort((a, b) => {
                                    // Priority sort: urgent first, then by wait time
                                    const priorityOrder = { stat: 0, urgent: 1, high: 2, normal: 3, low: 4 };
                                    const aPriority = priorityOrder[a.priority] ?? 3;
                                    const bPriority = priorityOrder[b.priority] ?? 3;
                                    if (aPriority !== bPriority) return aPriority - bPriority;
                                    return new Date(a.waitingSince).getTime() - new Date(b.waitingSince).getTime();
                                })
                                .map((entry) => (
                                    <QueueTicket
                                        key={entry.id}
                                        entry={entry}
                                        onCall={handleCall}
                                        onComplete={handleComplete}
                                    />
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
