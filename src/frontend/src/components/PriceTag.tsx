import { cn } from "@/lib/utils";
import { formatPrice } from "../lib/backend";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: {
    price: "text-sm font-semibold",
    original: "text-xs",
    badge: "text-[10px] px-1 py-0.5",
  },
  md: {
    price: "text-base font-semibold",
    original: "text-sm",
    badge: "text-xs px-1.5 py-0.5",
  },
  lg: {
    price: "text-xl font-bold",
    original: "text-sm",
    badge: "text-xs px-2 py-1",
  },
};

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const styles = sizeMap[size];
  const hasSale = compareAtPrice !== undefined && compareAtPrice > price;
  const discountPct = hasSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn(
          styles.price,
          hasSale ? "text-destructive" : "text-foreground",
        )}
      >
        {formatPrice(price)}
      </span>
      {hasSale && (
        <>
          <span
            className={cn(
              styles.original,
              "text-muted-foreground line-through",
            )}
          >
            {formatPrice(compareAtPrice)}
          </span>
          <span
            className={cn(
              styles.badge,
              "rounded font-medium bg-destructive/10 text-destructive",
            )}
          >
            -{discountPct}%
          </span>
        </>
      )}
    </div>
  );
}
