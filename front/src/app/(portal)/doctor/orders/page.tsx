"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { OrderComposer } from "@/features/doctor/components/OrderComposer";
import { mockOrders, mockDoctorPatients } from "@/features/doctor/mock/data";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

function OrdersPageInner() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get("patientId");
    const patient = patientId ? mockDoctorPatients.find((p) => p.id === patientId) : null;

    const pending = mockOrders.filter((o) => o.status === "pending").length;
    const inProgress = mockOrders.filter((o) => o.status === "in-progress").length;
    const completed = mockOrders.filter((o) => o.status === "completed").length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <p className="text-sm text-muted-foreground mt-1">Lab, imaging, and consult order entry and management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Pending" value={pending} icon={Clock} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="In Progress" value={inProgress} icon={AlertTriangle} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Completed" value={completed} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Order Composer */}
                <div className="lg:col-span-2">
                    <OrderComposer patientName={patient ? `${patient.firstName} ${patient.lastName}` : undefined} />
                </div>

                {/* Recent Orders table */}
                <Card className="lg:col-span-3 border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground">
                                        <th className="text-left py-2 font-medium">Order</th>
                                        <th className="text-left py-2 font-medium">Patient</th>
                                        <th className="text-left py-2 font-medium">Type</th>
                                        <th className="text-left py-2 font-medium">Priority</th>
                                        <th className="text-left py-2 font-medium">Status</th>
                                        <th className="text-left py-2 font-medium">Ordered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockOrders.map((ord) => (
                                        <tr key={ord.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
                                            <td className="py-2.5 font-medium">{ord.name}</td>
                                            <td className="py-2.5 text-muted-foreground">{ord.patientName}</td>
                                            <td className="py-2.5"><Badge variant="outline" className="text-[10px] capitalize">{ord.category}</Badge></td>
                                            <td className="py-2.5">
                                                <Badge variant={ord.priority === "stat" ? "destructive" : ord.priority === "urgent" ? "default" : "secondary"} className="text-[10px]">
                                                    {ord.priority}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5"><StatusBadge status={ord.status} /></td>
                                            <td className="py-2.5 text-xs text-muted-foreground">{new Date(ord.orderedAt).toLocaleString()}</td>
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

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-sm text-muted-foreground">Loading...</p></div>}>
            <OrdersPageInner />
        </Suspense>
    );
}
