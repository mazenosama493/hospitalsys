"use client";

import { useState } from "react";
import { Package, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DispensePanel } from "@/features/pharmacy/components/DispensePanel";
import { mockPrescriptions, mockFormulary, mockDispenseRecords } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

const settingIcons: Record<string, string> = {
    inpatient: "🏥",
    outpatient: "🏠",
    discharge: "🚪",
};

export default function DispensePage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Only verified or dispensing Rxs can be dispensed
    const dispensableRxs = mockPrescriptions
        .filter((rx) => rx.status === "verified" || rx.status === "dispensing")
        .sort((a, b) => {
            const p: Record<string, number> = { stat: 0, urgent: 1, high: 2, normal: 3 };
            return (p[a.priority] ?? 3) - (p[b.priority] ?? 3);
        });

    const selected = dispensableRxs.find((rx) => rx.id === selectedId) ?? dispensableRxs[0] ?? null;
    const formularyItem = selected
        ? mockFormulary.find(
              (f) => f.genericName.toLowerCase().includes(selected.genericName?.toLowerCase() ?? selected.medication.toLowerCase().split(" ")[0])
          )
        : undefined;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dispensing</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Stock-aware dispensing for verified prescriptions
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Verified / dispensing queue */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Ready to Dispense</h2>
                        <Badge variant="outline" className="text-xs text-teal-700 border-teal-500/30">
                            {dispensableRxs.length} items
                        </Badge>
                    </div>

                    {dispensableRxs.length === 0 && (
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center py-10 text-muted-foreground gap-2">
                                <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
                                <p className="text-sm">No items ready to dispense.</p>
                            </CardContent>
                        </Card>
                    )}

                    {dispensableRxs.map((rx) => {
                        const fi = mockFormulary.find((f) =>
                            f.genericName.toLowerCase().includes((rx.genericName ?? rx.medication).toLowerCase().split(" ")[0])
                        );
                        const stockOk = fi ? fi.stockLevel >= rx.quantity : true;
                        const isSelected = (selected?.id ?? null) === rx.id;

                        return (
                            <button
                                key={rx.id}
                                onClick={() => setSelectedId(rx.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border/50 hover:bg-muted/40",
                                    !stockOk && !isSelected && "border-red-500/20 bg-red-500/[0.02]"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-muted-foreground">{rx.id}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs">{settingIcons[rx.setting]}</span>
                                        <StatusBadge status={rx.priority} />
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-tight">
                                    {rx.medication} <span className="text-muted-foreground text-xs">{rx.dosage}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{rx.patientName}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <StatusBadge status={rx.status} />
                                    <span className="text-[10px] text-muted-foreground">Qty: {rx.quantity}</span>
                                    {!stockOk && (
                                        <span className="text-[10px] text-red-600 flex items-center gap-0.5 font-medium">
                                            <AlertTriangle className="h-2.5 w-2.5" /> Low stock
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Dispense panel + history */}
                <div className="space-y-6">
                    {selected ? (
                        <DispensePanel rx={selected} formularyItem={formularyItem} />
                    ) : (
                        <Card className="border-border/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Package className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm">Select a prescription to begin dispensing</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Dispense history */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Dispensed Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs text-muted-foreground bg-muted/30">
                                            <th className="text-left py-2.5 px-3 font-medium">Dispense ID</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Patient</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Medication</th>
                                            <th className="text-center py-2.5 px-3 font-medium">Qty</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Lot</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Dispensed By</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockDispenseRecords.map((d) => (
                                            <tr key={d.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
                                                <td className="py-2.5 px-3 font-mono text-xs">{d.id}</td>
                                                <td className="py-2.5 px-3 text-xs font-medium">{d.patientName}</td>
                                                <td className="py-2.5 px-3 text-xs">{d.medication}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <Badge variant="secondary" className="text-xs">{d.quantityDispensed}</Badge>
                                                </td>
                                                <td className="py-2.5 px-3 text-xs font-mono text-muted-foreground">{d.lotNumber}</td>
                                                <td className="py-2.5 px-3 text-xs text-muted-foreground">{d.dispensedBy}</td>
                                                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-2.5 w-2.5" />
                                                        {new Date(d.dispensedAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {mockDispenseRecords.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                                                    No dispense records today.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
