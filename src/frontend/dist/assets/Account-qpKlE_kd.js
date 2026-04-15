import { c as createLucideIcon, k as useAuth, j as jsxRuntimeExports, b as Button, H as Heart, L as Link, C as ChevronRight, s as Package, O as OrderStatus } from "./index-CzdgUJ7r.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { b as useMyOrders } from "./use-orders-CM4FWeUj.js";
import { f as formatTimestamp, a as formatPrice } from "./backend-BvEPXO-C.js";
import { L as LogIn } from "./log-in-B0rYGWR-.js";
import { L as ListOrdered } from "./list-ordered-8JT8IBb9.js";
import "./useMutation-keq2ozyC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
];
const UserRound = createLucideIcon("user-round", __iconNode);
const STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground"
};
const QUICK_LINKS = [
  {
    icon: ListOrdered,
    label: "My Orders",
    sub: "Track & manage orders",
    to: "/account/orders",
    ocid: "account.orders_link"
  },
  {
    icon: Heart,
    label: "Wishlist",
    sub: "Saved items",
    to: "/account/wishlist",
    ocid: "account.wishlist_link"
  },
  {
    icon: UserRound,
    label: "Profile",
    sub: "Account settings",
    to: "/account/profile",
    ocid: "account.profile_link"
  }
];
function AccountPage() {
  var _a, _b;
  const { isAuthenticated, profile, profileLoading, login } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders(0, 3);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-md mx-auto px-4 py-20 text-center",
        "data-ocid": "account.login_prompt",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-9 w-9 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold mb-2", children: "Sign In to Your Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Access your orders, wishlist, and account settings." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              className: "gap-2",
              onClick: login,
              "data-ocid": "account.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                "Sign In with Internet Identity"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8", "data-ocid": "account.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-6 mb-6", children: profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-14 h-14 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-36 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-52" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-display font-semibold text-primary", children: ((_b = (_a = profile == null ? void 0 : profile.displayName) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) ?? "U" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-display font-semibold", children: [
          "Welcome back, ",
          (profile == null ? void 0 : profile.displayName) ?? "Shopper",
          "!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: (profile == null ? void 0 : profile.email) ?? "" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8", children: QUICK_LINKS.map(({ icon: Icon, label, sub, to, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 hover:shadow-subtle transition-smooth group",
        "data-ocid": ocid,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground ml-auto flex-shrink-0" })
        ]
      },
      to
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold", children: "Recent Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/account/orders",
            className: "text-sm text-primary hover:underline",
            "data-ocid": "account.view_all_orders_link",
            children: "View all"
          }
        )
      ] }),
      ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) }) : !orders || orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "py-12 text-center",
          "data-ocid": "account.orders_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-muted-foreground mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "mt-3", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Start Shopping" }) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: orders.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/account/orders/$orderId",
          params: { orderId: order.id.toString() },
          className: "flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors",
          "data-ocid": `account.order.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                "Order #",
                order.id.toString().padStart(6, "0")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                formatTimestamp(order.createdAt),
                " · ",
                order.items.length,
                " ",
                "item",
                order.items.length !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`,
                  children: order.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: formatPrice(order.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
            ] })
          ]
        },
        order.id.toString()
      )) })
    ] })
  ] });
}
export {
  AccountPage as default
};
