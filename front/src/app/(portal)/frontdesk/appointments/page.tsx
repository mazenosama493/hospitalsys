"use client";

import { useState } from "react";
import { CalendarDays, Plus, Clock, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { StatCard } from "@/components/molecules/StatCard";
import { mockFrontdeskAppointments } from "@/features/frontdesk/data/mock-data";

const departments = ["All", "Internal Medicine", "Cardiology", "Neurology", "Surgery", "Orthopedics"];
const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

export default function AppointmentsPage() {
    const [selectedDate, setSelectedDate] = useState("2026-03-10");
    const [deptFilter, setDeptFilter] = useState("All");
    const [showBooking, setShowBooking] = useState(false);

    const dayAppts = mockFrontdeskAppointments.filter((a) => a.date === selectedDate);
    const filtered = deptFilter === "All" ? dayAppts : dayAppts.filter((a) => a.department === deptFilter);

    const scheduled = dayAppts.filter((a) => a.status === "scheduled").length;
    const completed = dayAppts.filter((a) => a.status === "completed").length;
    const inProgress = dayAppts.filter((a) => a.status === "in-progress").length;

    // Simple booking form state
    const [bookForm, setBookForm] = useState({ patientName: "", doctor: "", department: "", date: selectedDate, time: "", duration: "30", type: "consultation", notes: "" });

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Appointment Scheduler</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage and book patient appointments</p>
                </div>
                <Button className="gap-2" onClick={() => setShowBooking(!showBooking)}>
                    <Plus className="h-4 w-4" /> Book Appointment
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Total Today" value={dayAppts.length} icon={CalendarDays} iconClassName="bg-sky-500/10 text-sky-600" />
                <StatCard title="Scheduled" value={scheduled} icon={Clock} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="In Progress" value={inProgress} icon={User} iconClassName="bg-cyan-500/10 text-cyan-600" />
                <StatCard title="Completed" value={completed} icon={CalendarDays} iconClassName="bg-emerald-500/10 text-emerald-600" />
            </div>

            {/* Booking form */}
            {showBooking && (
                <Card className="border-primary/30 shadow-sm bg-primary/[0.02]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">New Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Patient Name</label>
                                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Search patient…" value={bookForm.patientName} onChange={(e) => setBookForm({ ...bookForm, patientName: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Doctor</label>
                                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={bookForm.doctor} onChange={(e) => setBookForm({ ...bookForm, doctor: e.target.value })}>
                                    <option value="">Select doctor…</option>
                                    <option>Dr. David Chen</option>
                                    <option>Dr. Sarah Kim</option>
                                    <option>Dr. Nina Patel</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Date</label>
                                <input type="date" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Time</label>
                                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}>
                                    <option value="">Select time…</option>
                                    {timeSlots.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => setShowBooking(false)}>Cancel</Button>
                            <Button size="sm" onClick={() => { setShowBooking(false); }}>Book Appointment</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Date + department filters */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Date:</label>
                    <input type="date" className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {departments.map((dept) => (
                        <button key={dept} onClick={() => setDeptFilter(dept)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${deptFilter === dept ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"}`}>
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schedule */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Schedule — {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filtered.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">No appointments for this day/filter</p>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map((appt) => (
                                <div key={appt.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                                    <div className="text-center min-w-[52px]">
                                        <p className="text-sm font-bold">{appt.time}</p>
                                        <p className="text-[10px] text-muted-foreground">{appt.duration}min</p>
                                    </div>
                                    <div className="h-10 w-px bg-border/60" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{appt.patientName}</p>
                                        <p className="text-xs text-muted-foreground">{appt.doctorName} · {appt.department}</p>
                                        {appt.notes && <p className="text-xs text-muted-foreground/70 mt-0.5 italic">{appt.notes}</p>}
                                    </div>
                                    <Badge variant="outline" className="text-[10px] capitalize">{appt.type}</Badge>
                                    <StatusBadge status={appt.status} />
                                    {appt.status === "scheduled" && (
                                        <Button size="sm" variant="outline" className="h-7 text-xs">Check In</Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
