import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/review";
import CommonTypes "../types/common";

module {
  public type ReviewInternal = Types.ReviewInternal;
  public type Review = Types.Review;
  public type CreateReviewInput = Types.CreateReviewInput;
  public type ProductRatingSummary = Types.ProductRatingSummary;

  public func toPublic(self : ReviewInternal) : Review {
    {
      id        = self.id;
      productId = self.productId;
      userId    = self.userId;
      rating    = self.rating;
      title     = self.title;
      comment   = self.comment;
      images    = self.images;
      status    = self.status;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  public func create(
    reviews : List.List<ReviewInternal>,
    nextId : Nat,
    caller : CommonTypes.UserId,
    input : CreateReviewInput,
  ) : ReviewInternal {
    let now = Time.now();
    // Rating must be 1–5
    let safeRating = if (input.rating < 1) 1 else if (input.rating > 5) 5 else input.rating;
    let r : ReviewInternal = {
      id            = nextId;
      productId     = input.productId;
      userId        = caller;
      var rating    = safeRating;
      var title     = input.title;
      var comment   = input.comment;
      var images    = input.images;
      var status    = #Pending;
      createdAt     = now;
      var updatedAt = now;
    };
    reviews.add(r);
    r;
  };

  public func setStatus(
    self : ReviewInternal,
    status : Types.ReviewStatus,
  ) : () {
    self.status    := status;
    self.updatedAt := Time.now();
  };

  public func getByProduct(
    reviews : List.List<ReviewInternal>,
    productId : CommonTypes.ProductId,
    approvedOnly : Bool,
  ) : [Review] {
    reviews
      .filter(func(r) {
        r.productId == productId and (not approvedOnly or r.status == #Approved)
      })
      .toArray()
      .map(toPublic);
  };

  public func getByUser(
    reviews : List.List<ReviewInternal>,
    userId : CommonTypes.UserId,
  ) : [Review] {
    reviews
      .filter(func(r) { r.userId == userId })
      .toArray()
      .map(toPublic);
  };

  public func getPending(
    reviews : List.List<ReviewInternal>,
  ) : [Review] {
    reviews
      .filter(func(r) { r.status == #Pending })
      .toArray()
      .map(toPublic);
  };

  public func getRatingSummary(
    reviews : List.List<ReviewInternal>,
    productId : CommonTypes.ProductId,
  ) : ProductRatingSummary {
    let approved = reviews.filter(func(r) {
      r.productId == productId and r.status == #Approved
    });
    let total = approved.size();
    if (total == 0) {
      return ({
        productId;
        averageRating = 0.0;
        totalReviews  = 0;
        ratingCounts  = [0, 0, 0, 0, 0];
      } : ProductRatingSummary);
    };
    // ratingCounts[0] = count of 1-star, ..., ratingCounts[4] = count of 5-star
    let counts = [var 0, 0, 0, 0, 0];
    var ratingSum = 0;
    approved.forEach(func(r) {
      ratingSum += r.rating;
      let idx : Nat = if (r.rating == 0) 0 else if (r.rating > 5) 4 else (r.rating.toInt() - 1).toNat();
      counts[idx] += 1;
    });
    let avg = ratingSum.toFloat() / total.toFloat();
    {
      productId;
      averageRating = avg;
      totalReviews  = total;
      ratingCounts  = [counts[0], counts[1], counts[2], counts[3], counts[4]];
    };
  };

  public func hasReviewed(
    reviews : List.List<ReviewInternal>,
    userId : CommonTypes.UserId,
    productId : CommonTypes.ProductId,
  ) : Bool {
    switch (reviews.find(func(r) { r.userId == userId and r.productId == productId })) {
      case (?_) true;
      case null false;
    };
  };
};
