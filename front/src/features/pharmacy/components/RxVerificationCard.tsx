"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, XCircle, Pill, Clock, AlertTriangle } from "lucide-react";
import { DrugWarningBanner } from "./DrugWarningBanner";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import type { PharmacyPrescription } from "@/types";
import { cn } from "@/lib/utils";

interface RxVerificationCardProps {
  rx: PharmacyPrescription;
  className?: string;
}

export function RxVerificationCard({ rx, className }: RxVerificationCardProps) {
  const hasWarnings = rx.warnings.length > 0;
  const hasSevere = rx.warnings.some((w) => w.severity === "severe" || w.severity === "contraindicated");

  return (
    <Card className={cn("border-border/50 shadow-sm", hasSevere && "border-red-500/40", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            {rx.medication} {rx.dosage}
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusBadge status={rx.priority} />
            <StatusBadge status={rx.status} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs mt-2">
          <div><span className="text-muted-foreground">Patient: </span><span className="font-medium">{rx.patientName}</span></div>
          <div><span className="text-muted-foreground">MRN: </span><span className="font-mono">{rx.mrn}</span></div>
          <div><span className="text-muted-foreground">Route: </span><span>{rx.route}</span></div>
          <div><span className="text-muted-foreground">Freq: </span><span>{rx.frequency}</span></div>
          <div><span className="text-muted-foreground">Qty: </span><span className="font-medium">{rx.quantity}</span></div>
          <div><span className="text-muted-foreground">Refills: </span><span>{rx.refillsRemaining}/{rx.refillsAllowed}</span></div>
          <div><span className="text-muted-foreground">Setting: </span><Badge variant="outline" className="text-[10px] capitalize">{rx.setting}</Badge></div>
          <div><span className="text-muted-foreground">Prescriber: </span><span>{rx.prescribedBy}</span></div>
        </div>
        {rx.allergies.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-[10px] text-red-700 font-semibold">Allergies:</span>
            {rx.allergies.map((a) => (
              <Badge key={a} variant="destructive" className="text-[9px] px-1 py-0">{a}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Warnings */}
        {hasWarnings && (
          <div className="space-y-2">
            {rx.warnings.map((w) => (
              <DrugWarningBanner key={w.id} warning={w} />
            ))}
          </div>
        )}

        {/* Pharmacist comment */}
        <Textarea placeholder="Pharmacist verification notes…" rows={2} className="text-xs resize-none" />

        {/* Audit trail */}
        {rx.verifiedBy && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground border-t pt-2">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
            <span>Verified by {rx.verifiedBy} at {rx.verifiedAt ? new Date(rx.verifiedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
          </div>
        )}

        {/* Actions */}
        {(rx.status === "pending-verification" || rx.status === "ordered") && (
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-600 border-amber-500/30 hover:bg-amber-500/10">
              <Clock className="h-3.5 w-3.5" /> Hold
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-red-600 border-red-500/30 hover:bg-red-500/10">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
            <Button size="sm" className="gap-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" /> Verify
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
