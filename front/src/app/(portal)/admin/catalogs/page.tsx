"use client";

import { useState } from "react";
import { Search, FlaskConical, ScanLine, Stethoscope } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusChip } from "@/features/admin/components/StatusChip";
import { mockLabCatalog, mockRadiologyCatalog, mockServiceCatalog } from "@/features/admin/mock/data";
import type { LabCatalogItem, RadiologyCatalogItem, ServiceCatalogItem, CatalogItemStatus } from "@/types";

export default function CatalogsPage() {
  const [labSearch, setLabSearch] = useState("");
  const [labStatus, setLabStatus] = useState<CatalogItemStatus | "all">("all");

  const [radSearch, setRadSearch] = useState("");
  const [radStatus, setRadStatus] = useState<CatalogItemStatus | "all">("all");

  const [svcSearch, setSvcSearch] = useState("");
  const [svcStatus, setSvcStatus] = useState<CatalogItemStatus | "all">("all");

  const [labItems, setLabItems] = useState<LabCatalogItem[]>(mockLabCatalog);
  const [radItems, setRadItems] = useState<RadiologyCatalogItem[]>(mockRadiologyCatalog);
  const [svcItems, setSvcItems] = useState<ServiceCatalogItem[]>(mockServiceCatalog);

  const filteredLab = labItems.filter((i) => {
    const q = labSearch.toLowerCase();
    const matchQ = i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q);
    const matchS = labStatus === "all" || i.status === labStatus;
    return matchQ && matchS;
  });

  const filteredRad = radItems.filter((i) => {
    const q = radSearch.toLowerCase();
    const matchQ = i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q);
    const matchS = radStatus === "all" || i.status === radStatus;
    return matchQ && matchS;
  });

  const filteredSvc = svcItems.filter((i) => {
    const q = svcSearch.toLowerCase();
    const matchQ = i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q);
    const matchS = svcStatus === "all" || i.status === svcStatus;
    return matchQ && matchS;
  });

  const toggleLabStatus = (id: string) => {
    setLabItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "inactive" : "active" as CatalogItemStatus }
          : i
      )
    );
  };

  const toggleRadStatus = (id: string) => {
    setRadItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "inactive" : "active" as CatalogItemStatus }
          : i
      )
    );
  };

  const toggleSvcStatus = (id: string) => {
    setSvcItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "inactive" : "active" as CatalogItemStatus }
          : i
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Catalogs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage lab tests, radiology studies, and clinical services
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <FlaskConical className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <Tabs defaultValue="lab" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lab" className="gap-1.5">
            <FlaskConical className="h-4 w-4" /> Lab Tests
            <Badge variant="secondary" className="ml-1 text-xs">{labItems.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="radiology" className="gap-1.5">
            <ScanLine className="h-4 w-4" /> Radiology
            <Badge variant="secondary" className="ml-1 text-xs">{radItems.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5">
            <Stethoscope className="h-4 w-4" /> Services
            <Badge variant="secondary" className="ml-1 text-xs">{svcItems.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Lab Tests */}
        <TabsContent value="lab" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search lab tests..." value={labSearch} onChange={(e) => setLabSearch(e.target.value)} />
            </div>
            <Select value={labStatus} onValueChange={(v) => setLabStatus(v as CatalogItemStatus | "all")}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-semibold">Code</TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">Category</TableHead>
                  <TableHead className="text-xs font-semibold">Specimen</TableHead>
                  <TableHead className="text-xs font-semibold">TAT (hrs)</TableHead>
                  <TableHead className="text-xs font-semibold">Price</TableHead>
                  <TableHead className="text-xs font-semibold">Auth</TableHead>
                  <TableHead className="text-xs font-semibold">CPT Code</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLab.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.code}</TableCell>
                    <TableCell className="text-sm font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs">{item.category}</TableCell>
                    <TableCell className="text-xs">{item.specimen}</TableCell>
                    <TableCell className="text-xs">{item.turnaroundHours}h</TableCell>
                    <TableCell className="text-xs">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.requiresAuth ? (
                        <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-700">Required</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.cptCode ?? "—"}</TableCell>
                    <TableCell><StatusChip status={item.status} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={item.status === "active"}
                        onCheckedChange={() => toggleLabStatus(item.id)}
                        disabled={item.status === "discontinued"}
                        className="scale-75"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Radiology */}
        <TabsContent value="radiology" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search studies..." value={radSearch} onChange={(e) => setRadSearch(e.target.value)} />
            </div>
            <Select value={radStatus} onValueChange={(v) => setRadStatus(v as CatalogItemStatus | "all")}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-semibold">Code</TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">Modality</TableHead>
                  <TableHead className="text-xs font-semibold">Body Part</TableHead>
                  <TableHead className="text-xs font-semibold">Contrast</TableHead>
                  <TableHead className="text-xs font-semibold">Duration</TableHead>
                  <TableHead className="text-xs font-semibold">Price</TableHead>
                  <TableHead className="text-xs font-semibold">Auth</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRad.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.code}</TableCell>
                    <TableCell className="text-sm font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs uppercase">{item.modality}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{item.bodyPart}</TableCell>
                    <TableCell>
                      {item.withContrast ? (
                        <Badge variant="outline" className="text-xs border-blue-400/50 text-blue-700">Yes</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{item.durationMinutes}min</TableCell>
                    <TableCell className="text-xs">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.requiresAuth ? (
                        <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-700">Required</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell><StatusChip status={item.status} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={item.status === "active"}
                        onCheckedChange={() => toggleRadStatus(item.id)}
                        disabled={item.status === "discontinued"}
                        className="scale-75"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search services..." value={svcSearch} onChange={(e) => setSvcSearch(e.target.value)} />
            </div>
            <Select value={svcStatus} onValueChange={(v) => setSvcStatus(v as CatalogItemStatus | "all")}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-semibold">Code</TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">Category</TableHead>
                  <TableHead className="text-xs font-semibold">Department</TableHead>
                  <TableHead className="text-xs font-semibold">Price</TableHead>
                  <TableHead className="text-xs font-semibold">Unit</TableHead>
                  <TableHead className="text-xs font-semibold">CPT</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSvc.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.code}</TableCell>
                    <TableCell className="text-sm font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs">{item.category}</TableCell>
                    <TableCell className="text-xs">{item.department}</TableCell>
                    <TableCell className="text-xs">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-xs">{item.unit}</TableCell>
                    <TableCell className="text-xs font-mono">{item.cptCode ?? "—"}</TableCell>
                    <TableCell><StatusChip status={item.status} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={item.status === "active"}
                        onCheckedChange={() => toggleSvcStatus(item.id)}
                        disabled={item.status === "discontinued"}
                        className="scale-75"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
