"use client";

import { useState, useMemo } from "react";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ClaimStatus } from "@/types";
import { mockClaims, mockDenials, mockInvoices } from "@/features/billing/mock/data";
import { ClaimCard } from "@/features/billing/components/ClaimCard";
import { FinancialStatusBadge } from "@/features/billing/components/FinancialStatusBadge";

const fmt = (n?: number) =>
  n === undefined ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const STATUS_FILTERS: { label: string; value: ClaimStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Acknowledged", value: "acknowledged" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partially_paid" },
  { label: "Paid", value: "paid" },
  { label: "Denied", value: "denied" },
];

export default function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClaimStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(mockClaims[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockClaims.filter((c) => {
      const matchSearch =
        c.patientName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.payerName.toLowerCase().includes(q);
      const matchStatus = filter === "all" || c.status === filter;
      return matchSearch && matchStatus;
    });
  }, [search, filter]);

  const claim = mockClaims.find((c) => c.id === selectedId) ?? null;
  const claimDenials = claim ? mockDenials.filter((d) => d.claimId === claim.id) : [];
  const relatedInvoice = claim ? mockInvoices.find((i) => i.id === claim.invoiceId) : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left: list */}
      <aside className="w-80 shrink-0 border-r flex flex-col">
        <div className="p-4 border-b space-y-3">
          <h2 className="font-semibold">Claim Worklist</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-xs rounded-full px-2.5 py-0.5 border transition-colors ${
                  filter === f.value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((c) => (
            <ClaimCard
              key={c.id}
              claim={c}
              selected={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground px-2 py-4">No claims found.</p>
          )}
        </div>
      </aside>

      {/* Right: detail */}
      {claim ? (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold">{claim.id}</h1>
              <p className="text-muted-foreground text-sm">{claim.patientName} · {claim.mrn}</p>
            </div>
            <FinancialStatusBadge status={claim.status} />
          </div>

          {/* Claim info */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Claim Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">Payer</p><p className="font-medium">{claim.payerName}</p></div>
                <div><p className="text-xs text-muted-foreground">Member ID</p><p className="font-medium">{claim.memberId}</p></div>
                {claim.groupNumber && (
                  <div><p className="text-xs text-muted-foreground">Group #</p><p className="font-medium">{claim.groupNumber}</p></div>
                )}
                <div><p className="text-xs text-muted-foreground">Claim Type</p><p className="font-medium capitalize">{claim.claimType}</p></div>
                <div><p className="text-xs text-muted-foreground">Invoice</p><p className="font-medium">{claim.invoiceId}</p></div>
                {claim.submittedAt && (
                  <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium">{claim.submittedAt.slice(0, 10)}</p></div>
                )}
                {claim.acknowledgedAt && (
                  <div><p className="text-xs text-muted-foreground">Acknowledged</p><p className="font-medium">{claim.acknowledgedAt.slice(0, 10)}</p></div>
                )}
                {claim.processedAt && (
                  <div><p className="text-xs text-muted-foreground">Processed</p><p className="font-medium">{claim.processedAt.slice(0, 10)}</p></div>
                )}
                {claim.eobReceivedAt && (
                  <div><p className="text-xs text-muted-foreground">EOB Received</p><p className="font-medium">{claim.eobReceivedAt.slice(0, 10)}</p></div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* EOB breakdown */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">EOB / Payment Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="max-w-xs space-y-2 text-sm ml-auto">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Billed</span><span className="font-semibold">{fmt(claim.totalBilled)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Allowed Amount</span><span>{fmt(claim.allowedAmount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Adjustment</span><span className="text-blue-700">- {fmt(claim.adjustmentAmount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Insurance Paid</span><span className="text-green-700">{fmt(claim.paidAmount)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Patient Responsibility</span>
                  <span className={(claim.patientResponsibility ?? 0) > 0 ? "text-orange-600" : "text-green-700"}>
                    {fmt(claim.patientResponsibility)}
                  </span>
                </div>
              </div>
              {claim.notes && (
                <p className="text-xs text-muted-foreground border-t pt-3 mt-3">{claim.notes}</p>
              )}
            </CardContent>
          </Card>

          {/* Denials on this claim */}
          {claimDenials.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Denials ({claimDenials.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {claimDenials.map((d) => (
                  <div key={d.id} className="rounded-md border border-red-200 bg-red-50/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="outline" className="text-xs border-red-300 text-red-700 mb-1">{d.reasonCode}</Badge>
                        <p className="text-sm font-medium">{d.reasonDescription}</p>
                        <p className="text-xs text-muted-foreground">Denied: {fmt(d.deniedAmount)} · Service: {d.serviceDate}</p>
                      </div>
                      <FinancialStatusBadge status={d.status} size="sm" />
                    </div>
                    {d.resolutionNotes && (
                      <p className="text-xs text-muted-foreground mt-2 border-t pt-2">{d.resolutionNotes}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related invoice summary */}
          {relatedInvoice && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Related Invoice: {relatedInvoice.id}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>{relatedInvoice.primaryDiagnosis}</span>
                  <FinancialStatusBadge status={relatedInvoice.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {relatedInvoice.chargeItems.length} charge items · Total {fmt(relatedInvoice.totalCharges)}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a claim to view details.
        </main>
      )}
    </div>
  );
}
