import { g as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, C as ChevronRight, f as cn, I as Input, b as Button, B as Badge, X } from "./index-CzdgUJ7r.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { a as Switch, S as SlidersHorizontal, P as Pagination } from "./Pagination-BfSYGoZI.js";
import { E as EmptyState } from "./EmptyState-BqKvqo8I.js";
import { a as useCategories, u as useProducts, P as ProductCard } from "./use-products-C2b16iKm.js";
import "./index-CEjBcvQ_.js";
import "./index-y4qoz3wi.js";
import "./index-C_0r4B1t.js";
import "./chevron-left-BAeFkPTF.js";
import "./PriceTag-DWCNPjVR.js";
import "./backend-BvEPXO-C.js";
const PAGE_SIZE = 24;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" }
];
function CategoryPage() {
  const { categoryId } = useParams({ strict: false });
  const navigate = useNavigate();
  const catIdBig = categoryId ? BigInt(categoryId) : void 0;
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === catIdBig);
  const [activeSubcat, setActiveSubcat] = reactExports.useState(
    void 0
  );
  const [minPrice, setMinPrice] = reactExports.useState();
  const [maxPrice, setMaxPrice] = reactExports.useState();
  const [inStockOnly, setInStockOnly] = reactExports.useState(false);
  const [sort, setSort] = reactExports.useState("newest");
  const [page, setPage] = reactExports.useState(0);
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [lastCategoryId, setLastCategoryId] = reactExports.useState(categoryId);
  if (lastCategoryId !== categoryId) {
    setLastCategoryId(categoryId);
    setActiveSubcat(void 0);
    setPage(0);
  }
  const { data: rawProducts = [], isLoading } = useProducts(
    {
      categoryId: catIdBig,
      subcategoryId: activeSubcat,
      inStockOnly,
      tags: [],
      minPrice,
      maxPrice
    },
    page,
    PAGE_SIZE
  );
  const products = [...rawProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "popular") return Number(b.soldCount - a.soldCount);
    return Number(b.createdAt - a.createdAt);
  });
  const handleView = (product) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() }
    });
  };
  const resetFilters = () => {
    setActiveSubcat(void 0);
    setMinPrice(void 0);
    setMaxPrice(void 0);
    setInStockOnly(false);
    setSort("newest");
    setPage(0);
  };
  const activeFilterCount = [
    activeSubcat,
    minPrice,
    maxPrice,
    inStockOnly
  ].filter(Boolean).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/" }),
            className: "hover:text-foreground transition-colors",
            "data-ocid": "category.breadcrumb_home",
            children: "Home"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: (category == null ? void 0 : category.name) ?? `Category ${categoryId}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground mb-1", children: (category == null ? void 0 : category.name) ?? "Browse Products" }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            products.length,
            products.length === PAGE_SIZE ? "+" : "",
            " products"
          ] })
        ] }),
        categories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({
              to: "/category/$categoryId",
              params: { categoryId: cat.id.toString() }
            }),
            className: cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              cat.id === catIdBig ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            ),
            "data-ocid": `category.switcher.${cat.id.toString()}`,
            children: cat.name
          },
          cat.id.toString()
        )) })
      ] }),
      category && category.subcategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-2 mt-4 flex-wrap",
          "data-ocid": "category.subcategory_tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setActiveSubcat(void 0);
                  setPage(0);
                },
                className: cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  !activeSubcat ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
                ),
                "data-ocid": "category.subcategory.all",
                children: "All"
              }
            ),
            category.subcategories.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setActiveSubcat(sub.id);
                  setPage(0);
                },
                className: cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  activeSubcat === sub.id ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
                ),
                "data-ocid": `category.subcategory.${sub.id.toString()}`,
                children: sub.name
              },
              sub.id.toString()
            ))
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "aside",
        {
          className: "hidden md:block w-52 flex-shrink-0 space-y-5",
          "data-ocid": "category.filter_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: "Filters" }),
              activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: resetFilters,
                  className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                  children: "Reset"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Price Range" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Min ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      placeholder: "0",
                      value: minPrice ?? "",
                      onChange: (e) => setMinPrice(
                        e.target.value ? Number(e.target.value) : void 0
                      ),
                      className: "h-8 text-sm",
                      "data-ocid": "category.filter.min_price_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Max ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      placeholder: "Any",
                      value: maxPrice ?? "",
                      onChange: (e) => setMaxPrice(
                        e.target.value ? Number(e.target.value) : void 0
                      ),
                      className: "h-8 text-sm",
                      "data-ocid": "category.filter.max_price_input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "cat-instock",
                  className: "text-sm font-medium text-foreground cursor-pointer",
                  children: "In Stock Only"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "cat-instock",
                  checked: inStockOnly,
                  onCheckedChange: (v) => {
                    setInStockOnly(v);
                    setPage(0);
                  },
                  "data-ocid": "category.filter.instock_toggle"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "md:hidden gap-2",
              onClick: () => setShowFilters(true),
              "data-ocid": "category.filter_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }),
                "Filters",
                activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 w-4 p-0 text-[10px] justify-center", children: activeFilterCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 ml-auto", children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSort(opt.value),
              className: cn(
                "text-xs px-2.5 py-1.5 rounded-lg transition-colors border",
                sort === opt.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              ),
              "data-ocid": `category.sort.${opt.value}`,
              children: opt.label
            },
            opt.value
          )) })
        ] }),
        (minPrice || maxPrice || inStockOnly) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
          minPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "gap-1 cursor-pointer",
              onClick: () => setMinPrice(void 0),
              children: [
                "Min $",
                minPrice,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              ]
            }
          ),
          maxPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "gap-1 cursor-pointer",
              onClick: () => setMaxPrice(void 0),
              children: [
                "Max $",
                maxPrice,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              ]
            }
          ),
          inStockOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "gap-1 cursor-pointer",
              onClick: () => setInStockOnly(false),
              children: [
                "In Stock ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              ]
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 12 }, (_, i) => `skel-${i}`).map(
          (key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" })
          ] }, key)
        ) }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "No products in this category",
            description: "Try adjusting filters or exploring other categories.",
            action: { label: "Reset filters", onClick: resetFilters }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: products.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product,
              index: i + 1,
              onView: handleView
            },
            product.id.toString()
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pagination,
            {
              page,
              pageSize: PAGE_SIZE,
              hasMore: products.length === PAGE_SIZE,
              onPageChange: setPage,
              className: "mt-8"
            }
          )
        ] })
      ] })
    ] }) }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm",
          role: "button",
          tabIndex: 0,
          "aria-label": "Close filters",
          onClick: () => setShowFilters(false),
          onKeyDown: (e) => {
            if (e.key === "Escape" || e.key === "Enter")
              setShowFilters(false);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-y-0 left-0 w-72 bg-card p-6 overflow-y-auto shadow-elevated space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowFilters(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "Min price",
                value: minPrice ?? "",
                onChange: (e) => setMinPrice(
                  e.target.value ? Number(e.target.value) : void 0
                ),
                className: "h-9"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "Max price",
                value: maxPrice ?? "",
                onChange: (e) => setMaxPrice(
                  e.target.value ? Number(e.target.value) : void 0
                ),
                className: "h-9"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "In Stock Only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: inStockOnly, onCheckedChange: setInStockOnly })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => setShowFilters(false), children: "Apply Filters" })
      ] })
    ] })
  ] });
}
export {
  CategoryPage as default
};
