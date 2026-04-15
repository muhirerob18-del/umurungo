import { e as useSearch, j as jsxRuntimeExports, s as Package, b as Button, L as Link, q as ShoppingBag } from "./index-CzdgUJ7r.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { a as useOrderDetail } from "./use-orders-CM4FWeUj.js";
import { f as formatTimestamp, a as formatPrice } from "./backend-BvEPXO-C.js";
import { C as CircleCheck } from "./circle-check-BjAFXj6r.js";
import { L as ListOrdered } from "./list-ordered-8JT8IBb9.js";
import "./index-CEjBcvQ_.js";
import "./useMutation-keq2ozyC.js";
function CheckoutSuccessPage() {
  const search = useSearch({ strict: false });
  const orderId = search.orderId ? BigInt(search.orderId) : void 0;
  const { data: order, isLoading } = useOrderDetail(orderId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 py-16 text-center",
      "data-ocid": "checkout_success.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-semibold mb-2", children: "Order Confirmed!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2", children: "Thank you for your purchase. Your order has been placed successfully." }),
        order && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground mb-6", children: [
          "Order #",
          order.id.toString().padStart(6, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm text-muted-foreground mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-primary" }),
          "Estimated delivery: 3–7 business days"
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 text-left mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40 mb-4" }),
          [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 mb-3 rounded-lg" }, i))
        ] }) : order ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 text-left mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm", children: "Order Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(order.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-4", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-3 items-center",
              "data-ocid": `checkout_success.item.${order.items.indexOf(item) + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl || "/assets/images/placeholder.svg",
                    alt: item.title,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Qty: ",
                    Number(item.quantity)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: formatPrice(item.price * Number(item.quantity)) })
              ]
            },
            item.productId.toString()
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.subtotal) })
            ] }),
            order.discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "−",
                formatPrice(order.discountAmount)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Ships To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: order.shippingAddress.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              order.shippingAddress.street,
              ", ",
              order.shippingAddress.city,
              ",",
              " ",
              order.shippingAddress.country
            ] })
          ] })
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          order && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              "data-ocid": "checkout_success.track_order_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/account/orders/$orderId",
                  params: { orderId: order.id.toString() },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 mr-2" }),
                    "Track Order"
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              "data-ocid": "checkout_success.view_orders_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account/orders", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "h-4 w-4 mr-2" }),
                "View All Orders"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "checkout_success.continue_shopping_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 mr-2" }),
            "Continue Shopping"
          ] }) })
        ] })
      ]
    }
  );
}
export {
  CheckoutSuccessPage as default
};
