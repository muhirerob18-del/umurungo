import { r as reactExports, j as jsxRuntimeExports, W as Warehouse, s as Package, v as LoadingSpinner, b as Button, S as Search, I as Input, a as useActor, p as useQuery, i as useQueryClient, d as createActor } from "./index-CzdgUJ7r.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bs2ys7v8.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { T as TriangleAlert } from "./triangle-alert-DwS5het5.js";
import "./index-BzaPRzk_.js";
import "./index-y4qoz3wi.js";
import "./index-CEjBcvQ_.js";
function useAdminProducts(search) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "inventory-products", search],
    queryFn: () => actor.listProducts(
      {
        inStockOnly: false,
        tags: [],
        searchTerm: search || void 0,
        isActive: void 0,
        categoryId: void 0,
        subcategoryId: void 0,
        minPrice: void 0,
        maxPrice: void 0
      },
      0n,
      50n
    ),
    enabled: !!actor && !isFetching
  });
}
function useLowStockAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "low-stock"],
    queryFn: () => actor.adminGetLowStockAlerts(),
    enabled: !!actor && !isFetching
  });
}
function StockAdjustModal({
  productId,
  productTitle,
  currentStock,
  onClose
}) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [delta, setDelta] = reactExports.useState("0");
  const [mode, setMode] = reactExports.useState("set");
  const mutation = useMutation({
    mutationFn: () => {
      if (!actor) throw new Error("No actor");
      const val = BigInt(Number.parseInt(delta));
      const adjustedDelta = mode === "set" ? val - currentStock : val;
      return actor.adminAdjustStock(productId, adjustedDelta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      ue.success("Stock updated");
      onClose();
    },
    onError: () => ue.error("Failed to update stock")
  });
  const preview = mode === "set" ? Number.parseInt(delta) : Number(currentStock) + Number.parseInt(delta);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.inventory.stock_adjust_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adjust Stock" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Product:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: productTitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Current Stock:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: currentStock.toString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("set"),
            className: `flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${mode === "set" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
            "data-ocid": "admin.inventory.set_mode_toggle",
            children: "Set Quantity"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("delta"),
            className: `flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${mode === "delta" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
            "data-ocid": "admin.inventory.delta_mode_toggle",
            children: "Add / Remove"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stock-val", children: mode === "set" ? "New Quantity" : "Delta (+ add / - remove)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "stock-val",
            type: "number",
            value: delta,
            onChange: (e) => setDelta(e.target.value),
            "data-ocid": "admin.inventory.stock_value_input"
          }
        )
      ] }),
      delta !== "" && !Number.isNaN(Number.parseInt(delta)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "New stock will be:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: Math.max(0, preview) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "admin.inventory.stock_adjust_dialog.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => mutation.mutate(),
          disabled: mutation.isPending,
          "data-ocid": "admin.inventory.stock_adjust_dialog.confirm_button",
          children: mutation.isPending ? "Updating…" : "Update Stock"
        }
      )
    ] })
  ] }) });
}
function AdminInventoryPage() {
  var _a;
  const [search, setSearch] = reactExports.useState("");
  const [adjusting, setAdjusting] = reactExports.useState(null);
  const lowStock = useLowStockAlerts();
  const products = useAdminProducts(search);
  const outOfStock = (products.data ?? []).filter((p) => p.stock === 0n);
  const lowStockCount = ((_a = lowStock.data) == null ? void 0 : _a.length) ?? 0;
  const totalProducts = (products.data ?? []).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.inventory.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Inventory" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Monitor stock levels and reorder alerts." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4 text-center shadow-card",
          "data-ocid": "admin.inventory.total_products_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-6 w-6 mx-auto text-primary mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: totalProducts }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total Products" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-amber-50 border border-amber-200 rounded-xl p-4 text-center",
          "data-ocid": "admin.inventory.low_stock_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 mx-auto text-amber-500 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-amber-700", children: lowStockCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600 mt-0.5", children: "Low Stock Alerts" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-rose-50 border border-rose-200 rounded-xl p-4 text-center",
          "data-ocid": "admin.inventory.out_of_stock_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 mx-auto text-rose-500 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-rose-700", children: outOfStock.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-600 mt-0.5", children: "Out of Stock" })
          ]
        }
      )
    ] }),
    lowStockCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-amber-200 rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.inventory.low_stock_alerts_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-amber-800", children: "Low Stock Alerts" })
          ] }),
          lowStock.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: (lowStock.data ?? []).map((alert, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-4 px-5 py-3",
              "data-ocid": `admin.inventory.low_stock_alert.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: alert.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Reorder point: ",
                    alert.reorderPoint.toString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-amber-700", children: alert.stock.toString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "in stock" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs flex-shrink-0",
                    onClick: () => setAdjusting({
                      id: alert.productId,
                      title: alert.title,
                      stock: alert.stock
                    }),
                    "data-ocid": `admin.inventory.adjust_stock_button.${i + 1}`,
                    children: "Adjust"
                  }
                )
              ]
            },
            alert.productId.toString()
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.inventory.products_table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground flex-1", children: "All Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-56", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search products…",
                  className: "pl-8 h-8 text-xs",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  "data-ocid": "admin.inventory.search_input"
                }
              )
            ] })
          ] }),
          products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "SKU" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Stock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Reorder Pt." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Action" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: (products.data ?? []).map((p, i) => {
                const isLow = p.stock <= p.reorderPoint && p.stock > 0n;
                const isOut = p.stock === 0n;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/20 transition-colors",
                    "data-ocid": `admin.inventory.products_table.row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        p.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: p.images[0],
                            alt: p.title,
                            className: "h-8 w-8 rounded object-cover flex-shrink-0 bg-muted"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded bg-muted flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-48", children: p.title })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground hidden md:table-cell text-xs", children: p.sku }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `font-bold ${isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-foreground"}`,
                          children: p.stock.toString()
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right text-muted-foreground hidden sm:table-cell", children: p.reorderPoint.toString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-center text-xs", children: isOut ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium", children: "Out of Stock" }) : isLow ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium", children: "Low Stock" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium", children: "In Stock" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          className: "h-7 text-xs",
                          onClick: () => setAdjusting({
                            id: p.id,
                            title: p.title,
                            stock: p.stock
                          }),
                          "data-ocid": `admin.inventory.adjust_button.${i + 1}`,
                          children: "Adjust"
                        }
                      ) })
                    ]
                  },
                  p.id.toString()
                );
              }) })
            ] }),
            (products.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-12 text-muted-foreground",
                "data-ocid": "admin.inventory.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No products found" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    adjusting && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StockAdjustModal,
      {
        productId: adjusting.id,
        productTitle: adjusting.title,
        currentStock: adjusting.stock,
        onClose: () => setAdjusting(null)
      }
    )
  ] });
}
export {
  AdminInventoryPage as default
};
