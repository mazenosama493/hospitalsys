"use client";

import { AlertTriangle, Phone, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/molecules/StatCard";
import { ReportPreview } from "@/features/lab/components/ReportPreview";
import { mockLabReports } from "@/features/lab/mock/data";
import { cn } from "@/lib/utils";

export default function CriticalResultsPage() {
    const criticalReports = mockLabReports.filter((r) => r.hasCritical);
    const notified = criticalReports.filter((r) => r.criticalNotifiedTo);
    const pendingNotification = criticalReports.filter((r) => !r.criticalNotifiedTo);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Critical Results</h1>
                <p className="text-sm text-muted-foreground mt-1">Panic-value queue — requires physician notification and documentation</p>
            </div>

            {/* Alert banner */}
            {pendingNotification.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-red-500/[0.08] border-red-500/40 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 animate-pulse" />
                    <span className="font-semibold text-red-700">{pendingNotification.length} critical result{pendingNotification.length > 1 ? "s" : ""} awaiting physician notification</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Critical" value={criticalReports.length} icon={AlertTriangle} iconClassName="bg-red-500/10 text-red-600" />
                <StatCard title="Notified" value={notified.length} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="Pending Notification" value={pendingNotification.length} icon={Phone} iconClassName="bg-amber-500/10 text-amber-600" />
            </div>

            {/* Critical reports */}
            <div className="space-y-4">
                {criticalReports.map((report) => (
                    <div key={report.id}>
                        {!report.criticalNotifiedTo && (
                            <Card className="border-red-500/40 shadow-sm mb-2">
                                <CardContent className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-red-600" />
                                        <span className="font-medium text-red-700">Notify ordering physician: {report.orderedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" className="gap-1.5 text-xs bg-red-600 hover:bg-red-700">
                                            <Phone className="h-3 w-3" /> Mark Notified
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <ReportPreview report={report} />
                    </div>
                ))}
            </div>
        </div>
    );
}
