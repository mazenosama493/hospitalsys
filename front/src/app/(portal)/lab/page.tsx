"use client";

import Link from "next/link";
import { FlaskConical, Clock, CheckCircle2, AlertTriangle, Activity, ScanLine, ArrowRight, Timer } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockLabOrders, mockLabStats, mockRecollections, mockSpecimens } from "@/features/lab/mock/data";
import { cn } from "@/lib/utils";

export default function LabDashboard() {
    const statOrders = mockLabOrders.filter((o) => o.priority === "stat");

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laboratory Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Clinical Laboratory Information System — Lab Tech Ahmed</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 font-medium">
                        <Timer className="h-3.5 w-3.5" /> Avg TAT: {mockLabStats.avgTATMinutes} min
                    </div>
                </div>
            </div>

            {/* Critical alert */}
            {mockLabStats.criticalResults > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.06] border-red-500/30 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    <div className="flex-1">
                        <span className="font-semibold text-red-700">{mockLabStats.criticalResults} critical result{mockLabStats.criticalResults > 1 ? "s" : ""} require notification</span>
                    </div>
                    <Link href="/lab/critical">
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-500/30 hover:bg-red-500/10">View Critical Queue</Button>
                    </Link>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Pending Orders" value={mockLabStats.pendingOrders} icon={Clock} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="In Progress" value={mockLabStats.inProgress} icon={FlaskConical} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Completed Today" value={mockLabStats.completedToday} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="STAT Orders" value={mockLabStats.statOrders} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Recollections" value={mockLabStats.recollections} icon={Activity} iconClassName="bg-orange-500/10 text-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* STAT Queue */}
                <div className="lg:col-span-2">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" /> STAT &amp; Urgent Orders
                                </CardTitle>
                                <Link href="/lab/worklist" className="text-xs text-primary hover:underline flex items-center gap-1">Full Worklist <ArrowRight className="h-3 w-3" /></Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-xs text-muted-foreground">
                                            <th className="text-left py-2 px-3 font-medium">Order</th>
                                            <th className="text-left py-2 px-3 font-medium">Patient</th>
                                            <th className="text-left py-2 px-3 font-medium">Test</th>
                                            <th className="text-center py-2 px-3 font-medium">Priority</th>
                                            <th className="text-center py-2 px-3 font-medium">Status</th>
                                            <th className="text-left py-2 px-3 font-medium">Ordered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockLabOrders.filter((o) => o.priority === "stat" || o.priority === "urgent").map((order) => (
                                            <tr key={order.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
                                                <td className="py-2 px-3 font-mono text-xs">{order.id}</td>
                                                <td className="py-2 px-3 font-medium text-xs">{order.patientName}</td>
                                                <td className="py-2 px-3 text-xs">{order.testName}</td>
                                                <td className="py-2 px-3 text-center"><StatusBadge status={order.priority} /></td>
                                                <td className="py-2 px-3 text-center"><StatusBadge status={order.status} /></td>
                                                <td className="py-2 px-3 text-xs text-muted-foreground">{new Date(order.orderedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick actions + recollections */}
                <div className="space-y-4">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/lab/accessioning"><Button variant="outline" className="w-full justify-start gap-2 text-xs h-9"><ScanLine className="h-3.5 w-3.5" /> Accession Specimen</Button></Link>
                            <Link href="/lab/results"><Button variant="outline" className="w-full justify-start gap-2 text-xs h-9"><FlaskConical className="h-3.5 w-3.5" /> Enter Results</Button></Link>
                            <Link href="/lab/verification"><Button variant="outline" className="w-full justify-start gap-2 text-xs h-9"><CheckCircle2 className="h-3.5 w-3.5" /> Verify Results</Button></Link>
                        </CardContent>
                    </Card>

                    {mockRecollections.filter((r) => !r.resolved).length > 0 && (
                        <Card className="border-orange-500/30 shadow-sm bg-orange-500/[0.03]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700">
                                    <Activity className="h-4 w-4" /> Recollection Requests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mockRecollections.filter((r) => !r.resolved).map((rc) => (
                                    <div key={rc.id} className="p-2 rounded border border-orange-500/20 bg-orange-500/[0.04] text-xs">
                                        <p className="font-medium">{rc.patientName}</p>
                                        <p className="text-muted-foreground capitalize">{rc.reason} — {rc.notes}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
