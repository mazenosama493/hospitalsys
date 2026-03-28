"use client";

import { useState } from "react";
import {
  AlertTriangle, Activity, ClipboardList, CheckCircle2,
  ScanLine, FilePen, FileCheck, Zap, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/molecules/StatCard";
import { CriticalFindingBanner } from "@/features/radiology/components/CriticalFindingBanner";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import {
  mockRadStats,
  mockImagingOrders,
  mockRadiologyReports,
  mockCriticalFindings,
} from "@/features/radiology/mock/data";
import type { CriticalFinding } from "@/types";
import Link from "next/link";

export default function RadiologyPage() {
  const [criticals, setCriticals] = useState<CriticalFinding[]>(mockCriticalFindings);

  const statOrders = mockImagingOrders
    .filter((o) => o.priority === "stat" || o.priority === "urgent")
    .sort((a, b) => (a.priority === "stat" ? -1 : 1) - (b.priority === "stat" ? -1 : 1))
    .slice(0, 5);

  const recentSigned = mockRadiologyReports
    .filter((r) => r.status === "final")
    .sort((a, b) => (b.signedAt ?? "").localeCompare(a.signedAt ?? ""))
    .slice(0, 4);

  function handleNotify(id: string) {
    setCriticals((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "notified" as const, notifiedAt: new Date().toISOString() } : c,
      ),
    );
  }
  function handleAcknowledge(id: string) {
    setCriticals((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "acknowledged" as const, acknowledgedAt: new Date().toISOString() } : c,
      ),
    );
  }

  const pending = criticals.filter((c) => c.status === "pending" || c.status === "notified");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Radiology Dashboard</h1>
          <p className="text-sm text-muted-foreground">RIS-PACS Overview</p>
        </div>
        <Badge variant="outline" className="gap-1 text-sm">
          <Activity className="h-3.5 w-3.5 text-emerald-500" />
          Dr. Layla Hassan
        </Badge>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((cf) => (
            <CriticalFindingBanner
              key={cf.id}
              finding={cf}
              onNotify={handleNotify}
              onAcknowledge={handleAcknowledge}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard title="Pending Orders"  value={mockRadStats.pendingOrders}  icon={ClipboardList} iconClassName="bg-blue-500/10 text-blue-600" />
        <StatCard title="In-Progress"     value={mockRadStats.inProgress}     icon={Activity}      iconClassName="bg-indigo-500/10 text-indigo-600" />
        <StatCard title="Awaiting Read"   value={mockRadStats.awaitingRead}   icon={ScanLine}      iconClassName="bg-violet-500/10 text-violet-600" />
        <StatCard title="Pending Sign"    value={mockRadStats.pendingSign}    icon={FilePen}       iconClassName="bg-amber-500/10 text-amber-600" />
        <StatCard title="Signed Today"    value={mockRadStats.signedToday}    icon={FileCheck}     iconClassName="bg-emerald-500/10 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-red-500" />
                STAT &amp; Urgent Queue
              </CardTitle>
              <Link href="/radiology/worklist">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                  Full Worklist <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {statOrders.length === 0 ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">No STAT or urgent orders.</p>
            ) : (
              <div className="divide-y">
                {statOrders.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 px-4 py-2.5">
                    <ModalityBadge modality={o.modality} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{o.patientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.examName}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={o.priority === "stat" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}
                    >
                      {o.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">{o.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Recently Signed Reports
              </CardTitle>
              <Link href="/radiology/reports">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                  All Reports <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentSigned.length === 0 ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">No reports signed today.</p>
            ) : (
              <div className="divide-y">
                {recentSigned.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-2.5">
                    <ModalityBadge modality={r.modality} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.patientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.examName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {r.signedAt ? new Date(r.signedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          { label: "Orders Board",      href: "/radiology/orders",   icon: ClipboardList, desc: "View & protocol orders" },
          { label: "Modality Worklist", href: "/radiology/worklist", icon: ScanLine,      desc: "Ready to read" },
          { label: "Reports",           href: "/radiology/reports",  icon: FilePen,       desc: "Draft & sign reports" },
          { label: "Critical Findings", href: "/radiology/critical", icon: AlertTriangle, desc: `${mockRadStats.pendingCritical} pending` },
        ] as const).map(({ label, href, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="cursor-pointer hover:bg-muted/40 transition-colors h-full">
              <CardContent className="flex flex-col gap-1 p-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
