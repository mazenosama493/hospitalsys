"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Clock, Filter } from "lucide-react";
import { mockWardPatients, mockNursingNotes, mockWoundNotes } from "@/features/nurse/mock/data";
import type { NursingNoteCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: { key: NursingNoteCategory | "wound" | "all"; label: string; emoji: string }[] = [
    { key: "all", label: "All", emoji: "📋" },
    { key: "assessment", label: "Assessment", emoji: "🩺" },
    { key: "care", label: "Care", emoji: "🩹" },
    { key: "education", label: "Education", emoji: "📖" },
    { key: "communication", label: "Communication", emoji: "📞" },
    { key: "wound", label: "Wound/Device", emoji: "🩹" },
];

const templates = [
    "Routine assessment — patient stable, no complaints.",
    "Fall risk precautions in place. Bed alarm on. Non-skid socks provided.",
    "Patient educated on medication purpose and side effects. Verbalized understanding.",
    "Physician notified of change in patient condition. New orders received.",
    "Wound care performed per protocol. Site documented.",
];

export default function NursingNotesPage() {
    const [catFilter, setCatFilter] = useState<string>("all");
    const [patientFilter, setPatientFilter] = useState<string>("all");
    const [showEditor, setShowEditor] = useState(false);
    const [noteText, setNoteText] = useState("");

    const notes = mockNursingNotes
        .filter((n) => catFilter === "all" || n.category === catFilter)
        .filter((n) => patientFilter === "all" || n.patientId === patientFilter)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const woundNotes = mockWoundNotes
        .filter((w) => patientFilter === "all" || w.patientId === patientFilter);

    const showWounds = catFilter === "all" || catFilter === "wound";

    const catColors: Record<string, string> = {
        assessment: "bg-sky-500/10 text-sky-700 border-sky-500/30",
        care: "bg-teal-500/10 text-teal-700 border-teal-500/30",
        education: "bg-violet-500/10 text-violet-700 border-violet-500/30",
        communication: "bg-amber-500/10 text-amber-700 border-amber-500/30",
        safety: "bg-red-500/10 text-red-700 border-red-500/30",
        procedure: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nursing Notes</h1>
                    <p className="text-sm text-muted-foreground mt-1">Clinical documentation, assessments, and wound/device notes</p>
                </div>
                <Button className="gap-2" onClick={() => setShowEditor(!showEditor)}>
                    <Plus className="h-4 w-4" /> New Note
                </Button>
            </div>

            {/* Quick note editor */}
            {showEditor && (
                <Card className="border-border/50 shadow-sm border-primary/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" /> New Nursing Note
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-muted-foreground font-semibold mr-1 self-center">Templates:</span>
                            {templates.map((t, i) => (
                                <button key={i} onClick={() => setNoteText(t)} className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 bg-muted/50 text-muted-foreground hover:bg-muted hover:border-border transition-colors truncate max-w-[220px]">
                                    {t.slice(0, 50)}…
                                </button>
                            ))}
                        </div>
                        <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type your nursing note here…" rows={4} className="text-sm resize-none" />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setShowEditor(false); setNoteText(""); }}>Cancel</Button>
                            <Button size="sm" onClick={() => setShowEditor(false)}>Save Note</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {categories.map((c) => (
                        <button key={c.key} onClick={() => setCatFilter(c.key)} className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", catFilter === c.key ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            <span>{c.emoji}</span> {c.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => setPatientFilter("all")} className={cn("px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", patientFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                        All Patients
                    </button>
                    {mockWardPatients.map((p) => (
                        <button key={p.id} onClick={() => setPatientFilter(p.id)} className={cn("px-2 py-1 rounded-full text-xs font-medium border transition-colors", patientFilter === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted")}>
                            {p.roomNumber} · {p.firstName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes timeline */}
            <div className="space-y-2">
                {catFilter !== "wound" && notes.map((note) => (
                    <div key={note.id} className={cn("p-3 rounded-lg border", catColors[note.category] || "border-border/50")}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] capitalize">{note.category}</Badge>
                                <span className="text-sm font-medium">{note.patientName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <Clock className="h-2.5 w-2.5" />
                                {new Date(note.timestamp).toLocaleString()}
                                <span>· {note.authorName}</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                ))}
                {showWounds && woundNotes.map((wn) => (
                    <div key={wn.id} className="p-3 rounded-lg border bg-orange-500/[0.05] border-orange-500/30">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] capitalize text-orange-700">🩹 {wn.type}</Badge>
                                <span className="text-sm font-medium">{wn.patientName}</span>
                                <span className="text-xs text-muted-foreground">{wn.location}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{new Date(wn.timestamp).toLocaleString()} · {wn.recordedBy}</span>
                        </div>
                        <p className="text-sm">{wn.description}</p>
                        <p className="text-xs text-muted-foreground mt-1 italic">Care: {wn.care}</p>
                    </div>
                ))}
                {catFilter !== "wound" && notes.length === 0 && (
                    <Card className="border-border/50"><CardContent className="py-12 text-center"><p className="text-sm text-muted-foreground">No notes matching filter.</p></CardContent></Card>
                )}
            </div>
        </div>
    );
}
