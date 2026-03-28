"use client";

import Link from "next/link";
import { BedDouble, Heart, AlertTriangle, ClipboardList, Pill, Clock, Sun, ArrowRight, Users } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedsideSummary } from "@/features/nurse/components/BedsideSummary";
import { TaskList } from "@/features/nurse/components/TaskList";
import { mockWardPatients, mockNursingTasks, mockMAR, mockVitals } from "@/features/nurse/mock/data";
import { cn } from "@/lib/utils";

export default function NurseDashboard() {
    const overdueTasks = mockNursingTasks.filter((t) => t.isOverdue);
    const overdueMeds = mockMAR.filter((m) => m.status === "overdue");
    const criticalPatients = mockWardPatients.filter((p) => p.acuity === "critical" || p.status === "critical");
    const pendingTasks = mockNursingTasks.filter((t) => t.status === "pending" || t.status === "overdue");

    return (
        <div className="space-y-6">
            {/* Header with shift info */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nursing Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Ward A &amp; ICU — Maria Garcia, RN</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-medium">
                        <Sun className="h-3.5 w-3.5" /> Day Shift · 07:00–19:00
                    </div>
                </div>
            </div>

            {/* Overdue banner */}
            {(overdueTasks.length > 0 || overdueMeds.length > 0) && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.06] border-red-500/30 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    <div className="flex-1">
                        <span className="font-semibold text-red-700">Attention Required: </span>
                        {overdueTasks.length > 0 && <span className="text-red-700">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}</span>}
                        {overdueTasks.length > 0 && overdueMeds.length > 0 && <span className="text-red-700"> · </span>}
                        {overdueMeds.length > 0 && <span className="text-red-700">{overdueMeds.length} overdue medication{overdueMeds.length > 1 ? "s" : ""}</span>}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="My Patients" value={mockWardPatients.length} icon={BedDouble} iconClassName="bg-teal-500/10 text-teal-600" />
                <StatCard title="Critical" value={criticalPatients.length} icon={Heart} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Overdue Tasks" value={overdueTasks.length} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Pending Tasks" value={pendingTasks.length} icon={ClipboardList} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="Overdue Meds" value={overdueMeds.length} icon={Pill} iconClassName="bg-orange-500/10 text-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Patient Grid */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> My Patients
                        </h2>
                        <Link href="/nurse/ward" className="text-xs text-primary hover:underline flex items-center gap-1">
                            Ward Census <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mockWardPatients.map((patient) => {
                            const patientTasks = mockNursingTasks.filter((t) => t.patientId === patient.id);
                            const overdueCount = patientTasks.filter((t) => t.isOverdue).length;
                            const nextTask = patientTasks.find((t) => t.status === "pending" || t.status === "overdue");
                            const latestVital = mockVitals.filter((v) => v.patientId === patient.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
                            const lastVitalsTime = latestVital ? new Date(latestVital.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined;

                            return (
                                <BedsideSummary
                                    key={patient.id}
                                    patient={patient}
                                    nextTask={nextTask}
                                    overdueTasks={overdueCount}
                                    lastVitals={lastVitalsTime}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right: tasks */}
                <div className="lg:col-span-2">
                    <TaskList
                        tasks={mockNursingTasks.filter((t) => t.status !== "completed").slice(0, 8)}
                        title="Upcoming Tasks"
                    />
                </div>
            </div>
        </div>
    );
}
