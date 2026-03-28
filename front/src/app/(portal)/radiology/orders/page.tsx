"use client";

import { useState } from "react";
import { Search, Filter, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import { StudyStatusPipeline } from "@/features/radiology/components/StudyStatusPipeline";
import { mockImagingOrders } from "@/features/radiology/mock/data";
import type { ImagingOrder, ImagingModality, ImagingStudyStatus } from "@/types";
import { cn } from "@/lib/utils";

const MODALITIES: (ImagingModality | "all")[] = ["all", "XR", "CT", "MRI", "US", "NM", "PET"];
const STATUSES: { label: string; value: ImagingStudyStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Ordered", value: "ordered" },
  { label: "Protocoled", value: "protocoled" },
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in-progress" },
  { label: "Acquired", value: "acquired" },
  { label: "Reading", value: "reading" },
  { label: "Reported", value: "reported" },
  { label: "Signed", value: "signed" },
];

const PRIORITY_STYLES: Record<string, string> = {
  stat:   "bg-red-100 text-red-700 border-red-300",
  urgent: "bg-orange-100 text-orange-700 border-orange-300",
  high:   "bg-amber-100 text-amber-700 border-amber-300",
  normal: "bg-slate-100 text-slate-600 border-slate-300",
};

export default function OrdersBoardPage() {
  const [query, setQuery]               = useState("");
  const [modality, setModality]         = useState<ImagingModality | "all">("all");
  const [statusFilter, setStatus]       = useState<ImagingStudyStatus | "all">("all");
  const [selected, setSelected]         = useState<ImagingOrder | null>(
    mockImagingOrders[0] ?? null,
  );

  const filtered = mockImagingOrders.filter((o) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      o.patientName.toLowerCase().includes(q) ||
      o.examName.toLowerCase().includes(q) ||
      o.accessionNumber.toLowerCase().includes(q) ||
      o.mrn.toLowerCase().includes(q);
    const matchM = modality === "all" || o.modality === modality;
    const matchS = statusFilter === "all" || o.status === statusFilter;
    return matchQ && matchM && matchS;
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders Board</h1>
        <p className="text-sm text-muted-foreground">
          {mockImagingOrders.length} orders today
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, exam, accession..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {MODALITIES.map((m) => (
            <button
              key={m}
              onClick={() => setModality(m)}
              className={cn(
                "rounded border px-2.5 py-1 text-xs font-semibold transition-colors",
                modality === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input text-muted-foreground hover:bg-muted",
              )}
            >
              {m === "all" ? "All Modalities" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground self-center mr-1" />
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={cn(
              "rounded-full border px-3 py-0.5 text-xs capitalize transition-colors",
              statusFilter === s.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-input text-muted-foreground hover:bg-muted",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Orders list */}
        <div className="w-full max-w-md flex flex-col gap-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">No orders match.</p>
          ) : (
            filtered.map((o) => (
              <div
                key={o.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(o)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(o)}
                className={cn(
                  "flex flex-col gap-1.5 rounded-lg border p-3 cursor-pointer transition-colors",
                  selected?.id === o.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/40",
                  (o.priority === "stat") && "border-l-4 border-l-red-500",
                  (o.priority === "urgent") && "border-l-4 border-l-orange-400",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ModalityBadge modality={o.modality} />
                    <span className="font-medium text-sm truncate">{o.patientName}</span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold uppercase",
                      PRIORITY_STYLES[o.priority],
                    )}
                  >
                    {o.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{o.examName}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{o.accessionNumber}</span>
                  <Badge variant="outline" className="text-xs capitalize">{o.status}</Badge>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator orientation="vertical" />

        {/* Order detail panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            <Card className="h-full">
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ModalityBadge modality={selected.modality} />
                      <h2 className="font-bold">{selected.patientName}</h2>
                      <span className="text-sm text-muted-foreground">{selected.mrn}</span>
                    </div>
                    <p className="text-sm font-medium">{selected.examName}</p>
                    <p className="text-xs text-muted-foreground">
                      Acc#: {selected.accessionNumber} · Room: {selected.scheduledRoom ?? "TBD"} ·{" "}
                      {selected.scheduledAt
                        ? new Date(selected.scheduledAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Not scheduled"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded border px-2 py-0.5 text-xs font-bold uppercase",
                      PRIORITY_STYLES[selected.priority],
                    )}
                  >
                    {selected.priority}
                  </span>
                </div>

                {/* Status Pipeline */}
                <div className="overflow-x-auto pb-2">
                  <StudyStatusPipeline status={selected.status} />
                </div>

                <Separator />

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    { label: "DOB", value: selected.dateOfBirth },
                    { label: "Gender", value: selected.gender },
                    { label: "Requested by", value: selected.requestedBy },
                    { label: "Department", value: selected.department },
                    { label: "Requested at", value: new Date(selected.requestedAt).toLocaleString() },
                    { label: "Body Region", value: `${selected.bodyRegion}${selected.laterality ? ` (${selected.laterality})` : ""}` },
                    { label: "Contrast", value: selected.contrastRequired ? "Required" : "Not required" },
                    { label: "Technologist", value: selected.assignedTechnologist ?? "—" },
                    { label: "Radiologist", value: selected.assignedRadiologist ?? "—" },
                    { label: "Protocoled by", value: selected.protocoledBy ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Clinical History */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Clinical History</p>
                  <p className="text-sm rounded bg-muted/50 p-2">{selected.clinicalHistory}</p>
                </div>

                {selected.notes && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm rounded bg-muted/50 p-2">{selected.notes}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  {selected.status === "ordered" && (
                    <Button size="sm">Protocol Order</Button>
                  )}
                  {selected.status === "protocoled" && (
                    <Button size="sm">Schedule</Button>
                  )}
                  {selected.reportId && (
                    <Button size="sm" variant="outline" className="gap-1">
                      <LinkIcon className="h-3.5 w-3.5" />
                      View Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select an order to view details.
          </div>
        )}
      </div>
    </div>
  );
}
