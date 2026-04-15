import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { Category, Coupon, CreateCouponInput } from "../../backend";
import { DiscountType } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatTimestamp } from "../../lib/backend";

function useCoupons(activeOnly: boolean) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Coupon[]>({
    queryKey: ["admin", "coupons", activeOnly],
    queryFn: () => actor!.adminListCoupons(activeOnly),
    enabled: !!actor && !isFetching,
  });
}

function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => actor!.listCategories(),
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  validFrom: string;
  validTo: string;
  usageLimit: string;
  minOrderAmount: string;
  applicableCategories: string[];
  isActive: boolean;
}

function couponToForm(c: Coupon): CouponFormData {
  return {
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue.toString(),
    validFrom: new Date(Number(c.validFrom / 1_000_000n))
      .toISOString()
      .slice(0, 16),
    validTo: new Date(Number(c.validTo / 1_000_000n))
      .toISOString()
      .slice(0, 16),
    usageLimit: c.usageLimit?.toString() ?? "",
    minOrderAmount: c.minOrderAmount?.toString() ?? "",
    applicableCategories: c.applicableCategories.map((id) => id.toString()),
    isActive: c.isActive,
  };
}

const emptyForm: CouponFormData = {
  code: "",
  discountType: DiscountType.Percent,
  discountValue: "",
  validFrom: new Date().toISOString().slice(0, 16),
  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16),
  usageLimit: "",
  minOrderAmount: "",
  applicableCategories: [],
  isActive: true,
};

interface CouponFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: Coupon | null;
  categories: Category[];
}

function CouponFormModal({
  open,
  onClose,
  editing,
  categories,
}: CouponFormModalProps) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<CouponFormData>(
    editing ? couponToForm(editing) : emptyForm,
  );

  const set = (k: keyof CouponFormData, v: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleCategory = (id: string) => {
    set(
      "applicableCategories",
      form.applicableCategories.includes(id)
        ? form.applicableCategories.filter((c) => c !== id)
        : [...form.applicableCategories, id],
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const input: CreateCouponInput = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number.parseFloat(form.discountValue),
        validFrom: BigInt(new Date(form.validFrom).getTime()) * 1_000_000n,
        validTo: BigInt(new Date(form.validTo).getTime()) * 1_000_000n,
        usageLimit: form.usageLimit
          ? BigInt(Number.parseInt(form.usageLimit))
          : undefined,
        minOrderAmount: form.minOrderAmount
          ? Number.parseFloat(form.minOrderAmount)
          : undefined,
        applicableCategories: form.applicableCategories.map((id) => BigInt(id)),
      };
      if (editing) return actor.adminUpdateCoupon(editing.id, input);
      return actor.adminCreateCoupon(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success(editing ? "Coupon updated" : "Coupon created");
      onClose();
    },
    onError: () => toast.error("Failed to save coupon"),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.coupons.coupon_dialog"
      >
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="coup-code">Coupon Code *</Label>
            <Input
              id="coup-code"
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="SAVE20"
              className="font-mono uppercase"
              data-ocid="admin.coupons.code_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discount Type *</Label>
              <Select
                value={form.discountType}
                onValueChange={(v) => set("discountType", v as DiscountType)}
              >
                <SelectTrigger data-ocid="admin.coupons.discount_type_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscountType.Percent}>
                    Percentage (%)
                  </SelectItem>
                  <SelectItem value={DiscountType.Fixed}>
                    Fixed Amount ($)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coup-value">Discount Value *</Label>
              <Input
                id="coup-value"
                type="number"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder={
                  form.discountType === DiscountType.Percent ? "20" : "10.00"
                }
                data-ocid="admin.coupons.discount_value_input"
              />
            </div>
            <div>
              <Label htmlFor="coup-from">Valid From *</Label>
              <Input
                id="coup-from"
                type="datetime-local"
                value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)}
                data-ocid="admin.coupons.valid_from_input"
              />
            </div>
            <div>
              <Label htmlFor="coup-to">Valid To *</Label>
              <Input
                id="coup-to"
                type="datetime-local"
                value={form.validTo}
                onChange={(e) => set("validTo", e.target.value)}
                data-ocid="admin.coupons.valid_to_input"
              />
            </div>
            <div>
              <Label htmlFor="coup-limit">Usage Limit</Label>
              <Input
                id="coup-limit"
                type="number"
                value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)}
                placeholder="Unlimited"
                data-ocid="admin.coupons.usage_limit_input"
              />
            </div>
            <div>
              <Label htmlFor="coup-min">Min. Order Amount ($)</Label>
              <Input
                id="coup-min"
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => set("minOrderAmount", e.target.value)}
                placeholder="0.00"
                data-ocid="admin.coupons.min_order_input"
              />
            </div>
          </div>
          {categories.length > 0 && (
            <div>
              <Label className="mb-2 block">
                Applicable Categories (empty = all)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id.toString()}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`cat-${cat.id.toString()}`}
                      checked={form.applicableCategories.includes(
                        cat.id.toString(),
                      )}
                      onCheckedChange={() => toggleCategory(cat.id.toString())}
                      data-ocid={`admin.coupons.category_checkbox.${cat.id.toString()}`}
                    />
                    <Label
                      htmlFor={`cat-${cat.id.toString()}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              id="coup-active"
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", !!v)}
              data-ocid="admin.coupons.is_active_checkbox"
            />
            <Label htmlFor="coup-active">Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.coupons.coupon_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.code || !form.discountValue}
            data-ocid="admin.coupons.coupon_dialog.save_button"
          >
            {mutation.isPending ? "Saving…" : "Save Coupon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [activeOnly, setActiveOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [page, setPage] = useState(0);

  const coupons = useCoupons(activeOnly);
  const categories = useCategories();
  const PAGE_SIZE = 20;
  const paginated = (coupons.data ?? []).slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const deactivateMutation = useMutation({
    mutationFn: (id: bigint) => actor!.adminDeactivateCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon deactivated");
    },
    onError: () => toast.error("Failed to deactivate coupon"),
  });

  const totalRedemptions = (coupons.data ?? []).reduce(
    (sum, c) => sum + Number(c.usageCount),
    0,
  );

  return (
    <div className="space-y-5" data-ocid="admin.coupons.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Coupons
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage discount codes and promotions.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          data-ocid="admin.coupons.create_coupon_button"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Create Coupon
        </Button>
      </div>

      {/* Report summary */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-card border border-border rounded-xl p-4 shadow-card"
          data-ocid="admin.coupons.report_card"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Coupons
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {(coupons.data ?? []).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Redemptions
          </p>
          <p className="text-2xl font-display font-bold text-foreground">
            {totalRedemptions}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
        <div className="flex gap-1" data-ocid="admin.coupons.filter_tabs">
          <button
            type="button"
            onClick={() => {
              setActiveOnly(false);
              setPage(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!activeOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            data-ocid="admin.coupons.filter.all_tab"
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveOnly(true);
              setPage(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            data-ocid="admin.coupons.filter.active_tab"
          >
            Active Only
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.coupons.table"
      >
        {coupons.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Valid Period
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Usage
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((coupon, i) => (
                  <tr
                    key={coupon.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.coupons.table.row.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded text-xs">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {coupon.discountType === DiscountType.Percent
                        ? "Percent"
                        : "Fixed"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {coupon.discountType === DiscountType.Percent
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {formatTimestamp(coupon.validFrom)} —{" "}
                      {formatTimestamp(coupon.validTo)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      {coupon.usageCount.toString()}
                      {coupon.usageLimit
                        ? ` / ${coupon.usageLimit.toString()}`
                        : ""}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={
                          coupon.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditing(coupon);
                            setShowModal(true);
                          }}
                          data-ocid={`admin.coupons.edit_button.${i + 1}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        {coupon.isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() => deactivateMutation.mutate(coupon.id)}
                            data-ocid={`admin.coupons.deactivate_button.${i + 1}`}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.coupons.empty_state"
              >
                <Tag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No coupons found</p>
                <p className="text-sm mt-1">
                  Create your first coupon to get started.
                </p>
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
              data-ocid="admin.coupons.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={paginated.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 text-xs"
              data-ocid="admin.coupons.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <CouponFormModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          editing={editing}
          categories={categories.data ?? []}
        />
      )}
    </div>
  );
}
