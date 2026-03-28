"use client";

import { useState } from "react";
import { CalendarDays, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModalityBadge } from "@/features/radiology/components/ModalityBadge";
import { mockModalitySlots } from "@/features/radiology/mock/data";
import type { ImagingModality, ModalitySlot } from "@/types";
import { cn } from "@/lib/utils";

const ROOMS = [...new Set(mockModalitySlots.map((s) => s.room))];

const SLOT_STATUS_STYLES: Record<ModalitySlot["status"], string> = {
  available:   "bg-slate-50  border-slate-200 text-slate-400",
  scheduled:   "bg-blue-50   border-blue-300  text-blue-800",
  "in-progress":"bg-indigo-100 border-indigo-400 text-indigo-700 ring-1 ring-indigo-400",
  completed:   "bg-emerald-50 border-emerald-300 text-emerald-700",
  blocked:     "bg-rose-50   border-rose-300  text-rose-600",
  cancelled:   "bg-slate-100 border-slate-200 text-slate-400 line-through",
};

const SLOT_STATUS_BADGE: Record<ModalitySlot["status"], string> = {
  available:    "bg-slate-100 text-slate-500",
  scheduled:    "bg-blue-100 text-blue-700",
  "in-progress":"bg-indigo-100 text-indigo-700",
  completed:    "bg-emerald-100 text-emerald-700",
  blocked:      "bg-rose-100 text-rose-600",
  cancelled:    "bg-slate-100 text-slate-400",
};

const MODALITY_ROOM_LABELS: Partial<Record<ImagingModality, string>> = {
  CT: "CT Suite", MRI: "MRI Suite", US: "Ultrasound Bay", XR: "X-Ray Room",
};

export default function SchedulePage() {
  const [date, setDate] = useState("2026-03-16");

  const daySlots = mockModalitySlots.filter((s) => s.date === date);

  const roomGroups: Record<string, ModalitySlot[]> = {};
  for (const slot of daySlots) {
    if (!roomGroups[slot.room]) roomGroups[slot.room] = [];
    roomGroups[slot.room].push(slot);
    roomGroups[slot.room].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const summary = {
    available:    daySlots.filter((s) => s.status === "available").length,
    scheduled:    daySlots.filter((s) => s.status === "scheduled").length,
    inProgress:   daySlots.filter((s) => s.status === "in-progress").length,
    completed:    daySlots.filter((s) => s.status === "completed").length,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-muted-foreground" />
            Modality Schedule
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              setDate(d.toISOString().slice(0, 10));
            }}
          >
            &#8249; Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date().toISOString().slice(0, 10))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() + 1);
              setDate(d.toISOString().slice(0, 10));
            }}
          >
            Next &#8250;
          </Button>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Available", value: summary.available,   style: "bg-slate-100 text-slate-600" },
          { label: "Scheduled", value: summary.scheduled,   style: "bg-blue-100 text-blue-700" },
          { label: "In Progress", value: summary.inProgress, style: "bg-indigo-100 text-indigo-700" },
          { label: "Completed", value: summary.completed,   style: "bg-emerald-100 text-emerald-700" },
        ].map(({ label, value, style }) => (
          <Badge key={label} variant="secondary" className={cn("text-sm gap-1", style)}>
            {value} {label}
          </Badge>
        ))}
      </div>

      {/* Room cards */}
      {ROOMS.length === 0 ? (
        <p className="text-sm text-muted-foreground">No slots for this date.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROOMS.map((room) => {
            const slots = roomGroups[room] ?? [];
            const modalityOfRoom = slots[0]?.modality;

            return (
              <Card key={room}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {modalityOfRoom && <ModalityBadge modality={modalityOfRoom} />}
                    {room}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {slots.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No slots.</p>
                  ) : (
                    slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "rounded border p-2.5 text-xs transition-colors",
                          SLOT_STATUS_STYLES[slot.status],
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="h-3 w-3" />
                            {slot.startTime}–{slot.endTime}
                            <span className="font-normal text-muted-foreground">
                              ({slot.durationMinutes}min)
                            </span>
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn("capitalize text-[11px]", SLOT_STATUS_BADGE[slot.status])}
                          >
                            {slot.status}
                          </Badge>
                        </div>

                        {slot.patientName ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold">{slot.patientName}</p>
                            <p className="text-muted-foreground">{slot.examName}</p>
                            {slot.technologist && (
                              <p className="flex items-center gap-1 text-muted-foreground">
                                <User className="h-2.5 w-2.5" />
                                {slot.technologist}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">
                            {slot.status === "blocked" ? slot.examName ?? "Blocked" : "Available"}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
