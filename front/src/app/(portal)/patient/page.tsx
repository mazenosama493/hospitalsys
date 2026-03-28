"use client";

import {
    CalendarDays,
    Pill,
    FileText,
    Activity,
    Heart,
    Clock,
    CheckCircle2,
    FlaskConical,
} from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    mockPatientAppointments,
    mockPatientMedications,
    mockPatientVitalsHistory,
    mockLabResults,
} from "@/features/patient/mock/data";

export default function PatientDashboard() {
    const upcomingAppointments = mockPatientAppointments.filter(
        (a) => a.status === "scheduled"
    );
    const activeMeds = mockPatientMedications.filter(
        (m) => m.status === "active"
    );
    const latestVitals = mockPatientVitalsHistory[0];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back, Emily
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Your personal health dashboard
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Upcoming Appointments"
                    value={upcomingAppointments.length}
                    icon={CalendarDays}
                    iconClassName="bg-sky-500/10 text-sky-600"
                />
                <StatCard
                    title="Active Medications"
                    value={activeMeds.length}
                    icon={Pill}
                    iconClassName="bg-emerald-500/10 text-emerald-600"
                />
                <StatCard
                    title="Pending Lab Results"
                    value={mockLabResults.filter((l) => l.status !== "completed").length}
                    icon={FlaskConical}
                    iconClassName="bg-amber-500/10 text-amber-600"
                />
                <StatCard
                    title="Blood Pressure"
                    value={`${latestVitals.systolic}/${latestVitals.diastolic}`}
                    icon={Heart}
                    iconClassName="bg-rose-500/10 text-rose-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Upcoming Appointments */}
                <Card className="lg:col-span-3 border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            Upcoming Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary">
                                        <span className="text-lg font-bold leading-none">
                                            {new Date(apt.date).getDate()}
                                        </span>
                                        <span className="text-[10px] font-medium uppercase mt-0.5">
                                            {new Date(apt.date).toLocaleString("en", { month: "short" })}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold">{apt.doctorName}</p>
                                        <p className="text-xs text-muted-foreground">{apt.department}</p>
                                        {apt.notes && (
                                            <p className="text-xs text-muted-foreground/80 mt-0.5 truncate">{apt.notes}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            {apt.time}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                                            {apt.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Medications */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            Current Medications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activeMeds.map((med) => (
                                <div
                                    key={med.id}
                                    className="p-3 rounded-lg hover:bg-muted/40 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">{med.name}</p>
                                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {med.dosage} · {med.frequency} · {med.route}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        Prescribed by {med.prescribedBy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lab Results & Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lab Results */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-primary" />
                            Recent Lab Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {mockLabResults.map((lab) => (
                                <div
                                    key={lab.id}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{lab.testName}</p>
                                        <p className="text-xs text-muted-foreground">{lab.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lab.result && (
                                            <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                                                {lab.result}
                                            </span>
                                        )}
                                        <StatusBadge status={lab.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Vitals */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Vitals History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">Date</th>
                                        <th className="text-center py-2 px-2 text-xs font-semibold text-muted-foreground">BP</th>
                                        <th className="text-center py-2 px-2 text-xs font-semibold text-muted-foreground">HR</th>
                                        <th className="text-center py-2 px-2 text-xs font-semibold text-muted-foreground">Temp</th>
                                        <th className="text-center py-2 px-2 text-xs font-semibold text-muted-foreground">SpO₂</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockPatientVitalsHistory.map((v, i) => (
                                        <tr key={i} className="border-b border-border/20">
                                            <td className="py-2 px-2 font-medium">{v.date}</td>
                                            <td className="py-2 px-2 text-center">{v.systolic}/{v.diastolic}</td>
                                            <td className="py-2 px-2 text-center">{v.heartRate}</td>
                                            <td className="py-2 px-2 text-center">{v.temp}°F</td>
                                            <td className="py-2 px-2 text-center">{v.spo2}%</td>
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
