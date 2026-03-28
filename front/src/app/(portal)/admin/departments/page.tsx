"use client";

import { useState } from "react";
import { Search, Building2, Users, Activity, BedDouble, Phone, MapPin, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/features/admin/components/StatusChip";
import { mockAdminDepartments, mockWards } from "@/features/admin/mock/data";
import type { AdminDepartment, DepartmentType } from "@/types";

const TYPE_COLORS: Record<DepartmentType, string> = {
  clinical:       "bg-blue-500/10 text-blue-700",
  diagnostic:     "bg-amber-500/10 text-amber-700",
  surgical:       "bg-red-500/10 text-red-700",
  administrative: "bg-slate-500/10 text-slate-700",
  support:        "bg-teal-500/10 text-teal-700",
  emergency:      "bg-rose-500/10 text-rose-700",
  pharmacy:       "bg-violet-500/10 text-violet-700",
};

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DepartmentType | "all">("all");
  const [selectedDept, setSelectedDept] = useState<AdminDepartment | null>(null);

  const filtered = mockAdminDepartments.filter((d) => {
    const matchSearch = search.trim() === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const selectedWards = selectedDept
    ? mockWards.filter((w) => w.departmentId === selectedDept.id)
    : [];

  return (
    <div className="flex gap-6 h-full">
      {/* Main Panel */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockAdminDepartments.length} departments · {mockAdminDepartments.filter((d) => d.status === "active").length} active
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Building2 className="h-4 w-4" /> Add Department
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or code…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as DepartmentType | "all")}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="clinical">Clinical</SelectItem>
              <SelectItem value="diagnostic">Diagnostic</SelectItem>
              <SelectItem value="surgical">Surgical</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dept) => (
            <Card
              key={dept.id}
              className={`border-border/50 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedDept?.id === dept.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedDept(dept.id === selectedDept?.id ? null : dept)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{dept.name}</h3>
                      <p className="text-xs font-mono text-muted-foreground">{dept.code}</p>
                    </div>
                  </div>
                  <StatusChip status={dept.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs capitalize ${TYPE_COLORS[dept.type]}`}>
                    {dept.type}
                  </Badge>
                  {dept.building && (
                    <span className="text-xs text-muted-foreground">{dept.building} · Floor {dept.floorNumber}</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-lg font-bold text-primary">{dept.staffCount}</p>
                    <p className="text-xs text-muted-foreground">Staff</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-lg font-bold text-blue-600">{dept.activePatients}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-2">
                    <p className="text-lg font-bold text-teal-600">{dept.bedCount}</p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                </div>
                {dept.headName && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{dept.headName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center text-sm text-muted-foreground">
              No departments match the current filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedDept && (
        <div className="w-80 shrink-0">
          <Card className="border-border/50 shadow-sm sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">{selectedDept.name}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{selectedDept.code}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedDept(null)}>Close</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusChip status={selectedDept.status} />
                <Badge variant="outline" className={`text-xs capitalize ${TYPE_COLORS[selectedDept.type]}`}>
                  {selectedDept.type}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                {selectedDept.headName && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Head:</span>
                    <span>{selectedDept.headName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span>{selectedDept.building}, Floor {selectedDept.floorNumber}</span>
                </div>
                {selectedDept.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-mono text-xs">{selectedDept.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-lg font-bold text-primary">{selectedDept.staffCount}</p>
                  <p className="text-xs text-muted-foreground">Staff</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-lg font-bold text-blue-600">{selectedDept.activePatients}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <p className="text-lg font-bold text-teal-600">{selectedDept.bedCount}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
              </div>

              {selectedDept.description && (
                <p className="text-xs text-muted-foreground border-t border-border/40 pt-3">{selectedDept.description}</p>
              )}

              {/* Wards */}
              {selectedWards.length > 0 && (
                <div className="border-t border-border/40 pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Wards ({selectedWards.length})</p>
                  <div className="space-y-2">
                    {selectedWards.map((ward) => (
                      <div key={ward.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                        <div>
                          <p className="text-xs font-medium">{ward.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{ward.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold">{ward.occupiedBeds}/{ward.totalBeds}</p>
                          <p className="text-xs text-muted-foreground">beds</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                <Button size="sm" className="flex-1 h-8 text-xs" variant="outline">
                  {selectedDept.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
