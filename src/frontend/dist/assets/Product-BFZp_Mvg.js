import { g as useParams, u as useNavigate, i as useQueryClient, a as useActor, k as useAuth, l as useCart, m as useWishlist, r as reactExports, j as jsxRuntimeExports, C as ChevronRight, B as Badge, b as Button, n as ShoppingCart, H as Heart, o as Star, d as createActor } from "./index-CzdgUJ7r.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { T as Textarea } from "./textarea-D0qt3Q4n.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { E as EmptyState } from "./EmptyState-BqKvqo8I.js";
import { P as PriceTag } from "./PriceTag-DWCNPjVR.js";
import { c as useProduct, d as useProductRating, e as useProductReviews, u as useProducts, S as StarRating, P as ProductCard } from "./use-products-C2b16iKm.js";
import { f as formatTimestamp } from "./backend-BvEPXO-C.js";
import { C as ChevronLeft } from "./chevron-left-BAeFkPTF.js";
import { M as Minus } from "./minus-C7AVbqFb.js";
import { P as Plus } from "./plus-DGDwjsZ6.js";
import "./index-CEjBcvQ_.js";
function RatingBar({
  label,
  count,
  total
}) {
  const pct = total > 0n ? Number(count) / Number(total) * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 text-right text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-yellow-400 fill-yellow-400 flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-yellow-400 rounded-full transition-all duration-500",
        style: { width: `${pct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-xs text-muted-foreground", children: count.toString() })
  ] });
}
function ProductPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const { isAuthenticated, login } = useAuth();
  const productIdBig = productId ? BigInt(productId) : void 0;
  const { data: product, isLoading: productLoading } = useProduct(productIdBig);
  const { data: rating } = useProductRating(productIdBig);
  const { data: reviews = [] } = useProductReviews(productIdBig);
  const { data: similar = [] } = useProducts(
    { categoryId: product == null ? void 0 : product.categoryId, inStockOnly: false, tags: [] },
    0,
    8
  );
  const { addItem: addToCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    hasItem
  } = useWishlist();
  const [activeImage, setActiveImage] = reactExports.useState(0);
  const [qty, setQty] = reactExports.useState(1);
  const [reviewRating, setReviewRating] = reactExports.useState(5);
  const [reviewTitle, setReviewTitle] = reactExports.useState("");
  const [reviewComment, setReviewComment] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const isWishlisted = product ? hasItem(product.id) : false;
  const isOutOfStock = product ? product.stock <= 0n : false;
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart(product.id, BigInt(qty));
    ue.success(`${product.title} added to cart`);
  };
  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      ue.success("Removed from wishlist");
    } else {
      addToWishlist(product.id);
      ue.success("Added to wishlist");
    }
  };
  const handleSubmitReview = async () => {
    if (!actor || !product) return;
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!reviewComment.trim() || !reviewTitle.trim()) {
      ue.error("Please fill in title and comment");
      return;
    }
    setSubmitting(true);
    try {
      const input = {
        productId: product.id,
        rating: BigInt(reviewRating),
        title: reviewTitle,
        comment: reviewComment,
        images: []
      };
      await actor.submitReview(input);
      ue.success("Review submitted! It will appear after moderation.");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", product.id.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: ["product-rating", product.id.toString()]
      });
    } catch {
      ue.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const prevImage = () => setActiveImage(
    (i) => product ? i === 0 ? product.images.length - 1 : i - 1 : 0
  );
  const nextImage = () => setActiveImage(
    (i) => product ? i === product.images.length - 1 ? 0 : i + 1 : 0
  );
  const similarProducts = similar.filter((p) => p.id.toString() !== productId).slice(0, 4);
  if (productLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
      ] })
    ] }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "Product not found",
        description: "This product may have been removed or doesn't exist.",
        action: {
          label: "Browse products",
          onClick: () => navigate({ to: "/search", search: { q: "" } })
        }
      }
    ) });
  }
  const images = product.images.length > 0 ? product.images : ["/assets/images/placeholder.svg"];
  const discountPct = product.compareAtPrice && product.compareAtPrice > product.price ? Math.round(
    (product.compareAtPrice - product.price) / product.compareAtPrice * 100
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/" }),
          className: "hover:text-foreground transition-colors",
          "data-ocid": "product.breadcrumb_home",
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
      product.categoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({
              to: "/category/$categoryId",
              params: { categoryId: product.categoryId.toString() }
            }),
            className: "hover:text-foreground transition-colors",
            "data-ocid": "product.breadcrumb_category",
            children: "Category"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium line-clamp-1", children: product.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "product.image_gallery", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-card rounded-2xl overflow-hidden border border-border mb-3 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: images[activeImage] ?? "/assets/images/placeholder.svg",
              alt: product.title,
              className: "w-full h-full object-cover",
              onError: (e) => {
                e.target.src = "/assets/images/placeholder.svg";
              }
            }
          ),
          discountPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs", children: [
            "-",
            discountPct,
            "% OFF"
          ] }),
          isOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-sm px-4 py-2", children: "Out of Stock" }) }),
          images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: prevImage,
                className: "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-card shadow-subtle",
                "aria-label": "Previous image",
                "data-ocid": "product.gallery_prev",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: nextImage,
                className: "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-card shadow-subtle",
                "aria-label": "Next image",
                "data-ocid": "product.gallery_next",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveImage(i),
            className: `flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary" : "border-transparent hover:border-border"}`,
            "data-ocid": `product.thumbnail.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: img,
                alt: `${product.title} view ${i + 1}`,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.src = "/assets/images/placeholder.svg";
                }
              }
            )
          },
          img || `thumb-${i}`
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          product.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-xs font-medium",
              children: tag
            },
            tag
          )),
          isOutOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-xs bg-destructive/10 text-destructive",
              children: "Out of Stock"
            }
          ),
          !isOutOfStock && product.stock <= 5n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs bg-amber-100 text-amber-700",
              children: [
                "Only ",
                product.stock.toString(),
                " left"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display text-2xl md:text-3xl font-bold text-foreground leading-snug",
            "data-ocid": "product.title",
            children: product.title
          }
        ),
        rating && Number(rating.totalReviews) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          StarRating,
          {
            rating: rating.averageRating,
            size: "md",
            showValue: true,
            reviewCount: Number(rating.totalReviews)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PriceTag,
          {
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            size: "lg"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-muted-foreground leading-relaxed",
              "data-ocid": "product.description",
              children: product.description
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border rounded-lg overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setQty((q) => Math.max(1, q - 1)),
                  className: "w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors",
                  "aria-label": "Decrease quantity",
                  "data-ocid": "product.qty_decrease",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-10 text-center text-sm font-semibold",
                  "data-ocid": "product.qty_display",
                  children: qty
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setQty((q) => Math.min(q + 1, Number(product.stock))),
                  className: "w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors",
                  "aria-label": "Increase quantity",
                  disabled: isOutOfStock,
                  "data-ocid": "product.qty_increase",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "flex-1 gap-2 font-medium",
                onClick: handleAddToCart,
                disabled: isOutOfStock,
                "data-ocid": "product.add_to_cart_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
                  isOutOfStock ? "Out of Stock" : "Add to Cart"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "w-12 px-0",
                onClick: handleWishlist,
                "aria-label": isWishlisted ? "Remove from wishlist" : "Add to wishlist",
                "data-ocid": "product.wishlist_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    className: `h-5 w-5 transition-colors ${isWishlisted ? "fill-destructive text-destructive" : ""}`
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "SKU: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: product.sku })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-16", "data-ocid": "product.reviews_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-6", children: "Ratings & Reviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-6", children: rating && Number(rating.totalReviews) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-bold text-foreground", children: rating.averageRating.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StarRating,
              {
                rating: rating.averageRating,
                size: "lg",
                className: "justify-center mt-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              rating.totalReviews.toString(),
              " reviews"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [5, 4, 3, 2, 1].map((star, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            RatingBar,
            {
              label: star.toString(),
              count: rating.ratingCounts[4 - i] ?? 0n,
              total: rating.totalReviews
            },
            star
          )) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-10 w-10 text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No reviews yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Be the first to review!" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-4", children: reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Star,
            title: "No reviews yet",
            description: "Share your experience with this product."
          }
        ) : reviews.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card rounded-xl border border-border p-5",
            "data-ocid": `product.review.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: Number(review.rating), size: "sm" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground mt-1", children: review.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: formatTimestamp(review.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: review.comment })
            ]
          },
          review.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-8 bg-card rounded-2xl border border-border p-6",
          "data-ocid": "product.write_review_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-5", children: "Write a Review" }),
            !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Sign in to leave a review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: login, "data-ocid": "product.review.login_button", children: "Sign in with Internet Identity" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "border-0 p-0 m-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-sm font-medium text-foreground mb-2", children: "Rating" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex gap-1",
                    "data-ocid": "product.review.rating_select",
                    children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setReviewRating(star),
                        "aria-label": `Rate ${star} stars`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Star,
                          {
                            className: `h-7 w-7 transition-colors ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30 fill-muted-foreground/10"}`
                          }
                        )
                      },
                      star
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "review-title",
                    className: "text-sm font-medium text-foreground block mb-1",
                    children: "Title"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "review-title",
                    type: "text",
                    value: reviewTitle,
                    onChange: (e) => setReviewTitle(e.target.value),
                    placeholder: "Summarize your experience",
                    className: "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                    "data-ocid": "product.review.title_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "review-comment",
                    className: "text-sm font-medium text-foreground block mb-1",
                    children: "Comment"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "review-comment",
                    value: reviewComment,
                    onChange: (e) => setReviewComment(e.target.value),
                    placeholder: "Tell us what you think about this product…",
                    rows: 4,
                    className: "resize-none",
                    "data-ocid": "product.review.comment_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleSubmitReview,
                  disabled: submitting,
                  className: "gap-2",
                  "data-ocid": "product.review.submit_button",
                  children: submitting ? "Submitting…" : "Submit Review"
                }
              )
            ] })
          ]
        }
      )
    ] }),
    similarProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "product.similar_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-6", children: "Similar Products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: similarProducts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductCard,
        {
          product: p,
          index: i + 1,
          onView: (prod) => navigate({
            to: "/product/$productId",
            params: { productId: prod.id.toString() }
          })
        },
        p.id.toString()
      )) })
    ] })
  ] }) });
}
export {
  ProductPage as default
};
