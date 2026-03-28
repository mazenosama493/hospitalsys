"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StudyCard } from "@/features/radiology/components/StudyCard";
import { StudyStatusPipeline } from "@/features/radiology/components/StudyStatusPipeline";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import { mockImagingStudies, mockPriorStudies } from "@/features/radiology/mock/data";
import type { ImagingModality, ImagingStudy } from "@/types";
import { cn } from "@/lib/utils";

const MODALITIES: (ImagingModality | "all")[] = ["all", "XR", "CT", "MRI", "US", "NM", "PET"];
const READ_STATUSES: ImagingStudy["status"][] = ["acquired", "reading", "reported"];

export default function WorklistPage() {
  const [query, setQuery]         = useState("");
  const [modality, setModality]   = useState<ImagingModality | "all">("all");
  const [showAll, setShowAll]     = useState(false);
  const [selected, setSelected]   = useState<ImagingStudy | null>(
    mockImagingStudies.find((s) => s.status === "acquired" || s.status === "reading") ?? null,
  );

  const filtered = mockImagingStudies.filter((s) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      s.patientName.toLowerCase().includes(q) ||
      s.examName.toLowerCase().includes(q) ||
      s.accessionNumber.toLowerCase().includes(q);
    const matchM = modality === "all" || s.modality === modality;
    const matchStatus = showAll || READ_STATUSES.includes(s.status as ImagingStudy["status"]);
    return matchQ && matchM && matchStatus;
  });

  const priors = selected
    ? mockPriorStudies.filter((p) => p.patientId === selected.patientId)
    : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modality Worklist</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} studies{!showAll && " awaiting read"}
        </p>
      </div>

      {/* Controls */}
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
              {m === "all" ? "All" : m}
            </button>
          ))}
        </div>
        <Button
          variant={showAll ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Pending only" : "Show all"}
        </Button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Study list */}
        <div className="w-full max-w-md flex flex-col gap-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">No studies match filters.</p>
          ) : (
            filtered.map((s) => (
              <StudyCard
                key={s.id}
                study={s}
                selected={selected?.id === s.id}
                onClick={() => setSelected(s)}
              />
            ))
          )}
        </div>

        <Separator orientation="vertical" />

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            <Card className="h-full">
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <ModalityBadge modality={selected.modality} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{selected.patientName}</p>
                    <p className="text-sm text-muted-foreground">{selected.mrn}</p>
                    <p className="text-sm font-medium mt-0.5">{selected.examName}</p>
                    <p className="text-xs text-muted-foreground">Acc#: {selected.accessionNumber}</p>
                  </div>
                  {selected.hasCritical && (
                    <Badge variant="destructive" className="shrink-0">CRITICAL</Badge>
                  )}
                </div>

                {/* Status pipeline */}
                <div className="overflow-x-auto pb-1">
                  <StudyStatusPipeline status={selected.status} />
                </div>

                <Separator />

                {/* Study details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    { label: "Room", value: selected.room ?? "—" },
                    { label: "Date / Time", value: `${selected.examDate} · ${selected.examTime}` },
                    { label: "Technologist", value: selected.technologist ?? "—" },
                    { label: "Radiologist", value: selected.radiologist ?? "—" },
                    { label: "Images", value: selected.imagesCount !== undefined ? `${selected.imagesCount} images / ${selected.seriesCount} series` : "—" },
                    { label: "Priority", value: selected.priority },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                      <p className="font-medium capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Clinical History</p>
                  <p className="text-sm rounded bg-muted/50 p-2">{selected.clinicalHistory}</p>
                </div>

                {/* PACS link */}
                <Button className="w-full gap-2" variant="secondary">
                  <ExternalLink className="h-4 w-4" />
                  Open in PACS Viewer (Demo)
                </Button>

                {/* Prior studies */}
                {priors.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Prior Studies for {selected.patientName}
                      </p>
                      <div className="space-y-2">
                        {priors.map((p) => (
                          <div key={p.id} className="rounded border p-2 text-xs space-y-0.5">
                            <div className="flex items-center gap-2">
                              <ModalityBadge modality={p.modality} />
                              <span className="font-medium">{p.examName}</span>
                              <span className="text-muted-foreground">{p.examDate}</span>
                            </div>
                            {p.impression && (
                              <p className="text-muted-foreground italic pl-1">{p.impression}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a study to view details.
          </div>
        )}
      </div>
    </div>
  );
}
