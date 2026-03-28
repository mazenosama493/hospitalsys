"use client";

import { useState } from "react";
import { Pill, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MedicationProfile } from "@/features/pharmacy/components/MedicationProfile";
import { mockPrescriptions, mockRefills } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

// Derive unique patient list from prescriptions
const uniquePatients = Array.from(
    new Map(mockPrescriptions.map((rx) => [rx.patientId, { id: rx.patientId, name: rx.patientName, mrn: rx.mrn }])).values()
);

export default function MedProfilesPage() {
    const [selectedPatientId, setSelectedPatientId] = useState<string>(uniquePatients[0]?.id ?? "");
    const [search, setSearch] = useState("");

    const filteredPatients = uniquePatients.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
    });

    const activeMeds = mockPrescriptions.filter(
        (rx) =>
            rx.patientId === selectedPatientId &&
            rx.status !== "dispensed"
    );
    const patientAllergies = mockPrescriptions.find((rx) => rx.patientId === selectedPatientId)?.allergies ?? [];
    const patientRefills = mockRefills.filter((rf) =>
        activeMeds.some((m) => rf.prescriptionId.startsWith(m.id.split("-OLD")[0]))
    );
    const selectedPatient = uniquePatients.find((p) => p.id === selectedPatientId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Medication Profiles</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Patient medication history, active therapies, and refill records
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                {/* Patient selector */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search patients…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-9 text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        {filteredPatients.map((p) => {
                            const medCount = mockPrescriptions.filter(
                                (rx) => rx.patientId === p.id && rx.status !== "dispensed"
                            ).length;
                            const allergies = mockPrescriptions.find((rx) => rx.patientId === p.id)?.allergies ?? [];
                            const isSelected = p.id === selectedPatientId;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPatientId(p.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all",
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border/50 hover:bg-muted/40"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-sm font-medium">{p.name}</p>
                                        {medCount > 0 && (
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                {medCount} Rx
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground">{p.mrn}</p>
                                    {allergies.length > 0 && (
                                        <p className="text-[10px] text-red-600 mt-0.5 font-medium">
                                            ⚠ {allergies.join(", ")}
                                        </p>
                                    )}
                                </button>
                            );
                        })}

                        {filteredPatients.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                <Users className="h-7 w-7 mx-auto mb-2 text-muted-foreground/30" />
                                No patients found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile detail */}
                <div>
                    {selectedPatient ? (
                        <MedicationProfile
                            patientName={selectedPatient.name}
                            allergies={patientAllergies}
                            activeMeds={activeMeds}
                            refills={patientRefills}
                        />
                    ) : (
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Pill className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm">Select a patient to view their medication profile</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
