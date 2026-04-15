import { i as useQueryClient, a as useActor, r as reactExports, j as jsxRuntimeExports, o as Star, S as Search, I as Input, v as LoadingSpinner, B as Badge, b as Button, J as ReviewStatus, X, p as useQuery, d as createActor } from "./index-CzdgUJ7r.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Bs2ys7v8.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Check } from "./select-CsMHjYVZ.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { f as formatTimestamp } from "./backend-BvEPXO-C.js";
import "./index-BzaPRzk_.js";
import "./index-y4qoz3wi.js";
import "./index-C_0r4B1t.js";
const PAGE_SIZE = 20;
function usePendingReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "pending-reviews"],
    queryFn: () => actor.adminGetPendingReviews(),
    enabled: !!actor && !isFetching
  });
}
const STATUS_COLORS = {
  [ReviewStatus.Pending]: "bg-amber-100 text-amber-700",
  [ReviewStatus.Approved]: "bg-emerald-100 text-emerald-700",
  [ReviewStatus.Rejected]: "bg-rose-100 text-rose-700"
};
function StarDisplay({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: `h-3.5 w-3.5 ${n <= Number(rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`
    },
    n
  )) });
}
function ReviewDetailModal({
  review,
  onClose,
  onModerate,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg",
      "data-ocid": "admin.reviews.review_detail_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review Detail" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Product ID:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: review.productId.toString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatTimestamp(review.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: STATUS_COLORS[review.status], children: review.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StarDisplay, { rating: review.rating }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: review.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed", children: review.comment })
          ] }),
          review.images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: review.images.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img,
              alt: "",
              className: "h-20 w-20 rounded-lg object-cover bg-muted"
            },
            idx.toString()
          )) }),
          review.status === ReviewStatus.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white",
                onClick: () => onModerate(ReviewStatus.Approved),
                disabled: isLoading,
                "data-ocid": "admin.reviews.review_detail_dialog.approve_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1.5" }),
                  " Approve"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "flex-1 border-destructive text-destructive hover:bg-destructive/5",
                onClick: () => onModerate(ReviewStatus.Rejected),
                disabled: isLoading,
                "data-ocid": "admin.reviews.review_detail_dialog.reject_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
                  " Reject"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function AdminReviewsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [search, setSearch] = reactExports.useState("");
  const [ratingFilter, setRatingFilter] = reactExports.useState("all");
  const [detailReview, setDetailReview] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(0);
  const reviews = usePendingReviews();
  const moderateMutation = useMutation({
    mutationFn: ({ id, status }) => actor.adminModerateReview(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "pending-reviews"] });
      ue.success("Review moderated");
      setDetailReview(null);
    },
    onError: () => ue.error("Failed to moderate review")
  });
  const filtered = (reviews.data ?? []).filter((r) => {
    const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()) || r.productId.toString().includes(search);
    const matchesRating = ratingFilter === "all" || Number(r.rating) === Number.parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.reviews.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Reviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Moderate pending product reviews." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3",
        "data-ocid": "admin.reviews.pending_count_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-6 w-6 text-amber-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-amber-800", children: [
              (reviews.data ?? []).length,
              " pending reviews"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600", children: "All require moderation before appearing in the store." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-48", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search reviews…",
            className: "pl-8 h-9",
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(0);
            },
            "data-ocid": "admin.reviews.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: ratingFilter,
          onValueChange: (v) => {
            setRatingFilter(v);
            setPage(0);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36 h-9",
                "data-ocid": "admin.reviews.rating_filter_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Ratings" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Ratings" }),
              [5, 4, 3, 2, 1].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: n.toString(), children: [
                n,
                " Star",
                n !== 1 ? "s" : ""
              ] }, n))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-card",
        "data-ocid": "admin.reviews.table",
        children: [
          reviews.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Product ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Review" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Rating" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: paginated.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/20 transition-colors",
                  "data-ocid": `admin.reviews.table.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground text-xs hidden md:table-cell", children: [
                      "#",
                      review.productId.toString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate max-w-48", children: review.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: review.comment })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StarDisplay, { rating: review.rating }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell", children: formatTimestamp(review.createdAt) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-[10px] px-2 py-0 ${STATUS_COLORS[review.status]}`,
                        children: review.status
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          className: "h-7 text-xs",
                          onClick: () => setDetailReview(review),
                          "data-ocid": `admin.reviews.view_button.${i + 1}`,
                          children: "View"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50",
                          onClick: () => moderateMutation.mutate({
                            id: review.id,
                            status: ReviewStatus.Approved
                          }),
                          disabled: moderateMutation.isPending,
                          "aria-label": "Approve",
                          "data-ocid": `admin.reviews.approve_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/5",
                          onClick: () => moderateMutation.mutate({
                            id: review.id,
                            status: ReviewStatus.Rejected
                          }),
                          disabled: moderateMutation.isPending,
                          "aria-label": "Reject",
                          "data-ocid": `admin.reviews.reject_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] }) })
                  ]
                },
                review.id.toString()
              )) })
            ] }),
            paginated.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-16 text-muted-foreground",
                "data-ocid": "admin.reviews.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No pending reviews" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "All reviews have been moderated." })
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
                  "data-ocid": "admin.reviews.pagination_prev",
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
                  "data-ocid": "admin.reviews.pagination_next",
                  children: "Next"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    detailReview && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReviewDetailModal,
      {
        review: detailReview,
        onClose: () => setDetailReview(null),
        onModerate: (status) => moderateMutation.mutate({ id: detailReview.id, status }),
        isLoading: moderateMutation.isPending
      }
    )
  ] });
}
export {
  AdminReviewsPage as default
};
