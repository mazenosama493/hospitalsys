"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, Printer, CheckCircle2, AlertTriangle } from "lucide-react";
import { SpecimenBadge } from "@/features/lab/components/SpecimenBadge";
import { mockAccessions } from "@/features/lab/mock/data";
import { cn } from "@/lib/utils";

export default function AccessioningPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Accessioning</h1>
                <p className="text-sm text-muted-foreground mt-1">Receive specimens, verify identity, and print barcode labels</p>
            </div>

            {/* Barcode scan entry */}
            <Card className="border-primary/30 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <ScanLine className="h-4 w-4 text-primary" /> Scan / Enter Specimen
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input placeholder="Scan barcode or type specimen ID…" className="pl-10 h-10 font-mono" autoFocus />
                        </div>
                        <Button className="gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Accession
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" /> Print Label
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="p-2 rounded border border-border/50 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Patient</p>
                            <p className="text-sm font-medium">—</p>
                        </div>
                        <div className="p-2 rounded border border-border/50 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Specimen Type</p>
                            <p className="text-sm font-medium">—</p>
                        </div>
                        <div className="p-2 rounded border border-border/50 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Tests Ordered</p>
                            <p className="text-sm font-medium">—</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Accession log */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Today&apos;s Accession Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-xs text-muted-foreground">
                                    <th className="text-left py-2 px-3 font-medium">Accession #</th>
                                    <th className="text-left py-2 px-3 font-medium">Specimen</th>
                                    <th className="text-left py-2 px-3 font-medium">Patient</th>
                                    <th className="text-left py-2 px-3 font-medium">MRN</th>
                                    <th className="text-left py-2 px-3 font-medium">Type</th>
                                    <th className="text-left py-2 px-3 font-medium">Tests</th>
                                    <th className="text-left py-2 px-3 font-medium">Condition</th>
                                    <th className="text-left py-2 px-3 font-medium">Received</th>
                                    <th className="text-center py-2 px-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockAccessions.map((acc) => (
                                    <tr key={acc.id} className={cn("border-b border-border/30 hover:bg-muted/40 transition-colors", acc.condition !== "acceptable" && "bg-orange-500/[0.04]")}>
                                        <td className="py-2 px-3 font-mono text-xs font-medium">{acc.accessionNumber}</td>
                                        <td className="py-2 px-3"><SpecimenBadge barcode={`LAB-...${acc.specimenId.slice(-3)}`} status="received" /></td>
                                        <td className="py-2 px-3 font-medium text-xs">{acc.patientName}</td>
                                        <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{acc.mrn}</td>
                                        <td className="py-2 px-3"><Badge variant="outline" className="text-[10px] capitalize">{acc.specimenType}</Badge></td>
                                        <td className="py-2 px-3 text-xs">{acc.testNames.join(", ")}</td>
                                        <td className="py-2 px-3">
                                            <Badge variant={acc.condition === "acceptable" ? "outline" : "destructive"} className="text-[10px] capitalize">
                                                {acc.condition === "acceptable" ? "✓ OK" : `⚠ ${acc.condition}`}
                                            </Badge>
                                        </td>
                                        <td className="py-2 px-3 text-xs text-muted-foreground">{new Date(acc.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                        <td className="py-2 px-3 text-center"><Badge variant="outline" className="text-[10px] capitalize">{acc.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
