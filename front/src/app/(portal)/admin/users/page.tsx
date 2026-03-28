"use client";

import { useState } from "react";
import {
  Search, UserPlus, Download, MoreHorizontal,
  Pencil, Trash2, ShieldOff, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleBadge } from "@/features/admin/components/RoleBadge";
import { StatusChip } from "@/features/admin/components/StatusChip";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { mockAdminUsers } from "@/features/admin/mock/data";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/types";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      search.trim() === "" ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.employeeId?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const allChecked = filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const someChecked = filtered.some((u) => selected.has(u.id)) && !allChecked;

  function toggleAll() {
    if (allChecked) {
      setSelected((prev) => { const s = new Set(prev); filtered.forEach((u) => s.delete(u.id)); return s; });
    } else {
      setSelected((prev) => { const s = new Set(prev); filtered.forEach((u) => s.add(u.id)); return s; });
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function bulkSetStatus(status: AdminUserStatus) {
    setUsers((prev) => prev.map((u) => selected.has(u.id) ? { ...u, status } : u));
    setSelected(new Set());
  }

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }

  function toggleUserStatus(user: AdminUser) {
    const next: AdminUserStatus = user.status === "active" ? "suspended" : "active";
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u));
    if (selectedUser?.id === user.id) setSelectedUser((u) => u ? { ...u, status: next } : null);
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Panel */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users &amp; Roles</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {users.length} users · {users.filter((u) => u.status === "active").length} active
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, ID…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as AdminUserRole | "all")}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="lab_tech">Lab Tech</SelectItem>
              <SelectItem value="radiologist">Radiologist</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
              <SelectItem value="billing_staff">Billing Staff</SelectItem>
              <SelectItem value="front_desk">Front Desk</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminUserStatus | "all")}>
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-auto border-l pl-3 border-border/50">
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => bulkSetStatus("active")}>
                <ShieldCheck className="h-3.5 w-3.5" /> Activate
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => bulkSetStatus("suspended")}>
                <ShieldOff className="h-3.5 w-3.5" /> Suspend
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="w-10 py-3 px-3">
                      <Checkbox
                        checked={allChecked ? true : someChecked ? true : false}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Department</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                    <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="w-10 py-3 px-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No users match the current filters.</td>
                    </tr>
                  ) : filtered.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer ${selectedUser?.id === user.id ? "bg-muted/40" : ""}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="py-3 px-3" onClick={(e) => { e.stopPropagation(); toggleOne(user.id); }}>
                        <Checkbox checked={selected.has(user.id)} onCheckedChange={() => toggleOne(user.id)} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {user.avatarInitials}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3"><RoleBadge role={user.role} /></td>
                      <td className="py-3 px-3 text-muted-foreground text-xs hidden md:table-cell">{user.departmentName ?? "—"}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {user.lastLogin ? user.lastLogin.replace("T", " ").substring(0, 16) : "—"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusChip status={user.status} />
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                              {user.status === "active"
                                ? <><ShieldOff className="h-4 w-4 mr-2" /> Suspend</>
                                : <><ShieldCheck className="h-4 w-4 mr-2" /> Activate</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      {selectedUser && (
        <div className="w-80 shrink-0">
          <Card className="border-border/50 shadow-sm sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-semibold">User Details</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedUser(null)}>Close</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary">
                  {selectedUser.avatarInitials}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <RoleBadge role={selectedUser.role} />
                <StatusChip status={selectedUser.status} />
              </div>
              <div className="space-y-2 text-sm">
                {selectedUser.employeeId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee ID</span>
                    <span className="font-mono text-xs">{selectedUser.employeeId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span>{selectedUser.departmentName ?? "—"}</span>
                </div>
                {selectedUser.specialization && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Specialization</span>
                    <span>{selectedUser.specialization}</span>
                  </div>
                )}
                {selectedUser.licenseNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License</span>
                    <span className="font-mono text-xs">{selectedUser.licenseNumber}</span>
                  </div>
                )}
                {selectedUser.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{selectedUser.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="text-xs">{selectedUser.lastLogin?.substring(0, 10) ?? "—"}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 h-8 gap-1 text-xs" variant="outline">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-8 gap-1 text-xs"
                  variant="outline"
                  onClick={() => toggleUserStatus(selectedUser)}
                >
                  {selectedUser.status === "active"
                    ? <><ShieldOff className="h-3.5 w-3.5" /> Suspend</>
                    : <><ShieldCheck className="h-3.5 w-3.5" /> Activate</>}
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="w-full h-8 text-xs"
                onClick={() => setDeleteTarget(selectedUser)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete User
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        title={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        description="This action cannot be undone. The user's account and associated data will be permanently removed."
        confirmLabel="Delete User"
        onConfirm={() => { if (deleteTarget) deleteUser(deleteTarget.id); setDeleteTarget(null); }}
      />
    </div>
  );
}
