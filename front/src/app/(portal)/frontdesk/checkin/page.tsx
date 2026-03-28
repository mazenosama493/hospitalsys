"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, UserCheck, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockADTPatients, mockFrontdeskAppointments } from "@/features/frontdesk/data/mock-data";
import type { ADTPatient } from "@/types";

export default function CheckInPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<ADTPatient | null>(null);
    const [step, setStep] = useState<"search" | "verify" | "confirmed">("search");

    const results = searchQuery.trim().length >= 1
        ? mockADTPatients.filter((p) => {
            const q = searchQuery.toLowerCase();
            return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
        })
        : [];

    const patientAppts = selectedPatient
        ? mockFrontdeskAppointments.filter((a) => a.patientId === selectedPatient.id && a.date === "2026-03-10" && a.status === "scheduled")
        : [];

    const handleSelectPatient = (p: ADTPatient) => {
        setSelectedPatient(p);
        setStep("verify");
        setSearchQuery("");
    };

    const handleConfirmCheckIn = () => {
        setStep("confirmed");
    };

    const handleReset = () => {
        setSelectedPatient(null);
        setStep("search");
        setSearchQuery("");
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Patient Check-In</h1>
                <p className="text-sm text-muted-foreground mt-1">Search for patient → verify identity → confirm check-in</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
                {["Search", "Verify", "Confirmed"].map((label, idx) => {
                    const stepIdx = idx;
                    const currentIdx = step === "search" ? 0 : step === "verify" ? 1 : 2;
                    return (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${stepIdx <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                {stepIdx < currentIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                            </div>
                            <span className={`text-xs font-medium ${stepIdx <= currentIdx ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                            {idx < 2 && <div className={`w-12 h-px ${stepIdx < currentIdx ? "bg-primary" : "bg-border"}`} />}
                        </div>
                    );
                })}
            </div>

            {/* Step 1: Search */}
            {step === "search" && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Search className="h-4 w-4 text-primary" />
                            Find Patient
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            autoFocus
                            placeholder="Type patient name or MRN…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11"
                        />
                        {results.length > 0 && (
                            <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                {results.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelectPatient(p)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all text-left"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            {p.firstName[0]}{p.lastName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{p.mrn} · {p.dateOfBirth}</p>
                                        </div>
                                        <StatusBadge status={p.status} />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        )}
                        {searchQuery.trim().length >= 1 && results.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No patients found. Try a different search term.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Verify */}
            {step === "verify" && selectedPatient && (
                <div className="space-y-4">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-primary" />
                                Verify Patient Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Identity details */}
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-semibold text-lg">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                                    <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                                        <div><span className="text-muted-foreground text-xs">MRN:</span> <span className="font-mono">{selectedPatient.mrn}</span></div>
                                        <div><span className="text-muted-foreground text-xs">DOB:</span> {selectedPatient.dateOfBirth}</div>
                                        <div><span className="text-muted-foreground text-xs">Phone:</span> {selectedPatient.phone}</div>
                                        <div><span className="text-muted-foreground text-xs">Gender:</span> <span className="capitalize">{selectedPatient.gender}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Warnings */}
                            {!selectedPatient.consentSigned && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-800 dark:text-amber-300">Consent forms have not been signed. Please have the patient sign before proceeding.</p>
                                </div>
                            )}

                            {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                                    <p className="text-sm text-red-800 dark:text-red-300">
                                        Allergies: <strong>{selectedPatient.allergies.join(", ")}</strong>
                                    </p>
                                </div>
                            )}

                            {/* Insurance verification */}
                            {selectedPatient.insurance && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
                                    <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <div className="flex-1 text-sm">
                                        <span className="font-medium">{selectedPatient.insurance.provider}</span>
                                        <span className="text-muted-foreground"> · {selectedPatient.insurance.policyNumber} · Copay ${selectedPatient.insurance.copay ?? "N/A"}</span>
                                    </div>
                                    <StatusBadge status={selectedPatient.insurance.coverageType} />
                                </div>
                            )}

                            <Separator />

                            {/* Today's appointments */}
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Today&apos;s Appointments
                                </h4>
                                {patientAppts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg text-center">No scheduled appointments today — this is a walk-in visit</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {patientAppts.map((a) => (
                                            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40">
                                                <span className="text-sm font-bold min-w-[44px]">{a.time}</span>
                                                <div className="h-6 w-px bg-border/60" />
                                                <div className="flex-1 min-w-0 text-sm">
                                                    <span className="font-medium">{a.doctorName}</span> · <span className="text-muted-foreground">{a.department}</span>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] capitalize">{a.type}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button variant="outline" onClick={handleReset}>← Back to Search</Button>
                        <Button className="gap-2 min-w-[160px]" onClick={handleConfirmCheckIn}>
                            <CheckCircle2 className="h-4 w-4" /> Confirm Check-In
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmed */}
            {step === "confirmed" && selectedPatient && (
                <Card className="border-emerald-500/30 shadow-sm bg-emerald-500/5">
                    <CardContent className="py-12 text-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Check-In Complete</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.mrn}) has been checked in.
                            </p>
                        </div>
                        {patientAppts.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Next: <strong>{patientAppts[0].doctorName}</strong> at <strong>{patientAppts[0].time}</strong> ({patientAppts[0].department})
                            </p>
                        )}
                        <Button variant="outline" className="mt-4" onClick={handleReset}>Check In Another Patient</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
