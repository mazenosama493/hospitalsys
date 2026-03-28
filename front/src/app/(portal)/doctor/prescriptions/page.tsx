"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { mockPrescriptions, mockDoctorPatients } from "@/features/doctor/mock/data";
import { Pill, Plus, Search, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const commonDrugs = [
    { name: "Metformin", dosage: "500mg", route: "oral", frequency: "BID" },
    { name: "Lisinopril", dosage: "10mg", route: "oral", frequency: "QD" },
    { name: "Amlodipine", dosage: "5mg", route: "oral", frequency: "QD" },
    { name: "Atorvastatin", dosage: "20mg", route: "oral", frequency: "QHS" },
    { name: "Omeprazole", dosage: "20mg", route: "oral", frequency: "QD" },
    { name: "Acetaminophen", dosage: "500mg", route: "oral", frequency: "Q6H PRN" },
    { name: "Amoxicillin", dosage: "500mg", route: "oral", frequency: "TID" },
    { name: "Heparin", dosage: "5000 units", route: "iv", frequency: "Q8H" },
];

function PrescriptionsInner() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get("patientId");
    const [drugSearch, setDrugSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<typeof commonDrugs[0] | null>(null);

    const activeMeds = mockPrescriptions.filter((m) => m.status === "active");
    const onHold = mockPrescriptions.filter((m) => m.status === "on-hold");

    const filteredDrugs = commonDrugs.filter((d) =>
        d.name.toLowerCase().includes(drugSearch.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
                    <p className="text-sm text-muted-foreground mt-1">Active medications and new prescription entry</p>
                </div>
                <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4" /> New Rx
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Active Prescriptions" value={activeMeds.length} icon={Pill} iconClassName="bg-violet-500/10 text-violet-600" />
                <StatCard title="Patients on Meds" value={new Set(activeMeds.map(m => m.patientId)).size} icon={Pill} iconClassName="bg-cyan-500/10 text-cyan-600" />
                <StatCard title="On Hold" value={onHold.length} icon={Pill} iconClassName="bg-amber-500/10 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* New Rx form */}
                {showForm && (
                    <Card className="lg:col-span-2 border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Pill className="h-4 w-4 text-primary" /> New Prescription
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Drug search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input placeholder="Search medication…" value={drugSearch} onChange={(e) => setDrugSearch(e.target.value)} className="pl-10 h-9 text-sm" />
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                {filteredDrugs.map((drug) => (
                                    <button key={drug.name} onClick={() => { setSelected(drug); setDrugSearch(""); }} className={cn(
                                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                                        selected?.name === drug.name
                                            ? "bg-primary/10 text-primary border-primary/30"
                                            : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:border-border"
                                    )}>
                                        {drug.name} {drug.dosage}
                                    </button>
                                ))}
                            </div>
                            {selected && (
                                <div className="space-y-3 pt-2 border-t">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Medication</label><Input value={selected.name} className="h-8 text-sm mt-0.5" readOnly /></div>
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Dosage</label><Input defaultValue={selected.dosage} className="h-8 text-sm mt-0.5" /></div>
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Route</label><Input defaultValue={selected.route} className="h-8 text-sm mt-0.5" /></div>
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Frequency</label><Input defaultValue={selected.frequency} className="h-8 text-sm mt-0.5" /></div>
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Quantity</label><Input type="number" defaultValue={30} className="h-8 text-sm mt-0.5" /></div>
                                        <div><label className="text-[10px] font-semibold text-muted-foreground uppercase">Refills</label><Input type="number" defaultValue={3} className="h-8 text-sm mt-0.5" /></div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase">SIG (Directions)</label>
                                        <Textarea defaultValue={`Take ${selected.dosage} by ${selected.route} ${selected.frequency}`} className="text-sm mt-0.5 resize-none" rows={2} />
                                    </div>
                                    <Button className="w-full gap-2"><Send className="h-3.5 w-3.5" /> Submit Prescription</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Active prescriptions list */}
                <Card className={cn("border-border/50 shadow-sm", showForm ? "lg:col-span-3" : "lg:col-span-5")}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" /> Active Prescriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground">
                                        <th className="text-left py-2 font-medium">Medication</th>
                                        <th className="text-left py-2 font-medium">Patient</th>
                                        <th className="text-left py-2 font-medium">Dosage</th>
                                        <th className="text-left py-2 font-medium">Route</th>
                                        <th className="text-left py-2 font-medium">Frequency</th>
                                        <th className="text-left py-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockPrescriptions.map((rx) => (
                                        <tr key={rx.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
                                            <td className="py-2.5 font-medium">{rx.medication}</td>
                                            <td className="py-2.5 text-muted-foreground">{rx.patientName}</td>
                                            <td className="py-2.5">{rx.dosage}</td>
                                            <td className="py-2.5"><Badge variant="outline" className="text-[10px] capitalize">{rx.route}</Badge></td>
                                            <td className="py-2.5 text-xs text-muted-foreground">{rx.frequency}</td>
                                            <td className="py-2.5"><StatusBadge status={rx.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PrescriptionsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-sm text-muted-foreground">Loading...</p></div>}>
            <PrescriptionsInner />
        </Suspense>
    );
}
