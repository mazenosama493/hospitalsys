"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, CheckCircle2, FileText, Loader2 } from "lucide-react";
import type { Encounter } from "@/types";
import { cn } from "@/lib/utils";

interface EncounterNoteEditorProps {
    encounter?: Encounter;
    patientName?: string;
    onSave?: (data: Pick<Encounter, "subjective" | "objective" | "assessment" | "plan">) => void;
    className?: string;
}

const soapSections = [
    { key: "subjective", label: "Subjective", placeholder: "Chief complaint, HPI, ROS, PMH…" },
    { key: "objective", label: "Objective", placeholder: "Vitals, physical exam findings, lab data…" },
    { key: "assessment", label: "Assessment", placeholder: "Diagnoses, clinical impression…" },
    { key: "plan", label: "Plan", placeholder: "Treatment plan, orders, follow-up…" },
] as const;

export function EncounterNoteEditor({ encounter, patientName, onSave, className }: EncounterNoteEditorProps) {
    const [form, setForm] = useState({
        subjective: encounter?.subjective || "",
        objective: encounter?.objective || "",
        assessment: encounter?.assessment || "",
        plan: encounter?.plan || "",
    });
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const update = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setLastSaved(null);
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setLastSaved(new Date().toLocaleTimeString());
            onSave?.(form);
        }, 600);
    };

    const handleSign = () => {
        handleSave();
    };

    return (
        <Card className={cn("border-border/50 shadow-sm", className)}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {encounter ? "Edit Encounter Note" : "New Encounter Note"}
                    </CardTitle>
                    {patientName && <Badge variant="outline" className="text-xs">{patientName}</Badge>}
                    {encounter?.status && <Badge variant="secondary" className="text-[10px] capitalize">{encounter.status}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    {lastSaved && (
                        <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Saved {lastSaved}
                        </span>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save Draft
                    </Button>
                    <Button size="sm" className="h-7 text-xs gap-1" onClick={handleSign}>
                        <CheckCircle2 className="h-3 w-3" /> Sign & Lock
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {soapSections.map((section) => (
                    <div key={section.key} className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
                                {section.label[0]}
                            </span>
                            {section.label}
                        </label>
                        <Textarea
                            value={form[section.key]}
                            onChange={(e) => update(section.key, e.target.value)}
                            placeholder={section.placeholder}
                            rows={section.key === "plan" ? 5 : 3}
                            className="text-sm resize-none"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
