import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { createActor } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useCategories, useProducts } from "../hooks/use-products";

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => `skel-${i}`).map((key) => (
        <div key={key} className="space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

const CATEGORY_IMAGES: Record<string, string> = {
  electronics: "/assets/generated/category-electronics.dim_600x400.jpg",
  fashion: "/assets/generated/category-fashion.dim_600x400.jpg",
};

const CATEGORY_COLORS: Record<string, string> = {
  electronics: "from-slate-900/80 to-slate-900/40",
  fashion: "from-amber-950/70 to-amber-950/30",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const seeded = useRef(false);

  const { data: newArrivals = [], isLoading: arrivalsLoading } = useProducts(
    { inStockOnly: false, tags: [] },
    0,
    8,
  );
  const { data: topPicks = [], isLoading: topLoading } = useProducts(
    { inStockOnly: true, tags: [] },
    0,
    8,
  );
  const { data: categories = [] } = useCategories();

  // Seed data on first load if no products
  useEffect(() => {
    if (!actor || actorFetching || seeded.current) return;
    if (newArrivals.length === 0 && !arrivalsLoading) {
      seeded.current = true;
      actor.seedData().catch(() => {});
    }
  }, [actor, actorFetching, newArrivals.length, arrivalsLoading]);

  const handleView = (product: { id: bigint }) => {
    navigate({
      to: "/product/$productId",
      params: { productId: product.id.toString() },
    });
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        data-ocid="home.hero"
        className="relative overflow-hidden bg-card"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative min-h-[420px] md:min-h-[520px] flex items-center">
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src="/assets/generated/hero-storefront.dim_1400x560.jpg"
                alt="Modern fashion and electronics"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 md:px-12 py-16 max-w-xl">
              <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 text-xs font-medium tracking-wide">
                <Sparkles className="h-3 w-3 mr-1" />
                New Season Collection
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                Curated
                <br />
                <span className="text-primary">Essentials</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-sm">
                Premium electronics and fashion — thoughtfully curated for
                modern living.
              </p>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="gap-2 font-medium"
                  onClick={() => navigate({ to: "/search", search: { q: "" } })}
                  data-ocid="home.shop_now_button"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    navigate({
                      to: "/category/$categoryId",
                      params: { categoryId: "1" },
                    })
                  }
                  data-ocid="home.explore_button"
                >
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature badges ────────────────────────────────────── */}
      <section className="bg-primary py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-1.5 text-primary-foreground text-xs font-medium">
            {[
              { icon: <Zap className="h-3.5 w-3.5" />, label: "Fast Delivery" },
              {
                icon: <TrendingUp className="h-3.5 w-3.5" />,
                label: "Trending Products",
              },
              {
                icon: <Sparkles className="h-3.5 w-3.5" />,
                label: "Premium Brands",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section
        className="bg-background py-14 px-6"
        data-ocid="home.categories_section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                Browse
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Shop by Category
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/search", search: { q: "" } })}
            >
              All products
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.length > 0
              ? categories.map((cat, i) => {
                  const slug = cat.slug.toLowerCase();
                  const img =
                    CATEGORY_IMAGES[slug] ?? "/assets/images/placeholder.svg";
                  const gradient =
                    CATEGORY_COLORS[slug] ??
                    "from-foreground/70 to-foreground/30";
                  return (
                    <Link
                      key={cat.id.toString()}
                      to="/category/$categoryId"
                      params={{ categoryId: cat.id.toString() }}
                      data-ocid={`home.category.item.${i + 1}`}
                      className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1] cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
                      />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                          {cat.subcategories.length} subcategories
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                          {cat.name}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          Shop now
                          <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  );
                })
              : [
                  {
                    slug: "electronics",
                    name: "Electronics & Gadgets",
                    img: "/assets/generated/category-electronics.dim_600x400.jpg",
                    gradient: CATEGORY_COLORS.electronics,
                    id: "1",
                  },
                  {
                    slug: "fashion",
                    name: "Fashion & Apparel",
                    img: "/assets/generated/category-fashion.dim_600x400.jpg",
                    gradient: CATEGORY_COLORS.fashion,
                    id: "2",
                  },
                ].map((cat, i) => (
                  <Link
                    key={cat.id}
                    to="/category/$categoryId"
                    params={{ categoryId: cat.id }}
                    data-ocid={`home.category.item.${i + 1}`}
                    className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1] cursor-pointer"
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${cat.gradient}`}
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                        {cat.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90">
                        Shop now <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ─────────────────────────────────────── */}
      <section
        className="bg-muted/30 py-14 px-6"
        data-ocid="home.new_arrivals_section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                Fresh In
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                New Arrivals
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/search", search: { q: "" } })}
            >
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {arrivalsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : newArrivals.length === 0 ? (
            <div
              className="rounded-2xl bg-card border border-border text-center py-16"
              data-ocid="home.new_arrivals.empty_state"
            >
              <p className="text-muted-foreground font-medium">
                Products loading… Come back shortly!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i + 1}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Picks ─────────────────────────────────────────── */}
      <section
        className="bg-background py-14 px-6"
        data-ocid="home.top_picks_section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                <TrendingUp className="inline h-3.5 w-3.5 mr-1" />
                Trending
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Top Picks
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/search", search: { q: "" } })}
            >
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {topLoading ? (
            <ProductGridSkeleton count={8} />
          ) : topPicks.length === 0 ? null : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topPicks.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i + 1}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────── */}
      <section className="bg-primary px-6 py-12" data-ocid="home.promo_banner">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Deals updated daily
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Fresh discounts on electronics and fashion every single day. Don't
            miss out.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-semibold"
            onClick={() => navigate({ to: "/search", search: { q: "" } })}
            data-ocid="home.promo_cta_button"
          >
            Browse All Deals
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
