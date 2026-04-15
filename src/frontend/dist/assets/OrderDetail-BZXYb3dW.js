import { c as createLucideIcon, g as useParams, l as useCart, j as jsxRuntimeExports, s as Package, b as Button, L as Link, O as OrderStatus, X, P as PaymentMethod } from "./index-CzdgUJ7r.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { a as useOrderDetail, c as useCancelOrder } from "./use-orders-CM4FWeUj.js";
import { f as formatTimestamp, a as formatPrice } from "./backend-BvEPXO-C.js";
import { C as ChevronLeft } from "./chevron-left-BAeFkPTF.js";
import { M as MapPin } from "./map-pin-CGhrhGh0.js";
import "./index-CEjBcvQ_.js";
import "./useMutation-keq2ozyC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
];
const RefreshCcw = createLucideIcon("refresh-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground"
};
const PAYMENT_LABELS = {
  [PaymentMethod.Stripe]: "Credit / Debit Card",
  [PaymentMethod.PayPal]: "PayPal",
  [PaymentMethod.MtnMomo]: "MTN Mobile Money"
};
function OrderDetailPage() {
  const { orderId: orderIdParam } = useParams({ strict: false });
  const orderId = orderIdParam ?? "";
  const { data: order, isLoading } = useOrderDetail(
    orderId ? BigInt(orderId) : void 0
  );
  const cancelOrder = useCancelOrder();
  const { addItem } = useCart();
  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelOrder.mutateAsync(order.id);
      ue.success("Order cancelled successfully.");
    } catch {
      ue.error("Failed to cancel order.");
    }
  };
  const handleReorder = () => {
    if (!order) return;
    for (const item of order.items) addItem(item.productId, item.quantity);
    ue.success("Items added to cart!");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-36 mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-xl" })
    ] });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-16 text-center",
        "data-ocid": "order_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold mb-2", children: "Order not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/orders", children: "Back to Orders" }) })
        ]
      }
    );
  }
  const isPending = order.status === OrderStatus.Pending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", "data-ocid": "order_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/account/orders",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "order_detail.back_link",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-display font-semibold", children: [
        "Order #",
        order.id.toString().padStart(6, "0")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`,
            children: order.status
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: formatTimestamp(order.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod })
      ] }),
      order.trackingNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-primary flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tracking Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-medium", children: order.trackingNumber })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-sm mb-4", children: [
        order.items.length,
        " Item",
        order.items.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: order.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-3 items-center",
          "data-ocid": `order_detail.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: item.imageUrl || "/assets/images/placeholder.svg",
                alt: item.title,
                className: "w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium line-clamp-2 leading-snug", children: item.title }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.subtotal) })
        ] }),
        order.discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Discount ",
            order.couponCode && `(${order.couponCode})`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "−",
            formatPrice(order.discountAmount)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(order.total) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm", children: "Delivery Address" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: order.shippingAddress.fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: order.shippingAddress.street }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          order.shippingAddress.city,
          ", ",
          order.shippingAddress.state,
          " ",
          order.shippingAddress.postalCode
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: order.shippingAddress.country }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: order.shippingAddress.phone })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleReorder,
          className: "gap-2",
          "data-ocid": "order_detail.reorder_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4" }),
            "Reorder"
          ]
        }
      ),
      isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleCancel,
          disabled: cancelOrder.isPending,
          className: "gap-2 text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5",
          "data-ocid": "order_detail.cancel_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
            cancelOrder.isPending ? "Cancelling..." : "Cancel Order"
          ]
        }
      )
    ] })
  ] });
}
export {
  OrderDetailPage as default
};
