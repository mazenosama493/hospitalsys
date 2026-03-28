"use client";

import { useState } from "react";
import { BedDouble, User, Clock, Wrench, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/features/admin/components/StatusChip";
import { mockWards, mockBeds } from "@/features/admin/mock/data";
import type { Bed, BedStatus } from "@/types";

const BED_STATUS_COLORS: Record<BedStatus, string> = {
  available:   "bg-emerald-500/15 border-emerald-400/40 text-emerald-700",
  occupied:    "bg-blue-500/15 border-blue-400/40 text-blue-700",
  reserved:    "bg-violet-500/15 border-violet-400/40 text-violet-700",
  maintenance: "bg-orange-500/15 border-orange-400/40 text-orange-700",
  cleaning:    "bg-amber-500/15 border-amber-400/40 text-amber-700",
};

const BED_STATUS_ICONS: Record<BedStatus, React.ReactNode> = {
  available:   <BedDouble className="h-4 w-4" />,
  occupied:    <User className="h-4 w-4" />,
  reserved:    <Clock className="h-4 w-4" />,
  maintenance: <Wrench className="h-4 w-4" />,
  cleaning:    <Sparkles className="h-4 w-4" />,
};

export default function BedsPage() {
  const [selectedWardId, setSelectedWardId] = useState<string>(mockWards[0]?.id ?? "");
  const [statusFilter, setStatusFilter] = useState<BedStatus | "all">("all");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  const selectedWard = mockWards.find((w) => w.id === selectedWardId);
  const wardBeds = mockBeds.filter((b) => {
    const matchWard = b.wardId === selectedWardId;
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchWard && matchStatus;
  });

  const allBeds = mockBeds;
  const occupancyRate = allBeds.length > 0
    ? Math.round((allBeds.filter((b) => b.status === "occupied").length / allBeds.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rooms &amp; Beds</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {allBeds.length} beds total · {allBeds.filter((b) => b.status === "occupied").length} occupied ({occupancyRate}%)
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <BedDouble className="h-4 w-4" /> Add Bed
        </Button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["available", "occupied", "reserved", "maintenance", "cleaning"] as BedStatus[]).map((s) => (
          <div
            key={s}
            className={`rounded-xl border p-3 text-center cursor-pointer transition-all ${statusFilter === s ? "ring-2 ring-primary" : ""} ${BED_STATUS_COLORS[s]}`}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
          >
            <div className="flex justify-center mb-1">{BED_STATUS_ICONS[s]}</div>
            <p className="text-xl font-bold">
              {allBeds.filter((b) => b.status === s).length}
            </p>
            <p className="text-xs capitalize mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Ward Sidebar */}
        <div className="w-56 shrink-0 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Wards</p>
          {mockWards.map((ward) => {
            const wardBedList = mockBeds.filter((b) => b.wardId === ward.id);
            const occupied = wardBedList.filter((b) => b.status === "occupied").length;
            return (
              <button
                key={ward.id}
                onClick={() => { setSelectedWardId(ward.id); setSelectedBed(null); }}
                className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-all ${selectedWardId === ward.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 hover:bg-muted/50"
                }`}
              >
                <p className="font-medium text-sm truncate">{ward.name}</p>
                <p className={`text-xs mt-0.5 ${selectedWardId === ward.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {occupied}/{ward.totalBeds} occupied
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60"
                    style={{ width: `${ward.totalBeds > 0 ? Math.round((occupied / ward.totalBeds) * 100) : 0}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bed Grid */}
        <div className="flex-1 min-w-0 space-y-4">
          {selectedWard && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">{selectedWard.name}</h2>
                <p className="text-xs text-muted-foreground capitalize">
                  {selectedWard.type.replace("_", " ")} · Floor {selectedWard.floorNumber}, {selectedWard.building}
                  {selectedWard.headNurseName ? ` · Head: ${selectedWard.headNurseName}` : ""}
                </p>
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BedStatus | "all")}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {wardBeds.length === 0 ? (
              <div className="col-span-5 py-16 text-center text-sm text-muted-foreground">
                No beds in this ward or all are filtered out.
              </div>
            ) : wardBeds.map((bed) => (
              <button
                key={bed.id}
                onClick={() => setSelectedBed(bed.id === selectedBed?.id ? null : bed)}
                className={`rounded-xl border p-3 text-left transition-all hover:shadow-md ${BED_STATUS_COLORS[bed.status]} ${selectedBed?.id === bed.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{bed.number}</span>
                  {BED_STATUS_ICONS[bed.status]}
                </div>
                {bed.roomNumber && (
                  <p className="text-xs mt-1 opacity-70">Room {bed.roomNumber}</p>
                )}
                <p className="text-xs capitalize mt-0.5 font-medium">{bed.status}</p>
                {bed.patientName && (
                  <p className="text-xs mt-1 truncate opacity-80">{bed.patientName}</p>
                )}
                {bed.features && bed.features.length > 0 && (
                  <p className="text-xs mt-1 opacity-60 truncate">{bed.features.slice(0, 2).join(", ")}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bed Detail */}
        {selectedBed && (
          <div className="w-64 shrink-0">
            <Card className="border-border/50 shadow-sm sticky top-6">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold">Bed {selectedBed.number}</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedBed(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusChip status={selectedBed.status} />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ward</span>
                    <span>{selectedBed.wardName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span className="text-xs">{selectedBed.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{selectedBed.type.replace("_", " ")}</span>
                  </div>
                  {selectedBed.roomNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span>{selectedBed.roomNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor</span>
                    <span>{selectedBed.floorNumber}</span>
                  </div>
                </div>
                {selectedBed.patientName && (
                  <div className="rounded-lg bg-blue-500/10 border border-blue-300/30 p-2.5">
                    <p className="text-xs font-semibold text-blue-700">Current Patient</p>
                    <p className="text-sm font-medium mt-0.5">{selectedBed.patientName}</p>
                    {selectedBed.admittedAt && (
                      <p className="text-xs text-muted-foreground mt-0.5">Admitted {selectedBed.admittedAt}</p>
                    )}
                  </div>
                )}
                {selectedBed.features && selectedBed.features.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedBed.features.map((f) => (
                        <Badge key={f} variant="outline" className="text-xs capitalize">{f.replace("_", " ")}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">Edit</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">Change Status</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
