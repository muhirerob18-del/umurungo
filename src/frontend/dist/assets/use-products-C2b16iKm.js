import { c as createLucideIcon, j as jsxRuntimeExports, o as Star, f as cn, r as reactExports, l as useCart, m as useWishlist, B as Badge, H as Heart, b as Button, n as ShoppingCart, a as useActor, p as useQuery, d as createActor } from "./index-CzdgUJ7r.js";
import { P as PriceTag } from "./PriceTag-DWCNPjVR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};
function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
  reviewCount,
  className
}) {
  const starClass = sizeMap[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-0.5", className), children: [
    Array.from({ length: max }, (_, i) => i).map((i) => {
      const filled = i < Math.floor(rating);
      const partial = !filled && i < rating;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Star,
          {
            className: cn(
              starClass,
              "text-muted-foreground/30 fill-muted-foreground/20"
            )
          }
        ),
        (filled || partial) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute inset-0 overflow-hidden",
            style: { width: filled ? "100%" : `${rating % 1 * 100}%` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Star,
              {
                className: cn(starClass, "text-yellow-500 fill-yellow-400")
              }
            )
          }
        )
      ] }, `star-${i}`);
    }),
    showValue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-medium text-foreground", children: rating.toFixed(1) }),
    reviewCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs text-muted-foreground", children: [
      "(",
      reviewCount,
      ")"
    ] })
  ] });
}
function ProductCard({
  product,
  onView,
  index = 1,
  className
}) {
  const [imageError, setImageError] = reactExports.useState(false);
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    hasItem
  } = useWishlist();
  const isWishlisted = hasItem(product.id);
  const isOutOfStock = product.stock <= 0n;
  const imageUrl = !imageError && product.images.length > 0 ? product.images[0] : "/assets/images/placeholder.svg";
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product.id, 1n);
    }
  };
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: cn(
        "group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer",
        "transition-smooth hover:shadow-elevated hover:-translate-y-0.5",
        className
      ),
      onClick: () => onView == null ? void 0 : onView(product),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onView == null ? void 0 : onView(product);
      },
      "data-ocid": `product.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-muted overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: product.title,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              onError: () => setImageError(true),
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex flex-col gap-1", children: [
            isOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] bg-muted-foreground/80 text-card",
                children: "Out of Stock"
              }
            ),
            product.compareAtPrice && product.compareAtPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-destructive text-destructive-foreground", children: "Sale" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: cn(
                "absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100 transition-smooth",
                "hover:bg-card hover:shadow-subtle"
              ),
              onClick: handleWishlist,
              "aria-label": isWishlisted ? "Remove from wishlist" : "Add to wishlist",
              "data-ocid": `product.wishlist.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: cn(
                    "h-3.5 w-3.5 transition-colors",
                    isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "absolute inset-x-0 bottom-0 flex gap-1 p-2",
                "translate-y-full group-hover:translate-y-0 transition-smooth"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "flex-1 h-8 text-xs gap-1",
                    onClick: handleAddToCart,
                    disabled: isOutOfStock,
                    "data-ocid": `product.add_button.${index}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3" }),
                      isOutOfStock ? "Out of Stock" : "Add to Cart"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 w-8 p-0 bg-card/80 backdrop-blur-sm",
                    onClick: (e) => {
                      e.stopPropagation();
                      onView == null ? void 0 : onView(product);
                    },
                    "aria-label": "Quick view",
                    "data-ocid": `product.view_button.${index}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5 truncate", children: product.tags[0] ?? "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-sm text-foreground line-clamp-2 leading-tight mb-1.5", children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceTag,
              {
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                size: "sm"
              }
            ),
            Number(product.soldCount) > 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: 4.5, size: "sm", showValue: true })
          ] })
        ] })
      ]
    }
  );
}
const DEFAULT_FILTER = {
  inStockOnly: false,
  tags: []
};
function useProducts(filter = {}, page = 0, pageSize = 20) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const mergedFilter = { ...DEFAULT_FILTER, ...filter };
  const offset = BigInt(page * pageSize);
  const limit = BigInt(pageSize);
  return useQuery({
    queryKey: ["products", mergedFilter, page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts(mergedFilter, offset, limit);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 2 * 60 * 1e3
  });
}
function useProduct(id) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorFetching && !!id,
    staleTime: 5 * 60 * 1e3
  });
}
function useSearchProducts(term, limit = 20) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchProducts(term, BigInt(limit));
    },
    enabled: !!actor && !actorFetching && term.trim().length > 1,
    staleTime: 1 * 60 * 1e3
  });
}
function useCategories() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 10 * 60 * 1e3
  });
}
function useProductRating(productId) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product-rating", productId == null ? void 0 : productId.toString()],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProductRating(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
    staleTime: 5 * 60 * 1e3
  });
}
function useProductReviews(productId, approvedOnly = true) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product-reviews", productId == null ? void 0 : productId.toString(), approvedOnly],
    queryFn: async () => {
      if (!actor || !productId) return [];
      return actor.getProductReviews(productId, approvedOnly);
    },
    enabled: !!actor && !actorFetching && !!productId,
    staleTime: 3 * 60 * 1e3
  });
}
export {
  ProductCard as P,
  StarRating as S,
  useCategories as a,
  useSearchProducts as b,
  useProduct as c,
  useProductRating as d,
  useProductReviews as e,
  useProducts as u
};
