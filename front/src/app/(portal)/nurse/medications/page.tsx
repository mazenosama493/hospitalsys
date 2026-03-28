"use client";

import { useState } from "react";
import { Pill, AlertTriangle, CheckCircle2, Clock, ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/molecules/StatCard";
import { MARTimeline } from "@/features/nurse/components/MARTimeline";
import { mockWardPatients, mockMAR } from "@/features/nurse/mock/data";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "overdue", "scheduled", "given", "missed"] as const;

export default function MedAdminPage() {
    const [selectedPatient, setSelectedPatient] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const entries = mockMAR
        .filter((m) => selectedPatient === "all" || m.patientId === selectedPatient)
        .filter((m) => filterStatus === "all" || m.status === filterStatus)
        .sort((a, b) => {
            if (a.status === "overdue" && b.status !== "overdue") return -1;
            if (a.status !== "overdue" && b.status === "overdue") return 1;
            return a.scheduledTime.localeCompare(b.scheduledTime);
        });

    const overdue = mockMAR.filter((m) => m.status === "overdue").length;
    const scheduled = mockMAR.filter((m) => m.status === "scheduled").length;
    const given = mockMAR.filter((m) => m.status === "given").length;
    const missed = mockMAR.filter((m) => m.status === "missed").length;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Medication Administration</h1>
                    <p className="text-sm text-muted-foreground mt-1">eMAR — scan, verify, and document medication delivery</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <ScanLine className="h-4 w-4" /> Open Barcode Scanner
                </Button>
            </div>

            {/* Overdue alert */}
            {overdue > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.06] border-red-500/30 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    <span className="font-semibold text-red-700">{overdue} medication{overdue > 1 ? "s" : ""} overdue — requires immediate attention</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Given" value={given} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="Scheduled" value={scheduled} icon={Clock} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Overdue" value={overdue} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Missed/Refused" value={missed} icon={Pill} iconClassName="bg-amber-500/10 text-amber-600" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => setSelectedPatient("all")} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", selectedPatient === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                        All Patients
                    </button>
                    {mockWardPatients.map((p) => (
                        <button key={p.id} onClick={() => setSelectedPatient(p.id)} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", selectedPatient === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {p.roomNumber} · {p.firstName}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5">
                    {statusFilters.map((s) => (
                        <button key={s} onClick={() => setFilterStatus(s)} className={cn("px-2 py-1 rounded-full text-[10px] font-medium border transition-colors capitalize", filterStatus === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAR */}
            <MARTimeline entries={entries} />
        </div>
    );
}
