import CommonTypes "common";

module {
  public type ReviewId = CommonTypes.ReviewId;
  public type ProductId = CommonTypes.ProductId;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type ReviewStatus = { #Pending; #Approved; #Rejected };

  public type ReviewInternal = {
    id : ReviewId;
    productId : ProductId;
    userId : UserId;
    var rating : Nat;
    var title : Text;
    var comment : Text;
    var images : [Text];
    var status : ReviewStatus;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  public type Review = {
    id : ReviewId;
    productId : ProductId;
    userId : UserId;
    rating : Nat;
    title : Text;
    comment : Text;
    images : [Text];
    status : ReviewStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type CreateReviewInput = {
    productId : ProductId;
    rating : Nat;
    title : Text;
    comment : Text;
    images : [Text];
  };

  public type ProductRatingSummary = {
    productId : ProductId;
    averageRating : Float;
    totalReviews : Nat;
    ratingCounts : [Nat];
  };
};
