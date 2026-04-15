import CommonTypes "common";

module {
  public type CouponId = CommonTypes.CouponId;
  public type CategoryId = CommonTypes.CategoryId;
  public type Timestamp = CommonTypes.Timestamp;

  public type DiscountType = { #Percent; #Fixed };

  public type CouponInternal = {
    id : CouponId;
    var code : Text;
    var discountType : DiscountType;
    var discountValue : Float;
    var validFrom : Timestamp;
    var validTo : Timestamp;
    var usageLimit : ?Nat;
    var usageCount : Nat;
    var applicableCategories : [CategoryId];
    var minOrderAmount : ?Float;
    var isActive : Bool;
    createdAt : Timestamp;
  };

  public type Coupon = {
    id : CouponId;
    code : Text;
    discountType : DiscountType;
    discountValue : Float;
    validFrom : Timestamp;
    validTo : Timestamp;
    usageLimit : ?Nat;
    usageCount : Nat;
    applicableCategories : [CategoryId];
    minOrderAmount : ?Float;
    isActive : Bool;
    createdAt : Timestamp;
  };

  public type CreateCouponInput = {
    code : Text;
    discountType : DiscountType;
    discountValue : Float;
    validFrom : Timestamp;
    validTo : Timestamp;
    usageLimit : ?Nat;
    applicableCategories : [CategoryId];
    minOrderAmount : ?Float;
  };

  public type CouponValidation = {
    isValid : Bool;
    discountAmount : Float;
    message : Text;
  };
};
