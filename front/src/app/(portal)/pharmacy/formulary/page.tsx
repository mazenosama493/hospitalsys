"use client";

import { Package, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormularySearch } from "@/features/pharmacy/components/FormularySearch";
import { mockFormulary, mockSubstitutions } from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

const substitutionStatusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 border-red-500/20" },
};

export default function FormularyPage() {
    const lowStock = mockFormulary.filter((f) => f.stockLevel <= f.reorderPoint);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Formulary</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Drug formulary, stock levels, and therapeutic substitutions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs text-rose-700 border-rose-500/30 bg-rose-500/5">
                        {lowStock.length} low stock
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {mockFormulary.length} drugs
                    </Badge>
                </div>
            </div>

            {/* Low stock banner */}
            {lowStock.length > 0 && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-rose-500/[0.05] border-rose-500/30">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-rose-700">
                            {lowStock.length} item{lowStock.length > 1 ? "s" : ""} at or below reorder point
                        </p>
                        <p className="text-xs text-rose-600/80 mt-0.5">
                            {lowStock.map((f) => f.genericName).join(" · ")}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
                {/* Main formulary search */}
                <div>
                    <FormularySearch items={mockFormulary} />
                </div>

                {/* Right: substitutions + inventory summary */}
                <div className="space-y-4">
                    {/* Substitution requests */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-violet-600" /> Substitution Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockSubstitutions.map((sub) => {
                                const conf = substitutionStatusConfig[sub.status] ?? substitutionStatusConfig.pending;
                                return (
                                    <div
                                        key={sub.id}
                                        className="p-3 rounded-lg border border-border/50 space-y-2 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-muted-foreground">{sub.id}</span>
                                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", conf.className)}>
                                                {conf.label}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">{sub.patientName}</p>
                                            <p className="text-muted-foreground line-through">{sub.originalMedication}</p>
                                            <p className="text-emerald-700 font-medium flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> {sub.substituteMedication}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground capitalize">
                                            Reason: {sub.reason.replace(/-/g, " ")}
                                        </p>
                                        {sub.costSavings !== undefined && (
                                            <p className="text-emerald-700 font-medium">
                                                Savings: ${sub.costSavings.toFixed(2)}
                                            </p>
                                        )}
                                        {sub.approvedBy && (
                                            <p className="text-[10px] text-muted-foreground">
                                                Approved by {sub.approvedBy}
                                            </p>
                                        )}
                                        {sub.status === "pending" && (
                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-xs text-red-600 border-red-500/30 hover:bg-red-500/10"
                                                >
                                                    Reject
                                                </Button>
                                                <Button size="sm" className="flex-1 text-xs">
                                                    Approve
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {mockSubstitutions.length === 0 && (
                                <p className="text-center py-4 text-xs text-muted-foreground">No substitution requests.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stock summary */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" /> Stock Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {mockFormulary
                                .sort((a, b) => a.stockLevel / a.reorderPoint - b.stockLevel / b.reorderPoint)
                                .slice(0, 6)
                                .map((item) => {
                                    const pct = Math.min(100, Math.round((item.stockLevel / (item.reorderPoint * 3)) * 100));
                                    const isLow = item.stockLevel <= item.reorderPoint;
                                    return (
                                        <div key={item.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium truncate max-w-[160px]">{item.genericName}</span>
                                                <span className={cn("font-mono font-medium", isLow ? "text-rose-600" : "text-emerald-700")}>
                                                    {item.stockLevel}
                                                </span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        isLow ? "bg-rose-500" : pct > 50 ? "bg-emerald-500" : "bg-amber-500"
                                                    )}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
