"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Save } from "lucide-react";
import { ResultEntryRow } from "@/features/lab/components/ResultEntryRow";
import { AbnormalHighlight } from "@/features/lab/components/AbnormalHighlight";
import { mockLabPanels } from "@/features/lab/mock/data";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "pending", "partial", "complete"] as const;

export default function ResultEntryPage() {
    const [filter, setFilter] = useState<string>("all");

    const panels = mockLabPanels
        .filter((p) => filter === "all" || p.status === filter)
        .filter((p) => p.status !== "released");

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Result Entry</h1>
                    <p className="text-sm text-muted-foreground mt-1">Enter and review test results — auto-flagging applies</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5">
                {statusFilters.map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-colors capitalize", filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Panel result cards */}
            {panels.length === 0 ? (
                <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No panels matching filter.</p></CardContent></Card>
            ) : (
                <div className="space-y-4">
                    {panels.map((panel) => {
                        const hasCritical = panel.results.some((r) => r.flag === "critical-high" || r.flag === "critical-low");
                        const hasPending = panel.results.some((r) => r.status === "pending");
                        return (
                            <AbnormalHighlight key={panel.id} flag={hasCritical ? "critical-high" : "normal"}>
                                <Card className={cn("border-border/50 shadow-sm", hasCritical && "border-red-500/30")}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                                <FlaskConical className="h-4 w-4 text-primary" />
                                                {panel.name} <span className="text-xs text-muted-foreground font-normal">({panel.code})</span>
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{panel.patientName}</span>
                                                <Badge variant="outline" className="text-[10px] capitalize">{panel.status}</Badge>
                                                {hasPending && <Button size="sm" className="h-7 text-xs gap-1"><Save className="h-3 w-3" /> Save</Button>}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b text-xs text-muted-foreground">
                                                        <th className="text-left py-2 px-3 font-medium">Code</th>
                                                        <th className="text-left py-2 px-3 font-medium">Test</th>
                                                        <th className="text-left py-2 px-3 font-medium">Value</th>
                                                        <th className="text-left py-2 px-3 font-medium">Unit</th>
                                                        <th className="text-left py-2 px-3 font-medium">Ref Range</th>
                                                        <th className="text-left py-2 px-3 font-medium">Flag</th>
                                                        <th className="text-left py-2 px-3 font-medium">Delta</th>
                                                        <th className="text-left py-2 px-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {panel.results.map((r) => (
                                                        <ResultEntryRow key={r.id} result={r} editable={hasPending} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AbnormalHighlight>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
