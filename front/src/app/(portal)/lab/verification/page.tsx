"use client";

import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { VerificationPanel } from "@/features/lab/components/VerificationPanel";
import { mockLabPanels } from "@/features/lab/mock/data";

export default function VerificationPage() {
    const pendingVerification = mockLabPanels.filter((p) => p.status === "complete" || p.status === "partial");
    const verified = mockLabPanels.filter((p) => p.status === "verified" || p.status === "released");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Result Verification</h1>
                <p className="text-sm text-muted-foreground mt-1">Review, authorize, and release final lab results</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Awaiting Verification" value={pendingVerification.length} icon={Clock} iconClassName="bg-amber-500/10 text-amber-600" />
                <StatCard title="Verified Today" value={verified.length} icon={CheckCircle2} iconClassName="bg-emerald-500/10 text-emerald-600" />
                <StatCard title="Total Panels" value={mockLabPanels.length} icon={ShieldCheck} iconClassName="bg-teal-500/10 text-teal-600" />
            </div>

            {/* Panels to verify */}
            <div className="space-y-4">
                {pendingVerification.length === 0 ? (
                    <div className="text-center py-12 text-sm text-muted-foreground">All panels verified — no items pending.</div>
                ) : (
                    pendingVerification.map((panel) => (
                        <VerificationPanel key={panel.id} panel={panel} />
                    ))
                )}
            </div>

            {/* Recently verified */}
            {verified.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-base font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Recently Verified
                    </h2>
                    {verified.map((panel) => (
                        <VerificationPanel key={panel.id} panel={panel} />
                    ))}
                </div>
            )}
        </div>
    );
}
