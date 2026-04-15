import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { CreateReviewInput } from "../backend";
import { EmptyState } from "../components/EmptyState";
import { PriceTag } from "../components/PriceTag";
import { ProductCard } from "../components/ProductCard";
import { StarRating } from "../components/StarRating";
import { useAuth } from "../hooks/use-auth";
import { useCart } from "../hooks/use-cart";
import {
  useProduct,
  useProductRating,
  useProductReviews,
  useProducts,
} from "../hooks/use-products";
import { useWishlist } from "../hooks/use-wishlist";
import { formatTimestamp } from "../lib/backend";

function RatingBar({
  label,
  count,
  total,
}: {
  label: string;
  count: bigint;
  total: bigint;
}) {
  const pct = total > 0n ? (Number(count) / Number(total)) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-4 text-right text-muted-foreground">{label}</span>
      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-xs text-muted-foreground">
        {count.toString()}
      </span>
    </div>
  );
}

export default function ProductPage() {
  const { productId } = useParams({ strict: false }) as { productId?: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const { isAuthenticated, login } = useAuth();

  const productIdBig = productId ? BigInt(productId) : undefined;

  const { data: product, isLoading: productLoading } = useProduct(productIdBig);
  const { data: rating } = useProductRating(productIdBig);
  const { data: reviews = [] } = useProductReviews(productIdBig);
  const { data: similar = [] } = useProducts(
    { categoryId: product?.categoryId, inStockOnly: false, tags: [] },
    0,
    8,
  );

  const { addItem: addToCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    hasItem,
  } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isWishlisted = product ? hasItem(product.id) : false;
  const isOutOfStock = product ? product.stock <= 0n : false;

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart(product.id, BigInt(qty));
    toast.success(`${product.title} added to cart`);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product.id);
      toast.success("Added to wishlist");
    }
  };

  const handleSubmitReview = async () => {
    if (!actor || !product) return;
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!reviewComment.trim() || !reviewTitle.trim()) {
      toast.error("Please fill in title and comment");
      return;
    }
    setSubmitting(true);
    try {
      const input: CreateReviewInput = {
        productId: product.id,
        rating: BigInt(reviewRating),
        title: reviewTitle,
        comment: reviewComment,
        images: [],
      };
      await actor.submitReview(input);
      toast.success("Review submitted! It will appear after moderation.");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", product.id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-rating", product.id.toString()],
      });
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const prevImage = () =>
    setActiveImage((i) =>
      product ? (i === 0 ? product.images.length - 1 : i - 1) : 0,
    );
  const nextImage = () =>
    setActiveImage((i) =>
      product ? (i === product.images.length - 1 ? 0 : i + 1) : 0,
    );

  const similarProducts = similar
    .filter((p) => p.id.toString() !== productId)
    .slice(0, 4);

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or doesn't exist."
          action={{
            label: "Browse products",
            onClick: () => navigate({ to: "/search", search: { q: "" } }),
          }}
        />
      </div>
    );
  }

  const images =
    product.images.length > 0
      ? product.images
      : ["/assets/images/placeholder.svg"];
  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:text-foreground transition-colors"
            data-ocid="product.breadcrumb_home"
          >
            Home
          </button>
          <ChevronRight className="h-3 w-3" />
          {product.categoryId && (
            <>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/category/$categoryId",
                    params: { categoryId: product.categoryId.toString() },
                  })
                }
                className="hover:text-foreground transition-colors"
                data-ocid="product.breadcrumb_category"
              >
                Category
              </button>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-foreground font-medium line-clamp-1">
            {product.title}
          </span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div data-ocid="product.image_gallery">
            <div className="relative aspect-square bg-card rounded-2xl overflow-hidden border border-border mb-3 group">
              <img
                src={images[activeImage] ?? "/assets/images/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
              {discountPct > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs">
                  -{discountPct}% OFF
                </Badge>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-card shadow-subtle"
                    aria-label="Previous image"
                    data-ocid="product.gallery_prev"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-card shadow-subtle"
                    aria-label="Next image"
                    data-ocid="product.gallery_next"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img || `thumb-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                    data-ocid={`product.thumbnail.${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/images/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {isOutOfStock && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-destructive/10 text-destructive"
                >
                  Out of Stock
                </Badge>
              )}
              {!isOutOfStock && product.stock <= 5n && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-amber-100 text-amber-700"
                >
                  Only {product.stock.toString()} left
                </Badge>
              )}
            </div>

            <h1
              className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug"
              data-ocid="product.title"
            >
              {product.title}
            </h1>

            {rating && Number(rating.totalReviews) > 0 && (
              <div className="flex items-center gap-3">
                <StarRating
                  rating={rating.averageRating}
                  size="md"
                  showValue
                  reviewCount={Number(rating.totalReviews)}
                />
              </div>
            )}

            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg"
            />

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Description
              </h3>
              <p
                className="text-sm text-muted-foreground leading-relaxed"
                data-ocid="product.description"
              >
                {product.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                    data-ocid="product.qty_decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span
                    className="w-10 text-center text-sm font-semibold"
                    data-ocid="product.qty_display"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQty((q) => Math.min(q + 1, Number(product.stock)))
                    }
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                    disabled={isOutOfStock}
                    data-ocid="product.qty_increase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 font-medium"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  data-ocid="product.add_to_cart_button"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 px-0"
                  onClick={handleWishlist}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  data-ocid="product.wishlist_button"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-destructive text-destructive" : ""}`}
                  />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              SKU: <span className="font-mono">{product.sku}</span>
            </p>
          </div>
        </div>

        {/* Ratings & Reviews */}
        <section className="mb-16" data-ocid="product.reviews_section">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            Ratings &amp; Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border p-6">
              {rating && Number(rating.totalReviews) > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="font-display text-5xl font-bold text-foreground">
                      {rating.averageRating.toFixed(1)}
                    </div>
                    <StarRating
                      rating={rating.averageRating}
                      size="lg"
                      className="justify-center mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {rating.totalReviews.toString()} reviews
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star, i) => (
                      <RatingBar
                        key={star}
                        label={star.toString()}
                        count={rating.ratingCounts[4 - i] ?? 0n}
                        total={rating.totalReviews}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No reviews yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first to review!
                  </p>
                </div>
              )}
            </div>

            {/* Review list */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No reviews yet"
                  description="Share your experience with this product."
                />
              ) : (
                reviews.map((review, i) => (
                  <div
                    key={review.id.toString()}
                    className="bg-card rounded-xl border border-border p-5"
                    data-ocid={`product.review.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <StarRating rating={Number(review.rating)} size="sm" />
                        <h4 className="font-semibold text-sm text-foreground mt-1">
                          {review.title}
                        </h4>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTimestamp(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Write a review */}
          <div
            className="mt-8 bg-card rounded-2xl border border-border p-6"
            data-ocid="product.write_review_section"
          >
            <h3 className="font-display font-semibold text-foreground mb-5">
              Write a Review
            </h3>
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to leave a review
                </p>
                <Button onClick={login} data-ocid="product.review.login_button">
                  Sign in with Internet Identity
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-w-xl">
                {/* Star selector */}
                <fieldset className="border-0 p-0 m-0">
                  <legend className="text-sm font-medium text-foreground mb-2">
                    Rating
                  </legend>
                  <div
                    className="flex gap-1"
                    data-ocid="product.review.rating_select"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= reviewRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground/30 fill-muted-foreground/10"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="review-title"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="product.review.title_input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Comment
                  </label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us what you think about this product…"
                    rows={4}
                    className="resize-none"
                    data-ocid="product.review.comment_textarea"
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="gap-2"
                  data-ocid="product.review.submit_button"
                >
                  {submitting ? "Submitting…" : "Submit Review"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section data-ocid="product.similar_section">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((p, i) => (
                <ProductCard
                  key={p.id.toString()}
                  product={p}
                  index={i + 1}
                  onView={(prod) =>
                    navigate({
                      to: "/product/$productId",
                      params: { productId: prod.id.toString() },
                    })
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
