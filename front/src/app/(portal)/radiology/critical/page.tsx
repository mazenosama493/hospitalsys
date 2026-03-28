"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CriticalFindingBanner } from "@/features/radiology/components/CriticalFindingBanner";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import { mockCriticalFindings } from "@/features/radiology/mock/data";
import type { CriticalFinding } from "@/types";
import { cn } from "@/lib/utils";

export default function CriticalFindingsPage() {
  const [findings, setFindings] = useState<CriticalFinding[]>(mockCriticalFindings);

  function handleNotify(id: string) {
    setFindings((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "notified" as const,
              notifiedAt: new Date().toISOString(),
              notifiedTo: "Ordering Physician",
            }
          : c,
      ),
    );
  }

  function handleAcknowledge(id: string) {
    setFindings((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "acknowledged" as const,
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: "Dr. David Chen",
            }
          : c,
      ),
    );
  }

  const pending    = findings.filter((c) => c.status === "pending" || c.status === "notified");
  const acknowledged = findings.filter((c) => c.status === "acknowledged");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Critical Findings
          </h1>
          <p className="text-sm text-muted-foreground">
            Radiologist-identified findings requiring immediate communication
          </p>
        </div>
        <div className="flex gap-3">
          <Badge
            variant="secondary"
            className={cn(
              "gap-1 text-sm",
              pending.length > 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600",
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {pending.length} Pending
          </Badge>
          <Badge variant="secondary" className="gap-1 text-sm bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {acknowledged.length} Acknowledged
          </Badge>
        </div>
      </div>

      {/* Pending / Active */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Pending &amp; Notified
        </h2>

        {pending.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="font-medium">All critical findings have been acknowledged.</p>
              <p className="text-sm">No pending actions required.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((cf) => (
              <CriticalFindingBanner
                key={cf.id}
                finding={cf}
                onNotify={handleNotify}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Acknowledged history */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Acknowledged History
        </h2>

        {acknowledged.length === 0 ? (
          <p className="text-sm text-muted-foreground">No acknowledged findings yet.</p>
        ) : (
          <div className="space-y-2">
            {acknowledged.map((cf) => (
              <Card key={cf.id} className="border-l-4 border-l-emerald-500 bg-emerald-50/30">
                <CardHeader className="pb-1 pt-3">
                  <CardTitle className="flex flex-wrap items-center gap-2 text-sm font-normal">
                    <ModalityBadge modality={cf.modality} />
                    <span className="font-semibold">{cf.patientName}</span>
                    <span className="text-muted-foreground">{cf.mrn}</span>
                    <span className="text-muted-foreground">· {cf.examName}</span>
                    <Badge
                      variant="secondary"
                      className={
                        cf.severity === "critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {cf.severity}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 gap-1 ml-auto"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Acknowledged
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 space-y-1 text-sm">
                  <p className="font-medium">{cf.finding}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>Identified by {cf.identifiedBy}</span>
                    {cf.notifiedTo && <span>Notified: {cf.notifiedTo}</span>}
                    {cf.acknowledgedBy && (
                      <span>
                        Acknowledged by {cf.acknowledgedBy}
                        {cf.acknowledgedAt && (
                          <> at {new Date(cf.acknowledgedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
                        )}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
