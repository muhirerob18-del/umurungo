import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  ListOrdered,
  LogIn,
  Package,
  User2,
} from "lucide-react";
import { OrderStatus } from "../backend";
import { useAuth } from "../hooks/use-auth";
import { useMyOrders } from "../hooks/use-orders";
import { formatPrice, formatTimestamp } from "../lib/backend";

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground",
};

const QUICK_LINKS = [
  {
    icon: ListOrdered,
    label: "My Orders",
    sub: "Track & manage orders",
    to: "/account/orders" as const,
    ocid: "account.orders_link",
  },
  {
    icon: Heart,
    label: "Wishlist",
    sub: "Saved items",
    to: "/account/wishlist" as const,
    ocid: "account.wishlist_link",
  },
  {
    icon: User2,
    label: "Profile",
    sub: "Account settings",
    to: "/account/profile" as const,
    ocid: "account.profile_link",
  },
];

export default function AccountPage() {
  const { isAuthenticated, profile, profileLoading, login } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders(0, 3);

  if (!isAuthenticated) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="account.login_prompt"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <User2 className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display font-semibold mb-2">
          Sign In to Your Account
        </h1>
        <p className="text-muted-foreground mb-8">
          Access your orders, wishlist, and account settings.
        </p>
        <Button
          size="lg"
          className="gap-2"
          onClick={login}
          data-ocid="account.login_button"
        >
          <LogIn className="h-4 w-4" />
          Sign In with Internet Identity
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-ocid="account.page">
      {/* Welcome header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        {profileLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-3.5 w-52" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-display font-semibold text-primary">
                {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold">
                Welcome back, {profile?.displayName ?? "Shopper"}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {QUICK_LINKS.map(({ icon: Icon, label, sub, to, ocid }) => (
          <Link
            key={to}
            to={to}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 hover:shadow-subtle transition-smooth group"
            data-ocid={ocid}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold">Recent Orders</h2>
          <Link
            to="/account/orders"
            className="text-sm text-primary hover:underline"
            data-ocid="account.view_all_orders_link"
          >
            View all
          </Link>
        </div>

        {ordersLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="account.orders_empty_state"
          >
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <Button asChild size="sm" className="mt-3" variant="outline">
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
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                data-ocid={`account.order.${idx + 1}`}
              >
                <div>
                  <p className="text-sm font-medium">
                    Order #{order.id.toString().padStart(6, "0")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(order.createdAt)} · {order.items.length}{" "}
                    item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
