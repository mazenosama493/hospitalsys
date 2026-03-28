"use client";

import { useState, useMemo } from "react";
import { Search, Plus, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { BillingInvoiceStatus } from "@/types";
import { mockInvoices } from "@/features/billing/mock/data";
import { InvoiceCard } from "@/features/billing/components/InvoiceCard";
import { FinancialStatusBadge } from "@/features/billing/components/FinancialStatusBadge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const STATUS_FILTERS: { label: string; value: BillingInvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Billed Ins.", value: "billed_insurance" },
  { label: "Partial", value: "partial" },
  { label: "Overdue", value: "overdue" },
  { label: "Cleared", value: "cleared" },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BillingInvoiceStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(mockInvoices[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockInvoices.filter((inv) => {
      const matchSearch =
        inv.patientName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.primaryDiagnosis.toLowerCase().includes(q);
      const matchStatus = filter === "all" || inv.status === filter;
      return matchSearch && matchStatus;
    });
  }, [search, filter]);

  const invoice = mockInvoices.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left: list */}
      <aside className="w-80 shrink-0 border-r flex flex-col">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Invoices</h2>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />New
            </Button>
          </div>
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
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              selected={inv.id === selectedId}
              onClick={() => setSelectedId(inv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground px-2 py-4">No invoices match.</p>
          )}
        </div>
      </aside>

      {/* Right: detail */}
      {invoice ? (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold">{invoice.id}</h1>
              <p className="text-muted-foreground text-sm">{invoice.patientName} · {invoice.mrn}</p>
            </div>
            <div className="flex items-center gap-2">
              <FinancialStatusBadge status={invoice.status} />
              <Button size="sm" variant="outline">Print</Button>
              <Button size="sm">Send to Payer</Button>
            </div>
          </div>

          {/* Encounter info */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Encounter Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">Encounter Type</p><p className="font-medium capitalize">{invoice.encounterType}</p></div>
                <div><p className="text-xs text-muted-foreground">Admission</p><p className="font-medium">{invoice.admissionDate ?? "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Discharge</p><p className="font-medium">{invoice.dischargeDate ?? "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Attending</p><p className="font-medium">{invoice.attendingPhysician}</p></div>
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{invoice.department}</p></div>
                <div><p className="text-xs text-muted-foreground">Payer</p><p className="font-medium">{invoice.insurancePlan?.payerName ?? "Self-Pay"}</p></div>
                <div className="sm:col-span-3">
                  <p className="text-xs text-muted-foreground">Primary Diagnosis</p>
                  <p className="font-medium">{invoice.primaryDiagnosis} <Badge variant="outline" className="text-xs ml-1">{invoice.primaryDiagnosisCode}</Badge></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charge items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />Charge Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="pb-2 text-left font-medium">CPT</th>
                      <th className="pb-2 text-left font-medium">Description</th>
                      <th className="pb-2 text-left font-medium">Date</th>
                      <th className="pb-2 text-right font-medium">Qty</th>
                      <th className="pb-2 text-right font-medium">Unit Price</th>
                      <th className="pb-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.chargeItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-2 font-mono text-xs">{item.cptCode}</td>
                        <td className="py-2 max-w-[16rem]">
                          <p className="truncate">{item.description}</p>
                          <p className="text-xs text-muted-foreground">{item.diagnosisCodes.join(", ")}</p>
                        </td>
                        <td className="py-2 text-muted-foreground text-xs">{item.serviceDate}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">{fmt(item.unitPrice)}</td>
                        <td className="py-2 text-right font-semibold">{fmt(item.totalCharge)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Financial summary */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Financial Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="max-w-xs space-y-2 text-sm ml-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Charges</span>
                  <span className="font-semibold">{fmt(invoice.totalCharges)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance Billed</span>
                  <span>{fmt(invoice.insuranceBilled)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance Paid</span>
                  <span className="text-green-700">- {fmt(invoice.insurancePaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adjustments</span>
                  <span className="text-blue-700">- {fmt(invoice.adjustments)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Patient Balance</span>
                  <span className={invoice.patientBalance > 0 ? "text-orange-600" : "text-green-700"}>
                    {fmt(invoice.patientBalance)}
                  </span>
                </div>
                {invoice.dueDate && (
                  <p className="text-xs text-muted-foreground text-right">Due: {invoice.dueDate}</p>
                )}
                {invoice.notes && (
                  <p className="text-xs text-muted-foreground border-t pt-2 mt-2">{invoice.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          Select an invoice to view details.
        </main>
      )}
    </div>
  );
}
