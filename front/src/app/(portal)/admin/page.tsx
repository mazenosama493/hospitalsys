"use client";

import Link from "next/link";
import {
  Users, Building2, Activity, ShieldCheck, BedDouble,
  FlaskConical, ScanLine, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mockAdminStats, mockAdminDepartments, mockAdminUsers,
  mockAuditLogs, mockBeds, mockRecentActivity,
} from "@/features/admin/mock/data";
import { RoleBadge } from "@/features/admin/components/RoleBadge";
import { StatusChip } from "@/features/admin/components/StatusChip";

const stats = mockAdminStats;
const recentAudit = mockAuditLogs.slice(-6).reverse();
const bedSummary = [
  { label: "Available", count: mockBeds.filter((b) => b.status === "available").length, color: "text-emerald-600" },
  { label: "Occupied",  count: mockBeds.filter((b) => b.status === "occupied").length,  color: "text-blue-600" },
  { label: "Reserved",  count: mockBeds.filter((b) => b.status === "reserved").length,  color: "text-violet-600" },
  { label: "Maintenance/Cleaning", count: mockBeds.filter((b) => b.status === "maintenance" || b.status === "cleaning").length, color: "text-amber-600" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        System overview · MedHub Virtual Hospital
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    {stats.systemUptime}% uptime
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    trend={{ value: stats.activeUsers, label: "active" }}
                    iconClassName="bg-violet-500/10 text-violet-600"
                />
                <StatCard
                    title="Departments"
                    value={stats.totalDepartments}
                    icon={Building2}
                    iconClassName="bg-teal-500/10 text-teal-600"
                />
                <StatCard
                    title="Beds"
                    value={`${stats.occupiedBeds}/${stats.totalBeds}`}
                    icon={BedDouble}
                    trend={{ value: Math.round((stats.occupiedBeds / stats.totalBeds) * 100), label: "% occupied" }}
                    iconClassName="bg-sky-500/10 text-sky-600"
                />
                <StatCard
                    title="Audit Events Today"
                    value={stats.auditLogsToday}
                    icon={ShieldCheck}
                    iconClassName="bg-emerald-500/10 text-emerald-600"
                />
            </div>

            {/* Row 2: Catalog counts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Lab Tests"
                    value={stats.totalLabTests}
                    icon={FlaskConical}
                    iconClassName="bg-amber-500/10 text-amber-600"
                />
                <StatCard
                    title="Radiology Studies"
                    value={stats.totalRadiologyStudies}
                    icon={ScanLine}
                    iconClassName="bg-indigo-500/10 text-indigo-600"
                />
                <StatCard
                    title="Active Patients"
                    value={mockAdminDepartments.reduce((s, d) => s + d.activePatients, 0)}
                    icon={Activity}
                    iconClassName="bg-rose-500/10 text-rose-600"
                />
                <StatCard
                    title="Suspended Users"
                    value={mockAdminUsers.filter((u) => u.status === "suspended").length}
                    icon={AlertTriangle}
                    iconClassName="bg-red-500/10 text-red-600"
                />
            </div>

            {/* Three-column section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Departments Table */}
                <Card className="lg:col-span-3 border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                Departments
                            </CardTitle>
                            <Link href="/admin/departments">
                                <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Head</th>
                                        <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Staff</th>
                                        <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patients</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockAdminDepartments.slice(0, 8).map((dept) => (
                                        <tr key={dept.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 px-3 font-medium">{dept.name}</td>
                                            <td className="py-2.5 px-3 text-muted-foreground">{dept.headName ?? "—"}</td>
                                            <td className="py-2.5 px-3 text-center">{dept.staffCount}</td>
                                            <td className="py-2.5 px-3 text-center">
                                                <Badge variant="secondary" className="text-xs">
                                                    {dept.activePatients}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Right column: Bed status + Recent Activity */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Bed Availability */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <BedDouble className="h-4 w-4 text-primary" />
                                    Bed Availability
                                </CardTitle>
                                <Link href="/admin/beds">
                                    <Button variant="ghost" size="sm" className="text-xs h-7">Manage</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {bedSummary.map((item) => (
                                    <div key={item.label} className="rounded-lg border border-border/50 p-3 text-center">
                                        <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-border/50 shadow-sm flex-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockRecentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 py-1.5">
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                                            activity.type === "success" ? "bg-emerald-500" :
                                            activity.type === "warning" ? "bg-amber-500" : "bg-sky-500"
                                        }`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium leading-tight">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {activity.user} · {activity.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Audit Trail Preview */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Recent Audit Events
                        </CardTitle>
                        <Link href="/admin/audit">
                            <Button variant="ghost" size="sm" className="text-xs h-7">View full log</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outcome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAudit.map((entry) => (
                                    <tr key={entry.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${entry.severity === "critical" ? "bg-red-500/5" : ""}`}>
                                        <td className="py-2.5 px-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                                            {entry.timestamp.replace("T", " ").substring(0, 16)}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <p className="font-medium text-xs">{entry.userName}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{entry.userRole.replace("_", " ")}</p>
                                        </td>
                                        <td className="py-2.5 px-3 capitalize font-medium text-xs">{entry.action.replace("_", " ")}</td>
                                        <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{entry.resource}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <StatusChip status={entry.severity} />
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            {entry.outcome === "success"
                                                ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                                                : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Users Preview */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Users
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {stats.totalUsers} total
                            </Badge>
                            <Link href="/admin/users">
                                <Button variant="ghost" size="sm" className="text-xs h-7">Manage</Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockAdminUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                        <td className="py-2.5 px-3 font-medium">{user.firstName} {user.lastName}</td>
                                        <td className="py-2.5 px-3 text-muted-foreground">{user.email}</td>
                                        <td className="py-2.5 px-3">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="py-2.5 px-3 text-muted-foreground">{user.departmentName ?? "—"}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <StatusChip status={user.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

