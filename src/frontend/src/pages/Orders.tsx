import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  LogIn,
  Package,
} from "lucide-react";
import { useState } from "react";
import { OrderStatus } from "../backend";
import { useAuth } from "../hooks/use-auth";
import { useMyOrders } from "../hooks/use-orders";
import { formatPrice, formatTimestamp } from "../lib/backend";

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground",
};

export default function OrdersPage() {
  const { isAuthenticated, login } = useAuth();
  const [page, setPage] = useState(0);
  const { data: orders, isLoading } = useMyOrders(page, PAGE_SIZE);

  if (!isAuthenticated) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="orders.login_prompt"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <ListOrdered className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-display font-semibold mb-2">
          Sign in to view orders
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Access your complete order history.
        </p>
        <Button
          onClick={login}
          className="gap-2"
          data-ocid="orders.login_button"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-ocid="orders.page">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/account"
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="orders.back_link"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-display font-semibold">My Orders</h1>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`order-skeleton-row-${i + 1}`}
                className="h-20 rounded-lg"
              />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="py-16 text-center" data-ocid="orders.empty_state">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-medium mb-1">No orders yet</h2>
            <p className="text-sm text-muted-foreground mb-5">
              When you place orders, they'll appear here.
            </p>
            <Button asChild variant="outline" data-ocid="orders.browse_button">
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order, idx) => (
              <Link
                key={order.id.toString()}
                to="/account/orders/$orderId"
                params={{ orderId: order.id.toString() }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                data-ocid={`orders.item.${idx + 1}`}
              >
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={`${item.productId.toString()}-${i}`}
                      className="w-10 h-10 rounded-lg bg-muted border-2 border-card overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.imageUrl || "/assets/images/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Order #{order.id.toString().padStart(6, "0")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(order.createdAt)} · {order.items.length}{" "}
                    item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {orders && orders.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            data-ocid="orders.pagination_prev"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={orders.length < PAGE_SIZE}
            data-ocid="orders.pagination_next"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
