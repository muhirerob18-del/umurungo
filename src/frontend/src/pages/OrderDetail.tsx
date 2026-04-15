import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  MapPin,
  Package,
  RefreshCcw,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { OrderStatus, PaymentMethod } from "../backend";
import { useCart } from "../hooks/use-cart";
import { useCancelOrder, useOrderDetail } from "../hooks/use-orders";
import { formatPrice, formatTimestamp } from "../lib/backend";

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground",
};

const PAYMENT_LABELS: Record<string, string> = {
  [PaymentMethod.Stripe]: "Credit / Debit Card",
  [PaymentMethod.PayPal]: "PayPal",
  [PaymentMethod.MtnMomo]: "MTN Mobile Money",
};

export default function OrderDetailPage() {
  const { orderId: orderIdParam } = useParams({ strict: false }) as {
    orderId?: string;
  };
  const orderId = orderIdParam ?? "";
  const { data: order, isLoading } = useOrderDetail(
    orderId ? BigInt(orderId) : undefined,
  );
  const cancelOrder = useCancelOrder();
  const { addItem } = useCart();

  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success("Order cancelled successfully.");
    } catch {
      toast.error("Failed to cancel order.");
    }
  };

  const handleReorder = () => {
    if (!order) return;
    for (const item of order.items) addItem(item.productId, item.quantity);
    toast.success("Items added to cart!");
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-36 mb-6" />
        <Skeleton className="h-24 rounded-xl mb-4" />
        <Skeleton className="h-48 rounded-xl mb-4" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="order_detail.error_state"
      >
        <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h1 className="text-xl font-display font-semibold mb-2">
          Order not found
        </h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const isPending = order.status === OrderStatus.Pending;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="order_detail.page">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/account/orders"
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="order_detail.back_link"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-display font-semibold">
          Order #{order.id.toString().padStart(6, "0")}
        </h1>
      </div>

      {/* Order header */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
          >
            {order.status}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatTimestamp(order.createdAt)}
          </span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">
            {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
          </span>
        </div>
        {order.trackingNumber && (
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
            <Truck className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Tracking Number</p>
              <p className="text-sm font-mono font-medium">
                {order.trackingNumber}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <h2 className="font-display font-semibold text-sm mb-4">
          {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
        </h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={item.productId.toString()}
              className="flex gap-3 items-center"
              data-ocid={`order_detail.item.${idx + 1}`}
            >
              <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl || "/assets/images/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 leading-snug">
                  {item.title}
                </p>
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
        <Separator className="my-4" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-primary">
              <span>
                Discount {order.couponCode && `(${order.couponCode})`}
              </span>
              <span>−{formatPrice(order.discountAmount)}</span>
            </div>
          )}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-display font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-sm">
            Delivery Address
          </h2>
        </div>
        <div className="text-sm space-y-0.5">
          <p className="font-medium">{order.shippingAddress.fullName}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.street}
          </p>
          <p className="text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
          <p className="text-muted-foreground">
            {order.shippingAddress.country}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleReorder}
          className="gap-2"
          data-ocid="order_detail.reorder_button"
        >
          <RefreshCcw className="h-4 w-4" />
          Reorder
        </Button>
        {isPending && (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={cancelOrder.isPending}
            className="gap-2 text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/5"
            data-ocid="order_detail.cancel_button"
          >
            <X className="h-4 w-4" />
            {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        )}
      </div>
    </div>
  );
}
