"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleBadge } from "@/features/admin/components/RoleBadge";
import { mockPermissions } from "@/features/admin/mock/data";
import type { AdminUserRole, PermissionAction, PermissionResource } from "@/types";

const ALL_ROLES: AdminUserRole[] = [
  "admin", "doctor", "nurse", "lab_tech", "radiologist",
  "pharmacist", "billing_staff", "front_desk", "patient",
];

const ALL_RESOURCES: PermissionResource[] = [
  "patients", "encounters", "orders", "prescriptions", "lab_results",
  "radiology_reports", "invoices", "claims", "payments",
  "users", "departments", "beds", "catalogs", "audit_logs", "settings",
];

const ALL_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "export"];

const ACTION_COLORS: Record<PermissionAction, string> = {
  view:    "bg-sky-500/15 text-sky-700",
  create:  "bg-emerald-500/15 text-emerald-700",
  edit:    "bg-amber-500/15 text-amber-700",
  delete:  "bg-red-500/15 text-red-700",
  approve: "bg-violet-500/15 text-violet-700",
  export:  "bg-indigo-500/15 text-indigo-700",
};

type PermMatrix = Record<AdminUserRole, Record<PermissionResource, Set<PermissionAction>>>;

function buildMatrix(): PermMatrix {
  const matrix = {} as PermMatrix;
  for (const role of ALL_ROLES) {
    matrix[role] = {} as Record<PermissionResource, Set<PermissionAction>>;
    for (const res of ALL_RESOURCES) {
      matrix[role][res] = new Set();
    }
  }
  for (const perm of mockPermissions) {
    if (matrix[perm.role] && matrix[perm.role][perm.resource]) {
      perm.actions.forEach((a) => matrix[perm.role][perm.resource].add(a));
    }
  }
  return matrix;
}

export default function PermissionsPage() {
  const [matrix, setMatrix] = useState<PermMatrix>(buildMatrix);
  const [selectedRole, setSelectedRole] = useState<AdminUserRole | null>(null);

  function toggle(role: AdminUserRole, resource: PermissionResource, action: PermissionAction) {
    setMatrix((prev) => {
      const next = { ...prev, [role]: { ...prev[role], [resource]: new Set(prev[role][resource]) } };
      if (next[role][resource].has(action)) {
        next[role][resource].delete(action);
      } else {
        next[role][resource].add(action);
      }
      return next;
    });
  }

  const displayRoles = selectedRole ? [selectedRole] : ALL_ROLES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Permission Matrix</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure role-based access control for all resources
        </p>
      </div>

      {/* Action Legend */}
      <div className="flex flex-wrap gap-2">
        {ALL_ACTIONS.map((a) => (
          <Badge key={a} variant="outline" className={`text-xs capitalize ${ACTION_COLORS[a]}`}>
            {a}
          </Badge>
        ))}
      </div>

      {/* Role filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRole(null)}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedRole === null ? "bg-primary text-primary-foreground border-primary" : "border-border/60 hover:bg-muted/50"}`}
        >
          All Roles
        </button>
        {ALL_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role === selectedRole ? null : role)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${selectedRole === role ? "bg-primary text-primary-foreground border-primary" : "border-border/60 hover:bg-muted/50"}`}
          >
            {role.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Matrix Table */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border/50">
                  <th className="sticky left-0 z-10 bg-muted/60 text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                    Resource
                  </th>
                  {displayRoles.map((role) => (
                    <th key={role} className="py-3 px-2 text-center min-w-[130px]">
                      <RoleBadge role={role} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_RESOURCES.map((resource) => (
                  <tr key={resource} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="sticky left-0 bg-background border-r border-border/30 py-3 px-4 font-medium capitalize" style={{ fontVariant: "small-caps" }}>
                      {resource.replace("_", " ")}
                    </td>
                    {displayRoles.map((role) => (
                      <td key={role} className="py-2.5 px-2">
                        <div className="flex flex-wrap justify-center gap-1">
                          {ALL_ACTIONS.map((action) => {
                            const hasIt = matrix[role][resource].has(action);
                            return (
                              <button
                                key={action}
                                title={`${role} — ${resource} — ${action}`}
                                onClick={() => toggle(role, resource, action)}
                                className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                                  hasIt
                                    ? `${ACTION_COLORS[action]} border-transparent`
                                    : "border-border/40 text-muted-foreground/30 hover:border-border"
                                }`}
                              >
                                {hasIt ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3 opacity-30" />}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-center mt-1 text-muted-foreground/50 text-[10px]">
                          {ALL_ACTIONS.map((a) => a[0].toUpperCase()).join("")}
                        </p>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Action columns per role (left to right): View · Create · Edit · Delete · Approve · Export.
        Changes shown here are previews only — connect to API to persist.
      </p>
    </div>
  );
}
