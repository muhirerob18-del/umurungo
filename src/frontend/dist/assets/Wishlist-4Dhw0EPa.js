import { c as createLucideIcon, u as useNavigate, a as useActor, m as useWishlist, l as useCart, r as reactExports, j as jsxRuntimeExports, H as Heart, b as Button, L as Link, n as ShoppingCart, d as createActor } from "./index-CzdgUJ7r.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { P as PriceTag } from "./PriceTag-DWCNPjVR.js";
import "./backend-BvEPXO-C.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function WishlistPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const fetchProducts = reactExports.useCallback(async () => {
    if (!actor || actorFetching || items.length === 0) return;
    setLoading(true);
    const results = await Promise.all(
      items.map(
        (id) => actor.getProduct(BigInt(id)).then((p) => p ? { id, product: p } : null)
      )
    );
    const map = {};
    for (const r of results) {
      if (r) map[r.id] = r.product;
    }
    setProducts(map);
    setLoading(false);
  }, [actor, actorFetching, items]);
  reactExports.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleAddAllToCart = () => {
    for (const id of items) addItem(BigInt(id), 1n);
    ue.success("All wishlist items added to cart!");
  };
  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href).then(() => ue.success("Wishlist link copied!"));
  };
  const handleNavigateToProduct = (productId) => {
    navigate({ to: "/product/$productId", params: { productId } });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-5xl mx-auto px-4 py-8",
        "data-ocid": "wishlist.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 mb-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[3/4] rounded-xl" }, k)) })
        ]
      }
    );
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-5xl mx-auto px-4 py-16 text-center",
        "data-ocid": "wishlist.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-9 w-9 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold mb-2", children: "Your wishlist is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-sm mx-auto", children: "Save items you love to revisit them anytime." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", "data-ocid": "wishlist.browse_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Explore Products" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", "data-ocid": "wishlist.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold", children: "My Wishlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          items.length,
          " saved item",
          items.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleShareWishlist,
            className: "gap-2",
            "data-ocid": "wishlist.share_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
              "Share"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleAddAllToCart,
            className: "gap-2",
            "data-ocid": "wishlist.add_all_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
              "Add All to Cart"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: items.map((id, idx) => {
      const product = products[id];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "group relative bg-card border border-border rounded-xl overflow-hidden transition-smooth hover:shadow-elevated hover:-translate-y-0.5",
          "data-ocid": `wishlist.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "aspect-square bg-muted overflow-hidden cursor-pointer w-full block",
                onClick: () => product && handleNavigateToProduct(product.id.toString()),
                onKeyDown: (e) => {
                  if ((e.key === "Enter" || e.key === " ") && product)
                    handleNavigateToProduct(product.id.toString());
                },
                "aria-label": `View ${(product == null ? void 0 : product.title) ?? "product"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: (product == null ? void 0 : product.images[0]) || "/assets/images/placeholder.svg",
                    alt: (product == null ? void 0 : product.title) ?? "",
                    className: "w-full h-full object-cover transition-smooth group-hover:scale-105"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeItem(BigInt(id)),
                className: "absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card shadow-subtle transition-smooth",
                "aria-label": "Remove from wishlist",
                "data-ocid": `wishlist.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3.5 w-3.5 fill-destructive text-destructive" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-0.5 truncate", children: (product == null ? void 0 : product.tags[0]) ?? "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "font-medium text-sm line-clamp-2 leading-tight mb-2 text-left hover:text-primary transition-colors w-full",
                  onClick: () => product && handleNavigateToProduct(product.id.toString()),
                  children: (product == null ? void 0 : product.title) ?? "—"
                }
              ),
              product && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceTag,
                {
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  size: "sm"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "w-full h-8 text-xs gap-1",
                  onClick: () => {
                    addItem(BigInt(id), 1n);
                    ue.success("Added to cart!");
                  },
                  disabled: !product || product.stock <= 0n,
                  "data-ocid": `wishlist.add_to_cart_button.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3" }),
                    !product || product.stock <= 0n ? "Out of Stock" : "Add to Cart"
                  ]
                }
              )
            ] })
          ]
        },
        id
      );
    }) })
  ] });
}
export {
  WishlistPage as default
};
