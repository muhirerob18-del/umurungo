import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Package, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type {
  Category,
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPrice, formatTimestamp } from "../../lib/backend";

const PAGE_SIZE = 20;

function useAdminProducts(
  page: number,
  searchTerm: string,
  categoryFilter: string,
  statusFilter: string,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: [
      "admin",
      "products",
      page,
      searchTerm,
      categoryFilter,
      statusFilter,
    ],
    queryFn: () =>
      actor!.listProducts(
        {
          inStockOnly: false,
          tags: [],
          searchTerm: searchTerm || undefined,
          categoryId: categoryFilter ? BigInt(categoryFilter) : undefined,
          isActive:
            statusFilter === "active"
              ? true
              : statusFilter === "inactive"
                ? false
                : undefined,
          minPrice: undefined,
          maxPrice: undefined,
          subcategoryId: undefined,
        },
        BigInt(page * PAGE_SIZE),
        BigInt(PAGE_SIZE),
      ),
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

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  reorderPoint: string;
  categoryId: string;
  subcategoryId: string;
  tags: string;
  images: string;
  isActive: boolean;
}

const emptyForm: ProductFormData = {
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
  isActive: true,
};

function productToForm(p: Product): ProductFormData {
  return {
    title: p.title,
    description: p.description,
    price: p.price.toString(),
    compareAtPrice: p.compareAtPrice?.toString() ?? "",
    sku: p.sku,
    stock: p.stock.toString(),
    reorderPoint: p.reorderPoint.toString(),
    categoryId: p.categoryId.toString(),
    subcategoryId: p.subcategoryId?.toString() ?? "",
    tags: p.tags.join(", "),
    images: p.images.join("\n"),
    isActive: p.isActive,
  };
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
  categories: Category[];
}

function ProductFormModal({
  open,
  onClose,
  editing,
  categories,
}: ProductFormModalProps) {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<ProductFormData>(
    editing ? productToForm(editing) : emptyForm,
  );

  const set = (k: keyof ProductFormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const selectedCategory = categories.find(
    (c) => c.id.toString() === form.categoryId,
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const images = form.images
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean)
        .slice(0, 5);
      if (editing) {
        const input: UpdateProductInput = {
          title: form.title,
          description: form.description,
          price: Number.parseFloat(form.price),
          compareAtPrice: form.compareAtPrice
            ? Number.parseFloat(form.compareAtPrice)
            : undefined,
          sku: form.sku,
          stock: BigInt(Number.parseInt(form.stock)),
          reorderPoint: BigInt(Number.parseInt(form.reorderPoint)),
          categoryId: BigInt(form.categoryId),
          subcategoryId: form.subcategoryId
            ? BigInt(form.subcategoryId)
            : undefined,
          tags,
          images,
          isActive: form.isActive,
        };
        return actor.adminUpdateProduct(editing.id, input);
      }
      const input: CreateProductInput = {
        title: form.title,
        description: form.description,
        price: Number.parseFloat(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number.parseFloat(form.compareAtPrice)
          : undefined,
        sku: form.sku,
        stock: BigInt(Number.parseInt(form.stock)),
        reorderPoint: BigInt(Number.parseInt(form.reorderPoint)),
        categoryId: BigInt(form.categoryId),
        subcategoryId: form.subcategoryId
          ? BigInt(form.subcategoryId)
          : undefined,
        tags,
        images,
        isActive: form.isActive,
      };
      return actor.adminCreateProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success(editing ? "Product updated" : "Product created");
      onClose();
    },
    onError: () => toast.error("Failed to save product"),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.products.product_dialog"
      >
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="prod-title">Title *</Label>
              <Input
                id="prod-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Product title"
                data-ocid="admin.products.title_input"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Product description"
                data-ocid="admin.products.description_textarea"
              />
            </div>
            <div>
              <Label htmlFor="prod-price">Price *</Label>
              <Input
                id="prod-price"
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                data-ocid="admin.products.price_input"
              />
            </div>
            <div>
              <Label htmlFor="prod-compare">Compare-at Price</Label>
              <Input
                id="prod-compare"
                type="number"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                placeholder="0.00"
                data-ocid="admin.products.compare_price_input"
              />
            </div>
            <div>
              <Label htmlFor="prod-sku">SKU *</Label>
              <Input
                id="prod-sku"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="SKU-001"
                data-ocid="admin.products.sku_input"
              />
            </div>
            <div>
              <Label htmlFor="prod-stock">Stock</Label>
              <Input
                id="prod-stock"
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                data-ocid="admin.products.stock_input"
              />
            </div>
            <div>
              <Label htmlFor="prod-reorder">Reorder Point</Label>
              <Input
                id="prod-reorder"
                type="number"
                value={form.reorderPoint}
                onChange={(e) => set("reorderPoint", e.target.value)}
                data-ocid="admin.products.reorder_point_input"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => {
                  set("categoryId", v);
                  set("subcategoryId", "");
                }}
              >
                <SelectTrigger data-ocid="admin.products.category_select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id.toString()} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCategory && selectedCategory.subcategories.length > 0 && (
              <div>
                <Label>Subcategory</Label>
                <Select
                  value={form.subcategoryId}
                  onValueChange={(v) => set("subcategoryId", v)}
                >
                  <SelectTrigger data-ocid="admin.products.subcategory_select">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subcategories.map((s) => (
                      <SelectItem key={s.id.toString()} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2">
              <Label htmlFor="prod-tags">Tags (comma-separated)</Label>
              <Input
                id="prod-tags"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="tag1, tag2, tag3"
                data-ocid="admin.products.tags_input"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="prod-images">
                Image URLs (one per line, max 5)
              </Label>
              <Textarea
                id="prod-images"
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
                rows={3}
                placeholder="https://example.com/image.jpg"
                data-ocid="admin.products.images_textarea"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="prod-active"
                checked={form.isActive}
                onCheckedChange={(v) => set("isActive", !!v)}
                data-ocid="admin.products.is_active_checkbox"
              />
              <Label htmlFor="prod-active">Active (visible in store)</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.products.product_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={
              mutation.isPending ||
              !form.title ||
              !form.price ||
              !form.sku ||
              !form.categoryId
            }
            data-ocid="admin.products.product_dialog.save_button"
          >
            {mutation.isPending ? "Saving…" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const products = useAdminProducts(page, search, categoryFilter, statusFilter);
  const categories = useCategories();

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor!.adminDeleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted");
      setDeletingId(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const bulkActiveMutation = useMutation({
    mutationFn: ({ ids, active }: { ids: bigint[]; active: boolean }) =>
      actor!.adminBulkSetActive(ids, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelected(new Set());
      toast.success("Bulk update done");
    },
    onError: () => toast.error("Bulk update failed"),
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allIds = (products.data ?? []).map((p) => p.id.toString());
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };
  const selectedBigInts = () => [...selected].map((id) => BigInt(id));

  return (
    <div className="space-y-5" data-ocid="admin.products.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your product catalog.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          data-ocid="admin.products.add_product_button"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Product
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            className="pl-8 h-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            data-ocid="admin.products.search_input"
          />
        </div>
        <Select
          value={categoryFilter || "all"}
          onValueChange={(v) => {
            setCategoryFilter(v === "all" ? "" : v);
            setPage(0);
          }}
        >
          <SelectTrigger
            className="w-40 h-9"
            data-ocid="admin.products.category_filter_select"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories.data ?? []).map((c) => (
              <SelectItem key={c.id.toString()} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => {
            setStatusFilter(v === "all" ? "" : v);
            setPage(0);
          }}
        >
          <SelectTrigger
            className="w-36 h-9"
            data-ocid="admin.products.status_filter_select"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg"
          data-ocid="admin.products.bulk_actions_panel"
        >
          <span className="text-sm font-medium text-primary">
            {selected.size} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() =>
              bulkActiveMutation.mutate({
                ids: selectedBigInts(),
                active: true,
              })
            }
            data-ocid="admin.products.bulk_activate_button"
          >
            Activate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() =>
              bulkActiveMutation.mutate({
                ids: selectedBigInts(),
                active: false,
              })
            }
            data-ocid="admin.products.bulk_deactivate_button"
          >
            Deactivate
          </Button>
          <button
            type="button"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.products.table"
      >
        {products.isLoading ? (
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
                      data-ocid="admin.products.select_all_checkbox"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Stock
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
                {(products.data ?? []).map((p, i) => {
                  const cat = (categories.data ?? []).find(
                    (c) => c.id === p.categoryId,
                  );
                  return (
                    <tr
                      key={p.id.toString()}
                      className="hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.products.table.row.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.has(p.id.toString())}
                          onCheckedChange={() => toggleSelect(p.id.toString())}
                          data-ocid={`admin.products.checkbox.${i + 1}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="h-9 w-9 rounded-md object-cover flex-shrink-0 bg-muted"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-md bg-muted flex-shrink-0" />
                          )}
                          <span className="font-medium text-foreground line-clamp-1">
                            {p.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {cat?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground hidden sm:table-cell">
                        {p.stock.toString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={
                            p.isActive
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditing(p);
                              setShowModal(true);
                            }}
                            data-ocid={`admin.products.edit_button.${i + 1}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() => setDeletingId(p.id)}
                            data-ocid={`admin.products.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(products.data ?? []).length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.products.empty_state"
              >
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No products found</p>
                <p className="text-sm mt-1">
                  Try adjusting your filters or add a new product.
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
              data-ocid="admin.products.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={(products.data ?? []).length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 text-xs"
              data-ocid="admin.products.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductFormModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          editing={editing}
          categories={categories.data ?? []}
        />
      )}

      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(o) => !o && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="admin.products.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.products.delete_dialog.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.products.delete_dialog.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
