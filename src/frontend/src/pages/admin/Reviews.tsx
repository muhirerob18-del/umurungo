import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Search, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { Review } from "../../backend";
import { ReviewStatus } from "../../backend";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatTimestamp } from "../../lib/backend";

const PAGE_SIZE = 20;

function usePendingReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Review[]>({
    queryKey: ["admin", "pending-reviews"],
    queryFn: () => actor!.adminGetPendingReviews(),
    enabled: !!actor && !isFetching,
  });
}

const STATUS_COLORS: Record<ReviewStatus, string> = {
  [ReviewStatus.Pending]: "bg-amber-100 text-amber-700",
  [ReviewStatus.Approved]: "bg-emerald-100 text-emerald-700",
  [ReviewStatus.Rejected]: "bg-rose-100 text-rose-700",
};

function StarDisplay({ rating }: { rating: bigint }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= Number(rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onModerate: (status: ReviewStatus) => void;
  isLoading: boolean;
}

function ReviewDetailModal({
  review,
  onClose,
  onModerate,
  isLoading,
}: ReviewDetailModalProps) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        data-ocid="admin.reviews.review_detail_dialog"
      >
        <DialogHeader>
          <DialogTitle>Review Detail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Product ID:{" "}
                <span className="font-medium text-foreground">
                  {review.productId.toString()}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimestamp(review.createdAt)}
              </p>
            </div>
            <Badge className={STATUS_COLORS[review.status]}>
              {review.status}
            </Badge>
          </div>
          <StarDisplay rating={review.rating} />
          <div>
            <p className="font-semibold text-foreground">{review.title}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {review.comment}
            </p>
          </div>
          {review.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.images.map((img, idx) => (
                <img
                  key={idx.toString()}
                  src={img}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover bg-muted"
                />
              ))}
            </div>
          )}
          {review.status === ReviewStatus.Pending && (
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onModerate(ReviewStatus.Approved)}
                disabled={isLoading}
                data-ocid="admin.reviews.review_detail_dialog.approve_button"
              >
                <Check className="h-4 w-4 mr-1.5" /> Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/5"
                onClick={() => onModerate(ReviewStatus.Rejected)}
                disabled={isLoading}
                data-ocid="admin.reviews.review_detail_dialog.reject_button"
              >
                <X className="h-4 w-4 mr-1.5" /> Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const { actor } = useActor(createActor);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [detailReview, setDetailReview] = useState<Review | null>(null);
  const [page, setPage] = useState(0);

  const reviews = usePendingReviews();

  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: ReviewStatus }) =>
      actor!.adminModerateReview(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "pending-reviews"] });
      toast.success("Review moderated");
      setDetailReview(null);
    },
    onError: () => toast.error("Failed to moderate review"),
  });

  const filtered = (reviews.data ?? []).filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.productId.toString().includes(search);
    const matchesRating =
      ratingFilter === "all" ||
      Number(r.rating) === Number.parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-5" data-ocid="admin.reviews.page">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Moderate pending product reviews.
        </p>
      </div>

      {/* Summary */}
      <div
        className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
        data-ocid="admin.reviews.pending_count_card"
      >
        <Star className="h-6 w-6 text-amber-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            {(reviews.data ?? []).length} pending reviews
          </p>
          <p className="text-xs text-amber-600">
            All require moderation before appearing in the store.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search reviews…"
            className="pl-8 h-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            data-ocid="admin.reviews.search_input"
          />
        </div>
        <Select
          value={ratingFilter}
          onValueChange={(v) => {
            setRatingFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger
            className="w-36 h-9"
            data-ocid="admin.reviews.rating_filter_select"
          >
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} Star{n !== 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        data-ocid="admin.reviews.table"
      >
        {reviews.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Product ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Review
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Date
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
                {paginated.map((review, i) => (
                  <tr
                    key={review.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.reviews.table.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      #{review.productId.toString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-48">
                          {review.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {review.comment}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <StarDisplay rating={review.rating} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {formatTimestamp(review.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={`text-[10px] px-2 py-0 ${STATUS_COLORS[review.status]}`}
                      >
                        {review.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setDetailReview(review)}
                          data-ocid={`admin.reviews.view_button.${i + 1}`}
                        >
                          View
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() =>
                            moderateMutation.mutate({
                              id: review.id,
                              status: ReviewStatus.Approved,
                            })
                          }
                          disabled={moderateMutation.isPending}
                          aria-label="Approve"
                          data-ocid={`admin.reviews.approve_button.${i + 1}`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/5"
                          onClick={() =>
                            moderateMutation.mutate({
                              id: review.id,
                              status: ReviewStatus.Rejected,
                            })
                          }
                          disabled={moderateMutation.isPending}
                          aria-label="Reject"
                          data-ocid={`admin.reviews.reject_button.${i + 1}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginated.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.reviews.empty_state"
              >
                <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No pending reviews</p>
                <p className="text-sm mt-1">All reviews have been moderated.</p>
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
              data-ocid="admin.reviews.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={paginated.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 text-xs"
              data-ocid="admin.reviews.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {detailReview && (
        <ReviewDetailModal
          review={detailReview}
          onClose={() => setDetailReview(null)}
          onModerate={(status) =>
            moderateMutation.mutate({ id: detailReview.id, status })
          }
          isLoading={moderateMutation.isPending}
        />
      )}
    </div>
  );
}
