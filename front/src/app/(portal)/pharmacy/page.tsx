"use client";

import Link from "next/link";
import {
    Pill, Clock, CheckCircle2, AlertTriangle, Package, ShieldCheck,
    ArrowRight, FlaskConical, Activity, RefreshCw, XOctagon,
} from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrugWarningBanner } from "@/features/pharmacy/components/DrugWarningBanner";
import {
    mockPrescriptions, mockStandaloneWarnings, mockPharmStats, mockInterventions, mockFormulary,
} from "@/features/pharmacy/mock/data";
import { cn } from "@/lib/utils";

export default function PharmacyDashboard() {
    const severeWarnings = mockStandaloneWarnings.filter(
        (w) => w.severity === "severe" || w.severity === "contraindicated"
    );
    const pendingVerification = mockPrescriptions.filter(
        (rx) => rx.status === "pending-verification" || rx.status === "ordered"
    ).sort((a, b) => {
        const p: Record<string, number> = { stat: 0, urgent: 1, high: 2, normal: 3 };
        return (p[a.priority] ?? 3) - (p[b.priority] ?? 3);
    });
    const lowStockItems = mockFormulary.filter((f) => f.stockLevel <= f.reorderPoint);
    const pendingInterventions = mockInterventions.filter((i) => i.outcome === "pending");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pharmacy Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Clinical Pharmacy — Pharm. Sarah Adams</p>
                </div>
                <Badge variant="outline" className="text-xs text-teal-700 border-teal-500/30 bg-teal-500/5 mt-1">
                    Inpatient + Outpatient
                </Badge>
            </div>

            {/* Severe drug warning banner */}
            {severeWarnings.length > 0 && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.06] border-red-500/30">
                    <XOctagon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-700">
                            {severeWarnings.length} severe drug warning{severeWarnings.length > 1 ? "s" : ""} require pharmacist review
                        </p>
                        <p className="text-xs text-red-600/80 mt-0.5">
                            {severeWarnings.map((w) => w.title).join(" · ")}
                        </p>
                    </div>
                    <Link href="/pharmacy/verification">
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-500/30 hover:bg-red-500/10 shrink-0">
                            Review Now
                        </Button>
                    </Link>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                <StatCard title="Pending Verification" value={mockPharmStats.pendingVerification} icon={Clock} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="Verified / Ready" value={mockPharmStats.verified} icon={ShieldCheck} iconClassName="bg-teal-500/10 text-teal-600" />
                <StatCard title="Dispensing" value={mockPharmStats.dispensing} icon={Pill} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Dispensed Today" value={mockPharmStats.dispensedToday} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Active Warnings" value={mockPharmStats.activeWarnings} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Pending Interventions" value={mockPharmStats.pendingInterventions} icon={Activity} iconClassName="bg-orange-500/10 text-orange-600" />
                <StatCard title="Low Stock Items" value={mockPharmStats.lowStockItems} icon={Package} iconClassName="bg-rose-500/10 text-rose-600" />
                <StatCard title="Pending Substitutions" value={mockPharmStats.pendingSubstitutions} icon={RefreshCw} iconClassName="bg-violet-500/10 text-violet-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending verification queue */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-600" /> Pending Verification
                                </CardTitle>
                                <Link href="/pharmacy/verification" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    Full Queue <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs text-muted-foreground bg-muted/30">
                                            <th className="text-left py-2.5 px-3 font-medium">Rx ID</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Patient</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Medication</th>
                                            <th className="text-center py-2.5 px-3 font-medium">Priority</th>
                                            <th className="text-center py-2.5 px-3 font-medium">Warnings</th>
                                            <th className="text-left py-2.5 px-3 font-medium">Setting</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVerification.map((rx) => (
                                            <tr
                                                key={rx.id}
                                                className={cn(
                                                    "border-b border-border/30 hover:bg-muted/40 transition-colors",
                                                    rx.priority === "stat" && "bg-red-500/[0.03]"
                                                )}
                                            >
                                                <td className="py-2.5 px-3 font-mono text-xs">{rx.id}</td>
                                                <td className="py-2.5 px-3 font-medium text-xs">{rx.patientName}</td>
                                                <td className="py-2.5 px-3 text-xs">
                                                    {rx.medication} <span className="text-muted-foreground">{rx.dosage}</span>
                                                </td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <StatusBadge status={rx.priority} />
                                                </td>
                                                <td className="py-2.5 px-3 text-center">
                                                    {rx.warnings.length > 0 ? (
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px]",
                                                                rx.warnings.some((w) => w.severity === "severe" || w.severity === "contraindicated")
                                                                    ? "border-red-500/40 text-red-600"
                                                                    : "border-amber-500/40 text-amber-600"
                                                            )}
                                                        >
                                                            {rx.warnings.length} alert{rx.warnings.length > 1 ? "s" : ""}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-[10px] text-emerald-600">✓ Clear</span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <Badge variant="outline" className="text-[10px] capitalize">{rx.setting}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {pendingVerification.length === 0 && (
                                    <p className="text-center py-8 text-sm text-muted-foreground">All prescriptions verified.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active drug warnings */}
                    {mockStandaloneWarnings.length > 0 && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" /> Active Drug Warnings
                                    </CardTitle>
                                    <Link href="/pharmacy/verification" className="text-xs text-primary hover:underline flex items-center gap-1">
                                        Review <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {mockStandaloneWarnings.map((w) => (
                                    <DrugWarningBanner key={w.id} warning={w} compact />
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column: Quick actions + interventions + low stock */}
                <div className="space-y-4">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/pharmacy/queue">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                                    <Pill className="h-3.5 w-3.5" /> Rx Queue
                                </Button>
                            </Link>
                            <Link href="/pharmacy/verification">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Verify Prescriptions
                                </Button>
                            </Link>
                            <Link href="/pharmacy/dispense">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                                    <FlaskConical className="h-3.5 w-3.5" /> Dispense
                                </Button>
                            </Link>
                            <Link href="/pharmacy/formulary">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                                    <Package className="h-3.5 w-3.5" /> Formulary
                                </Button>
                            </Link>
                            <Link href="/pharmacy/interventions">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                                    <Activity className="h-3.5 w-3.5" /> Interventions
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Pending interventions */}
                    {pendingInterventions.length > 0 && (
                        <Card className="border-orange-500/30 shadow-sm bg-orange-500/[0.02]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700">
                                    <Activity className="h-4 w-4" /> Pending Interventions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {pendingInterventions.map((inv) => (
                                    <div key={inv.id} className="p-2.5 rounded border border-orange-500/20 bg-orange-500/[0.04] text-xs">
                                        <p className="font-medium">{inv.patientName}</p>
                                        <p className="text-muted-foreground capitalize">{inv.type} — {inv.medication}</p>
                                        <p className="text-orange-700 mt-0.5 text-[10px]">{inv.reason}</p>
                                    </div>
                                ))}
                                <Link href="/pharmacy/interventions">
                                    <Button variant="outline" size="sm" className="w-full text-xs mt-1 text-orange-700 border-orange-500/30 hover:bg-orange-500/10">
                                        View All Interventions
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Low stock alert */}
                    {lowStockItems.length > 0 && (
                        <Card className="border-rose-500/30 shadow-sm bg-rose-500/[0.02]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-700">
                                    <Package className="h-4 w-4" /> Low Stock Alert
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1.5">
                                {lowStockItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-2 rounded border border-rose-500/20 text-xs">
                                        <span className="font-medium">{item.genericName}</span>
                                        <Badge variant="outline" className="text-[10px] text-rose-700 border-rose-500/30">
                                            {item.stockLevel} left
                                        </Badge>
                                    </div>
                                ))}
                                <Link href="/pharmacy/formulary">
                                    <Button variant="outline" size="sm" className="w-full text-xs mt-1 text-rose-700 border-rose-500/30 hover:bg-rose-500/10">
                                        View Formulary
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
