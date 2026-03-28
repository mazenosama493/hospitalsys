"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, CheckCircle2, XCircle, Clock, AlertTriangle, ScanLine } from "lucide-react";
import type { MAREntry } from "@/types";
import { cn } from "@/lib/utils";

interface MARTimelineProps {
  entries: MAREntry[];
  className?: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  given: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/30" },
  scheduled: { icon: Clock, color: "text-sky-600", bg: "bg-sky-500/10 border-sky-500/30" },
  overdue: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-500/10 border-red-500/30" },
  missed: { icon: XCircle, color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/30" },
  held: { icon: Clock, color: "text-slate-600", bg: "bg-slate-500/10 border-slate-500/30" },
  refused: { icon: XCircle, color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/30" },
};

export function MARTimeline({ entries, className }: MARTimelineProps) {
  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Pill className="h-4 w-4 text-primary" />
          Medication Administration Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => {
            const cfg = statusConfig[entry.status] || statusConfig.scheduled;
            const Icon = cfg.icon;
            const schedTime = new Date(entry.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const adminTime = entry.administeredTime ? new Date(entry.administeredTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

            return (
              <div key={entry.id} className={cn("flex items-center gap-3 p-2.5 rounded-lg border", cfg.bg)}>
                <Icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{entry.medication}</p>
                    <Badge variant="outline" className="text-[10px] capitalize">{entry.route}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span>Scheduled: {schedTime}</span>
                    {adminTime && <><span>·</span><span>Given: {adminTime}</span></>}
                    {entry.administeredBy && <><span>·</span><span>By: {entry.administeredBy}</span></>}
                    {entry.notes && <><span>·</span><span className="italic">{entry.notes}</span></>}
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[10px] capitalize", cfg.color)}>{entry.status}</Badge>
                {(entry.status === "scheduled" || entry.status === "overdue") && (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 shrink-0">
                    <ScanLine className="h-3 w-3" /> Scan & Give
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
