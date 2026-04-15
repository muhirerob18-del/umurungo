import { i as useQueryClient, a as useActor, r as reactExports, j as jsxRuntimeExports, b as Button, S as Search, I as Input, v as LoadingSpinner, B as Badge, s as Package, p as useQuery, d as createActor } from "./index-CzdgUJ7r.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BwpoPJR4.js";
import { C as Checkbox } from "./checkbox-Cvz2ET_k.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bs2ys7v8.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CsMHjYVZ.js";
import { T as Textarea } from "./textarea-D0qt3Q4n.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { a as formatPrice } from "./backend-BvEPXO-C.js";
import { P as Plus } from "./plus-DGDwjsZ6.js";
import { P as Pen } from "./pen-Cr24hhcN.js";
import { T as Trash2 } from "./trash-2-DjWRPbkV.js";
import "./index-y4qoz3wi.js";
import "./index-BzaPRzk_.js";
import "./index-C_0r4B1t.js";
import "./index-CEjBcvQ_.js";
const PAGE_SIZE = 20;
function useAdminProducts(page, searchTerm, categoryFilter, statusFilter) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [
      "admin",
      "products",
      page,
      searchTerm,
      categoryFilter,
      statusFilter
    ],
    queryFn: () => actor.listProducts(
      {
        inStockOnly: false,
        tags: [],
        searchTerm: searchTerm || void 0,
        categoryId: categoryFilter ? BigInt(categoryFilter) : void 0,
        isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : void 0,
        minPrice: void 0,
        maxPrice: void 0,
        subcategoryId: void 0
      },
      BigInt(page * PAGE_SIZE),
      BigInt(PAGE_SIZE)
    ),
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
const emptyForm = {
  title: "",
  description: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: "0",
  reorderPoint: "5",
  categoryId: "",
  subcategoryId: "",
  tags: "",
  images: "",
  isActive: true
};
function productToForm(p) {
  var _a, _b;
  return {
    title: p.title,
    description: p.description,
    price: p.price.toString(),
    compareAtPrice: ((_a = p.compareAtPrice) == null ? void 0 : _a.toString()) ?? "",
    sku: p.sku,
    stock: p.stock.toString(),
    reorderPoint: p.reorderPoint.toString(),
    categoryId: p.categoryId.toString(),
    subcategoryId: ((_b = p.subcategoryId) == null ? void 0 : _b.toString()) ?? "",
    tags: p.tags.join(", "),
    images: p.images.join("\n"),
    isActive: p.isActive
  };
}
function ProductFormModal({
  open,
  onClose,
  editing,
  categories
}) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState(
    editing ? productToForm(editing) : emptyForm
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const selectedCategory = categories.find(
    (c) => c.id.toString() === form.categoryId
  );
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const images = form.images.split("\n").map((u) => u.trim()).filter(Boolean).slice(0, 5);
      if (editing) {
        const input2 = {
          title: form.title,
          description: form.description,
          price: Number.parseFloat(form.price),
          compareAtPrice: form.compareAtPrice ? Number.parseFloat(form.compareAtPrice) : void 0,
          sku: form.sku,
          stock: BigInt(Number.parseInt(form.stock)),
          reorderPoint: BigInt(Number.parseInt(form.reorderPoint)),
          categoryId: BigInt(form.categoryId),
          subcategoryId: form.subcategoryId ? BigInt(form.subcategoryId) : void 0,
          tags,
          images,
          isActive: form.isActive
        };
        return actor.adminUpdateProduct(editing.id, input2);
      }
      const input = {
        title: form.title,
        description: form.description,
        price: Number.parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? Number.parseFloat(form.compareAtPrice) : void 0,
        sku: form.sku,
        stock: BigInt(Number.parseInt(form.stock)),
        reorderPoint: BigInt(Number.parseInt(form.reorderPoint)),
        categoryId: BigInt(form.categoryId),
        subcategoryId: form.subcategoryId ? BigInt(form.subcategoryId) : void 0,
        tags,
        images,
        isActive: form.isActive
      };
      return actor.adminCreateProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      ue.success(editing ? "Product updated" : "Product created");
      onClose();
    },
    onError: () => ue.error("Failed to save product")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] overflow-y-auto",
      "data-ocid": "admin.products.product_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Product" : "Add Product" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-title", children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-title",
                value: form.title,
                onChange: (e) => set("title", e.target.value),
                placeholder: "Product title",
                "data-ocid": "admin.products.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "prod-desc",
                value: form.description,
                onChange: (e) => set("description", e.target.value),
                rows: 3,
                placeholder: "Product description",
                "data-ocid": "admin.products.description_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-price", children: "Price *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-price",
                type: "number",
                value: form.price,
                onChange: (e) => set("price", e.target.value),
                placeholder: "0.00",
                "data-ocid": "admin.products.price_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-compare", children: "Compare-at Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-compare",
                type: "number",
                value: form.compareAtPrice,
                onChange: (e) => set("compareAtPrice", e.target.value),
                placeholder: "0.00",
                "data-ocid": "admin.products.compare_price_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-sku", children: "SKU *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-sku",
                value: form.sku,
                onChange: (e) => set("sku", e.target.value),
                placeholder: "SKU-001",
                "data-ocid": "admin.products.sku_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-stock", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-stock",
                type: "number",
                value: form.stock,
                onChange: (e) => set("stock", e.target.value),
                "data-ocid": "admin.products.stock_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-reorder", children: "Reorder Point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-reorder",
                type: "number",
                value: form.reorderPoint,
                onChange: (e) => set("reorderPoint", e.target.value),
                "data-ocid": "admin.products.reorder_point_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.categoryId,
                onValueChange: (v) => {
                  set("categoryId", v);
                  set("subcategoryId", "");
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.products.category_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id.toString())) })
                ]
              }
            )
          ] }),
          selectedCategory && selectedCategory.subcategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subcategory" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.subcategoryId,
                onValueChange: (v) => set("subcategoryId", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.products.subcategory_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select subcategory" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: selectedCategory.subcategories.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id.toString(), children: s.name }, s.id.toString())) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-tags", children: "Tags (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-tags",
                value: form.tags,
                onChange: (e) => set("tags", e.target.value),
                placeholder: "tag1, tag2, tag3",
                "data-ocid": "admin.products.tags_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-images", children: "Image URLs (one per line, max 5)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "prod-images",
                value: form.images,
                onChange: (e) => set("images", e.target.value),
                rows: 3,
                placeholder: "https://example.com/image.jpg",
                "data-ocid": "admin.products.images_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "prod-active",
                checked: form.isActive,
                onCheckedChange: (v) => set("isActive", !!v),
                "data-ocid": "admin.products.is_active_checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-active", children: "Active (visible in store)" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin.products.product_dialog.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => mutation.mutate(),
              disabled: mutation.isPending || !form.title || !form.price || !form.sku || !form.categoryId,
              "data-ocid": "admin.products.product_dialog.save_button",
              children: mutation.isPending ? "Saving…" : "Save Product"
            }
          )
        ] })
      ]
    }
  ) });
}
function AdminProductsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [page, setPage] = reactExports.useState(0);
  const [search, setSearch] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const products = useAdminProducts(page, search, categoryFilter, statusFilter);
  const categories = useCategories();
  const deleteMutation = useMutation({
    mutationFn: (id) => actor.adminDeleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      ue.success("Product deleted");
      setDeletingId(null);
    },
    onError: () => ue.error("Failed to delete product")
  });
  const bulkActiveMutation = useMutation({
    mutationFn: ({ ids, active }) => actor.adminBulkSetActive(ids, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelected(/* @__PURE__ */ new Set());
      ue.success("Bulk update done");
    },
    onError: () => ue.error("Bulk update failed")
  });
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const allIds = (products.data ?? []).map((p) => p.id.toString());
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const toggleAll = () => {
    if (allSelected) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(allIds));
  };
  const selectedBigInts = () => [...selected].map((id) => BigInt(id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.products.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage your product catalog." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => {
            setEditing(null);
            setShowModal(true);
          },
          "data-ocid": "admin.products.add_product_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            " Add Product"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-48", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search products…",
            className: "pl-8 h-9",
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(0);
            },
            "data-ocid": "admin.products.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: categoryFilter || "all",
          onValueChange: (v) => {
            setCategoryFilter(v === "all" ? "" : v);
            setPage(0);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-40 h-9",
                "data-ocid": "admin.products.category_filter_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Categories" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Categories" }),
              (categories.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id.toString()))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter || "all",
          onValueChange: (v) => {
            setStatusFilter(v === "all" ? "" : v);
            setPage(0);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36 h-9",
                "data-ocid": "admin.products.status_filter_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
            ] })
          ]
        }
      )
    ] }),
    selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg",
        "data-ocid": "admin.products.bulk_actions_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-primary", children: [
            selected.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs",
              onClick: () => bulkActiveMutation.mutate({
                ids: selectedBigInts(),
                active: true
              }),
              "data-ocid": "admin.products.bulk_activate_button",
              children: "Activate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs",
              onClick: () => bulkActiveMutation.mutate({
                ids: selectedBigInts(),
                active: false
              }),
              "data-ocid": "admin.products.bulk_deactivate_button",
              children: "Deactivate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ml-auto text-xs text-muted-foreground hover:text-foreground",
              onClick: () => setSelected(/* @__PURE__ */ new Set()),
              children: "Clear"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.products.table",
        children: [
          products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: allSelected,
                    onCheckedChange: toggleAll,
                    "data-ocid": "admin.products.select_all_checkbox"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "SKU" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Stock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: (products.data ?? []).map((p, i) => {
                const cat = (categories.data ?? []).find(
                  (c) => c.id === p.categoryId
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/20 transition-colors",
                    "data-ocid": `admin.products.table.row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          checked: selected.has(p.id.toString()),
                          onCheckedChange: () => toggleSelect(p.id.toString()),
                          "data-ocid": `admin.products.checkbox.${i + 1}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        p.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: p.images[0],
                            alt: p.title,
                            className: "h-9 w-9 rounded-md object-cover flex-shrink-0 bg-muted"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-md bg-muted flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground line-clamp-1", children: p.title })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: p.sku }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: (cat == null ? void 0 : cat.name) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatPrice(p.price) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-foreground hidden sm:table-cell", children: p.stock.toString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: p.isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                          children: p.isActive ? "Active" : "Inactive"
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
                              setEditing(p);
                              setShowModal(true);
                            },
                            "data-ocid": `admin.products.edit_button.${i + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "icon",
                            variant: "ghost",
                            className: "h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/5",
                            onClick: () => setDeletingId(p.id),
                            "data-ocid": `admin.products.delete_button.${i + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                          }
                        )
                      ] }) })
                    ]
                  },
                  p.id.toString()
                );
              }) })
            ] }),
            (products.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-16 text-muted-foreground",
                "data-ocid": "admin.products.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No products found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Try adjusting your filters or add a new product." })
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
                  "data-ocid": "admin.products.pagination_prev",
                  children: "Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  disabled: (products.data ?? []).length < PAGE_SIZE,
                  onClick: () => setPage((p) => p + 1),
                  className: "h-7 text-xs",
                  "data-ocid": "admin.products.pagination_next",
                  children: "Next"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormModal,
      {
        open: showModal,
        onClose: () => {
          setShowModal(false);
          setEditing(null);
        },
        editing,
        categories: categories.data ?? []
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deletingId !== null,
        onOpenChange: (o) => !o && setDeletingId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.products.delete_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Product?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone. The product will be permanently removed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.products.delete_dialog.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => deletingId && deleteMutation.mutate(deletingId),
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                "data-ocid": "admin.products.delete_dialog.confirm_button",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminProductsPage as default
};
