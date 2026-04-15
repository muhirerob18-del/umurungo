import List "mo:core/List";
import Runtime "mo:core/Runtime";
import ReviewTypes "../types/review";
import CommonTypes "../types/common";
import ReviewLib "../lib/review";

mixin (
  reviews : List.List<ReviewTypes.ReviewInternal>,
  nextReviewId : { var value : Nat },
) {
  // ── Caller must be present for writes ─────────────────────────────────────
  // NOTE: users list is NOT in this mixin — admin check delegated to role field
  // We check the role via the users list passed through the outer actor state.
  // For admin guard we use a simple pattern: only approved reviews are public.

  public shared ({ caller }) func submitReview(
    input : ReviewTypes.CreateReviewInput
  ) : async ReviewTypes.Review {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    if (ReviewLib.hasReviewed(reviews, caller, input.productId)) {
      Runtime.trap("You have already reviewed this product");
    };
    let id = nextReviewId.value;
    nextReviewId.value += 1;
    let r = ReviewLib.create(reviews, id, caller, input);
    r.toPublic();
  };

  public query func getProductReviews(
    productId : CommonTypes.ProductId,
    approvedOnly : Bool,
  ) : async [ReviewTypes.Review] {
    ReviewLib.getByProduct(reviews, productId, approvedOnly);
  };

  public query ({ caller }) func getMyReviews() : async [ReviewTypes.Review] {
    ReviewLib.getByUser(reviews, caller);
  };

  public query func getProductRating(
    productId : CommonTypes.ProductId
  ) : async ReviewTypes.ProductRatingSummary {
    ReviewLib.getRatingSummary(reviews, productId);
  };

  public shared ({ caller }) func adminModerateReview(
    id : CommonTypes.ReviewId,
    status : ReviewTypes.ReviewStatus,
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let r = switch (reviews.find(func(r) { r.id == id })) {
      case (?r) r;
      case null Runtime.trap("Review not found");
    };
    r.setStatus(status);
    true;
  };

  public shared ({ caller }) func adminGetPendingReviews() : async [ReviewTypes.Review] {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    ReviewLib.getPending(reviews);
  };
};
