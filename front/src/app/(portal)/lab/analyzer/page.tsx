"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { SpecimenBadge } from "@/features/lab/components/SpecimenBadge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockAnalyzerQueue } from "@/features/lab/mock/data";
import { cn } from "@/lib/utils";

const statusIcons: Record<string, typeof Clock> = {
    queued: Clock,
    loading: Loader2,
    running: Activity,
    completed: CheckCircle2,
    error: AlertTriangle,
};

const statusColors: Record<string, string> = {
    queued: "border-border/50",
    loading: "border-amber-500/40 bg-amber-500/[0.03]",
    running: "border-sky-500/40 bg-sky-500/[0.03]",
    completed: "border-emerald-500/40 bg-emerald-500/[0.03]",
    error: "border-red-500/40 bg-red-500/[0.03]",
};

export default function AnalyzerQueuePage() {
    // Group by instrument
    const instruments = Array.from(new Set(mockAnalyzerQueue.map((q) => q.instrument)));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analyzer Queue</h1>
                <p className="text-sm text-muted-foreground mt-1">Per-instrument specimen queue with position and ETA</p>
            </div>

            {instruments.map((instrument) => {
                const items = mockAnalyzerQueue.filter((q) => q.instrument === instrument).sort((a, b) => a.queuePosition - b.queuePosition);
                const running = items.find((i) => i.status === "running");

                return (
                    <Card key={instrument} className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    {instrument}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px]">{items.length} specimen{items.length > 1 ? "s" : ""}</Badge>
                                    {running && <Badge className="text-[10px] bg-sky-500/10 text-sky-700 border-sky-500/30">Running</Badge>}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {items.map((item) => {
                                    const Icon = statusIcons[item.status] || Clock;
                                    return (
                                        <div key={item.id} className={cn("flex items-center gap-3 p-2.5 rounded-lg border transition-colors", statusColors[item.status])}>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold shrink-0">
                                                #{item.queuePosition}
                                            </div>
                                            <Icon className={cn("h-4 w-4 shrink-0", item.status === "running" && "animate-spin text-sky-600", item.status === "error" && "text-red-600")} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{item.testName}</p>
                                                    <StatusBadge status={item.priority} />
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                                    <span>{item.patientName}</span>
                                                    <span>·</span>
                                                    <span className="font-mono">{item.specimenBarcode}</span>
                                                    {item.startedAt && <><span>·</span><span>Started: {new Date(item.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>}
                                                </div>
                                            </div>
                                            {item.estimatedMinutes && (
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs font-medium">{item.estimatedMinutes} min</p>
                                                    <p className="text-[10px] text-muted-foreground">ETA</p>
                                                </div>
                                            )}
                                            <Badge variant="outline" className="text-[10px] capitalize shrink-0">{item.status}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
