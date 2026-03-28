"use client";

import { useState } from "react";
import { Download, ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAuditLogs } from "@/features/admin/mock/data";
import type { AuditSeverity, AuditAction } from "@/types";

const SEVERITY_COLORS: Record<AuditSeverity, string> = {
  info:     "bg-sky-500/10 text-sky-700 border-sky-300/40",
  warning:  "bg-amber-500/10 text-amber-700 border-amber-300/40",
  critical: "bg-red-500/10 text-red-700 border-red-300/40",
};

const SEVERITY_ICONS: Record<AuditSeverity, React.ReactNode> = {
  info:     <Info className="h-3 w-3" />,
  warning:  <AlertTriangle className="h-3 w-3" />,
  critical: <ShieldAlert className="h-3 w-3" />,
};

const OUTCOME_COLORS = {
  success: "text-emerald-600",
  failure: "text-red-600",
};

export default function AuditPage() {
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | "all">("all");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [userSearch, setUserSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-03-16");
  const [dateTo, setDateTo] = useState("2026-03-16");

  const uniqueActions = [...new Set(mockAuditLogs.map((l) => l.action))];

  const filtered = mockAuditLogs.filter((log) => {
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchUser = userSearch === "" || log.userName.toLowerCase().includes(userSearch.toLowerCase());
    const logDate = log.timestamp.slice(0, 10);
    const matchDate = (!dateFrom || logDate >= dateFrom) && (!dateTo || logDate <= dateTo);
    return matchSeverity && matchAction && matchUser && matchDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} events · Security and activity log
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3">
        {(["info", "warning", "critical"] as AuditSeverity[]).map((s) => {
          const count = mockAuditLogs.filter((l) => l.severity === s).length;
          return (
            <button
              key={s}
              onClick={() => setSeverityFilter(severityFilter === s ? "all" : s)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${SEVERITY_COLORS[s]} ${severityFilter === s ? "ring-2 ring-offset-1 ring-current" : ""}`}
            >
              {SEVERITY_ICONS[s]}
              <span className="capitalize">{s}</span>
              <span className="font-bold ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="w-44 h-9 text-sm"
          placeholder="Search user..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as AuditAction | "all")}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map((a) => (
              <SelectItem key={a} value={a} className="capitalize">{a.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">From</span>
          <Input type="date" className="w-36 h-9 text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <span className="text-xs text-muted-foreground">To</span>
          <Input type="date" className="w-36 h-9 text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Timestamp</TableHead>
              <TableHead className="text-xs font-semibold">User / Role</TableHead>
              <TableHead className="text-xs font-semibold">Action</TableHead>
              <TableHead className="text-xs font-semibold">Resource</TableHead>
              <TableHead className="text-xs font-semibold">Details</TableHead>
              <TableHead className="text-xs font-semibold">IP Address</TableHead>
              <TableHead className="text-xs font-semibold">Severity</TableHead>
              <TableHead className="text-xs font-semibold">Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No audit events match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow
                  key={log.id}
                  className={log.severity === "critical" ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/30"}
                >
                  <TableCell className="text-xs font-mono whitespace-nowrap">
                    {log.timestamp.replace("T", " ").slice(0, 19)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{log.userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{log.userRole.replace("_", " ")}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {log.action.replace("_", " ")}
                    </Badge>
                  </TableCell>
                    <TableCell className="text-xs font-medium">{log.resource}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-48 truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${SEVERITY_COLORS[log.severity]}`}>
                      {SEVERITY_ICONS[log.severity]}
                      <span className="capitalize">{log.severity}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold ${OUTCOME_COLORS[log.outcome]}`}>
                      {log.outcome === "success" ? "✓" : "✗"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
