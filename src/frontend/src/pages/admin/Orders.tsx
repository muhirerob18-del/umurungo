import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { Order, OrderFilter } from "../../backend";
import { OrderStatus, PaymentMethod } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPrice, formatTimestamp } from "../../lib/backend";

const PAGE_SIZE = 20;

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-amber-100 text-amber-700",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-700",
  [OrderStatus.Delivered]: "bg-emerald-100 text-emerald-700",
  [OrderStatus.Cancelled]: "bg-rose-100 text-rose-700",
  [OrderStatus.Refunded]: "bg-muted text-muted-foreground",
};

const ALL_STATUSES = Object.values(OrderStatus);

function useAdminOrders(filter: OrderFilter, page: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order[]>({
    queryKey: ["admin", "orders", filter, page],
    queryFn: () =>
      actor!.adminListOrders(
        filter,
        BigInt(page * PAGE_SIZE),
        BigInt(PAGE_SIZE),
      ),
    enabled: !!actor && !isFetching,
  });
}

function exportOrdersCSV(orders: Order[]) {
  const rows = [
    ["Order #", "Customer", "Date", "Total", "Payment", "Status"],
    ...orders.map((o) => [
      o.id.toString(),
      o.shippingAddress.fullName,
      formatTimestamp(o.createdAt),
      o.total.toFixed(2),
      o.paymentMethod,
      o.status,
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface OrderDrawerProps {
  order: Order;
  onClose: () => void;
}

function OrderDetailDrawer({ order, onClose }: OrderDrawerProps) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? "",
  );

  const statusMutation = useMutation({
    mutationFn: () => actor!.adminUpdateOrderStatus(order.id, newStatus),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const trackingMutation = useMutation({
    mutationFn: () => actor!.adminSetTrackingNumber(order.id, trackingNumber),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Tracking number saved");
    },
    onError: () => toast.error("Failed to save tracking number"),
  });

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        className="w-full sm:max-w-lg overflow-y-auto"
        data-ocid="admin.orders.order_detail_sheet"
      >
        <SheetHeader>
          <SheetTitle>Order #{order.id.toString()}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 mt-5">
          {/* Status + tracking */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">
                Update Status
              </Label>
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as OrderStatus)}
              >
                <SelectTrigger data-ocid="admin.orders.status_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => statusMutation.mutate()}
                disabled={
                  statusMutation.isPending || newStatus === order.status
                }
                data-ocid="admin.orders.update_status_button"
              >
                {statusMutation.isPending ? "Updating…" : "Update Status"}
              </Button>
            </div>
            <Separator />
            <div>
              <Label
                htmlFor="tracking"
                className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
              >
                Tracking Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="1Z999AA10123456784"
                  data-ocid="admin.orders.tracking_number_input"
                />
                <Button
                  size="sm"
                  onClick={() => trackingMutation.mutate()}
                  disabled={trackingMutation.isPending}
                  data-ocid="admin.orders.save_tracking_button"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-2">
              Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx.toString()}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-10 w-10 rounded object-cover flex-shrink-0 bg-muted"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity.toString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * Number(item.quantity))}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-2">
              Shipping Address
            </h3>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
            <div className="flex justify-between">
              <span>Payment</span>
              <span className="font-medium text-foreground">
                {order.paymentMethod}
              </span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between">
                <span>Coupon</span>
                <span className="font-medium">{order.couponCode}</span>
              </div>
            )}
            {order.paymentReference && (
              <div className="flex justify-between">
                <span>Ref</span>
                <span className="font-medium truncate max-w-40">
                  {order.paymentReference}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Created</span>
              <span>{formatTimestamp(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  const filter: OrderFilter = {
    status: statusFilter || undefined,
    paymentMethod: undefined,
    toDate: undefined,
    fromDate: undefined,
    customerId: undefined,
  };

  const orders = useAdminOrders(filter, page);

  const bulkStatusMutation = useMutation({
    mutationFn: async ({
      ids,
      status,
    }: { ids: bigint[]; status: OrderStatus }) => {
      if (!actor) throw new Error("No actor");
      return Promise.all(
        ids.map((id) => actor.adminUpdateOrderStatus(id, status)),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      setSelected(new Set());
      toast.success("Orders updated");
    },
    onError: () => toast.error("Failed to update orders"),
  });

  const filtered = (orders.data ?? []).filter(
    (o) =>
      !search ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search),
  );

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allIds = filtered.map((o) => o.id.toString());
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };
  const selectedBigInts = () => [...selected].map((id) => BigInt(id));

  return (
    <div className="space-y-5" data-ocid="admin.orders.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage customer orders and fulfillment.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => exportOrdersCSV(orders.data ?? [])}
          data-ocid="admin.orders.export_csv_button"
        >
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or order #…"
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="admin.orders.search_input"
          />
        </div>
        <div
          className="flex gap-1 flex-wrap"
          data-ocid="admin.orders.status_filter_tabs"
        >
          <button
            type="button"
            onClick={() => {
              setStatusFilter("");
              setPage(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!statusFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            data-ocid="admin.orders.status_filter.all_tab"
          >
            All
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
              data-ocid={`admin.orders.status_filter.${s.toLowerCase()}_tab`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg"
          data-ocid="admin.orders.bulk_actions_panel"
        >
          <span className="text-sm font-medium text-primary">
            {selected.size} selected
          </span>
          <Select
            onValueChange={(v) =>
              bulkStatusMutation.mutate({
                ids: selectedBigInts(),
                status: v as OrderStatus,
              })
            }
          >
            <SelectTrigger
              className="h-7 w-44 text-xs"
              data-ocid="admin.orders.bulk_status_select"
            >
              <SelectValue placeholder="Update status…" />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.orders.table"
      >
        {orders.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-10 px-4 py-3">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      data-ocid="admin.orders.select_all_checkbox"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order, i) => (
                  <tr
                    key={order.id.toString()}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setDetailOrder(order)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setDetailOrder(order)
                    }
                    data-ocid={`admin.orders.table.row.${i + 1}`}
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(order.id.toString())}
                        onCheckedChange={() =>
                          toggleSelect(order.id.toString())
                        }
                        data-ocid={`admin.orders.checkbox.${i + 1}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      #{order.id.toString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {order.shippingAddress.fullName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {formatTimestamp(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge className="bg-muted text-muted-foreground text-[10px]">
                        {order.paymentMethod === PaymentMethod.MtnMomo
                          ? "MTN MOMO"
                          : order.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={`text-[10px] px-2 py-0 ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailOrder(order);
                        }}
                        data-ocid={`admin.orders.view_button.${i + 1}`}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.orders.empty_state"
              >
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders found</p>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Page {page + 1}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-7 text-xs"
              data-ocid="admin.orders.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={(orders.data ?? []).length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 text-xs"
              data-ocid="admin.orders.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {detailOrder && (
        <OrderDetailDrawer
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
        />
      )}
    </div>
  );
}
