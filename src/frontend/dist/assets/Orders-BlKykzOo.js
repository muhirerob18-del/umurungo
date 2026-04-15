import { k as useAuth, r as reactExports, j as jsxRuntimeExports, b as Button, L as Link, s as Package, C as ChevronRight, O as OrderStatus } from "./index-CzdgUJ7r.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { b as useMyOrders } from "./use-orders-CM4FWeUj.js";
import { f as formatTimestamp, a as formatPrice } from "./backend-BvEPXO-C.js";
import { L as ListOrdered } from "./list-ordered-8JT8IBb9.js";
import { L as LogIn } from "./log-in-B0rYGWR-.js";
import { C as ChevronLeft } from "./chevron-left-BAeFkPTF.js";
import "./useMutation-keq2ozyC.js";
const PAGE_SIZE = 10;
const STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground"
};
function OrdersPage() {
  const { isAuthenticated, login } = useAuth();
  const [page, setPage] = reactExports.useState(0);
  const { data: orders, isLoading } = useMyOrders(page, PAGE_SIZE);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-md mx-auto px-4 py-20 text-center",
        "data-ocid": "orders.login_prompt",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "h-7 w-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold mb-2", children: "Sign in to view orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "Access your complete order history." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              className: "gap-2",
              "data-ocid": "orders.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                "Sign In"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8", "data-ocid": "orders.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/account",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "orders.back_link",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold", children: "My Orders" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "h-20 rounded-lg"
      },
      `order-skeleton-row-${i + 1}`
    )) }) : !orders || orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", "data-ocid": "orders.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-medium mb-1", children: "No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "When you place orders, they'll appear here." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", "data-ocid": "orders.browse_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Start Shopping" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: orders.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/account/orders/$orderId",
        params: { orderId: order.id.toString() },
        className: "flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group",
        "data-ocid": `orders.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2", children: [
            order.items.slice(0, 3).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-lg bg-muted border-2 border-card overflow-hidden flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl || "/assets/images/placeholder.svg",
                    alt: item.title,
                    className: "w-full h-full object-cover"
                  }
                )
              },
              `${item.productId.toString()}-${i}`
            )),
            order.items.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-10 h-10 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0", children: [
              "+",
              order.items.length - 3
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`,
                children: order.status
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tabular-nums", children: formatPrice(order.total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" })
          ] })
        ]
      },
      order.id.toString()
    )) }) }),
    orders && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setPage((p) => Math.max(0, p - 1)),
          disabled: page === 0,
          "data-ocid": "orders.pagination_prev",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        "Page ",
        page + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setPage((p) => p + 1),
          disabled: orders.length < PAGE_SIZE,
          "data-ocid": "orders.pagination_next",
          children: [
            "Next",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          ]
        }
      )
    ] })
  ] });
}
export {
  OrdersPage as default
};
