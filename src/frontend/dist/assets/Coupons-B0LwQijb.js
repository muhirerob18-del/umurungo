import { i as useQueryClient, a as useActor, r as reactExports, j as jsxRuntimeExports, b as Button, v as LoadingSpinner, D as DiscountType, B as Badge, T as Tag, p as useQuery, I as Input, d as createActor } from "./index-CzdgUJ7r.js";
import { C as Checkbox } from "./checkbox-Cvz2ET_k.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bs2ys7v8.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CsMHjYVZ.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { f as formatTimestamp } from "./backend-BvEPXO-C.js";
import { P as Plus } from "./plus-DGDwjsZ6.js";
import { P as Pen } from "./pen-Cr24hhcN.js";
import "./index-y4qoz3wi.js";
import "./index-C_0r4B1t.js";
import "./index-BzaPRzk_.js";
import "./index-CEjBcvQ_.js";
function useCoupons(activeOnly) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "coupons", activeOnly],
    queryFn: () => actor.adminListCoupons(activeOnly),
    enabled: !!actor && !isFetching
  });
}
function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => actor.listCategories(),
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1e3
  });
}
function couponToForm(c) {
  var _a, _b;
  return {
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue.toString(),
    validFrom: new Date(Number(c.validFrom / 1000000n)).toISOString().slice(0, 16),
    validTo: new Date(Number(c.validTo / 1000000n)).toISOString().slice(0, 16),
    usageLimit: ((_a = c.usageLimit) == null ? void 0 : _a.toString()) ?? "",
    minOrderAmount: ((_b = c.minOrderAmount) == null ? void 0 : _b.toString()) ?? "",
    applicableCategories: c.applicableCategories.map((id) => id.toString()),
    isActive: c.isActive
  };
}
const emptyForm = {
  code: "",
  discountType: DiscountType.Percent,
  discountValue: "",
  validFrom: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 16),
  usageLimit: "",
  minOrderAmount: "",
  applicableCategories: [],
  isActive: true
};
function CouponFormModal({
  open,
  onClose,
  editing,
  categories
}) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState(
    editing ? couponToForm(editing) : emptyForm
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCategory = (id) => {
    set(
      "applicableCategories",
      form.applicableCategories.includes(id) ? form.applicableCategories.filter((c) => c !== id) : [...form.applicableCategories, id]
    );
  };
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const input = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number.parseFloat(form.discountValue),
        validFrom: BigInt(new Date(form.validFrom).getTime()) * 1000000n,
        validTo: BigInt(new Date(form.validTo).getTime()) * 1000000n,
        usageLimit: form.usageLimit ? BigInt(Number.parseInt(form.usageLimit)) : void 0,
        minOrderAmount: form.minOrderAmount ? Number.parseFloat(form.minOrderAmount) : void 0,
        applicableCategories: form.applicableCategories.map((id) => BigInt(id))
      };
      if (editing) return actor.adminUpdateCoupon(editing.id, input);
      return actor.adminCreateCoupon(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      ue.success(editing ? "Coupon updated" : "Coupon created");
      onClose();
    },
    onError: () => ue.error("Failed to save coupon")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "admin.coupons.coupon_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Coupon" : "Create Coupon" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-code", children: "Coupon Code *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "coup-code",
                value: form.code,
                onChange: (e) => set("code", e.target.value.toUpperCase()),
                placeholder: "SAVE20",
                className: "font-mono uppercase",
                "data-ocid": "admin.coupons.code_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Discount Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.discountType,
                  onValueChange: (v) => set("discountType", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.coupons.discount_type_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: DiscountType.Percent, children: "Percentage (%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: DiscountType.Fixed, children: "Fixed Amount ($)" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-value", children: "Discount Value *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "coup-value",
                  type: "number",
                  value: form.discountValue,
                  onChange: (e) => set("discountValue", e.target.value),
                  placeholder: form.discountType === DiscountType.Percent ? "20" : "10.00",
                  "data-ocid": "admin.coupons.discount_value_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-from", children: "Valid From *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "coup-from",
                  type: "datetime-local",
                  value: form.validFrom,
                  onChange: (e) => set("validFrom", e.target.value),
                  "data-ocid": "admin.coupons.valid_from_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-to", children: "Valid To *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "coup-to",
                  type: "datetime-local",
                  value: form.validTo,
                  onChange: (e) => set("validTo", e.target.value),
                  "data-ocid": "admin.coupons.valid_to_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-limit", children: "Usage Limit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "coup-limit",
                  type: "number",
                  value: form.usageLimit,
                  onChange: (e) => set("usageLimit", e.target.value),
                  placeholder: "Unlimited",
                  "data-ocid": "admin.coupons.usage_limit_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-min", children: "Min. Order Amount ($)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "coup-min",
                  type: "number",
                  value: form.minOrderAmount,
                  onChange: (e) => set("minOrderAmount", e.target.value),
                  placeholder: "0.00",
                  "data-ocid": "admin.coupons.min_order_input"
                }
              )
            ] })
          ] }),
          categories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block", children: "Applicable Categories (empty = all)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      id: `cat-${cat.id.toString()}`,
                      checked: form.applicableCategories.includes(
                        cat.id.toString()
                      ),
                      onCheckedChange: () => toggleCategory(cat.id.toString()),
                      "data-ocid": `admin.coupons.category_checkbox.${cat.id.toString()}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: `cat-${cat.id.toString()}`,
                      className: "text-sm font-normal cursor-pointer",
                      children: cat.name
                    }
                  )
                ]
              },
              cat.id.toString()
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "coup-active",
                checked: form.isActive,
                onCheckedChange: (v) => set("isActive", !!v),
                "data-ocid": "admin.coupons.is_active_checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coup-active", children: "Active" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin.coupons.coupon_dialog.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => mutation.mutate(),
              disabled: mutation.isPending || !form.code || !form.discountValue,
              "data-ocid": "admin.coupons.coupon_dialog.save_button",
              children: mutation.isPending ? "Saving…" : "Save Coupon"
            }
          )
        ] })
      ]
    }
  ) });
}
function AdminCouponsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [activeOnly, setActiveOnly] = reactExports.useState(false);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(0);
  const coupons = useCoupons(activeOnly);
  const categories = useCategories();
  const PAGE_SIZE = 20;
  const paginated = (coupons.data ?? []).slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );
  const deactivateMutation = useMutation({
    mutationFn: (id) => actor.adminDeactivateCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      ue.success("Coupon deactivated");
    },
    onError: () => ue.error("Failed to deactivate coupon")
  });
  const totalRedemptions = (coupons.data ?? []).reduce(
    (sum, c) => sum + Number(c.usageCount),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.coupons.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Coupons" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage discount codes and promotions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => {
            setEditing(null);
            setShowModal(true);
          },
          "data-ocid": "admin.coupons.create_coupon_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            " Create Coupon"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4 shadow-card",
          "data-ocid": "admin.coupons.report_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Total Coupons" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: (coupons.data ?? []).length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Total Redemptions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: totalRedemptions })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 bg-card border border-border rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", "data-ocid": "admin.coupons.filter_tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setActiveOnly(false);
            setPage(0);
          },
          className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!activeOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`,
          "data-ocid": "admin.coupons.filter.all_tab",
          children: "All"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setActiveOnly(true);
            setPage(0);
          },
          className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`,
          "data-ocid": "admin.coupons.filter.active_tab",
          children: "Active Only"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.coupons.table",
        children: [
          coupons.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Value" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Valid Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: paginated.map((coupon, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/20 transition-colors",
                  "data-ocid": `admin.coupons.table.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded text-xs", children: coupon.code }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs", children: coupon.discountType === DiscountType.Percent ? "Percent" : "Fixed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: coupon.discountType === DiscountType.Percent ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell", children: [
                      formatTimestamp(coupon.validFrom),
                      " —",
                      " ",
                      formatTimestamp(coupon.validTo)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right text-muted-foreground hidden md:table-cell", children: [
                      coupon.usageCount.toString(),
                      coupon.usageLimit ? ` / ${coupon.usageLimit.toString()}` : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
                        children: coupon.isActive ? "Active" : "Inactive"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-7 w-7",
                          onClick: () => {
                            setEditing(coupon);
                            setShowModal(true);
                          },
                          "data-ocid": `admin.coupons.edit_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
                        }
                      ),
                      coupon.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          className: "h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5",
                          onClick: () => deactivateMutation.mutate(coupon.id),
                          "data-ocid": `admin.coupons.deactivate_button.${i + 1}`,
                          children: "Deactivate"
                        }
                      )
                    ] }) })
                  ]
                },
                coupon.id.toString()
              )) })
            ] }),
            paginated.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-16 text-muted-foreground",
                "data-ocid": "admin.coupons.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No coupons found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Create your first coupon to get started." })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Page ",
              page + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: page === 0,
                  onClick: () => setPage((p) => Math.max(0, p - 1)),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.coupons.pagination_prev",
                  children: "Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: paginated.length < PAGE_SIZE,
                  onClick: () => setPage((p) => p + 1),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.coupons.pagination_next",
                  children: "Next"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CouponFormModal,
      {
        open: showModal,
        onClose: () => {
          setShowModal(false);
          setEditing(null);
        },
        editing,
        categories: categories.data ?? []
      }
    )
  ] });
}
export {
  AdminCouponsPage as default
};
