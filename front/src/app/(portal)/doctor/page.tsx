"use client";

import Link from "next/link";
import { Users, CalendarDays, AlertTriangle, Clock, Stethoscope, Activity, FileText, Plus, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDoctorPatients, mockDoctorAppointments, mockDoctorAlerts, mockResults } from "@/features/doctor/mock/data";

const alertColors = {
    critical: "bg-red-500/10 border-red-500/20 text-red-700",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-700",
    info: "bg-sky-500/10 border-sky-500/20 text-sky-700",
};

export default function DoctorDashboard() {
    const todayAppointments = mockDoctorAppointments.filter((a) => a.date === "2026-03-10");
    const criticalPatients = mockDoctorPatients.filter((p) => p.status === "critical");
    const unreviewedResults = mockResults.filter((r) => !r.reviewedBy);
    const flaggedResults = mockResults.filter((r) => r.flag === "critical" || r.flag === "high");

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Good morning, Dr. Chen</h1>
                    <p className="text-sm text-muted-foreground mt-1">Here&apos;s your clinical overview for today</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/doctor/encounters/new">
                        <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> New Note</Button>
                    </Link>
                    <Link href="/doctor/orders">
                        <Button className="gap-2"><Plus className="h-4 w-4" /> New Order</Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="My Patients" value={mockDoctorPatients.length} icon={Users} iconClassName="bg-teal-500/10 text-teal-600" />
                <StatCard title="Today's Appointments" value={todayAppointments.length} icon={CalendarDays} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Critical Alerts" value={criticalPatients.length} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Unreviewed Results" value={unreviewedResults.length} icon={Activity} iconClassName="bg-amber-500/10 text-amber-600" />
            </div>

            {/* Alerts Banner */}
            {mockDoctorAlerts.length > 0 && (
                <div className="space-y-2">
                    {mockDoctorAlerts.map((alert) => (
                        <div key={alert.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${alertColors[alert.severity]}`}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="flex-1 font-medium">{alert.message}</span>
                            <span className="text-xs opacity-70">{alert.time}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Today's Schedule */}
                <Card className="lg:col-span-3 border-border/50 shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            Today&apos;s Schedule
                        </CardTitle>
                        <Link href="/doctor/schedule" className="text-xs text-primary hover:underline flex items-center gap-1">
                            Full schedule <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {todayAppointments.map((apt) => (
                                <Link key={apt.id} href={`/doctor/patients/${apt.patientId}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                                    <div className="text-center min-w-[52px]">
                                        <p className="text-sm font-bold">{apt.time}</p>
                                        <p className="text-[10px] text-muted-foreground">{apt.duration}min</p>
                                    </div>
                                    <div className="h-10 w-px bg-border/60" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{apt.patientName}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{apt.type}{apt.notes ? ` — ${apt.notes}` : ""}</p>
                                    </div>
                                    <StatusBadge status={apt.status} />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Admitted Patients */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                Admitted Patients
                            </CardTitle>
                            <Link href="/doctor/patients" className="text-xs text-primary hover:underline flex items-center gap-1">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {mockDoctorPatients.filter((p) => p.ward).map((patient) => (
                                    <Link key={patient.id} href={`/doctor/patients/${patient.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                {patient.firstName[0]}{patient.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{patient.firstName} {patient.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{patient.ward} · Rm {patient.roomNumber}</p>
                                        </div>
                                        <StatusBadge status={patient.status} />
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flagged Results */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Flagged Results
                            </CardTitle>
                            <Link href="/doctor/results" className="text-xs text-primary hover:underline flex items-center gap-1">
                                Results inbox <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {flaggedResults.slice(0, 4).map((res) => {
                                    const flagColor = res.flag === "critical" ? "text-red-600" : "text-amber-600";
                                    return (
                                        <div key={res.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                                            <AlertTriangle className={`h-4 w-4 shrink-0 ${flagColor}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{res.testName}</p>
                                                <p className="text-xs text-muted-foreground">{res.patientName}</p>
                                            </div>
                                            <span className={`text-sm font-bold ${flagColor}`}>{res.value} <span className="text-xs font-normal text-muted-foreground">{res.unit}</span></span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
