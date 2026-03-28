"use client";

import { useState } from "react";
import { BedDouble, ArrowRightLeft, LogOut, UserPlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { BedMap } from "@/features/frontdesk/components/BedMap";
import { mockAdmissions, mockBeds } from "@/features/frontdesk/data/mock-data";

const tabs = ["All", "Inpatient", "Outpatient", "Emergency", "Observation"] as const;

export default function AdmissionsPage() {
    const [activeTab, setActiveTab] = useState<string>("All");
    const [showBedMap, setShowBedMap] = useState(false);

    const filtered = activeTab === "All"
        ? mockAdmissions
        : mockAdmissions.filter((a) => a.type === activeTab.toLowerCase());

    const admitted = mockAdmissions.filter((a) => a.status === "admitted").length;
    const bedStats = {
        total: mockBeds.length,
        available: mockBeds.filter((b) => b.status === "available").length,
        occupied: mockBeds.filter((b) => b.status === "occupied").length,
        reserved: mockBeds.filter((b) => b.status === "reserved").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">ADT Board</h1>
                    <p className="text-sm text-muted-foreground mt-1">Admissions, discharges, and transfers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setShowBedMap(!showBedMap)}>
                        <BedDouble className="h-4 w-4" /> {showBedMap ? "Hide" : "Show"} Bed Map
                    </Button>
                    <Button className="gap-2">
                        <UserPlus className="h-4 w-4" /> New Admission
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Active Admissions" value={admitted} icon={UserPlus} iconClassName="bg-cyan-500/10 text-cyan-600" />
                <StatCard title="Available Beds" value={bedStats.available} icon={BedDouble} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="Occupied Beds" value={bedStats.occupied} icon={BedDouble} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Reserved Beds" value={bedStats.reserved} icon={BedDouble} iconClassName="bg-amber-500/10 text-amber-600" />
            </div>

            {/* Bed Map (toggleable) */}
            {showBedMap && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <BedDouble className="h-4 w-4 text-primary" /> Bed Map
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BedMap beds={mockBeds} />
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeTab === tab
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                            }`}
                    >
                        {tab}
                        {tab !== "All" && (
                            <span className="ml-1 opacity-70">
                                ({mockAdmissions.filter((a) => a.type === tab.toLowerCase()).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Admissions list */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left font-medium text-muted-foreground p-3">Patient</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Type</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Doctor</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Department</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Ward / Bed</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Admitted</th>
                                    <th className="text-left font-medium text-muted-foreground p-3">Status</th>
                                    <th className="text-right font-medium text-muted-foreground p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((adm) => (
                                    <tr key={adm.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium">{adm.patientName}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{adm.mrn}</p>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline" className="text-[10px] capitalize">{adm.type}</Badge>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{adm.admittingDoctor}</td>
                                        <td className="p-3">{adm.department}</td>
                                        <td className="p-3">
                                            {adm.ward ? (
                                                <span className="text-xs">{adm.ward} · {adm.bed}</span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground">
                                            {new Date(adm.admittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </td>
                                        <td className="p-3"><StatusBadge status={adm.status} /></td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" title="Transfer">
                                                    <ArrowRightLeft className="h-3 w-3" /> Transfer
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-600 hover:text-red-700" title="Discharge">
                                                    <LogOut className="h-3 w-3" /> Discharge
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No admissions matching this filter.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
