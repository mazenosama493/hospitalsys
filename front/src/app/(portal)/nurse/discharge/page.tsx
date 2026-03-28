"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ClipboardList, AlertTriangle } from "lucide-react";
import { mockWardPatients, mockDischargeChecklist } from "@/features/nurse/mock/data";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
    medical: "bg-sky-500/10 text-sky-700 border-sky-500/30",
    nursing: "bg-teal-500/10 text-teal-700 border-teal-500/30",
    pharmacy: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    education: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    social: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
    transport: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
};

const categoryEmoji: Record<string, string> = {
    medical: "🏥", nursing: "🩺", pharmacy: "💊", education: "📖", social: "🤝", transport: "🚗",
};

export default function DischargeChecklistPage() {
    const [checklist, setChecklist] = useState(mockDischargeChecklist);

    // For simplicity, show only pat-003 (Sarah Davis) who has the discharge items
    const patient = mockWardPatients.find((p) => p.id === "pat-003")!;
    const items = checklist.filter((c) => c.patientId === "pat-003");
    const completed = items.filter((c) => c.completed).length;
    const total = items.length;
    const pct = Math.round((completed / total) * 100);

    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof items>);

    const toggleItem = (id: string) => {
        setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, completed: !c.completed, completedBy: c.completed ? undefined : "Maria Garcia", completedAt: c.completed ? undefined : new Date().toISOString() } : c));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Discharge Checklist</h1>
                <p className="text-sm text-muted-foreground mt-1">Track discharge readiness for patients pending release</p>
            </div>

            {/* Patient + progress */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                                {patient.firstName[0]}{patient.lastName[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{patient.firstName} {patient.lastName}</p>
                                <p className="text-xs text-muted-foreground">Rm {patient.roomNumber} · {patient.diagnosis}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{pct}%</p>
                            <p className="text-[10px] text-muted-foreground">{completed}/{total} complete</p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    {pct < 100 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700">
                            <AlertTriangle className="h-3 w-3" />
                            {total - completed} item{total - completed > 1 ? "s" : ""} remaining before discharge
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Checklist by category */}
            <div className="space-y-4">
                {Object.entries(grouped).map(([category, categoryItems]) => {
                    const allDone = categoryItems.every((c) => c.completed);
                    return (
                        <Card key={category} className={cn("border-border/50 shadow-sm", allDone && "opacity-70")}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 capitalize">
                                    <span>{categoryEmoji[category] || "📋"}</span>
                                    {category}
                                    {allDone && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                    <Badge variant="outline" className="text-[10px] ml-auto">{categoryItems.filter(c => c.completed).length}/{categoryItems.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5">
                                    {categoryItems.map((item) => (
                                        <button key={item.id} onClick={() => toggleItem(item.id)} className={cn(
                                            "flex items-center gap-3 w-full text-left p-2.5 rounded-lg border transition-colors",
                                            item.completed ? "bg-emerald-500/[0.05] border-emerald-500/20" : "border-border/50 hover:bg-muted/40"
                                        )}>
                                            {item.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>{item.description}</p>
                                                {item.completedBy && (
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.completedBy} · {item.completedAt ? new Date(item.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                                )}
                                                {item.notes && <p className="text-[10px] text-muted-foreground italic mt-0.5">{item.notes}</p>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
