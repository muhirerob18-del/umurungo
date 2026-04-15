import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Product } from "../backend";
import { PriceTag } from "../components/PriceTag";
import { useCart } from "../hooks/use-cart";
import { useWishlist } from "../hooks/use-wishlist";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!actor || actorFetching || items.length === 0) return;
    setLoading(true);
    const results = await Promise.all(
      items.map((id) =>
        actor
          .getProduct(BigInt(id))
          .then((p) => (p ? { id, product: p } : null)),
      ),
    );
    const map: Record<string, Product> = {};
    for (const r of results) {
      if (r) map[r.id] = r.product;
    }
    setProducts(map);
    setLoading(false);
  }, [actor, actorFetching, items]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddAllToCart = () => {
    for (const id of items) addItem(BigInt(id), 1n);
    toast.success("All wishlist items added to cart!");
  };

  const handleShareWishlist = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Wishlist link copied!"));
  };

  const handleNavigateToProduct = (productId: string) => {
    navigate({ to: "/product/$productId", params: { productId } });
  };

  if (loading) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 py-8"
        data-ocid="wishlist.loading_state"
      >
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <Skeleton key={k} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 py-16 text-center"
        data-ocid="wishlist.empty_state"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Heart className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display font-semibold mb-2">
          Your wishlist is empty
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Save items you love to revisit them anytime.
        </p>
        <Button asChild size="lg" data-ocid="wishlist.browse_button">
          <Link to="/">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="wishlist.page">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareWishlist}
            className="gap-2"
            data-ocid="wishlist.share_button"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={handleAddAllToCart}
            className="gap-2"
            data-ocid="wishlist.add_all_button"
          >
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((id, idx) => {
          const product = products[id];
          return (
            <article
              key={id}
              className="group relative bg-card border border-border rounded-xl overflow-hidden transition-smooth hover:shadow-elevated hover:-translate-y-0.5"
              data-ocid={`wishlist.item.${idx + 1}`}
            >
              <button
                type="button"
                className="aspect-square bg-muted overflow-hidden cursor-pointer w-full block"
                onClick={() =>
                  product && handleNavigateToProduct(product.id.toString())
                }
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && product)
                    handleNavigateToProduct(product.id.toString());
                }}
                aria-label={`View ${product?.title ?? "product"}`}
              >
                <img
                  src={product?.images[0] || "/assets/images/placeholder.svg"}
                  alt={product?.title ?? ""}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
              </button>

              {/* Remove from wishlist */}
              <button
                type="button"
                onClick={() => removeItem(BigInt(id))}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card shadow-subtle transition-smooth"
                aria-label="Remove from wishlist"
                data-ocid={`wishlist.delete_button.${idx + 1}`}
              >
                <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
              </button>

              <div className="p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 truncate">
                  {product?.tags[0] ?? ""}
                </p>
                <button
                  type="button"
                  className="font-medium text-sm line-clamp-2 leading-tight mb-2 text-left hover:text-primary transition-colors w-full"
                  onClick={() =>
                    product && handleNavigateToProduct(product.id.toString())
                  }
                >
                  {product?.title ?? "—"}
                </button>
                {product && (
                  <div className="mb-3">
                    <PriceTag
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      size="sm"
                    />
                  </div>
                )}
                <Button
                  size="sm"
                  className="w-full h-8 text-xs gap-1"
                  onClick={() => {
                    addItem(BigInt(id), 1n);
                    toast.success("Added to cart!");
                  }}
                  disabled={!product || product.stock <= 0n}
                  data-ocid={`wishlist.add_to_cart_button.${idx + 1}`}
                >
                  <ShoppingCart className="h-3 w-3" />
                  {!product || product.stock <= 0n
                    ? "Out of Stock"
                    : "Add to Cart"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
