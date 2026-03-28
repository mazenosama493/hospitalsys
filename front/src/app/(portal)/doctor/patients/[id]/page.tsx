"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Plus, Pill, ClipboardList, Activity, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { PatientBanner } from "@/features/doctor/components/PatientBanner";
import { CDSSSidebar } from "@/features/doctor/components/CDSSSidebar";
import { mockDoctorPatients, mockEncounters, mockDiagnoses, mockOrders, mockPrescriptions, mockResults, mockCDSSSuggestions } from "@/features/doctor/mock/data";
import { cn } from "@/lib/utils";

const tabs = [
    { key: "summary", label: "Summary", icon: ClipboardList },
    { key: "notes", label: "Notes", icon: FileText },
    { key: "orders", label: "Orders", icon: Plus },
    { key: "medications", label: "Medications", icon: Pill },
    { key: "results", label: "Results", icon: Activity },
] as const;

export default function PatientChartPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState<string>("summary");

    const patient = mockDoctorPatients.find((p) => p.id === id);
    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground">Patient not found</p>
                <Link href="/doctor/patients"><Button variant="outline" className="mt-4">Back to Patients</Button></Link>
            </div>
        );
    }

    const patientEncounters = mockEncounters.filter((e) => e.patientId === id);
    const patientDiagnoses = mockDiagnoses.filter((d) => d.patientId === id);
    const patientOrders = mockOrders.filter((o) => o.patientId === id);
    const patientMeds = mockPrescriptions.filter((p) => p.patientId === id);
    const patientResults = mockResults.filter((r) => r.patientId === id);
    const cdss = mockCDSSSuggestions.filter((s) => s.patientId === id);

    const flagColors: Record<string, string> = { normal: "text-emerald-600", high: "text-amber-600", low: "text-sky-600", critical: "text-red-600" };
    const flagBg: Record<string, string> = { normal: "bg-emerald-500/10 border-emerald-500/30", high: "bg-amber-500/10 border-amber-500/30", low: "bg-sky-500/10 border-sky-500/30", critical: "bg-red-500/10 border-red-500/30" };

    return (
        <div className="space-y-4">
            {/* Back + actions */}
            <div className="flex items-center justify-between gap-4">
                <Link href="/doctor/patients" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Patients
                </Link>
                <div className="flex gap-2">
                    <Link href={`/doctor/encounters/new?patientId=${id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><FileText className="h-3.5 w-3.5" /> New Note</Button>
                    </Link>
                    <Link href={`/doctor/orders?patientId=${id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Plus className="h-3.5 w-3.5" /> New Order</Button>
                    </Link>
                    <Link href={`/doctor/prescriptions?patientId=${id}`}>
                        <Button size="sm" className="h-8 text-xs gap-1"><Pill className="h-3.5 w-3.5" /> Prescribe</Button>
                    </Link>
                </div>
            </div>

            {/* Patient Banner — always visible */}
            <PatientBanner patient={patient} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main content */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 border-b pb-0">
                        {tabs.map((tab) => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn(
                                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
                                activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}>
                                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    {activeTab === "summary" && (
                        <div className="space-y-4">
                            {/* Diagnoses */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Active Diagnoses</CardTitle></CardHeader>
                                <CardContent>
                                    {patientDiagnoses.length === 0 ? <p className="text-xs text-muted-foreground">No diagnoses recorded.</p> : (
                                        <div className="space-y-2">
                                            {patientDiagnoses.map((dx) => (
                                                <div key={dx.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">{dx.code}</Badge>
                                                    <span className="text-sm flex-1">{dx.description}</span>
                                                    <Badge variant="secondary" className="text-[10px] capitalize">{dx.type}</Badge>
                                                    <StatusBadge status={dx.status} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent encounter */}
                            {patientEncounters.length > 0 && (
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Latest Encounter</CardTitle></CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const enc = patientEncounters[0];
                                            return (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(enc.date).toLocaleDateString()} · {enc.authorName}
                                                        <Badge variant="secondary" className="text-[10px] capitalize">{enc.status}</Badge>
                                                        <Badge variant="outline" className="text-[10px] capitalize">{enc.visitType}</Badge>
                                                    </div>
                                                    {[{ l: "S", v: enc.subjective }, { l: "O", v: enc.objective }, { l: "A", v: enc.assessment }, { l: "P", v: enc.plan }].map((s) => (
                                                        <div key={s.l}>
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold mr-1.5">{s.l}</span>
                                                            <span className="text-sm text-muted-foreground whitespace-pre-line">{s.v}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Active meds summary */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Active Medications ({patientMeds.filter(m => m.status === "active").length})</CardTitle>
                                    <button onClick={() => setActiveTab("medications")} className="text-xs text-primary hover:underline flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {patientMeds.filter(m => m.status === "active").map((med) => (
                                            <span key={med.id} className="text-xs bg-violet-500/10 text-violet-700 border border-violet-500/20 px-2 py-1 rounded-full">
                                                {med.medication} {med.dosage} · {med.frequency}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="space-y-3">
                            {patientEncounters.length === 0 ? (
                                <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No encounter notes yet.</p></CardContent></Card>
                            ) : (
                                patientEncounters.map((enc) => (
                                    <Card key={enc.id} className="border-border/50 shadow-sm">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-sm font-semibold">{enc.id}</CardTitle>
                                                    <Badge variant="secondary" className="text-[10px] capitalize">{enc.status}</Badge>
                                                    <Badge variant="outline" className="text-[10px] capitalize">{enc.visitType}</Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{new Date(enc.date).toLocaleDateString()} · {enc.authorName}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {[{ l: "Subjective", v: enc.subjective }, { l: "Objective", v: enc.objective }, { l: "Assessment", v: enc.assessment }, { l: "Plan", v: enc.plan }].map((s) => (
                                                    <div key={s.l}>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{s.l}</p>
                                                        <p className="text-sm whitespace-pre-line">{s.v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Orders ({patientOrders.length})</CardTitle></CardHeader>
                            <CardContent>
                                {patientOrders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-6">No orders for this patient.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {patientOrders.map((ord) => (
                                            <div key={ord.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
                                                <Badge variant="outline" className="text-[10px] capitalize shrink-0">{ord.category}</Badge>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">{ord.name}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(ord.orderedAt).toLocaleString()}</p>
                                                </div>
                                                <Badge variant={ord.priority === "stat" ? "destructive" : ord.priority === "urgent" ? "default" : "secondary"} className="text-[10px]">{ord.priority}</Badge>
                                                <StatusBadge status={ord.status} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "medications" && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Medications ({patientMeds.length})</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {patientMeds.map((med) => (
                                        <div key={med.id} className="p-3 rounded-lg border border-border/50 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">{med.medication} {med.dosage}</p>
                                                <Badge variant="outline" className="text-[10px] capitalize">{med.route}</Badge>
                                                <StatusBadge status={med.status} />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{med.sig}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                <span>Frequency: {med.frequency}</span>
                                                <span>Qty: {med.quantity}</span>
                                                <span>Refills: {med.refills}</span>
                                                <span>Start: {med.startDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "results" && (
                        <div className="space-y-2">
                            {patientResults.length === 0 ? (
                                <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No results available.</p></CardContent></Card>
                            ) : (
                                patientResults.map((res) => (
                                    <div key={res.id} className={cn("flex items-center gap-4 p-3 rounded-lg border", flagBg[res.flag])}>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{res.testName}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(res.reportedAt).toLocaleString()}</p>
                                        </div>
                                        <span className={cn("text-lg font-bold", flagColors[res.flag])}>{res.value} <span className="text-xs font-normal text-muted-foreground">{res.unit}</span></span>
                                        <span className="text-xs text-muted-foreground shrink-0">Ref: {res.referenceRange}</span>
                                        <Badge variant="outline" className={cn("text-[10px]", flagColors[res.flag])}>{res.flag}</Badge>
                                    </div>
                                ))
                            )}
                        </div>
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
