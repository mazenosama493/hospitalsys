"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/molecules/StatCard";
import { ResultCard } from "@/features/doctor/components/ResultCard";
import { mockResults } from "@/features/doctor/mock/data";
import { Activity, AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["all", "critical", "high", "low", "normal", "unreviewed"] as const;

export default function ResultsReviewPage() {
    const [filter, setFilter] = useState<string>("all");

    const results = mockResults.filter((r) => {
        if (filter === "all") return true;
        if (filter === "unreviewed") return !r.reviewedBy;
        return r.flag === filter;
    });

    const critical = mockResults.filter((r) => r.flag === "critical").length;
    const high = mockResults.filter((r) => r.flag === "high").length;
    const unreviewed = mockResults.filter((r) => !r.reviewedBy).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Results Review</h1>
                <p className="text-sm text-muted-foreground mt-1">Lab and imaging results requiring physician review</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Total Results" value={mockResults.length} icon={Activity} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Critical" value={critical} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Flagged High" value={high} icon={AlertTriangle} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="Unreviewed" value={unreviewed} icon={Clock} iconClassName="bg-violet-500/10 text-violet-600" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5">
                {filters.map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                        filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                    )}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-3">
                {results.length === 0 ? (
                    <Card className="border-border/50">
                        <CardContent className="py-12 text-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">All results reviewed — nothing to show for this filter.</p>
                        </CardContent>
                    </Card>
                ) : (
                    results.map((result) => (
                        <div key={result.id} className="flex items-start gap-3">
                            <div className="flex-1">
                                <ResultCard result={result} />
                            </div>
                            {!result.reviewedBy && (
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-1 mt-4 shrink-0">
                                    <Eye className="h-3 w-3" /> Mark Reviewed
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
