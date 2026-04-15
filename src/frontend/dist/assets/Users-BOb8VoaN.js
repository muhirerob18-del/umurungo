import { i as useQueryClient, a as useActor, r as reactExports, j as jsxRuntimeExports, S as Search, I as Input, R as Role, v as LoadingSpinner, B as Badge, b as Button, U as Users, p as useQuery, d as createActor } from "./index-CzdgUJ7r.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BwpoPJR4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CsMHjYVZ.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { f as formatTimestamp } from "./backend-BvEPXO-C.js";
import "./index-y4qoz3wi.js";
import "./index-BzaPRzk_.js";
import "./index-C_0r4B1t.js";
const PAGE_SIZE = 20;
function useAdminUsers(page) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => actor.adminListUsers(BigInt(page * PAGE_SIZE), BigInt(PAGE_SIZE)),
    enabled: !!actor && !isFetching
  });
}
function AdminUsersPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [page, setPage] = reactExports.useState(0);
  const [search, setSearch] = reactExports.useState("");
  const [roleFilter, setRoleFilter] = reactExports.useState("");
  const [deactivatingId, setDeactivatingId] = reactExports.useState(null);
  const users = useAdminUsers(page);
  const setRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => actor.adminSetUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      ue.success("Role updated");
    },
    onError: () => ue.error("Failed to update role")
  });
  const deactivateMutation = useMutation({
    mutationFn: (userId) => actor.adminDeactivateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      ue.success("User deactivated");
      setDeactivatingId(null);
    },
    onError: () => ue.error("Failed to deactivate user")
  });
  const filtered = (users.data ?? []).filter((u) => {
    const matchesSearch = !search || u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const deactivatingUser = deactivatingId ? (users.data ?? []).find((u) => u.id.toString() === deactivatingId) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.users.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage user accounts and roles." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-48", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name or email…",
            className: "pl-8 h-9",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "admin.users.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: roleFilter || "all",
          onValueChange: (v) => setRoleFilter(v === "all" ? "" : v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36 h-9",
                "data-ocid": "admin.users.role_filter_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Roles" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Roles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Role.Admin, children: "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Role.Customer, children: "Customer" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.users.table",
        children: [
          users.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Joined" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((user, i) => {
                var _a;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/20 transition-colors",
                    "data-ocid": `admin.users.table.row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0", children: user.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: user.avatarUrl,
                            alt: "",
                            className: "h-8 w-8 rounded-full object-cover"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: ((_a = user.displayName[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: user.displayName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate lg:hidden", children: user.email })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs", children: user.email }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: user.role === Role.Admin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                          children: user.role
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs hidden md:table-cell", children: formatTimestamp(user.createdAt) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
                          children: user.isActive ? "Active" : "Inactive"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                        user.role === Role.Customer ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-xs",
                            onClick: () => setRoleMutation.mutate({
                              userId: user.id,
                              role: Role.Admin
                            }),
                            disabled: setRoleMutation.isPending,
                            "data-ocid": `admin.users.promote_button.${i + 1}`,
                            children: "Promote"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-xs",
                            onClick: () => setRoleMutation.mutate({
                              userId: user.id,
                              role: Role.Customer
                            }),
                            disabled: setRoleMutation.isPending,
                            "data-ocid": `admin.users.demote_button.${i + 1}`,
                            children: "Demote"
                          }
                        ),
                        user.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5",
                            onClick: () => setDeactivatingId(user.id.toString()),
                            "data-ocid": `admin.users.deactivate_button.${i + 1}`,
                            children: "Deactivate"
                          }
                        )
                      ] }) })
                    ]
                  },
                  user.id.toString()
                );
              }) })
            ] }),
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-16 text-muted-foreground",
                "data-ocid": "admin.users.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No users found" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Page ",
              page + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: page === 0,
                  onClick: () => setPage((p) => Math.max(0, p - 1)),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.users.pagination_prev",
                  children: "Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: (users.data ?? []).length < PAGE_SIZE,
                  onClick: () => setPage((p) => p + 1),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.users.pagination_next",
                  children: "Next"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deactivatingId !== null,
        onOpenChange: (o) => !o && setDeactivatingId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.users.deactivate_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Deactivate User?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Are you sure you want to deactivate",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deactivatingUser == null ? void 0 : deactivatingUser.displayName }),
              "? They will no longer be able to access their account."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.users.deactivate_dialog.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => deactivatingUser && deactivateMutation.mutate(deactivatingUser.id),
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                "data-ocid": "admin.users.deactivate_dialog.confirm_button",
                children: "Deactivate"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminUsersPage as default
};
