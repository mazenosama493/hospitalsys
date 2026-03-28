"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Filter, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientSearchBar } from "@/features/frontdesk/components/PatientSearchBar";
import { PatientCard } from "@/features/frontdesk/components/PatientCard";
import { mockADTPatients } from "@/features/frontdesk/data/mock-data";
import { Badge } from "@/components/ui/badge";

const statusFilters = ["all", "active", "admitted", "discharged", "critical"] as const;

export default function PatientSearchPage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const filteredPatients = statusFilter === "all"
        ? mockADTPatients
        : mockADTPatients.filter((p) => p.status === statusFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Patient Search</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Find patients by name, MRN, phone, or email
                    </p>
                </div>
                <Link href="/frontdesk/patients/register">
                    <Button className="gap-2">
                        <UserPlus className="h-4 w-4" /> Register New
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <PatientSearchBar autoFocus showShortcutHint />

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {statusFilters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === f
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                            }`}
                    >
                        {f === "all" ? "All Patients" : f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === "all" && <span className="ml-1 opacity-70">({mockADTPatients.length})</span>}
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-2">
                {filteredPatients.length === 0 ? (
                    <Card className="border-border/50">
                        <CardContent className="py-12 text-center">
                            <p className="text-sm text-muted-foreground">No patients matching the current filter.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPatients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))
                )}
            </div>
        </div>
    );
}
