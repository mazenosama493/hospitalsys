"use client";

import { useState, useMemo } from "react";
import { Search, ShieldCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockPatientAccounts, mockFinancialEvents } from "@/features/billing/mock/data";
import { FinancialStatusBadge } from "@/features/billing/components/FinancialStatusBadge";
import { FinancialTimeline } from "@/features/billing/components/FinancialTimeline";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function PatientSummaryPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("pat-002");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockPatientAccounts.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.mrn.toLowerCase().includes(q)
    );
  }, [search]);

  const account = mockPatientAccounts.find((a) => a.patientId === selectedId) ?? null;
  const events = account
    ? mockFinancialEvents.filter((e) => e.patientId === account.patientId)
    : [];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left: patient list */}
      <aside className="w-72 shrink-0 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Patient Accounts</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient / MRN…"
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((acct) => (
            <button
              key={acct.patientId}
              onClick={() => setSelectedId(acct.patientId)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                selectedId === acct.patientId ? "bg-blue-50 border border-blue-200" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{acct.patientName}</p>
                {acct.patientBalance > 0 && (
                  <span className="text-xs font-semibold text-orange-600">{fmt(acct.patientBalance)}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{acct.mrn}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground px-3 py-4">No patients found.</p>
          )}
        </div>
      </aside>

      {/* Right: detail */}
      {account ? (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">{account.patientName}</h1>
              <p className="text-sm text-muted-foreground">{account.mrn} · DOB {account.dateOfBirth}</p>
            </div>
            {account.patientBalance > 0 && (
              <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50 text-sm px-3 py-1">
                Balance Due: {fmt(account.patientBalance)}
              </Badge>
            )}
            {account.patientBalance === 0 && (
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-sm px-3 py-1">
                Account Clear
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Account balance breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Charged</span>
                    <span className="font-semibold">{fmt(account.totalBilled)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance Paid</span>
                    <span className="font-semibold text-green-700">- {fmt(account.insurancePaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contractual Adjustments</span>
                    <span className="font-semibold text-blue-700">- {fmt(account.adjustments)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient Paid</span>
                    <span className="font-semibold text-green-700">- {fmt(account.patientPaid)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Patient Balance Due</span>
                    <span className={account.patientBalance > 0 ? "text-orange-600" : "text-green-700"}>
                      {fmt(account.patientBalance)}
                    </span>
                  </div>
                  {account.overdueBalance > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-700 text-xs">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fmt(account.overdueBalance)} overdue
                    </div>
                  )}
                  {account.creditBalance > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-green-700 text-xs">
                      Credit balance: {fmt(account.creditBalance)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insurance info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  Insurance Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {account.insurance ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold">{account.insurance.payerName}</p>
                      <p className="text-muted-foreground">{account.insurance.planName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Member ID</p>
                        <p className="font-medium">{account.insurance.memberId}</p>
                      </div>
                      {account.insurance.groupNumber && (
                        <div>
                          <p className="text-xs text-muted-foreground">Group #</p>
                          <p className="font-medium">{account.insurance.groupNumber}</p>
                        </div>
                      )}
                      {account.insurance.copay !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Copay</p>
                          <p className="font-medium">{fmt(account.insurance.copay)}</p>
                        </div>
                      )}
                      {account.insurance.deductible !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Deductible</p>
                          <p className="font-medium">
                            {fmt(account.insurance.deductibleMet ?? 0)} / {fmt(account.insurance.deductible)} met
                          </p>
                        </div>
                      )}
                      {account.insurance.outOfPocketMax !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Out-of-Pocket Max</p>
                          <p className="font-medium">
                            {fmt(account.insurance.outOfPocketMet ?? 0)} / {fmt(account.insurance.outOfPocketMax)} met
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Prior Auth Required</p>
                        <FinancialStatusBadge
                          status={account.insurance.requiresAuth ? "billed_insurance" : "cleared"}
                          size="sm"
                        />
                      </div>
                    </div>
                    {account.insurance.phone && (
                      <p className="text-xs text-muted-foreground">Phone: {account.insurance.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No insurance on file — Self-pay.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financial Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialTimeline events={events} />
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a patient to view their account.
        </main>
      )}
    </div>
  );
}
