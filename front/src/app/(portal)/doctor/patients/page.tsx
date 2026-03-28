"use client";

import Link from "next/link";
import { useState } from "react";
import { Users, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockDoctorPatients } from "@/features/doctor/mock/data";

const filters = ["all", "admitted", "critical", "stable", "active"] as const;

export default function MyPatientsPage() {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const patients = mockDoctorPatients
        .filter((p) => filter === "all" || p.status === filter)
        .filter((p) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
        });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Patients</h1>
                <p className="text-sm text-muted-foreground mt-1">Admitted and outpatient panel for Dr. David Chen</p>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder="Search by name or MRN…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
                </div>
                <div className="flex items-center gap-1.5">
                    {filters.map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"}`}>
                            {f === "all" ? `All (${mockDoctorPatients.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient list */}
            <div className="space-y-2">
                {patients.length === 0 ? (
                    <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No patients matching filter.</p></CardContent></Card>
                ) : (
                    patients.map((patient) => {
                        const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
                        return (
                            <Link key={patient.id} href={`/doctor/patients/${patient.id}`} className="group flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:shadow-md hover:border-primary/30 transition-all">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback className={`text-xs font-bold ${patient.status === "critical" ? "bg-red-500/15 text-red-600" : "bg-primary/10 text-primary"}`}>
                                        {patient.firstName[0]}{patient.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">{patient.firstName} {patient.lastName}</p>
                                        {patient.allergies && patient.allergies.length > 0 && (
                                            <div className="flex gap-0.5">
                                                {patient.allergies.map((a) => (
                                                    <Badge key={a} variant="destructive" className="text-[9px] px-1 py-0">{a}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span className="font-mono">{patient.mrn}</span>
                                        <span>·</span>
                                        <span>{patient.gender === "male" ? "M" : "F"} · {age}y</span>
                                        {patient.ward && <><span>·</span><span>{patient.ward} Rm {patient.roomNumber}</span></>}
                                        {patient.diagnosis && <><span>·</span><span className="truncate max-w-[200px]">{patient.diagnosis}</span></>}
                                    </div>
                                </div>
                                <StatusBadge status={patient.status} />
                                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
