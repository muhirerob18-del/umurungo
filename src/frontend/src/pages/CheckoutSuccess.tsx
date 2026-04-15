import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, ListOrdered, Package, ShoppingBag } from "lucide-react";
import { useOrderDetail } from "../hooks/use-orders";
import { formatPrice, formatTimestamp } from "../lib/backend";

export default function CheckoutSuccessPage() {
  const search = useSearch({ strict: false }) as { orderId?: string };
  const orderId = search.orderId ? BigInt(search.orderId) : undefined;

  const { data: order, isLoading } = useOrderDetail(orderId);

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-16 text-center"
      data-ocid="checkout_success.page"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl font-display font-semibold mb-2">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      {order && (
        <p className="text-sm font-medium text-foreground mb-6">
          Order #{order.id.toString().padStart(6, "0")}
        </p>
      )}

      <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm text-muted-foreground mb-10">
        <Package className="h-4 w-4 text-primary" />
        Estimated delivery: 3–7 business days
      </div>

      {/* Order summary */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-5 text-left mb-8">
          <Skeleton className="h-5 w-40 mb-4" />
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-14 mb-3 rounded-lg" />
          ))}
        </div>
      ) : order ? (
        <div className="bg-card border border-border rounded-xl p-5 text-left mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm">
              Order Summary
            </h2>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(order.createdAt)}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div
                key={item.productId.toString()}
                className="flex gap-3 items-center"
                data-ocid={`checkout_success.item.${order.items.indexOf(item) + 1}`}
              >
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl || "/assets/images/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {Number(item.quantity)}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(item.price * Number(item.quantity))}
                </span>
              </div>
            ))}
          </div>
          <Separator className="mb-3" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Discount</span>
                <span>−{formatPrice(order.discountAmount)}</span>
              </div>
            )}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-display font-semibold">
            <span>Total Paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Ships To
            </p>
            <p className="text-sm font-medium">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <Button
            asChild
            variant="outline"
            data-ocid="checkout_success.track_order_button"
          >
            <Link
              to="/account/orders/$orderId"
              params={{ orderId: order.id.toString() }}
            >
              <Package className="h-4 w-4 mr-2" />
              Track Order
            </Link>
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          data-ocid="checkout_success.view_orders_button"
        >
          <Link to="/account/orders">
            <ListOrdered className="h-4 w-4 mr-2" />
            View All Orders
          </Link>
        </Button>
        <Button asChild data-ocid="checkout_success.continue_shopping_button">
          <Link to="/">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
