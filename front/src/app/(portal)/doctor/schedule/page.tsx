"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { mockDoctorAppointments } from "@/features/doctor/mock/data";

const days = ["2026-03-10", "2026-03-11", "2026-03-12"];
const dayLabels: Record<string, string> = {
    "2026-03-10": "Mon, Mar 10",
    "2026-03-11": "Tue, Mar 11",
    "2026-03-12": "Wed, Mar 12",
};

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState("2026-03-10");

    const dayAppts = mockDoctorAppointments.filter((a) => a.date === selectedDate);
    const scheduled = dayAppts.filter((a) => a.status === "scheduled").length;
    const inProgress = dayAppts.filter((a) => a.status === "in-progress").length;

    const currentIdx = days.indexOf(selectedDate);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Clinic Schedule</h1>
                <p className="text-sm text-muted-foreground mt-1">Your daily appointments and clinic availability</p>
            </div>

            {/* Day navigation */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentIdx <= 0} onClick={() => setSelectedDate(days[currentIdx - 1])}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1.5">
                    {days.map((d) => (
                        <button key={d} onClick={() => setSelectedDate(d)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDate === d ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"}`}>
                            {dayLabels[d] || d}
                        </button>
                    ))}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentIdx >= days.length - 1} onClick={() => setSelectedDate(days[currentIdx + 1])}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Appointments" value={dayAppts.length} icon={CalendarDays} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Scheduled" value={scheduled} icon={CalendarDays} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="In Progress" value={inProgress} icon={CalendarDays} iconClassName="bg-cyan-500/10 text-cyan-600" />
            </div>

            {/* Schedule */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {dayLabels[selectedDate] || selectedDate}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {dayAppts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No appointments scheduled for this day.</p>
                    ) : (
                        <div className="space-y-2">
                            {dayAppts.map((apt) => (
                                <Link key={apt.id} href={`/doctor/patients/${apt.patientId}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                                    <div className="text-center min-w-[56px]">
                                        <p className="text-sm font-bold">{apt.time}</p>
                                        <p className="text-[10px] text-muted-foreground">{apt.duration} min</p>
                                    </div>
                                    <div className="h-10 w-px bg-border/60" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{apt.patientName}</p>
                                        <p className="text-xs text-muted-foreground">{apt.department} · <span className="capitalize">{apt.type}</span>{apt.notes ? ` — ${apt.notes}` : ""}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] capitalize">{apt.type}</Badge>
                                    <StatusBadge status={apt.status} />
                                    {apt.status === "scheduled" && (
                                        <Button size="sm" variant="outline" className="h-7 text-xs">Start Visit</Button>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
