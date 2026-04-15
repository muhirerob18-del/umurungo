import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Product } from "../backend";
import { useCart } from "../hooks/use-cart";
import { formatPrice } from "../lib/backend";

export default function CartPage() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { items, products, setProduct, updateItem, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: [
      "cart-products",
      items.map((i) => i.productId.toString()).join(","),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const fetched: Product[] = [];
      for (const item of items) {
        const p = await actor.getProduct(item.productId);
        if (p) {
          setProduct(p);
          fetched.push(p);
        }
      }
      return fetched;
    },
    enabled: !!actor && !actorFetching && items.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId.toString()];
    return p ? sum + p.price * Number(item.quantity) : sum;
  }, 0);
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !actor) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const categoryIds = items
        .map((i) => products[i.productId.toString()]?.categoryId)
        .filter(Boolean) as bigint[];
      const result = await actor.validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
        categoryIds,
      );
      if (result.isValid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: result.discountAmount,
        });
        toast.success(result.message || "Coupon applied!");
      } else {
        setCouponError(result.message || "Invalid coupon code.");
      }
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  if (isLoading && items.length > 0) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 py-10"
        data-ocid="cart.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 py-16 text-center"
        data-ocid="cart.empty_state"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display font-semibold mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Discover thousands of products across electronics, fashion, and more.
        </p>
        <Button asChild size="lg" data-ocid="cart.browse_button">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="cart.page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-semibold">Shopping Cart</h1>
        <span className="text-sm text-muted-foreground">
          {items.reduce((s, i) => s + Number(i.quantity), 0)} items
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, idx) => {
            const product = products[item.productId.toString()];
            const qty = Number(item.quantity);
            return (
              <div
                key={item.productId.toString()}
                className="flex gap-4 bg-card border border-border rounded-xl p-4 transition-smooth hover:shadow-subtle"
                data-ocid={`cart.item.${idx + 1}`}
              >
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={product?.images[0] || "/assets/images/placeholder.svg"}
                    alt={product?.title ?? "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        {product?.tags[0] ?? ""}
                      </p>
                      <h3 className="font-medium text-sm leading-snug line-clamp-2">
                        {product?.title ?? "Loading..."}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
                      aria-label="Remove item"
                      data-ocid={`cart.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.productId, BigInt(qty - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                        data-ocid={`cart.qty_minus.${idx + 1}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.productId, BigInt(qty + 1))
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                        data-ocid={`cart.qty_plus.${idx + 1}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">
                      {product ? formatPrice(product.price * qty) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/"
            className="text-sm text-primary hover:underline flex items-center gap-1 pt-2"
            data-ocid="cart.continue_shopping_link"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-4">
          <h2 className="font-display font-semibold mb-4">Order Summary</h2>

          {/* Promo Code */}
          {!appliedCoupon ? (
            <div className="mb-4">
              <label
                htmlFor="cart-coupon"
                className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 block"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="cart-coupon"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  placeholder="Enter code"
                  className="text-sm h-9"
                  data-ocid="cart.coupon_input"
                  onKeyDown={(e) => e.key === "Enter" && handleValidateCoupon()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleValidateCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  data-ocid="cart.coupon_apply_button"
                >
                  <Tag className="h-3.5 w-3.5" />
                </Button>
              </div>
              {couponError && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="cart.coupon_error_state"
                >
                  {couponError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {appliedCoupon.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove coupon"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <Separator className="mb-4" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-primary">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-display font-semibold text-base mb-5">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => navigate({ to: "/checkout" })}
            data-ocid="cart.checkout_button"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
