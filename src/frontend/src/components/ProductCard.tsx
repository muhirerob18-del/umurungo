import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend";
import { useCart } from "../hooks/use-cart";
import { useWishlist } from "../hooks/use-wishlist";
import { PriceTag } from "./PriceTag";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  index?: number;
  className?: string;
}

export function ProductCard({
  product,
  onView,
  index = 1,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    hasItem,
  } = useWishlist();
  const isWishlisted = hasItem(product.id);
  const isOutOfStock = product.stock <= 0n;

  const imageUrl =
    !imageError && product.images.length > 0
      ? product.images[0]
      : "/assets/images/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product.id, 1n);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <article
      className={cn(
        "group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer",
        "transition-smooth hover:shadow-elevated hover:-translate-y-0.5",
        className,
      )}
      onClick={() => onView?.(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView?.(product);
      }}
      data-ocid={`product.item.${index}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOutOfStock && (
            <Badge
              variant="secondary"
              className="text-[10px] bg-muted-foreground/80 text-card"
            >
              Out of Stock
            </Badge>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Badge className="text-[10px] bg-destructive text-destructive-foreground">
              Sale
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full bg-card/80 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100 transition-smooth",
            "hover:bg-card hover:shadow-subtle",
          )}
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          data-ocid={`product.wishlist.${index}`}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isWishlisted
                ? "fill-destructive text-destructive"
                : "text-muted-foreground",
            )}
          />
        </button>

        {/* Quick view */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex gap-1 p-2",
            "translate-y-full group-hover:translate-y-0 transition-smooth",
          )}
        >
          <Button
            size="sm"
            className="flex-1 h-8 text-xs gap-1"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            data-ocid={`product.add_button.${index}`}
          >
            <ShoppingCart className="h-3 w-3" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-card/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(product);
            }}
            aria-label="Quick view"
            data-ocid={`product.view_button.${index}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5 truncate">
          {product.tags[0] ?? ""}
        </p>
        <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight mb-1.5">
          {product.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />
          {Number(product.soldCount) > 100 && (
            <StarRating rating={4.5} size="sm" showValue />
          )}
        </div>
      </div>
    </article>
  );
}
