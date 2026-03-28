"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SpecimenBadge } from "@/features/lab/components/SpecimenBadge";
import { mockSpecimens } from "@/features/lab/mock/data";
import type { SpecimenStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusSteps: SpecimenStatus[] = ["ordered", "collected", "in-transit", "received", "processing", "analyzed", "resulted"];
const statusFilters: ("all" | SpecimenStatus)[] = ["all", ...statusSteps, "rejected"];

function statusIndex(status: SpecimenStatus): number {
    return statusSteps.indexOf(status);
}

export default function SpecimenTrackingPage() {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const specimens = mockSpecimens
        .filter((s) => filter === "all" || s.status === filter)
        .filter((s) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return s.barcode.toLowerCase().includes(q) || s.patientName.toLowerCase().includes(q);
        });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Specimen Tracking</h1>
                <p className="text-sm text-muted-foreground mt-1">Lifecycle view from collection through final result</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder="Search by barcode or patient…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                    {statusFilters.map((s) => (
                        <button key={s} onClick={() => setFilter(s)} className={cn("px-2 py-1 rounded-full text-[10px] font-medium border transition-colors capitalize", filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {s.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Specimen cards */}
            {specimens.length === 0 ? (
                <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No specimens matching filter.</p></CardContent></Card>
            ) : (
                <div className="space-y-3">
                    {specimens.map((sp) => {
                        const idx = statusIndex(sp.status);
                        return (
                            <Card key={sp.id} className={cn("border-border/50 shadow-sm", sp.status === "rejected" && "border-red-500/40 bg-red-500/[0.02]")}>
                                <CardContent className="py-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <SpecimenBadge barcode={sp.barcode} status={sp.status} specimenType={sp.type} />
                                            <span className="text-sm font-medium">{sp.patientName}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {sp.testNames.join(", ")}
                                        </div>
                                    </div>
                                    {/* Progress steps */}
                                    <div className="flex items-center gap-0">
                                        {statusSteps.map((step, i) => {
                                            const isCompleted = idx >= i;
                                            const isCurrent = idx === i;
                                            return (
                                                <div key={step} className="flex items-center flex-1">
                                                    <div className={cn(
                                                        "flex items-center justify-center h-6 w-6 rounded-full text-[9px] font-bold border-2 shrink-0",
                                                        isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground",
                                                        isCurrent && "ring-2 ring-primary/30"
                                                    )}>
                                                        {isCompleted ? "✓" : i + 1}
                                                    </div>
                                                    {i < statusSteps.length - 1 && (
                                                        <div className={cn("flex-1 h-0.5 mx-1", isCompleted ? "bg-primary" : "bg-border")} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-1 px-0">
                                        {statusSteps.map((step) => (
                                            <span key={step} className="text-[8px] text-muted-foreground capitalize text-center flex-1">{step.replace("-", " ")}</span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
