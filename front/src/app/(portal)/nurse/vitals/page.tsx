"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VitalsFlowsheet } from "@/features/nurse/components/VitalsFlowsheet";
import { mockWardPatients, mockVitals, mockIO, mockPainEntries } from "@/features/nurse/mock/data";
import { Heart, Droplets, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tabOptions = ["vitals", "io", "pain"] as const;
type FlowTab = typeof tabOptions[number];

export default function VitalsPage() {
    const [selectedPatient, setSelectedPatient] = useState(mockWardPatients[0].id);
    const [tab, setTab] = useState<FlowTab>("vitals");

    const patient = mockWardPatients.find((p) => p.id === selectedPatient)!;
    const patientVitals = mockVitals.filter((v) => v.patientId === selectedPatient).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const patientIO = mockIO.filter((io) => io.patientId === selectedPatient);
    const patientPain = mockPainEntries.filter((pe) => pe.patientId === selectedPatient);

    const totalIntake = patientIO.filter((io) => io.direction === "intake").reduce((s, io) => s + io.amount, 0);
    const totalOutput = patientIO.filter((io) => io.direction === "output").reduce((s, io) => s + io.amount, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Vitals Flowsheet</h1>
                <p className="text-sm text-muted-foreground mt-1">Vital signs, I&amp;O tracking, and pain assessments</p>
            </div>

            {/* Patient selector */}
            <div className="flex items-center gap-2 flex-wrap">
                {mockWardPatients.map((p) => (
                    <button key={p.id} onClick={() => setSelectedPatient(p.id)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", selectedPatient === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                        <span className="font-bold">{p.roomNumber}</span> {p.firstName} {p.lastName}
                    </button>
                ))}
            </div>

            {/* Tab */}
            <div className="flex items-center gap-1 border-b pb-0">
                {tabOptions.map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={cn("flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border")}>
                        {t === "vitals" && <Heart className="h-3.5 w-3.5" />}
                        {t === "io" && <Droplets className="h-3.5 w-3.5" />}
                        {t === "pain" && <Activity className="h-3.5 w-3.5" />}
                        {t === "io" ? "I&O" : t}
                    </button>
                ))}
            </div>

            {/* Content */}
            {tab === "vitals" && <VitalsFlowsheet vitals={patientVitals} />}

            {tab === "io" && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-primary" /> Intake &amp; Output
                            </CardTitle>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1 text-sky-600 font-medium"><ArrowDown className="h-3 w-3" /> Intake: {totalIntake} mL</span>
                                <span className="flex items-center gap-1 text-amber-600 font-medium"><ArrowUp className="h-3 w-3" /> Output: {totalOutput} mL</span>
                                <span className="font-bold">Net: {totalIntake - totalOutput} mL</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {patientIO.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No I&amp;O entries for this patient.</p>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs text-muted-foreground">
                                            <th className="text-left py-2 px-2 font-medium">Time</th>
                                            <th className="text-left py-2 px-2 font-medium">Direction</th>
                                            <th className="text-left py-2 px-2 font-medium">Type</th>
                                            <th className="text-left py-2 px-2 font-medium">Amount</th>
                                            <th className="text-left py-2 px-2 font-medium">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patientIO.map((io) => (
                                            <tr key={io.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
                                                <td className="py-2 px-2 text-xs">{new Date(io.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                                <td className="py-2 px-2"><Badge variant="outline" className={cn("text-[10px] capitalize", io.direction === "intake" ? "text-sky-600" : "text-amber-600")}>{io.direction}</Badge></td>
                                                <td className="py-2 px-2 text-xs capitalize">{io.type}</td>
                                                <td className="py-2 px-2 font-mono text-xs font-medium">{io.amount} mL</td>
                                                <td className="py-2 px-2 text-xs text-muted-foreground">{io.notes || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {tab === "pain" && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Pain Assessments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patientPain.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No pain entries for this patient.</p>
                        ) : (
                            <div className="space-y-3">
                                {patientPain.map((pe) => {
                                    const painColor = pe.score >= 7 ? "text-red-600" : pe.score >= 4 ? "text-amber-600" : "text-emerald-600";
                                    const painBg = pe.score >= 7 ? "bg-red-500/10 border-red-500/30" : pe.score >= 4 ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/30";
                                    return (
                                        <div key={pe.id} className={cn("p-3 rounded-lg border", painBg)}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-2xl font-bold", painColor)}>{pe.score}/10</span>
                                                    <div>
                                                        <p className="text-sm font-medium">{pe.location}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{pe.quality}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{new Date(pe.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>
                                            {pe.intervention && (
                                                <p className="text-xs text-muted-foreground mt-1">Intervention: {pe.intervention}</p>
                                            )}
                                            {pe.reassessScore !== undefined && (
                                                <div className="mt-1.5 flex items-center gap-2 text-xs">
                                                    <span className="text-muted-foreground">Reassess:</span>
                                                    <span className={cn("font-bold", pe.reassessScore < pe.score ? "text-emerald-600" : "text-amber-600")}>{pe.reassessScore}/10</span>
                                                    {pe.reassessTime && <span className="text-muted-foreground">at {new Date(pe.reassessTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
