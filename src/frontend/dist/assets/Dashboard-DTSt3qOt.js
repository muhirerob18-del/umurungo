import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, v as LoadingSpinner, q as ShoppingBag, U as Users, s as Package, L as Link, B as Badge, a as useActor, p as useQuery, A as AnalyticsPeriod, O as OrderStatus, d as createActor } from "./index-CzdgUJ7r.js";
import { a as formatPrice, f as formatTimestamp } from "./backend-BvEPXO-C.js";
import { T as TrendingUp } from "./trending-up-DtEUCgQD.js";
import { A as ArrowRight } from "./arrow-right-VfE0LXCR.js";
import { T as TriangleAlert } from "./triangle-alert-DwS5het5.js";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area } from "./AreaChart-1JxzF8I8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
const ORDER_STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-primary/10 text-primary",
  [OrderStatus.Processing]: "bg-accent text-accent-foreground",
  [OrderStatus.Shipped]: "bg-secondary text-secondary-foreground",
  [OrderStatus.Delivered]: "bg-primary/15 text-primary",
  [OrderStatus.Cancelled]: "bg-destructive/10 text-destructive",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground"
};
function useAdminDashboard() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const stats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => actor.adminGetDashboardStats(),
    enabled
  });
  const topProducts = useQuery({
    queryKey: ["admin", "top-products"],
    queryFn: () => actor.adminGetTopProducts(5n),
    enabled
  });
  const recentOrders = useQuery({
    queryKey: ["admin", "recent-orders"],
    queryFn: () => actor.adminListOrders(
      {
        status: void 0,
        paymentMethod: void 0,
        toDate: void 0,
        fromDate: void 0,
        customerId: void 0
      },
      0n,
      5n
    ),
    enabled
  });
  return { stats, topProducts, recentOrders };
}
function useRevenueChart(period) {
  const { actor, isFetching } = useActor(createActor);
  const config = {
    "7d": { analPeriod: AnalyticsPeriod.Day, count: 7n },
    "30d": { analPeriod: AnalyticsPeriod.Day, count: 30n },
    "12m": { analPeriod: AnalyticsPeriod.Month, count: 12n }
  };
  return useQuery({
    queryKey: ["admin", "revenue", period],
    queryFn: () => actor.adminGetRevenueByPeriod(
      config[period].analPeriod,
      config[period].count
    ),
    enabled: !!actor && !isFetching
  });
}
function KpiCard({ label, value, sub, icon, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-5 flex gap-4 items-start shadow-card bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3 text-emerald-500" }),
        sub
      ] })
    ] })
  ] });
}
function AdminDashboardPage() {
  const { stats, topProducts, recentOrders } = useAdminDashboard();
  const [period, setPeriod] = reactExports.useState("30d");
  const revenue = useRevenueChart(period);
  const s = stats.data;
  const chartData = (revenue.data ?? []).map((r) => ({
    period: r.period,
    revenue: r.revenue,
    orders: Number(r.orderCount)
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin.dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Welcome back — here's what's happening today." })
    ] }) }),
    stats.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        "data-ocid": "admin.dashboard.kpi_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Total Revenue",
              value: formatPrice((s == null ? void 0 : s.totalRevenue) ?? 0),
              sub: "vs last month",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
              accent: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Total Orders",
              value: ((s == null ? void 0 : s.totalOrders) ?? 0n).toString(),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Total Users",
              value: ((s == null ? void 0 : s.totalUsers) ?? 0n).toString(),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Total Products",
              value: ((s == null ? void 0 : s.totalProducts) ?? 0n).toString(),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3",
          "data-ocid": "admin.dashboard.pending_orders_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: "Pending Orders" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground", children: ((s == null ? void 0 : s.pendingOrders) ?? 0n).toString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/admin/orders",
                className: "ml-auto text-xs text-primary hover:underline flex items-center gap-0.5",
                children: [
                  "View ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-center gap-3",
          "data-ocid": "admin.dashboard.low_stock_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-medium", children: "Low Stock Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground", children: ((s == null ? void 0 : s.lowStockCount) ?? 0n).toString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/admin/inventory",
                className: "ml-auto text-xs text-destructive hover:underline flex items-center gap-0.5",
                children: [
                  "View ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-5 shadow-card",
        "data-ocid": "admin.dashboard.revenue_chart",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Revenue Overview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", "data-ocid": "admin.dashboard.period_tabs", children: ["7d", "30d", "12m"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setPeriod(p),
                "data-ocid": `admin.dashboard.period.${p}_tab`,
                className: `px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
                children: p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "12 Months"
              },
              p
            )) })
          ] }),
          revenue.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            AreaChart,
            {
              data: chartData,
              margin: { top: 4, right: 4, left: 0, bottom: 0 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "revenueGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "5%",
                      stopColor: "oklch(0.58 0.11 172)",
                      stopOpacity: 0.3
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "95%",
                      stopColor: "oklch(0.58 0.11 172)",
                      stopOpacity: 0
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CartesianGrid,
                  {
                    strokeDasharray: "3 3",
                    stroke: "oklch(0.92 0.01 73)",
                    vertical: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "period",
                    tick: { fontSize: 11, fill: "oklch(0.45 0.01 240)" },
                    tickLine: false,
                    axisLine: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    tick: { fontSize: 11, fill: "oklch(0.45 0.01 240)" },
                    tickLine: false,
                    axisLine: false,
                    tickFormatter: (v) => `$${(v / 1e3).toFixed(0)}k`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v) => [formatPrice(v), "Revenue"],
                    contentStyle: {
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid oklch(0.92 0.01 73)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Area,
                  {
                    type: "monotone",
                    dataKey: "revenue",
                    stroke: "oklch(0.58 0.11 172)",
                    strokeWidth: 2,
                    fill: "url(#revenueGrad)"
                  }
                )
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-5 shadow-card",
          "data-ocid": "admin.dashboard.top_products_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Top Products" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/admin/products",
                  className: "text-xs text-primary hover:underline flex items-center gap-0.5",
                  children: [
                    "View all ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                  ]
                }
              )
            ] }),
            topProducts.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              (topProducts.data ?? []).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 py-2 border-b border-border last:border-0",
                  "data-ocid": `admin.dashboard.top_product.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground w-5 text-center", children: i + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: p.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        p.soldCount.toString(),
                        " sold"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: formatPrice(p.revenue) })
                  ]
                },
                p.productId.toString()
              )),
              (topProducts.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No data yet" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-5 shadow-card",
          "data-ocid": "admin.dashboard.recent_orders_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Recent Orders" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/admin/orders",
                  className: "text-xs text-primary hover:underline flex items-center gap-0.5",
                  children: [
                    "View all ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                  ]
                }
              )
            ] }),
            recentOrders.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              (recentOrders.data ?? []).map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 py-2 border-b border-border last:border-0",
                  "data-ocid": `admin.dashboard.recent_order.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                        "#",
                        order.id.toString()
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(order.createdAt) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: formatPrice(order.total) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-[10px] px-2 py-0 ${ORDER_STATUS_COLORS[order.status]}`,
                        children: order.status
                      }
                    )
                  ]
                },
                order.id.toString()
              )),
              (recentOrders.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No orders yet" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-5 shadow-card",
        "data-ocid": "admin.dashboard.quick_actions_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground mb-3", children: "Quick Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
            { label: "Add Product", to: "/admin/products" },
            { label: "View Orders", to: "/admin/orders" },
            { label: "Manage Inventory", to: "/admin/inventory" },
            { label: "Create Coupon", to: "/admin/coupons" },
            { label: "Manage Users", to: "/admin/users" },
            { label: "View Analytics", to: "/admin/analytics" }
          ].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: a.to,
              className: "px-3 py-1.5 bg-muted hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-lg transition-colors",
              "data-ocid": `admin.dashboard.quick_action.${a.label.toLowerCase().replace(/\s+/g, "_")}_link`,
              children: a.label
            },
            a.to
          )) })
        ]
      }
    )
  ] });
}
export {
  AdminDashboardPage as default
};
