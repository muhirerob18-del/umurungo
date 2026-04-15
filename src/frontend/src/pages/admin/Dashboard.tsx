import { Badge } from "@/components/ui/badge";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createActor } from "../../backend";
import { AnalyticsPeriod } from "../../backend";
import type {
  DashboardStats,
  Order,
  RevenueByPeriod,
  TopProduct,
} from "../../backend";
import { OrderStatus } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPrice, formatTimestamp } from "../../lib/backend";

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-primary/10 text-primary",
  [OrderStatus.Processing]: "bg-accent text-accent-foreground",
  [OrderStatus.Shipped]: "bg-secondary text-secondary-foreground",
  [OrderStatus.Delivered]: "bg-primary/15 text-primary",
  [OrderStatus.Cancelled]: "bg-destructive/10 text-destructive",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground",
};

type ChartPeriod = "7d" | "30d" | "12m";

function useAdminDashboard() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const stats = useQuery<DashboardStats | null>({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => actor!.adminGetDashboardStats(),
    enabled,
  });

  const topProducts = useQuery<TopProduct[]>({
    queryKey: ["admin", "top-products"],
    queryFn: () => actor!.adminGetTopProducts(5n),
    enabled,
  });

  const recentOrders = useQuery<Order[]>({
    queryKey: ["admin", "recent-orders"],
    queryFn: () =>
      actor!.adminListOrders(
        {
          status: undefined,
          paymentMethod: undefined,
          toDate: undefined,
          fromDate: undefined,
          customerId: undefined,
        },
        0n,
        5n,
      ),
    enabled,
  });

  return { stats, topProducts, recentOrders };
}

function useRevenueChart(period: ChartPeriod) {
  const { actor, isFetching } = useActor(createActor);

  const config: Record<
    ChartPeriod,
    { analPeriod: AnalyticsPeriod; count: bigint }
  > = {
    "7d": { analPeriod: AnalyticsPeriod.Day, count: 7n },
    "30d": { analPeriod: AnalyticsPeriod.Day, count: 30n },
    "12m": { analPeriod: AnalyticsPeriod.Month, count: 12n },
  };

  return useQuery<RevenueByPeriod[]>({
    queryKey: ["admin", "revenue", period],
    queryFn: () =>
      actor!.adminGetRevenueByPeriod(
        config[period].analPeriod,
        config[period].count,
      ),
    enabled: !!actor && !isFetching,
  });
}

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function KpiCard({ label, value, sub, icon, accent }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border p-5 flex gap-4 items-start shadow-card bg-card">
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-display font-bold text-foreground leading-tight">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, topProducts, recentOrders } = useAdminDashboard();
  const [period, setPeriod] = useState<ChartPeriod>("30d");
  const revenue = useRevenueChart(period);

  const s = stats.data;
  const chartData = (revenue.data ?? []).map((r) => ({
    period: r.period,
    revenue: r.revenue,
    orders: Number(r.orderCount),
  }));

  return (
    <div className="space-y-6" data-ocid="admin.dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back — here's what's happening today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {stats.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="admin.dashboard.kpi_section"
        >
          <KpiCard
            label="Total Revenue"
            value={formatPrice(s?.totalRevenue ?? 0)}
            sub="vs last month"
            icon={<TrendingUp className="h-5 w-5" />}
            accent
          />
          <KpiCard
            label="Total Orders"
            value={(s?.totalOrders ?? 0n).toString()}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
          <KpiCard
            label="Total Users"
            value={(s?.totalUsers ?? 0n).toString()}
            icon={<Users className="h-5 w-5" />}
          />
          <KpiCard
            label="Total Products"
            value={(s?.totalProducts ?? 0n).toString()}
            icon={<Package className="h-5 w-5" />}
          />
        </div>
      )}

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
          data-ocid="admin.dashboard.pending_orders_card"
        >
          <Clock className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-primary font-medium">Pending Orders</p>
            <p className="text-xl font-display font-bold text-foreground">
              {(s?.pendingOrders ?? 0n).toString()}
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="ml-auto text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div
          className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-center gap-3"
          data-ocid="admin.dashboard.low_stock_card"
        >
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-xs text-destructive font-medium">
              Low Stock Items
            </p>
            <p className="text-xl font-display font-bold text-foreground">
              {(s?.lowStockCount ?? 0n).toString()}
            </p>
          </div>
          <Link
            to="/admin/inventory"
            className="ml-auto text-xs text-destructive hover:underline flex items-center gap-0.5"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Revenue Chart */}
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-card"
        data-ocid="admin.dashboard.revenue_chart"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground">
            Revenue Overview
          </h2>
          <div className="flex gap-1" data-ocid="admin.dashboard.period_tabs">
            {(["7d", "30d", "12m"] as ChartPeriod[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPeriod(p)}
                data-ocid={`admin.dashboard.period.${p}_tab`}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "12 Months"}
              </button>
            ))}
          </div>
        </div>
        {revenue.isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.58 0.11 172)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.58 0.11 172)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.92 0.01 73)"
                vertical={false}
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: "oklch(0.45 0.01 240)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.45 0.01 240)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => [formatPrice(v), "Revenue"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.92 0.01 73)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.58 0.11 172)"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div
          className="bg-card border border-border rounded-xl p-5 shadow-card"
          data-ocid="admin.dashboard.top_products_section"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">
              Top Products
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-primary hover:underline flex items-center gap-0.5"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {topProducts.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-2">
              {(topProducts.data ?? []).map((p, i) => (
                <div
                  key={p.productId.toString()}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  data-ocid={`admin.dashboard.top_product.item.${i + 1}`}
                >
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.soldCount.toString()} sold
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(p.revenue)}
                  </span>
                </div>
              ))}
              {(topProducts.data ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No data yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div
          className="bg-card border border-border rounded-xl p-5 shadow-card"
          data-ocid="admin.dashboard.recent_orders_section"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:underline flex items-center gap-0.5"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentOrders.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-2">
              {(recentOrders.data ?? []).map((order, i) => (
                <div
                  key={order.id.toString()}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  data-ocid={`admin.dashboard.recent_order.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      #{order.id.toString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(order.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(order.total)}
                  </span>
                  <Badge
                    className={`text-[10px] px-2 py-0 ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </Badge>
                </div>
              ))}
              {(recentOrders.data ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-card"
        data-ocid="admin.dashboard.quick_actions_section"
      >
        <h2 className="font-display font-semibold text-foreground mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Add Product", to: "/admin/products" },
            { label: "View Orders", to: "/admin/orders" },
            { label: "Manage Inventory", to: "/admin/inventory" },
            { label: "Create Coupon", to: "/admin/coupons" },
            { label: "Manage Users", to: "/admin/users" },
            { label: "View Analytics", to: "/admin/analytics" },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="px-3 py-1.5 bg-muted hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-lg transition-colors"
              data-ocid={`admin.dashboard.quick_action.${a.label.toLowerCase().replace(/\s+/g, "_")}_link`}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
