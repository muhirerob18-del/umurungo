import { u as useNavigate, a as useActor, l as useCart, r as reactExports, p as useQuery, j as jsxRuntimeExports, q as ShoppingBag, b as Button, L as Link, I as Input, T as Tag, X, d as createActor } from "./index-CzdgUJ7r.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { a as formatPrice } from "./backend-BvEPXO-C.js";
import { T as Trash2 } from "./trash-2-DjWRPbkV.js";
import { M as Minus } from "./minus-C7AVbqFb.js";
import { P as Plus } from "./plus-DGDwjsZ6.js";
import { A as ArrowRight } from "./arrow-right-VfE0LXCR.js";
import "./index-CEjBcvQ_.js";
function CartPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { items, products, setProduct, updateItem, removeItem } = useCart();
  const [couponCode, setCouponCode] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [couponError, setCouponError] = reactExports.useState("");
  const [couponLoading, setCouponLoading] = reactExports.useState(false);
  const { isLoading } = useQuery({
    queryKey: [
      "cart-products",
      items.map((i) => i.productId.toString()).join(",")
    ],
    queryFn: async () => {
      if (!actor) return [];
      const fetched = [];
      for (const item of items) {
        const p = await actor.getProduct(item.productId);
        if (p) {
          setProduct(p);
          fetched.push(p);
        }
      }
      return fetched;
    },
    enabled: !!actor && !actorFetching && items.length > 0,
    staleTime: 2 * 60 * 1e3
  });
  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId.toString()];
    return p ? sum + p.price * Number(item.quantity) : sum;
  }, 0);
  const discount = (appliedCoupon == null ? void 0 : appliedCoupon.discount) ?? 0;
  const total = Math.max(0, subtotal - discount);
  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !actor) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const categoryIds = items.map((i) => {
        var _a;
        return (_a = products[i.productId.toString()]) == null ? void 0 : _a.categoryId;
      }).filter(Boolean);
      const result = await actor.validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
        categoryIds
      );
      if (result.isValid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: result.discountAmount
        });
        ue.success(result.message || "Coupon applied!");
      } else {
        setCouponError(result.message || "Invalid coupon code.");
      }
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };
  if (isLoading && items.length > 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-5xl mx-auto px-4 py-10",
        "data-ocid": "cart.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" })
          ] })
        ]
      }
    );
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-5xl mx-auto px-4 py-16 text-center",
        "data-ocid": "cart.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-9 w-9 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold mb-2", children: "Your cart is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-sm mx-auto", children: "Discover thousands of products across electronics, fashion, and more." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", "data-ocid": "cart.browse_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Start Shopping" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", "data-ocid": "cart.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold", children: "Shopping Cart" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        items.reduce((s, i) => s + Number(i.quantity), 0),
        " items"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-3", children: [
        items.map((item, idx) => {
          const product = products[item.productId.toString()];
          const qty = Number(item.quantity);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-4 bg-card border border-border rounded-xl p-4 transition-smooth hover:shadow-subtle",
              "data-ocid": `cart.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: (product == null ? void 0 : product.images[0]) || "/assets/images/placeholder.svg",
                    alt: (product == null ? void 0 : product.title) ?? "Product",
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5", children: (product == null ? void 0 : product.tags[0]) ?? "" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm leading-snug line-clamp-2", children: (product == null ? void 0 : product.title) ?? "Loading..." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeItem(item.productId),
                        className: "text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0",
                        "aria-label": "Remove item",
                        "data-ocid": `cart.delete_button.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0 border border-border rounded-lg overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateItem(item.productId, BigInt(qty - 1)),
                          className: "w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors",
                          "aria-label": "Decrease quantity",
                          "data-ocid": `cart.qty_minus.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-medium", children: qty }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateItem(item.productId, BigInt(qty + 1)),
                          className: "w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors",
                          "aria-label": "Increase quantity",
                          "data-ocid": `cart.qty_plus.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: product ? formatPrice(product.price * qty) : "—" })
                  ] })
                ] })
              ]
            },
            item.productId.toString()
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/",
            className: "text-sm text-primary hover:underline flex items-center gap-1 pt-2",
            "data-ocid": "cart.continue_shopping_link",
            children: "← Continue Shopping"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 h-fit sticky top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold mb-4", children: "Order Summary" }),
        !appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "cart-coupon",
              className: "text-xs text-muted-foreground uppercase tracking-wide mb-1.5 block",
              children: "Promo Code"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "cart-coupon",
                value: couponCode,
                onChange: (e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                },
                placeholder: "Enter code",
                className: "text-sm h-9",
                "data-ocid": "cart.coupon_input",
                onKeyDown: (e) => e.key === "Enter" && handleValidateCoupon()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: handleValidateCoupon,
                disabled: couponLoading || !couponCode.trim(),
                "data-ocid": "cart.coupon_apply_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          couponError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive mt-1",
              "data-ocid": "cart.coupon_error_state",
              children: couponError
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary", children: appliedCoupon.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setAppliedCoupon(null);
                setCouponCode("");
              },
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Remove coupon",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(subtotal) })
          ] }),
          appliedCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "−",
              formatPrice(discount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Calculated at checkout" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display font-semibold text-base mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full gap-2",
            size: "lg",
            onClick: () => navigate({ to: "/checkout" }),
            "data-ocid": "cart.checkout_button",
            children: [
              "Checkout ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  CartPage as default
};
