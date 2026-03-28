"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPayments, mockInvoices } from "@/features/billing/mock/data";
import { PaymentPostingForm } from "@/features/billing/components/PaymentPostingForm";
import { DollarSign, CreditCard, Building2, Banknote } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  insurance_eft: Building2,
  eft: Building2,
  wire: Building2,
  credit_card: CreditCard,
  debit_card: CreditCard,
  cash: Banknote,
  check: DollarSign,
};

export default function PaymentsPage() {
  const payments = [...mockPayments].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  const totalPosted = payments.filter((p) => !p.isVoid).reduce((s, p) => s + p.amount, 0);
  const insPayments = payments.filter((p) => ["insurance_eft", "eft", "wire"].includes(p.method));
  const patientPayments = payments.filter((p) => ["cash", "credit_card", "debit_card", "check"].includes(p.method));

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">Payment Posting</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Post and review payments — ERA, patient collections</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Posted</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{fmt(totalPosted)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Insurance Payments</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{fmt(insPayments.reduce((s, p) => s + p.amount, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Patient Payments</p>
            <p className="text-2xl font-bold text-teal-700 mt-1">{fmt(patientPayments.reduce((s, p) => s + p.amount, 0))}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment history */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="pb-2 text-left font-medium">Patient</th>
                    <th className="pb-2 text-left font-medium">Payer</th>
                    <th className="pb-2 text-left font-medium">Method</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                    <th className="pb-2 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const Icon = PAYMENT_ICONS[p.method] ?? DollarSign;
                    return (
                      <tr key={p.id} className={`border-b last:border-0 ${p.isVoid ? "opacity-40 line-through" : ""}`}>
                        <td className="py-2 font-medium">{p.patientName}</td>
                        <td className="py-2 text-muted-foreground text-xs max-w-[8rem] truncate">{p.payer}</td>
                        <td className="py-2">
                          <span className="flex items-center gap-1">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <Badge variant="outline" className="text-xs capitalize">{p.method.replace(/_/g, " ")}</Badge>
                          </span>
                        </td>
                        <td className="py-2 text-right font-semibold text-green-700">{fmt(p.amount)}</td>
                        <td className="py-2 text-right text-muted-foreground text-xs">{p.postedAt.slice(0, 10)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Post new payment */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Post New Payment</CardTitle></CardHeader>
          <CardContent>
            <PaymentPostingForm
              invoices={mockInvoices}
              onPost={(data) => {
                // In a real app this would call the backend/store
                console.log("Posting payment", data);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
