import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { useCategories, useProducts } from "../hooks/use-products";

const PAGE_SIZE = 24;

type SortValue = "newest" | "popular" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
];

export default function CategoryPage() {
  const { categoryId } = useParams({ strict: false }) as {
    categoryId?: string;
  };
  const navigate = useNavigate();
  const catIdBig = categoryId ? BigInt(categoryId) : undefined;

  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === catIdBig);

  const [activeSubcat, setActiveSubcat] = useState<bigint | undefined>(
    undefined,
  );
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [lastCategoryId, setLastCategoryId] = useState(categoryId);

  // Reset filters when navigating to a different category
  if (lastCategoryId !== categoryId) {
    setLastCategoryId(categoryId);
    setActiveSubcat(undefined);
    setPage(0);
  }

  const { data: rawProducts = [], isLoading } = useProducts(
    {
      categoryId: catIdBig,
      subcategoryId: activeSubcat,
      inStockOnly,
      tags: [],
      minPrice,
      maxPrice,
    },
    page,
    PAGE_SIZE,
  );

  const products = [...rawProducts].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "popular") return Number(b.soldCount - a.soldCount);
    return Number(b.createdAt - a.createdAt);
  });

  const handleView = (product: { id: bigint }) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() },
    });
  };

  const resetFilters = () => {
    setActiveSubcat(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStockOnly(false);
    setSort("newest");
    setPage(0);
  };

  const activeFilterCount = [
    activeSubcat,
    minPrice,
    maxPrice,
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="hover:text-foreground transition-colors"
              data-ocid="category.breadcrumb_home"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">
              {category?.name ?? `Category ${categoryId}`}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                {category?.name ?? "Browse Products"}
              </h1>
              {!isLoading && (
                <p className="text-sm text-muted-foreground">
                  {products.length}
                  {products.length === PAGE_SIZE ? "+" : ""} products
                </p>
              )}
            </div>

            {/* Category switcher */}
            {categories.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id.toString()}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/category/$categoryId",
                        params: { categoryId: cat.id.toString() },
                      })
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                      cat.id === catIdBig
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                    )}
                    data-ocid={`category.switcher.${cat.id.toString()}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory tabs */}
          {category && category.subcategories.length > 0 && (
            <div
              className="flex gap-2 mt-4 flex-wrap"
              data-ocid="category.subcategory_tabs"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveSubcat(undefined);
                  setPage(0);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  !activeSubcat
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                data-ocid="category.subcategory.all"
              >
                All
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id.toString()}
                  type="button"
                  onClick={() => {
                    setActiveSubcat(sub.id);
                    setPage(0);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border transition-colors",
                    activeSubcat === sub.id
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid={`category.subcategory.${sub.id.toString()}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside
            className="hidden md:block w-52 flex-shrink-0 space-y-5"
            data-ocid="category.filter_panel"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <Separator />

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Price Range
              </p>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Min ($)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={minPrice ?? ""}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-8 text-sm"
                    data-ocid="category.filter.min_price_input"
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
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-8 text-sm"
                    data-ocid="category.filter.max_price_input"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="cat-instock"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                In Stock Only
              </Label>
              <Switch
                id="cat-instock"
                checked={inStockOnly}
                onCheckedChange={(v) => {
                  setInStockOnly(v);
                  setPage(0);
                }}
                data-ocid="category.filter.instock_toggle"
              />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden gap-2"
                onClick={() => setShowFilters(true)}
                data-ocid="category.filter_toggle"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="h-4 w-4 p-0 text-[10px] justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <div className="flex gap-1 ml-auto">
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
                    data-ocid={`category.sort.${opt.value}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filter chips */}
            {(minPrice || maxPrice || inStockOnly) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {minPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => setMinPrice(undefined)}
                  >
                    Min ${minPrice} <X className="h-3 w-3" />
                  </Badge>
                )}
                {maxPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => setMaxPrice(undefined)}
                  >
                    Max ${maxPrice} <X className="h-3 w-3" />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => setInStockOnly(false)}
                  >
                    In Stock <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products */}
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
              <EmptyState
                title="No products in this category"
                description="Try adjusting filters or exploring other categories."
                action={{ label: "Reset filters", onClick: resetFilters }}
              />
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
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  hasMore={products.length === PAGE_SIZE}
                  onPageChange={setPage}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter")
                setShowFilters(false);
            }}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-card p-6 overflow-y-auto shadow-elevated space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Filters</span>
              <button type="button" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Price
              </p>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min price"
                  value={minPrice ?? ""}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="h-9"
                />
                <Input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice ?? ""}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="h-9"
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">In Stock Only</span>
              <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
            </div>
            <Button className="w-full" onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
