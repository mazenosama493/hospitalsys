"use client";

import { useState } from "react";
import { BedDouble, Search, AlertTriangle, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { BedsideSummary } from "@/features/nurse/components/BedsideSummary";
import { mockWardPatients, mockNursingTasks, mockVitals } from "@/features/nurse/mock/data";
import { cn } from "@/lib/utils";

const wards = ["All", "Ward A", "Ward B", "ICU"];
const acuityFilters = ["all", "critical", "high", "medium", "low"] as const;

export default function WardCensusPage() {
    const [selectedWard, setSelectedWard] = useState("All");
    const [acuityFilter, setAcuityFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const patients = mockWardPatients
        .filter((p) => selectedWard === "All" || p.ward === selectedWard)
        .filter((p) => acuityFilter === "all" || p.acuity === acuityFilter)
        .filter((p) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.roomNumber?.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
        });

    const total = mockWardPatients.length;
    const critical = mockWardPatients.filter((p) => p.acuity === "critical").length;
    const wardA = mockWardPatients.filter((p) => p.ward === "Ward A").length;
    const icu = mockWardPatients.filter((p) => p.ward === "ICU").length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Ward Census</h1>
                <p className="text-sm text-muted-foreground mt-1">Bed-based patient overview for your assigned wards</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Total Census" value={total} icon={BedDouble} iconClassName="bg-teal-500/10 text-teal-600" />
                <StatCard title="Critical Acuity" value={critical} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Ward A" value={wardA} icon={BedDouble} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="ICU" value={icu} icon={Heart} iconClassName="bg-rose-500/10 text-rose-600" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder="Search by name, room, or MRN…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
                </div>
                <div className="flex items-center gap-1.5">
                    {wards.map((w) => (
                        <button key={w} onClick={() => setSelectedWard(w)} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", selectedWard === w ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {w}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5">
                    {acuityFilters.map((a) => (
                        <button key={a} onClick={() => setAcuityFilter(a)} className={cn("px-2 py-1 rounded-full text-[10px] font-medium border transition-colors uppercase", acuityFilter === a ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient grid */}
            {patients.length === 0 ? (
                <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No patients matching filter.</p></CardContent></Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {patients.map((patient) => {
                        const patientTasks = mockNursingTasks.filter((t) => t.patientId === patient.id);
                        const overdueCount = patientTasks.filter((t) => t.isOverdue).length;
                        const nextTask = patientTasks.find((t) => t.status === "pending" || t.status === "overdue");
                        const latestVital = mockVitals.filter((v) => v.patientId === patient.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
                        const lastVitalsTime = latestVital ? new Date(latestVital.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined;

                        return (
                            <BedsideSummary
                                key={patient.id}
                                patient={patient}
                                nextTask={nextTask}
                                overdueTasks={overdueCount}
                                lastVitals={lastVitalsTime}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
