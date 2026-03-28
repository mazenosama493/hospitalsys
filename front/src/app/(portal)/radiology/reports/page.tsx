"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import { ReportEditor } from "@/features/radiology/components/ReportEditor";
import { mockRadiologyReports, mockPriorStudies } from "@/features/radiology/mock/data";
import type { RadiologyReport, RadReportStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: RadReportStatus | "all" }[] = [
  { label: "All",         value: "all" },
  { label: "Draft",       value: "draft" },
  { label: "Preliminary", value: "preliminary" },
  { label: "Final",       value: "final" },
  { label: "Amended",     value: "amended" },
];

const STATUS_STYLES: Record<RadReportStatus, string> = {
  draft:       "bg-slate-100 text-slate-700",
  preliminary: "bg-amber-100 text-amber-700",
  final:       "bg-emerald-100 text-emerald-700",
  amended:     "bg-cyan-100 text-cyan-700",
  addendum:    "bg-purple-100 text-purple-700",
};

export default function ReportsPage() {
  const [query, setQuery]         = useState("");
  const [statusFilter, setStatus] = useState<RadReportStatus | "all">("all");
  const [reports, setReports]     = useState<RadiologyReport[]>(mockRadiologyReports);
  const [selectedId, setSelectedId] = useState<string>(
    mockRadiologyReports.find((r) => r.status !== "final")?.id ?? mockRadiologyReports[0]?.id ?? "",
  );

  const filtered = reports.filter((r) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.examName.toLowerCase().includes(q) ||
      r.accessionNumber.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || r.status === statusFilter;
    return matchQ && matchS;
  });

  const selected = reports.find((r) => r.id === selectedId) ?? null;
  const priors = selected
    ? mockPriorStudies.filter((p) => p.patientId === selected.patientId)
    : [];

  function handleSaveDraft(id: string, data: Partial<RadiologyReport>) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r)));
  }

  function handleSignPreliminary(id: string) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "preliminary" as const, updatedAt: new Date().toISOString() } : r,
      ),
    );
  }

  function handleSign(id: string) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "final" as const, signedAt: new Date().toISOString() }
          : r,
      ),
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Radiology Reports</h1>
        <p className="text-sm text-muted-foreground">{reports.length} reports today</p>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left panel — report list */}
        <div className="flex w-72 shrink-0 flex-col gap-3 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs capitalize transition-colors",
                  statusFilter === s.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input text-muted-foreground hover:bg-muted",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No reports match.</p>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(r.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedId(r.id)}
                  className={cn(
                    "rounded-lg border p-2.5 cursor-pointer transition-colors space-y-1",
                    selectedId === r.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/40",
                    r.hasCritical && "border-l-4 border-l-red-500",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ModalityBadge modality={r.modality} />
                    <span className="text-sm font-medium truncate flex-1">{r.patientName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{r.examName}</p>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] text-muted-foreground">{r.accessionNumber}</span>
                    <Badge variant="secondary" className={cn("capitalize text-[11px]", STATUS_STYLES[r.status])}>
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Separator orientation="vertical" />

        {/* Right panel — report editor */}
        <div className="flex-1 overflow-hidden">
          {selected ? (
            <ReportEditor
              report={selected}
              priorStudies={priors}
              onSaveDraft={handleSaveDraft}
              onSignPreliminary={handleSignPreliminary}
              onSign={handleSign}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Select a report to view or edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
