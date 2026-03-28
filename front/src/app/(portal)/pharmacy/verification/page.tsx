"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { RxVerificationCard } from "@/features/pharmacy/components/RxVerificationCard";
import { mockPrescriptions } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

const tabs = ["pending", "all"] as const;
type Tab = typeof tabs[number];

export default function VerificationPage() {
    const [tab, setTab] = useState<Tab>("pending");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const pendingRxs = mockPrescriptions.filter(
        (rx) => rx.status === "pending-verification" || rx.status === "ordered"
    ).sort((a, b) => {
        const p: Record<string, number> = { stat: 0, urgent: 1, high: 2, normal: 3 };
        return (p[a.priority] ?? 3) - (p[b.priority] ?? 3);
    });

    const displayList = tab === "pending" ? pendingRxs : mockPrescriptions;
    const selected = displayList.find((rx) => rx.id === selectedId) ?? displayList[0] ?? null;

    const severePending = pendingRxs.filter((rx) =>
        rx.warnings.some((w) => w.severity === "severe" || w.severity === "contraindicated")
    );

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pharmacist Verification</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review drug interactions, allergies, and dosing before approving
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/5 text-xs">
                        {pendingRxs.length} pending
                    </Badge>
                    {severePending.length > 0 && (
                        <Badge variant="outline" className="text-red-600 border-red-500/30 bg-red-500/5 text-xs">
                            {severePending.length} severe alerts
                        </Badge>
                    )}
                </div>
            </div>

            {/* Safety alert */}
            {severePending.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.06] border-red-500/30 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    <div className="flex-1">
                        <span className="font-semibold text-red-700">
                            {severePending.length} prescription{severePending.length > 1 ? "s" : ""} with severe or contraindicated warnings require immediate review.
                        </span>
                        <p className="text-xs text-red-600/80 mt-0.5">
                            {severePending.map((rx) => `${rx.patientName} — ${rx.medication}`).join(" · ")}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setSelectedId(null); }}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize",
                            tab === t
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                    >
                        {t === "pending" && <Clock className="h-3.5 w-3.5" />}
                        {t === "all" && <Filter className="h-3.5 w-3.5" />}
                        {t === "pending" ? `Pending (${pendingRxs.length})` : "All Prescriptions"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Sidebar list */}
                <div className="space-y-1.5">
                    {displayList.map((rx) => {
                        const hasSevere = rx.warnings.some(
                            (w) => w.severity === "severe" || w.severity === "contraindicated"
                        );
                        const isSelected = (selected?.id ?? null) === rx.id;
                        return (
                            <button
                                key={rx.id}
                                onClick={() => setSelectedId(rx.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border/50 hover:bg-muted/40",
                                    hasSevere && !isSelected && "border-red-500/30 bg-red-500/[0.02]"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-muted-foreground">{rx.id}</span>
                                    <StatusBadge status={rx.priority} />
                                </div>
                                <p className="text-sm font-medium leading-tight">{rx.medication} {rx.dosage}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{rx.patientName}</p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <StatusBadge status={rx.status} />
                                    {rx.warnings.length > 0 && (
                                        <span className={cn("text-[10px] font-semibold flex items-center gap-0.5", hasSevere ? "text-red-600" : "text-amber-600")}>
                                            <AlertTriangle className="h-2.5 w-2.5" /> {rx.warnings.length}
                                        </span>
                                    )}
                                    {rx.status === "verified" && (
                                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                    {displayList.length === 0 && (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-emerald-500/50" />
                            All prescriptions verified.
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                <div>
                    {selected ? (
                        <RxVerificationCard rx={selected} />
                    ) : (
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <ShieldCheck className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm">Select a prescription to review</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
