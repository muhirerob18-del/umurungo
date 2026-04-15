import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createActor } from "../../backend";
import type { RevenueByPeriod, TopProduct } from "../../backend";
import { AnalyticsPeriod } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPrice } from "../../lib/backend";

type PeriodKey = "day" | "week" | "month" | "year";

const PERIOD_CONFIG: Record<
  PeriodKey,
  { label: string; analPeriod: AnalyticsPeriod; count: bigint }
> = {
  day: { label: "Daily (30d)", analPeriod: AnalyticsPeriod.Day, count: 30n },
  week: { label: "Weekly (12w)", analPeriod: AnalyticsPeriod.Week, count: 12n },
  month: {
    label: "Monthly (12m)",
    analPeriod: AnalyticsPeriod.Month,
    count: 12n,
  },
  year: { label: "Yearly (3y)", analPeriod: AnalyticsPeriod.Year, count: 3n },
};

function useRevenue(period: PeriodKey) {
  const { actor, isFetching } = useActor(createActor);
  const cfg = PERIOD_CONFIG[period];
  return useQuery<RevenueByPeriod[]>({
    queryKey: ["admin", "analytics", "revenue", period],
    queryFn: () => actor!.adminGetRevenueByPeriod(cfg.analPeriod, cfg.count),
    enabled: !!actor && !isFetching,
  });
}

function useTopProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TopProduct[]>({
    queryKey: ["admin", "analytics", "top-products"],
    queryFn: () => actor!.adminGetTopProducts(10n),
    enabled: !!actor && !isFetching,
  });
}

function exportCSV(revenue: RevenueByPeriod[]) {
  const rows = [
    ["Period", "Revenue", "Orders"],
    ...revenue.map((r) => [
      r.period,
      r.revenue.toFixed(2),
      r.orderCount.toString(),
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const revenue = useRevenue(period);
  const topProducts = useTopProducts();

  const revenueData = (revenue.data ?? []).map((r) => ({
    period: r.period,
    revenue: r.revenue,
    orders: Number(r.orderCount),
  }));

  const totalRevenue = revenueData.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = revenueData.reduce((s, r) => s + r.orders, 0);
  const avgRevenue =
    revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  const topProductsData = (topProducts.data ?? []).map((p) => ({
    title: p.title.length > 20 ? `${p.title.slice(0, 20)}…` : p.title,
    revenue: p.revenue,
    sold: Number(p.soldCount),
  }));

  return (
    <div className="space-y-6" data-ocid="admin.analytics.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Revenue trends, order patterns, and top performers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => exportCSV(revenue.data ?? [])}
          data-ocid="admin.analytics.export_csv_button"
        >
          <Download className="h-4 w-4 mr-1.5" /> Export Report
        </Button>
      </div>

      {/* Period Selector */}
      <div
        className="flex gap-1 bg-card border border-border rounded-xl p-3 w-fit"
        data-ocid="admin.analytics.period_filter_tabs"
      >
        {(
          Object.entries(PERIOD_CONFIG) as [
            PeriodKey,
            (typeof PERIOD_CONFIG)[PeriodKey],
          ][]
        ).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            data-ocid={`admin.analytics.period.${key}_tab`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="bg-card border border-border rounded-xl p-4 shadow-card"
          data-ocid="admin.analytics.total_revenue_card"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Revenue
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div
          className="bg-card border border-border rounded-xl p-4 shadow-card"
          data-ocid="admin.analytics.total_orders_card"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Orders
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {totalOrders.toLocaleString()}
          </p>
        </div>
        <div
          className="bg-card border border-border rounded-xl p-4 shadow-card"
          data-ocid="admin.analytics.avg_revenue_card"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Avg. Revenue / Period
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatPrice(avgRevenue)}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-card"
        data-ocid="admin.analytics.revenue_chart"
      >
        <h2 className="font-display font-semibold text-foreground mb-4">
          Revenue Over Time
        </h2>
        {revenue.isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={revenueData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="analyticsRevGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
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
                fill="url(#analyticsRevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders Chart */}
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-card"
        data-ocid="admin.analytics.orders_chart"
      >
        <h2 className="font-display font-semibold text-foreground mb-4">
          Order Count Over Time
        </h2>
        {revenue.isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={revenueData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
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
              />
              <Tooltip
                formatter={(v: number) => [v, "Orders"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.92 0.01 73)",
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="oklch(0.65 0.18 88)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products Bar Chart */}
      <div
        className="bg-card border border-border rounded-xl p-5 shadow-card"
        data-ocid="admin.analytics.top_products_chart"
      >
        <h2 className="font-display font-semibold text-foreground mb-4">
          Top Products by Revenue
        </h2>
        {topProducts.isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topProductsData}
              layout="vertical"
              margin={{ top: 4, right: 60, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.92 0.01 73)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "oklch(0.45 0.01 240)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fontSize: 11, fill: "oklch(0.45 0.01 240)" }}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                formatter={(v: number) => [formatPrice(v), "Revenue"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.92 0.01 73)",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="oklch(0.58 0.11 172)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        {(topProducts.data ?? []).length === 0 && !topProducts.isLoading && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No product data yet.
          </p>
        )}
      </div>
    </div>
  );
}
