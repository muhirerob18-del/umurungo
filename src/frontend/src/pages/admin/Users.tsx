import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { User } from "../../backend";
import { Role } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatTimestamp } from "../../lib/backend";

const PAGE_SIZE = 20;

function useAdminUsers(page: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<User[]>({
    queryKey: ["admin", "users", page],
    queryFn: () =>
      actor!.adminListUsers(BigInt(page * PAGE_SIZE), BigInt(PAGE_SIZE)),
    enabled: !!actor && !isFetching,
  });
}

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const users = useAdminUsers(page);

  const setRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: User["id"]; role: Role }) =>
      actor!.adminSetUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId: User["id"]) => actor!.adminDeactivateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deactivated");
      setDeactivatingId(null);
    },
    onError: () => toast.error("Failed to deactivate user"),
  });

  const filtered = (users.data ?? []).filter((u) => {
    const matchesSearch =
      !search ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const deactivatingUser = deactivatingId
    ? (users.data ?? []).find((u) => u.id.toString() === deactivatingId)
    : null;

  return (
    <div className="space-y-5" data-ocid="admin.users.page">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Users
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage user accounts and roles.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="admin.users.search_input"
          />
        </div>
        <Select
          value={roleFilter || "all"}
          onValueChange={(v) => setRoleFilter(v === "all" ? "" : (v as Role))}
        >
          <SelectTrigger
            className="w-36 h-9"
            data-ocid="admin.users.role_filter_select"
          >
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value={Role.Admin}>Admin</SelectItem>
            <SelectItem value={Role.Customer}>Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.users.table"
      >
        {users.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user, i) => (
                  <tr
                    key={user.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.users.table.row.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-primary">
                              {user.displayName[0]?.toUpperCase() ?? "?"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate lg:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={
                          user.role === Role.Admin
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {formatTimestamp(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={
                          user.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.role === Role.Customer ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              setRoleMutation.mutate({
                                userId: user.id,
                                role: Role.Admin,
                              })
                            }
                            disabled={setRoleMutation.isPending}
                            data-ocid={`admin.users.promote_button.${i + 1}`}
                          >
                            Promote
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              setRoleMutation.mutate({
                                userId: user.id,
                                role: Role.Customer,
                              })
                            }
                            disabled={setRoleMutation.isPending}
                            data-ocid={`admin.users.demote_button.${i + 1}`}
                          >
                            Demote
                          </Button>
                        )}
                        {user.isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() =>
                              setDeactivatingId(user.id.toString())
                            }
                            data-ocid={`admin.users.deactivate_button.${i + 1}`}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.users.empty_state"
              >
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No users found</p>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Page {page + 1}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-7 text-xs"
              data-ocid="admin.users.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={(users.data ?? []).length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 text-xs"
              data-ocid="admin.users.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deactivatingId !== null}
        onOpenChange={(o) => !o && setDeactivatingId(null)}
      >
        <AlertDialogContent data-ocid="admin.users.deactivate_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate{" "}
              <span className="font-medium">
                {deactivatingUser?.displayName}
              </span>
              ? They will no longer be able to access their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.users.deactivate_dialog.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deactivatingUser &&
                deactivateMutation.mutate(deactivatingUser.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.users.deactivate_dialog.confirm_button"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
