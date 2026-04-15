import { j as jsxRuntimeExports, f as cn } from "./index-CzdgUJ7r.js";
import { a as formatPrice } from "./backend-BvEPXO-C.js";
const sizeMap = {
  sm: {
    price: "text-sm font-semibold",
    original: "text-xs",
    badge: "text-[10px] px-1 py-0.5"
  },
  md: {
    price: "text-base font-semibold",
    original: "text-sm",
    badge: "text-xs px-1.5 py-0.5"
  },
  lg: {
    price: "text-xl font-bold",
    original: "text-sm",
    badge: "text-xs px-2 py-1"
  }
};
function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  className
}) {
  const styles = sizeMap[size];
  const hasSale = compareAtPrice !== void 0 && compareAtPrice > price;
  const discountPct = hasSale ? Math.round((compareAtPrice - price) / compareAtPrice * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-baseline gap-2 flex-wrap", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          styles.price,
          hasSale ? "text-destructive" : "text-foreground"
        ),
        children: formatPrice(price)
      }
    ),
    hasSale && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            styles.original,
            "text-muted-foreground line-through"
          ),
          children: formatPrice(compareAtPrice)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: cn(
            styles.badge,
            "rounded font-medium bg-destructive/10 text-destructive"
          ),
          children: [
            "-",
            discountPct,
            "%"
          ]
        }
      )
    ] })
  ] });
}
export {
  PriceTag as P
};
