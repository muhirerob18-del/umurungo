import { c as createLucideIcon, u as useNavigate, a as useActor, r as reactExports, j as jsxRuntimeExports, B as Badge, b as Button, Z as Zap, C as ChevronRight, L as Link, d as createActor } from "./index-CzdgUJ7r.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { u as useProducts, a as useCategories, P as ProductCard } from "./use-products-C2b16iKm.js";
import { A as ArrowRight } from "./arrow-right-VfE0LXCR.js";
import { T as TrendingUp } from "./trending-up-DtEUCgQD.js";
import "./PriceTag-DWCNPjVR.js";
import "./backend-BvEPXO-C.js";
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function ProductGridSkeleton({ count = 8 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: count }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" })
  ] }, key)) });
}
const CATEGORY_IMAGES = {
  electronics: "/assets/generated/category-electronics.dim_600x400.jpg",
  fashion: "/assets/generated/category-fashion.dim_600x400.jpg"
};
const CATEGORY_COLORS = {
  electronics: "from-slate-900/80 to-slate-900/40",
  fashion: "from-amber-950/70 to-amber-950/30"
};
function HomePage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const seeded = reactExports.useRef(false);
  const { data: newArrivals = [], isLoading: arrivalsLoading } = useProducts(
    { inStockOnly: false, tags: [] },
    0,
    8
  );
  const { data: topPicks = [], isLoading: topLoading } = useProducts(
    { inStockOnly: true, tags: [] },
    0,
    8
  );
  const { data: categories = [] } = useCategories();
  reactExports.useEffect(() => {
    if (!actor || actorFetching || seeded.current) return;
    if (newArrivals.length === 0 && !arrivalsLoading) {
      seeded.current = true;
      actor.seedData().catch(() => {
      });
    }
  }, [actor, actorFetching, newArrivals.length, arrivalsLoading]);
  const handleView = (product) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "home.hero",
        className: "relative overflow-hidden bg-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-[420px] md:min-h-[520px] flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/assets/generated/hero-storefront.dim_1400x560.jpg",
                alt: "Modern fashion and electronics",
                className: "w-full h-full object-cover object-center"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 px-6 md:px-12 py-16 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "mb-4 bg-primary/15 text-primary border-primary/30 text-xs font-medium tracking-wide", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
              "New Season Collection"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4", children: [
              "Curated",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Essentials" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-sm", children: "Premium electronics and fashion — thoughtfully curated for modern living." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "lg",
                  className: "gap-2 font-medium",
                  onClick: () => navigate({ to: "/search", search: { q: "" } }),
                  "data-ocid": "home.shop_now_button",
                  children: [
                    "Shop Now",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "lg",
                  variant: "outline",
                  onClick: () => navigate({
                    to: "/category/$categoryId",
                    params: { categoryId: "1" }
                  }),
                  "data-ocid": "home.explore_button",
                  children: "Explore"
                }
              )
            ] })
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-x-8 gap-y-1.5 text-primary-foreground text-xs font-medium", children: [
      { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }), label: "Fast Delivery" },
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
        label: "Trending Products"
      },
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        label: "Premium Brands"
      }
    ].map(({ icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      icon,
      label
    ] }, label)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-14 px-6",
        "data-ocid": "home.categories_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-widest mb-1", children: "Browse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Shop by Category" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "gap-1 text-muted-foreground hover:text-foreground",
                onClick: () => navigate({ to: "/search", search: { q: "" } }),
                children: [
                  "All products",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: categories.length > 0 ? categories.map((cat, i) => {
            const slug = cat.slug.toLowerCase();
            const img = CATEGORY_IMAGES[slug] ?? "/assets/images/placeholder.svg";
            const gradient = CATEGORY_COLORS[slug] ?? "from-foreground/70 to-foreground/30";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/category/$categoryId",
                params: { categoryId: cat.id.toString() },
                "data-ocid": `home.category.item.${i + 1}`,
                className: "group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1] cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: img,
                      alt: cat.name,
                      className: "absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `absolute inset-0 bg-gradient-to-r ${gradient}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 flex flex-col justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-widest text-white/70 mb-1", children: [
                      cat.subcategories.length,
                      " subcategories"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl md:text-3xl font-bold text-white mb-3", children: cat.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors", children: [
                      "Shop now",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-smooth group-hover:translate-x-1" })
                    ] })
                  ] })
                ]
              },
              cat.id.toString()
            );
          }) : [
            {
              slug: "electronics",
              name: "Electronics & Gadgets",
              img: "/assets/generated/category-electronics.dim_600x400.jpg",
              gradient: CATEGORY_COLORS.electronics,
              id: "1"
            },
            {
              slug: "fashion",
              name: "Fashion & Apparel",
              img: "/assets/generated/category-fashion.dim_600x400.jpg",
              gradient: CATEGORY_COLORS.fashion,
              id: "2"
            }
          ].map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/category/$categoryId",
              params: { categoryId: cat.id },
              "data-ocid": `home.category.item.${i + 1}`,
              className: "group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1] cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cat.img,
                    alt: cat.name,
                    className: "absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `absolute inset-0 bg-gradient-to-r ${cat.gradient}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 flex flex-col justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl md:text-3xl font-bold text-white mb-3", children: cat.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm font-medium text-white/90", children: [
                    "Shop now ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
                  ] })
                ] })
              ]
            },
            cat.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 py-14 px-6",
        "data-ocid": "home.new_arrivals_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-widest mb-1", children: "Fresh In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "New Arrivals" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "gap-1 text-muted-foreground hover:text-foreground",
                onClick: () => navigate({ to: "/search", search: { q: "" } }),
                children: [
                  "View all ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] }),
          arrivalsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGridSkeleton, { count: 8 }) : newArrivals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-2xl bg-card border border-border text-center py-16",
              "data-ocid": "home.new_arrivals.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "Products loading… Come back shortly!" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: newArrivals.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product,
              index: i + 1,
              onView: handleView
            },
            product.id.toString()
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-14 px-6",
        "data-ocid": "home.top_picks_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-primary uppercase tracking-widest mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "inline h-3.5 w-3.5 mr-1" }),
                "Trending"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Top Picks" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "gap-1 text-muted-foreground hover:text-foreground",
                onClick: () => navigate({ to: "/search", search: { q: "" } }),
                children: [
                  "View all ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] }),
          topLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGridSkeleton, { count: 8 }) : topPicks.length === 0 ? null : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: topPicks.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product,
              index: i + 1,
              onView: handleView
            },
            product.id.toString()
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary px-6 py-12", "data-ocid": "home.promo_banner", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3", children: "Deals updated daily" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 mb-6", children: "Fresh discounts on electronics and fashion every single day. Don't miss out." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "secondary",
          size: "lg",
          className: "gap-2 font-semibold",
          onClick: () => navigate({ to: "/search", search: { q: "" } }),
          "data-ocid": "home.promo_cta_button",
          children: [
            "Browse All Deals",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ]
        }
      )
    ] }) })
  ] });
}
export {
  HomePage as default
};
