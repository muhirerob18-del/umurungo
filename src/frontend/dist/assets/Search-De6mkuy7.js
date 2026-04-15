import { c as createLucideIcon, u as useNavigate, e as useSearch, r as reactExports, j as jsxRuntimeExports, S as Search, I as Input, b as Button, B as Badge, f as cn, X } from "./index-CzdgUJ7r.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { S as SlidersHorizontal, P as Pagination, a as Switch } from "./Pagination-BfSYGoZI.js";
import { E as EmptyState } from "./EmptyState-BqKvqo8I.js";
import { a as useCategories, b as useSearchProducts, u as useProducts, P as ProductCard } from "./use-products-C2b16iKm.js";
import "./index-CEjBcvQ_.js";
import "./index-y4qoz3wi.js";
import "./index-C_0r4B1t.js";
import "./chevron-left-BAeFkPTF.js";
import "./PriceTag-DWCNPjVR.js";
import "./backend-BvEPXO-C.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode);
const PAGE_SIZE = 24;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" }
];
function FilterSidebar({
  filters,
  onChange,
  categories,
  onReset,
  onClose
}) {
  const selectedCat = categories.find((c) => c.id === filters.categoryId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", "data-ocid": "search.filter_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground", children: "Filters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onReset,
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            "data-ocid": "search.filter_reset",
            children: "Reset all"
          }
        ),
        onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "aria-label": "Close filters",
            className: "md:hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange({ categoryId: void 0, subcategoryId: void 0 }),
            className: cn(
              "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
              !filters.categoryId ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
            ),
            "data-ocid": "search.filter.category.all",
            children: "All Categories"
          }
        ),
        categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange({ categoryId: cat.id, subcategoryId: void 0 }),
            className: cn(
              "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
              filters.categoryId === cat.id ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
            ),
            "data-ocid": `search.filter.category.${cat.id.toString()}`,
            children: cat.name
          },
          cat.id.toString()
        ))
      ] })
    ] }),
    selectedCat && selectedCat.subcategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Subcategory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange({ subcategoryId: void 0 }),
              className: cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                !filters.subcategoryId ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
              ),
              children: "All"
            }
          ),
          selectedCat.subcategories.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange({ subcategoryId: sub.id }),
              className: cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                filters.subcategoryId === sub.id ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
              ),
              children: sub.name
            },
            sub.id.toString()
          ))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Price Range" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Min ($)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              placeholder: "0",
              value: filters.minPrice ?? "",
              onChange: (e) => onChange({
                minPrice: e.target.value ? Number(e.target.value) : void 0
              }),
              className: "h-8 text-sm",
              "data-ocid": "search.filter.min_price_input"
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
              value: filters.maxPrice ?? "",
              onChange: (e) => onChange({
                maxPrice: e.target.value ? Number(e.target.value) : void 0
              }),
              className: "h-8 text-sm",
              "data-ocid": "search.filter.max_price_input"
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
          htmlFor: "instock",
          className: "text-sm font-medium text-foreground cursor-pointer",
          children: "In Stock Only"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          id: "instock",
          checked: filters.inStockOnly,
          onCheckedChange: (v) => onChange({ inStockOnly: v }),
          "data-ocid": "search.filter.instock_toggle"
        }
      )
    ] })
  ] });
}
const DEFAULT_FILTERS = {
  inStockOnly: false,
  tags: []
};
function SearchPage() {
  var _a;
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const q = searchParams.q ?? "";
  const [localQ, setLocalQ] = reactExports.useState(q);
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS);
  const [sort, setSort] = reactExports.useState("newest");
  const [page, setPage] = reactExports.useState(0);
  const [showMobileFilters, setShowMobileFilters] = reactExports.useState(false);
  const { data: categories = [] } = useCategories();
  const isSearch = q.trim().length > 1;
  const { data: searchResults = [], isLoading: searchLoading } = useSearchProducts(q, PAGE_SIZE * (page + 1));
  const { data: browseResults = [], isLoading: browseLoading } = useProducts(
    {
      inStockOnly: filters.inStockOnly,
      tags: filters.tags,
      categoryId: filters.categoryId,
      subcategoryId: filters.subcategoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    },
    page,
    PAGE_SIZE
  );
  const rawProducts = isSearch ? searchResults : browseResults;
  const isLoading = isSearch ? searchLoading : browseLoading;
  const products = [...rawProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "popular") return Number(b.soldCount - a.soldCount);
    return Number(b.createdAt - a.createdAt);
  });
  const updateFilters = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("newest");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: localQ } });
  };
  const handleView = (product) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() }
    });
  };
  const activeFilterCount = [
    filters.categoryId,
    filters.subcategoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly
  ].filter(Boolean).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border sticky top-0 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "flex gap-3 max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: localQ,
            onChange: (e) => setLocalQ(e.target.value),
            placeholder: "Search products…",
            className: "pl-9 h-10",
            "data-ocid": "search.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "h-10 px-5",
          "data-ocid": "search.search_button",
          children: "Search"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/" }),
            className: "hover:text-foreground transition-colors",
            children: "Home"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: q ? `"${q}"` : "All Products" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block w-56 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterSidebar,
          {
            filters,
            onChange: updateFilters,
            categories,
            onReset: resetFilters
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "md:hidden gap-2",
                  onClick: () => setShowMobileFilters(true),
                  "data-ocid": "search.filter_toggle",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }),
                    "Filters",
                    activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 w-4 p-0 text-[10px] justify-center", children: activeFilterCount })
                  ]
                }
              ),
              !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: products.length }),
                products.length === PAGE_SIZE ? "+" : "",
                " results",
                q ? ` for "${q}"` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSort(opt.value),
                  className: cn(
                    "text-xs px-2.5 py-1.5 rounded-lg transition-colors border",
                    sort === opt.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  ),
                  "data-ocid": `search.sort.${opt.value}`,
                  children: opt.label
                },
                opt.value
              )) })
            ] })
          ] }),
          activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
            filters.categoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "gap-1 cursor-pointer",
                onClick: () => updateFilters({
                  categoryId: void 0,
                  subcategoryId: void 0
                }),
                children: [
                  (_a = categories.find((c) => c.id === filters.categoryId)) == null ? void 0 : _a.name,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                ]
              }
            ),
            filters.minPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "gap-1 cursor-pointer",
                onClick: () => updateFilters({ minPrice: void 0 }),
                children: [
                  "Min $",
                  filters.minPrice,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                ]
              }
            ),
            filters.maxPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "gap-1 cursor-pointer",
                onClick: () => updateFilters({ maxPrice: void 0 }),
                children: [
                  "Max $",
                  filters.maxPrice,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                ]
              }
            ),
            filters.inStockOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "gap-1 cursor-pointer",
                onClick: () => updateFilters({ inStockOnly: false }),
                children: [
                  "In Stock",
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
          ) }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "search.empty_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: Search,
                title: q ? `No results for "${q}"` : "No products found",
                description: q ? "Try different keywords or adjust your filters." : "Try removing some filters to see more products.",
                action: { label: "Clear filters", onClick: resetFilters }
              }
            ),
            q && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Did you mean…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: [
                "headphones",
                "jacket",
                "watch",
                "sneakers",
                "laptop"
              ].map((hint) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => navigate({ to: "/search", search: { q: hint } }),
                  className: "text-sm text-primary hover:underline capitalize",
                  children: hint
                },
                hint
              )) })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: products.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductCard,
              {
                product,
                index: i + 1,
                onView: handleView
              },
              product.id.toString()
            )) }),
            !isSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
      ] })
    ] }),
    showMobileFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm",
          role: "button",
          tabIndex: 0,
          "aria-label": "Close filters",
          onClick: () => setShowMobileFilters(false),
          onKeyDown: (e) => {
            if (e.key === "Escape" || e.key === "Enter")
              setShowMobileFilters(false);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-y-0 left-0 w-72 bg-card p-6 overflow-y-auto shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterSidebar,
          {
            filters,
            onChange: updateFilters,
            categories,
            onReset: resetFilters,
            onClose: () => setShowMobileFilters(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full mt-6",
            onClick: () => setShowMobileFilters(false),
            "data-ocid": "search.filter.apply_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 mr-2" }),
              "Apply Filters"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  SearchPage as default
};
