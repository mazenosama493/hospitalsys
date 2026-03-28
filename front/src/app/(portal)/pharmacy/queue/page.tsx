"use client";

import { useState } from "react";
import { Pill, Search, Filter, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockPrescriptions } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "ordered", "pending-verification", "verified", "dispensing", "dispensed"] as const;
const settingFilters = ["all", "inpatient", "outpatient", "discharge"] as const;
const priorityOrder: Record<string, number> = { stat: 0, urgent: 1, high: 2, normal: 3 };

export default function RxQueuePage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [settingFilter, setSettingFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const rxs = mockPrescriptions
        .filter((rx) => statusFilter === "all" || rx.status === statusFilter)
        .filter((rx) => settingFilter === "all" || rx.setting === settingFilter)
        .filter((rx) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                rx.patientName.toLowerCase().includes(q) ||
                rx.medication.toLowerCase().includes(q) ||
                rx.id.toLowerCase().includes(q) ||
                rx.mrn.toLowerCase().includes(q) ||
                rx.prescribedBy.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Rx Queue</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    All prescriptions — ordered by priority · {rxs.length} result{rxs.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search by patient, drug, Rx ID, MRN, or prescriber…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mr-1">Status:</span>
                        {statusFilters.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                                    statusFilter === s
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                                )}
                            >
                                {s.replace(/-/g, " ")}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground ml-2 mr-1">Setting:</span>
                        {settingFilters.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSettingFilter(s)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                                    settingFilter === s
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-xs text-muted-foreground bg-muted/30">
                                    <th className="text-left py-2.5 px-3 font-medium">Rx ID</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Patient / MRN</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Medication</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Route · Freq</th>
                                    <th className="text-center py-2.5 px-3 font-medium">Qty</th>
                                    <th className="text-center py-2.5 px-3 font-medium">Priority</th>
                                    <th className="text-center py-2.5 px-3 font-medium">Status</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Setting</th>
                                    <th className="text-center py-2.5 px-3 font-medium">Alerts</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Prescriber</th>
                                    <th className="text-left py-2.5 px-3 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rxs.map((rx) => {
                                    const hasSevere = rx.warnings.some(
                                        (w) => w.severity === "severe" || w.severity === "contraindicated"
                                    );
                                    return (
                                        <tr
                                            key={rx.id}
                                            className={cn(
                                                "border-b border-border/30 hover:bg-muted/40 transition-colors",
                                                rx.priority === "stat" && "bg-red-500/[0.03]",
                                                hasSevere && "border-l-2 border-l-red-500"
                                            )}
                                        >
                                            <td className="py-2.5 px-3 font-mono text-xs">{rx.id}</td>
                                            <td className="py-2.5 px-3">
                                                <p className="font-medium text-xs">{rx.patientName}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono">{rx.mrn}</p>
                                                {rx.allergies.length > 0 && (
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        <AlertTriangle className="h-2.5 w-2.5 text-red-500 shrink-0" />
                                                        <span className="text-[9px] text-red-600 font-medium">{rx.allergies.join(", ")}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-3 text-xs">
                                                <span className="font-medium">{rx.medication}</span>{" "}
                                                <span className="text-muted-foreground">{rx.dosage}</span>
                                            </td>
                                            <td className="py-2.5 px-3 text-xs text-muted-foreground capitalize">
                                                {rx.route} · {rx.frequency}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <Badge variant="secondary" className="text-xs">{rx.quantity}</Badge>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <StatusBadge status={rx.priority} />
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <StatusBadge status={rx.status} />
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <Badge variant="outline" className="text-[10px] capitalize">{rx.setting}</Badge>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                {rx.warnings.length > 0 ? (
                                                    <span
                                                        className={cn(
                                                            "text-[10px] font-semibold",
                                                            hasSevere ? "text-red-600" : "text-amber-600"
                                                        )}
                                                    >
                                                        ⚠ {rx.warnings.length}
                                                    </span>
                                                ) : (
                                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 inline" />
                                                )}
                                            </td>
                                            <td className="py-2.5 px-3 text-xs text-muted-foreground">{rx.prescribedBy}</td>
                                            <td className="py-2.5 px-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {new Date(rx.prescribedAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {rxs.length === 0 && (
                            <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                                <Pill className="h-8 w-8 text-muted-foreground/40" />
                                No prescriptions matching the current filters.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
