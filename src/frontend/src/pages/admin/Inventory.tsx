import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Package, Search, Warehouse } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { LowStockAlert, Product } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";

function useAdminProducts(search: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["admin", "inventory-products", search],
    queryFn: () =>
      actor!.listProducts(
        {
          inStockOnly: false,
          tags: [],
          searchTerm: search || undefined,
          isActive: undefined,
          categoryId: undefined,
          subcategoryId: undefined,
          minPrice: undefined,
          maxPrice: undefined,
        },
        0n,
        50n,
      ),
    enabled: !!actor && !isFetching,
  });
}

function useLowStockAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LowStockAlert[]>({
    queryKey: ["admin", "low-stock"],
    queryFn: () => actor!.adminGetLowStockAlerts(),
    enabled: !!actor && !isFetching,
  });
}

interface StockAdjustModalProps {
  productId: bigint;
  productTitle: string;
  currentStock: bigint;
  onClose: () => void;
}

function StockAdjustModal({
  productId,
  productTitle,
  currentStock,
  onClose,
}: StockAdjustModalProps) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [delta, setDelta] = useState("0");
  const [mode, setMode] = useState<"delta" | "set">("set");

  const mutation = useMutation({
    mutationFn: () => {
      if (!actor) throw new Error("No actor");
      const val = BigInt(Number.parseInt(delta));
      const adjustedDelta = mode === "set" ? val - currentStock : val;
      return actor.adminAdjustStock(productId, adjustedDelta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Stock updated");
      onClose();
    },
    onError: () => toast.error("Failed to update stock"),
  });

  const preview =
    mode === "set"
      ? Number.parseInt(delta)
      : Number(currentStock) + Number.parseInt(delta);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-ocid="admin.inventory.stock_adjust_dialog">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Product:{" "}
            <span className="font-medium text-foreground">{productTitle}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Current Stock:{" "}
            <span className="font-bold text-foreground">
              {currentStock.toString()}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("set")}
              className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${mode === "set" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              data-ocid="admin.inventory.set_mode_toggle"
            >
              Set Quantity
            </button>
            <button
              type="button"
              onClick={() => setMode("delta")}
              className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${mode === "delta" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              data-ocid="admin.inventory.delta_mode_toggle"
            >
              Add / Remove
            </button>
          </div>
          <div>
            <Label htmlFor="stock-val">
              {mode === "set" ? "New Quantity" : "Delta (+ add / - remove)"}
            </Label>
            <Input
              id="stock-val"
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              data-ocid="admin.inventory.stock_value_input"
            />
          </div>
          {delta !== "" && !Number.isNaN(Number.parseInt(delta)) && (
            <p className="text-sm text-muted-foreground">
              New stock will be:{" "}
              <span className="font-bold text-foreground">
                {Math.max(0, preview)}
              </span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.inventory.stock_adjust_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            data-ocid="admin.inventory.stock_adjust_dialog.confirm_button"
          >
            {mutation.isPending ? "Updating…" : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<{
    id: bigint;
    title: string;
    stock: bigint;
  } | null>(null);

  const lowStock = useLowStockAlerts();
  const products = useAdminProducts(search);

  const outOfStock = (products.data ?? []).filter((p) => p.stock === 0n);
  const lowStockCount = lowStock.data?.length ?? 0;
  const totalProducts = (products.data ?? []).length;

  return (
    <div className="space-y-5" data-ocid="admin.inventory.page">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Inventory
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor stock levels and reorder alerts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="bg-card border border-border rounded-xl p-4 text-center shadow-card"
          data-ocid="admin.inventory.total_products_card"
        >
          <Warehouse className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">
            {totalProducts}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Products</p>
        </div>
        <div
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"
          data-ocid="admin.inventory.low_stock_card"
        >
          <AlertTriangle className="h-6 w-6 mx-auto text-amber-500 mb-2" />
          <p className="text-2xl font-display font-bold text-amber-700">
            {lowStockCount}
          </p>
          <p className="text-xs text-amber-600 mt-0.5">Low Stock Alerts</p>
        </div>
        <div
          className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center"
          data-ocid="admin.inventory.out_of_stock_card"
        >
          <Package className="h-6 w-6 mx-auto text-rose-500 mb-2" />
          <p className="text-2xl font-display font-bold text-rose-700">
            {outOfStock.length}
          </p>
          <p className="text-xs text-rose-600 mt-0.5">Out of Stock</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockCount > 0 && (
        <div
          className="bg-card border border-amber-200 rounded-xl overflow-hidden shadow-card"
          data-ocid="admin.inventory.low_stock_alerts_section"
        >
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="font-display font-semibold text-sm text-amber-800">
              Low Stock Alerts
            </h2>
          </div>
          {lowStock.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="divide-y divide-border">
              {(lowStock.data ?? []).map((alert, i) => (
                <div
                  key={alert.productId.toString()}
                  className="flex items-center gap-4 px-5 py-3"
                  data-ocid={`admin.inventory.low_stock_alert.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reorder point: {alert.reorderPoint.toString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-700">
                      {alert.stock.toString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      in stock
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs flex-shrink-0"
                    onClick={() =>
                      setAdjusting({
                        id: alert.productId,
                        title: alert.title,
                        stock: alert.stock,
                      })
                    }
                    data-ocid={`admin.inventory.adjust_stock_button.${i + 1}`}
                  >
                    Adjust
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Products Stock */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.inventory.products_table"
      >
        <div className="px-5 py-3 border-b border-border flex items-center gap-3">
          <h2 className="font-display font-semibold text-sm text-foreground flex-1">
            All Products
          </h2>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search products…"
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="admin.inventory.search_input"
            />
          </div>
        </div>
        {products.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    SKU
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Reorder Pt.
                  </th>
                  <th className="px-5 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(products.data ?? []).map((p, i) => {
                  const isLow = p.stock <= p.reorderPoint && p.stock > 0n;
                  const isOut = p.stock === 0n;
                  return (
                    <tr
                      key={p.id.toString()}
                      className="hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.inventory.products_table.row.${i + 1}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="h-8 w-8 rounded object-cover flex-shrink-0 bg-muted"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted flex-shrink-0" />
                          )}
                          <span className="font-medium text-foreground truncate max-w-48">
                            {p.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground hidden md:table-cell text-xs">
                        {p.sku}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`font-bold ${isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-foreground"}`}
                        >
                          {p.stock.toString()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">
                        {p.reorderPoint.toString()}
                      </td>
                      <td className="px-5 py-3 text-center text-xs">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() =>
                            setAdjusting({
                              id: p.id,
                              title: p.title,
                              stock: p.stock,
                            })
                          }
                          data-ocid={`admin.inventory.adjust_button.${i + 1}`}
                        >
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(products.data ?? []).length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.inventory.empty_state"
              >
                <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {adjusting && (
        <StockAdjustModal
          productId={adjusting.id}
          productTitle={adjusting.title}
          currentStock={adjusting.stock}
          onClose={() => setAdjusting(null)}
        />
      )}
    </div>
  );
}
