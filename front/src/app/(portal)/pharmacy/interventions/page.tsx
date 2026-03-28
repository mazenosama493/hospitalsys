"use client";

import { useState } from "react";
import { Activity, CheckCircle2, Clock, AlertTriangle, Filter, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { mockInterventions } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

const tabs = ["pending", "all"] as const;
type Tab = typeof tabs[number];

const typeColors: Record<string, string> = {
    monitoring: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    clarification: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    substitution: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    education: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    "adverse-event": "bg-red-500/10 text-red-700 border-red-500/20",
};

const outcomeConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 border-red-500/20" },
    "partially-accepted": { label: "Partial", className: "bg-sky-500/10 text-sky-700 border-sky-500/20" },
};

export default function InterventionsPage() {
    const [tab, setTab] = useState<Tab>("pending");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const pendingList = mockInterventions.filter((i) => i.outcome === "pending");
    const displayList = tab === "pending" ? pendingList : mockInterventions;
    const selected = displayList.find((i) => i.id === selectedId) ?? displayList[0] ?? null;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Interventions</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pharmacist clinical interventions — monitoring, clarifications, and drug safety
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/5 text-xs">
                        {pendingList.length} pending
                    </Badge>
                </div>
            </div>

            {/* Pending alert */}
            {pendingList.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-amber-500/[0.05] border-amber-500/30 text-sm">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <span className="font-medium text-amber-700">
                        {pendingList.length} intervention{pendingList.length > 1 ? "s" : ""} awaiting prescriber response.
                    </span>
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
                        {t === "pending" ? <Clock className="h-3.5 w-3.5" /> : <Filter className="h-3.5 w-3.5" />}
                        {t === "pending" ? `Pending (${pendingList.length})` : "All Interventions"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Sidebar list */}
                <div className="space-y-1.5">
                    {displayList.map((inv) => {
                        const outConf = outcomeConfig[inv.outcome] ?? outcomeConfig.pending;
                        const isSelected = (selected?.id ?? null) === inv.id;
                        return (
                            <button
                                key={inv.id}
                                onClick={() => setSelectedId(inv.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border/50 hover:bg-muted/40"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-muted-foreground">{inv.id}</span>
                                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", outConf.className)}>
                                        {outConf.label}
                                    </span>
                                </div>
                                <p className="text-sm font-medium leading-tight">{inv.patientName}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{inv.medication}</p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className={cn(
                                        "text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize",
                                        typeColors[inv.type] ?? "bg-muted/50 text-muted-foreground border-border/50"
                                    )}>
                                        {inv.type}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                    {displayList.length === 0 && (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500/50" />
                            No interventions to show.
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div>
                    {selected ? (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Intervention {selected.id}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize",
                                            typeColors[selected.type] ?? "bg-muted/50 text-muted-foreground border-border/50"
                                        )}>
                                            {selected.type}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                                            (outcomeConfig[selected.outcome] ?? outcomeConfig.pending).className
                                        )}>
                                            {(outcomeConfig[selected.outcome] ?? outcomeConfig.pending).label}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                                    <div><span className="text-muted-foreground">Patient: </span><span className="font-medium">{selected.patientName}</span></div>
                                    <div><span className="text-muted-foreground">Medication: </span><span className="font-medium">{selected.medication}</span></div>
                                    <div><span className="text-muted-foreground">Prescriber: </span><span>{selected.prescriberContact}</span></div>
                                    <div><span className="text-muted-foreground">Pharmacist: </span><span>{selected.pharmacistName}</span></div>
                                    <div><span className="text-muted-foreground">Created: </span><span>{new Date(selected.createdAt).toLocaleString()}</span></div>
                                    {selected.resolvedAt && (
                                        <div><span className="text-muted-foreground">Resolved: </span><span>{new Date(selected.resolvedAt).toLocaleString()}</span></div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Reason */}
                                <div className="p-3 rounded-lg border bg-amber-500/[0.04] border-amber-500/20 space-y-1">
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Reason / Clinical Issue</p>
                                    <p className="text-sm">{selected.reason}</p>
                                </div>

                                {/* Recommendation */}
                                <div className="p-3 rounded-lg border bg-teal-500/[0.04] border-teal-500/20 space-y-1">
                                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Pharmacist Recommendation</p>
                                    <p className="text-sm">{selected.recommendation}</p>
                                </div>

                                {/* Prescriber response */}
                                {selected.prescriberResponse && (
                                    <div className="p-3 rounded-lg border bg-emerald-500/[0.04] border-emerald-500/20 space-y-1">
                                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <MessageSquare className="h-3 w-3" /> Prescriber Response
                                        </p>
                                        <p className="text-sm">{selected.prescriberResponse}</p>
                                    </div>
                                )}

                                {/* Response text area for pending */}
                                {selected.outcome === "pending" && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground uppercase font-medium">
                                            Follow-up notes
                                        </label>
                                        <Textarea
                                            placeholder="Document prescriber contact or follow-up…"
                                            rows={3}
                                            className="text-xs resize-none"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs text-red-600 border-red-500/30 hover:bg-red-500/10"
                                            >
                                                Mark Rejected
                                            </Button>
                                            <Button size="sm" className="text-xs gap-1.5">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark Accepted
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Activity className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm">Select an intervention to view details</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
