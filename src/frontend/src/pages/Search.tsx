import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Filter, LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import {
  useCategories,
  useProducts,
  useSearchProducts,
} from "../hooks/use-products";
import type { FilterState } from "../types";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function FilterSidebar({
  filters,
  onChange,
  categories,
  onReset,
  onClose,
}: {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  categories: {
    id: bigint;
    name: string;
    subcategories: { id: bigint; name: string }[];
  }[];
  onReset: () => void;
  onClose?: () => void;
}) {
  const selectedCat = categories.find((c) => c.id === filters.categoryId);

  return (
    <aside className="space-y-6" data-ocid="search.filter_panel">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-foreground">
          Filters
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="search.filter_reset"
          >
            Reset all
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Category */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Category
        </p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() =>
              onChange({ categoryId: undefined, subcategoryId: undefined })
            }
            className={cn(
              "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
              !filters.categoryId
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted",
            )}
            data-ocid="search.filter.category.all"
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id.toString()}
              type="button"
              onClick={() =>
                onChange({ categoryId: cat.id, subcategoryId: undefined })
              }
              className={cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                filters.categoryId === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted",
              )}
              data-ocid={`search.filter.category.${cat.id.toString()}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      {selectedCat && selectedCat.subcategories.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Subcategory
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onChange({ subcategoryId: undefined })}
                className={cn(
                  "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                  !filters.subcategoryId
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted",
                )}
              >
                All
              </button>
              {selectedCat.subcategories.map((sub) => (
                <button
                  key={sub.id.toString()}
                  type="button"
                  onClick={() => onChange({ subcategoryId: sub.id })}
                  className={cn(
                    "w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                    filters.subcategoryId === sub.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Price Range
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Min ($)
            </Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="h-8 text-sm"
              data-ocid="search.filter.min_price_input"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Max ($)
            </Label>
            <Input
              type="number"
              min={0}
              placeholder="Any"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="h-8 text-sm"
              data-ocid="search.filter.max_price_input"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* In Stock */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor="instock"
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          In Stock Only
        </Label>
        <Switch
          id="instock"
          checked={filters.inStockOnly}
          onCheckedChange={(v) => onChange({ inStockOnly: v })}
          data-ocid="search.filter.instock_toggle"
        />
      </div>
    </aside>
  );
}

const DEFAULT_FILTERS: FilterState = {
  inStockOnly: false,
  tags: [],
};

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { q?: string };
  const q = searchParams.q ?? "";

  const [localQ, setLocalQ] = useState(q);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: categories = [] } = useCategories();

  // Keyword search mode vs browse mode
  const isSearch = q.trim().length > 1;

  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchProducts(q, PAGE_SIZE * (page + 1));

  const { data: browseResults = [], isLoading: browseLoading } = useProducts(
    {
      inStockOnly: filters.inStockOnly,
      tags: filters.tags,
      categoryId: filters.categoryId,
      subcategoryId: filters.subcategoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
    page,
    PAGE_SIZE,
  );

  const rawProducts = isSearch ? searchResults : browseResults;
  const isLoading = isSearch ? searchLoading : browseLoading;

  // Client-side sort
  const products = [...rawProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "popular") return Number(b.soldCount - a.soldCount);
    return Number(b.createdAt - a.createdAt);
  });

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("newest");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: localQ } });
  };

  const handleView = (product: { id: bigint }) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() },
    });
  };

  const activeFilterCount = [
    filters.categoryId,
    filters.subcategoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                placeholder="Search products…"
                className="pl-9 h-10"
                data-ocid="search.search_input"
              />
            </div>
            <Button
              type="submit"
              className="h-10 px-5"
              data-ocid="search.search_button"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">
            {q ? `"${q}"` : "All Products"}
          </span>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              categories={categories}
              onReset={resetFilters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden gap-2"
                  onClick={() => setShowMobileFilters(true)}
                  data-ocid="search.filter_toggle"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="h-4 w-4 p-0 text-[10px] justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                {!isLoading && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {products.length}
                    </span>
                    {products.length === PAGE_SIZE ? "+" : ""} results
                    {q ? ` for "${q}"` : ""}
                  </p>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSort(opt.value)}
                      className={cn(
                        "text-xs px-2.5 py-1.5 rounded-lg transition-colors border",
                        sort === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                      data-ocid={`search.sort.${opt.value}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filters chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.categoryId && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() =>
                      updateFilters({
                        categoryId: undefined,
                        subcategoryId: undefined,
                      })
                    }
                  >
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.minPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => updateFilters({ minPrice: undefined })}
                  >
                    Min ${filters.minPrice}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.maxPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => updateFilters({ maxPrice: undefined })}
                  >
                    Max ${filters.maxPrice}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {filters.inStockOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => updateFilters({ inStockOnly: false })}
                  >
                    In Stock
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => `skel-${i}`).map(
                  (key) => (
                    <div key={key} className="space-y-3">
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ),
                )}
              </div>
            ) : products.length === 0 ? (
              <div data-ocid="search.empty_state">
                <EmptyState
                  icon={Search}
                  title={q ? `No results for "${q}"` : "No products found"}
                  description={
                    q
                      ? "Try different keywords or adjust your filters."
                      : "Try removing some filters to see more products."
                  }
                  action={{ label: "Clear filters", onClick: resetFilters }}
                />
                {q && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Did you mean…
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "headphones",
                        "jacket",
                        "watch",
                        "sneakers",
                        "laptop",
                      ].map((hint) => (
                        <button
                          key={hint}
                          type="button"
                          onClick={() =>
                            navigate({ to: "/search", search: { q: hint } })
                          }
                          className="text-sm text-primary hover:underline capitalize"
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      index={i + 1}
                      onView={handleView}
                    />
                  ))}
                </div>
                {!isSearch && (
                  <Pagination
                    page={page}
                    pageSize={PAGE_SIZE}
                    hasMore={products.length === PAGE_SIZE}
                    onPageChange={setPage}
                    className="mt-8"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close filters"
            onClick={() => setShowMobileFilters(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter")
                setShowMobileFilters(false);
            }}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-card p-6 overflow-y-auto shadow-elevated">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              categories={categories}
              onReset={resetFilters}
              onClose={() => setShowMobileFilters(false)}
            />
            <Button
              className="w-full mt-6"
              onClick={() => setShowMobileFilters(false)}
              data-ocid="search.filter.apply_button"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
