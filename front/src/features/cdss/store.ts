import { create } from "zustand";
import {
  mockCDSSRecommendations,
  mockCDSSOverrides,
} from "./mock/data";
import type {
  CDSSRecommendation,
  CDSSOverrideRecord,
  CDSSAlertSeverity,
  CDSSRecommendationType,
  CDSSAlertStatus,
  CDSSOverrideAction,
  CDSSOverrideReasonCategory,
  CDSSSourceModule,
} from "@/types";

interface CDSSState {
  // Data
  recommendations: CDSSRecommendation[];
  overrides: CDSSOverrideRecord[];

  // Filters (Alert Center)
  severityFilter: CDSSAlertSeverity | "all";
  typeFilter: CDSSRecommendationType | "all";
  statusFilter: CDSSAlertStatus | "all";
  moduleFilter: CDSSSourceModule | "all";
  patientSearch: string;

  // Detail / selection
  selectedRecommendationId: string | null;
  showExplanationPanel: boolean;
  showEvidenceViewer: boolean;

  // Override modal
  showOverrideModal: boolean;
  overrideTargetId: string | null;

  // Filters (History)
  historyActionFilter: CDSSOverrideAction | "all";
  historyDateFrom: string;
  historyDateTo: string;
  historyClinicianSearch: string;

  // Actions
  setSeverityFilter: (v: CDSSAlertSeverity | "all") => void;
  setTypeFilter: (v: CDSSRecommendationType | "all") => void;
  setStatusFilter: (v: CDSSAlertStatus | "all") => void;
  setModuleFilter: (v: CDSSSourceModule | "all") => void;
  setPatientSearch: (v: string) => void;

  selectRecommendation: (id: string | null) => void;
  setShowExplanationPanel: (show: boolean) => void;
  setShowEvidenceViewer: (show: boolean) => void;

  openOverrideModal: (id: string) => void;
  closeOverrideModal: () => void;

  submitOverride: (payload: {
    action: CDSSOverrideAction;
    reasonCategory: CDSSOverrideReasonCategory;
    reason: string;
    notes?: string;
    clinicianName: string;
    clinicianRole: string;
    sourceModule?: CDSSSourceModule;
    recommendationId?: string;
  }) => void;

  submitFeedback: (id: string, rating: 1 | 2 | 3 | 4 | 5, comment: string) => void;

  setHistoryActionFilter: (v: CDSSOverrideAction | "all") => void;
  setHistoryDateFrom: (v: string) => void;
  setHistoryDateTo: (v: string) => void;
  setHistoryClinicianSearch: (v: string) => void;
}

export const useCDSSStore = create<CDSSState>((set, get) => ({
  recommendations: mockCDSSRecommendations,
  overrides: mockCDSSOverrides,

  severityFilter: "all",
  typeFilter: "all",
  statusFilter: "all",
  moduleFilter: "all",
  patientSearch: "",

  selectedRecommendationId: null,
  showExplanationPanel: true,
  showEvidenceViewer: false,

  showOverrideModal: false,
  overrideTargetId: null,

  historyActionFilter: "all",
  historyDateFrom: "2026-03-14",
  historyDateTo: "2026-03-16",
  historyClinicianSearch: "",

  setSeverityFilter: (v) => set({ severityFilter: v }),
  setTypeFilter: (v) => set({ typeFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setModuleFilter: (v) => set({ moduleFilter: v }),
  setPatientSearch: (v) => set({ patientSearch: v }),

  selectRecommendation: (id) =>
    set({ selectedRecommendationId: id, showExplanationPanel: true, showEvidenceViewer: false }),

  setShowExplanationPanel: (show) => set({ showExplanationPanel: show }),
  setShowEvidenceViewer: (show) => set({ showEvidenceViewer: show }),

  openOverrideModal: (id) => set({ showOverrideModal: true, overrideTargetId: id }),
  closeOverrideModal: () => set({ showOverrideModal: false, overrideTargetId: null }),

  submitOverride: (payload) => {
    const state = get();
    const targetId = payload.recommendationId ?? state.overrideTargetId;
    const { recommendations, overrides } = state;
    if (!targetId) return;

    const rec = recommendations.find((r) => r.id === targetId);
    if (!rec) return;

    const overrideTargetId = targetId;

    const now = new Date().toISOString();
    const newStatus: CDSSAlertStatus =
      payload.action === "override"
        ? "overridden"
        : payload.action === "acknowledge"
        ? "acknowledged"
        : payload.action === "dismiss"
        ? "dismissed"
        : "followed";

    const updatedRecs = recommendations.map((r) =>
      r.id === overrideTargetId
        ? {
            ...r,
            status: newStatus,
            overrideReason: payload.action === "override" ? payload.reason : r.overrideReason,
            overrideReasonCategory:
              payload.action === "override" ? payload.reasonCategory : r.overrideReasonCategory,
            overriddenBy: payload.action === "override" ? payload.clinicianName : r.overriddenBy,
            overriddenAt: payload.action === "override" ? now : r.overriddenAt,
            acknowledgedBy:
              payload.action === "acknowledge" ? payload.clinicianName : r.acknowledgedBy,
            acknowledgedAt: payload.action === "acknowledge" ? now : r.acknowledgedAt,
          }
        : r
    );

    const newOverride: CDSSOverrideRecord = {
      id: `ov-${Date.now()}`,
      recommendationId: overrideTargetId,
      recommendationTitle: rec.title,
      patientId: rec.patientId,
      patientName: rec.patientName,
      clinicianId: "doc-current",
      clinicianName: payload.clinicianName,
      clinicianRole: payload.clinicianRole,
      action: payload.action,
      reasonCategory: payload.reasonCategory,
      reason: payload.reason,
      timestamp: now,
      notes: payload.notes,
      sourceModule: payload.sourceModule ?? rec.sourceModule,
    };

    set({
      recommendations: updatedRecs,
      overrides: [newOverride, ...overrides],
      showOverrideModal: false,
      overrideTargetId: null,
    });
  },

  submitFeedback: (id, rating, comment) => {
    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id ? { ...r, feedbackRating: rating, feedbackComment: comment } : r
      ),
    }));
  },

  setHistoryActionFilter: (v) => set({ historyActionFilter: v }),
  setHistoryDateFrom: (v) => set({ historyDateFrom: v }),
  setHistoryDateTo: (v) => set({ historyDateTo: v }),
  setHistoryClinicianSearch: (v) => set({ historyClinicianSearch: v }),
}));
