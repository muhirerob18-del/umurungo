import { j as jsxRuntimeExports, X, f as cn, r as reactExports, a as useActor, i as useQueryClient, b as Button, S as Search, I as Input, v as LoadingSpinner, B as Badge, P as PaymentMethod, q as ShoppingBag, p as useQuery, O as OrderStatus, d as createActor } from "./index-CzdgUJ7r.js";
import { C as Checkbox } from "./checkbox-Cvz2ET_k.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CsMHjYVZ.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-BzaPRzk_.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { f as formatTimestamp, a as formatPrice } from "./backend-BvEPXO-C.js";
import { D as Download } from "./download-D-0-8CKb.js";
import "./index-y4qoz3wi.js";
import "./index-C_0r4B1t.js";
import "./index-CEjBcvQ_.js";
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
const PAGE_SIZE = 20;
const STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-amber-100 text-amber-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-emerald-100 text-emerald-700",
  [OrderStatus.Cancelled]: "bg-rose-100 text-rose-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground"
};
const ALL_STATUSES = Object.values(OrderStatus);
function useAdminOrders(filter, page) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "orders", filter, page],
    queryFn: () => actor.adminListOrders(
      filter,
      BigInt(page * PAGE_SIZE),
      BigInt(PAGE_SIZE)
    ),
    enabled: !!actor && !isFetching
  });
}
function exportOrdersCSV(orders) {
  const rows = [
    ["Order #", "Customer", "Date", "Total", "Payment", "Status"],
    ...orders.map((o) => [
      o.id.toString(),
      o.shippingAddress.fullName,
      formatTimestamp(o.createdAt),
      o.total.toFixed(2),
      o.paymentMethod,
      o.status
    ])
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function OrderDetailDrawer({ order, onClose }) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [newStatus, setNewStatus] = reactExports.useState(order.status);
  const [trackingNumber, setTrackingNumber] = reactExports.useState(
    order.trackingNumber ?? ""
  );
  const statusMutation = useMutation({
    mutationFn: () => actor.adminUpdateOrderStatus(order.id, newStatus),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      ue.success("Order status updated");
    },
    onError: () => ue.error("Failed to update status")
  });
  const trackingMutation = useMutation({
    mutationFn: () => actor.adminSetTrackingNumber(order.id, trackingNumber),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      ue.success("Tracking number saved");
    },
    onError: () => ue.error("Failed to save tracking number")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      className: "w-full sm:max-w-lg overflow-y-auto",
      "data-ocid": "admin.orders.order_detail_sheet",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { children: [
          "Order #",
          order.id.toString()
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1 block", children: "Update Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: newStatus,
                  onValueChange: (v) => setNewStatus(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.orders.status_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "mt-2 w-full",
                  onClick: () => statusMutation.mutate(),
                  disabled: statusMutation.isPending || newStatus === order.status,
                  "data-ocid": "admin.orders.update_status_button",
                  children: statusMutation.isPending ? "Updating…" : "Update Status"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "tracking",
                  className: "text-xs uppercase tracking-wide text-muted-foreground mb-1 block",
                  children: "Tracking Number"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "tracking",
                    value: trackingNumber,
                    onChange: (e) => setTrackingNumber(e.target.value),
                    placeholder: "1Z999AA10123456784",
                    "data-ocid": "admin.orders.tracking_number_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: () => trackingMutation.mutate(),
                    disabled: trackingMutation.isPending,
                    "data-ocid": "admin.orders.save_tracking_button",
                    children: "Save"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm text-foreground mb-2", children: [
              "Items (",
              order.items.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: order.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 py-2 border-b border-border last:border-0",
                children: [
                  item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: item.imageUrl,
                      alt: item.title,
                      className: "h-10 w-10 rounded object-cover flex-shrink-0 bg-muted"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded bg-muted flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: item.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Qty: ",
                      item.quantity.toString()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: formatPrice(item.price * Number(item.quantity)) })
                ]
              },
              idx.toString()
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.subtotal) })
              ] }),
              order.discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-emerald-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "-",
                  formatPrice(order.discountAmount)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-foreground pt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.total) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground mb-2", children: "Shipping Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: order.shippingAddress.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.shippingAddress.street }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                order.shippingAddress.city,
                ", ",
                order.shippingAddress.state,
                " ",
                order.shippingAddress.postalCode
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.shippingAddress.country }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.shippingAddress.phone })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-1 border-t border-border pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: order.paymentMethod })
            ] }),
            order.couponCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Coupon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.couponCode })
            ] }),
            order.paymentReference && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ref" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-40", children: order.paymentReference })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTimestamp(order.createdAt) })
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function AdminOrdersPage() {
  const [page, setPage] = reactExports.useState(0);
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [detailOrder, setDetailOrder] = reactExports.useState(null);
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const filter = {
    status: statusFilter || void 0,
    paymentMethod: void 0,
    toDate: void 0,
    fromDate: void 0,
    customerId: void 0
  };
  const orders = useAdminOrders(filter, page);
  const bulkStatusMutation = useMutation({
    mutationFn: async ({
      ids,
      status
    }) => {
      if (!actor) throw new Error("No actor");
      return Promise.all(
        ids.map((id) => actor.adminUpdateOrderStatus(id, status))
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      setSelected(/* @__PURE__ */ new Set());
      ue.success("Orders updated");
    },
    onError: () => ue.error("Failed to update orders")
  });
  const filtered = (orders.data ?? []).filter(
    (o) => !search || o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) || o.id.toString().includes(search)
  );
  const toggleSelect = (id) => setSelected((prev) => {
    const n = new Set(prev);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const allIds = filtered.map((o) => o.id.toString());
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const toggleAll = () => {
    if (allSelected) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(allIds));
  };
  const selectedBigInts = () => [...selected].map((id) => BigInt(id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.orders.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage customer orders and fulfillment." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => exportOrdersCSV(orders.data ?? []),
          "data-ocid": "admin.orders.export_csv_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1.5" }),
            " Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-48", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name or order #…",
            className: "pl-8 h-9",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "admin.orders.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-1 flex-wrap",
          "data-ocid": "admin.orders.status_filter_tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatusFilter("");
                  setPage(0);
                },
                className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!statusFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`,
                "data-ocid": "admin.orders.status_filter.all_tab",
                children: "All"
              }
            ),
            ALL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatusFilter(s);
                  setPage(0);
                },
                className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`,
                "data-ocid": `admin.orders.status_filter.${s.toLowerCase()}_tab`,
                children: s
              },
              s
            ))
          ]
        }
      )
    ] }),
    selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg",
        "data-ocid": "admin.orders.bulk_actions_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-primary", children: [
            selected.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              onValueChange: (v) => bulkStatusMutation.mutate({
                ids: selectedBigInts(),
                status: v
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-7 w-44 text-xs",
                    "data-ocid": "admin.orders.bulk_status_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Update status…" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ml-auto text-xs text-muted-foreground hover:text-foreground",
              onClick: () => setSelected(/* @__PURE__ */ new Set()),
              children: "Clear"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.orders.table",
        children: [
          orders.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: allSelected,
                    onCheckedChange: toggleAll,
                    "data-ocid": "admin.orders.select_all_checkbox"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Order #" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Customer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Payment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Detail" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/20 transition-colors cursor-pointer",
                  onClick: () => setDetailOrder(order),
                  onKeyDown: (e) => e.key === "Enter" && setDetailOrder(order),
                  "data-ocid": `admin.orders.table.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-4 py-3",
                        onClick: (e) => e.stopPropagation(),
                        onKeyDown: (e) => e.stopPropagation(),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox,
                          {
                            checked: selected.has(order.id.toString()),
                            onCheckedChange: () => toggleSelect(order.id.toString()),
                            "data-ocid": `admin.orders.checkbox.${i + 1}`
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium text-foreground", children: [
                      "#",
                      order.id.toString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell", children: order.shippingAddress.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: formatTimestamp(order.createdAt) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatPrice(order.total) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-muted text-muted-foreground text-[10px]", children: order.paymentMethod === PaymentMethod.MtnMomo ? "MTN MOMO" : order.paymentMethod }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-[10px] px-2 py-0 ${STATUS_COLORS[order.status]}`,
                        children: order.status
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "h-7 text-xs",
                        onClick: (e) => {
                          e.stopPropagation();
                          setDetailOrder(order);
                        },
                        "data-ocid": `admin.orders.view_button.${i + 1}`,
                        children: "View"
                      }
                    ) })
                  ]
                },
                order.id.toString()
              )) })
            ] }),
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-16 text-muted-foreground",
                "data-ocid": "admin.orders.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No orders found" })
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
                  "data-ocid": "admin.orders.pagination_prev",
                  children: "Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: (orders.data ?? []).length < PAGE_SIZE,
                  onClick: () => setPage((p) => p + 1),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.orders.pagination_next",
                  children: "Next"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    detailOrder && /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrderDetailDrawer,
      {
        order: detailOrder,
        onClose: () => setDetailOrder(null)
      }
    )
  ] });
}
export {
  AdminOrdersPage as default
};
