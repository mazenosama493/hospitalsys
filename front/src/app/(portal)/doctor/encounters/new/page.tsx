"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EncounterNoteEditor } from "@/features/doctor/components/EncounterNoteEditor";
import { PatientBanner } from "@/features/doctor/components/PatientBanner";
import { CDSSSidebar } from "@/features/doctor/components/CDSSSidebar";
import { mockDoctorPatients, mockEncounters, mockCDSSSuggestions } from "@/features/doctor/mock/data";
import { FileText, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

function EncounterPageInner() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get("patientId") || mockDoctorPatients[0].id;
    const patient = mockDoctorPatients.find((p) => p.id === patientId) || mockDoctorPatients[0];
    const cdss = mockCDSSSuggestions.filter((s) => s.patientId === patientId);
    const recentEncounters = mockEncounters.filter((e) => e.patientId === patientId);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">New Encounter Note</h1>
                    <p className="text-sm text-muted-foreground mt-1">SOAP documentation for this visit</p>
                </div>
            </div>

            {/* Patient Banner */}
            <PatientBanner patient={patient} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Note Editor */}
                <div className="lg:col-span-3 space-y-4">
                    <EncounterNoteEditor patientName={`${patient.firstName} ${patient.lastName}`} />

                    {/* Recent encounters */}
                    {recentEncounters.length > 0 && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Previous Encounters ({recentEncounters.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {recentEncounters.map((enc) => (
                                        <div key={enc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
                                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{enc.id}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(enc.date).toLocaleDateString()} · {enc.authorName}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] capitalize">{enc.visitType}</Badge>
                                            <Badge variant="outline" className="text-[10px] capitalize">{enc.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* CDSS Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4">
                        <CDSSSidebar suggestions={cdss} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EncounterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-sm text-muted-foreground">Loading...</p></div>}>
            <EncounterPageInner />
        </Suspense>
    );
}
