import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/coupon";
import CommonTypes "../types/common";

module {
  public type CouponInternal = Types.CouponInternal;
  public type Coupon = Types.Coupon;
  public type CreateCouponInput = Types.CreateCouponInput;
  public type CouponValidation = Types.CouponValidation;

  public func toPublic(self : CouponInternal) : Coupon {
    {
      id                    = self.id;
      code                  = self.code;
      discountType          = self.discountType;
      discountValue         = self.discountValue;
      validFrom             = self.validFrom;
      validTo               = self.validTo;
      usageLimit            = self.usageLimit;
      usageCount            = self.usageCount;
      applicableCategories  = self.applicableCategories;
      minOrderAmount        = self.minOrderAmount;
      isActive              = self.isActive;
      createdAt             = self.createdAt;
    };
  };

  public func create(
    coupons : List.List<CouponInternal>,
    nextId : Nat,
    input : CreateCouponInput,
  ) : CouponInternal {
    let now = Time.now();
    let c : CouponInternal = {
      id                         = nextId;
      var code                   = input.code.toUpper();
      var discountType           = input.discountType;
      var discountValue          = input.discountValue;
      var validFrom              = input.validFrom;
      var validTo                = input.validTo;
      var usageLimit             = input.usageLimit;
      var usageCount             = 0;
      var applicableCategories   = input.applicableCategories;
      var minOrderAmount         = input.minOrderAmount;
      var isActive               = true;
      createdAt                  = now;
    };
    coupons.add(c);
    c;
  };

  public func getByCode(
    coupons : List.List<CouponInternal>,
    code : Text,
  ) : ?CouponInternal {
    let upper = code.toUpper();
    coupons.find(func(c) { c.code == upper });
  };

  public func validate(
    coupon : CouponInternal,
    orderTotal : Float,
    categoryIds : [CommonTypes.CategoryId],
  ) : CouponValidation {
    let now = Time.now();

    if (not coupon.isActive) {
      return ({ isValid = false; discountAmount = 0.0; message = "Coupon is inactive" } : CouponValidation);
    };
    if (now < coupon.validFrom) {
      return ({ isValid = false; discountAmount = 0.0; message = "Coupon is not yet valid" } : CouponValidation);
    };
    if (now > coupon.validTo) {
      return ({ isValid = false; discountAmount = 0.0; message = "Coupon has expired" } : CouponValidation);
    };
    switch (coupon.usageLimit) {
      case (?limit) {
        if (coupon.usageCount >= limit) {
          return ({ isValid = false; discountAmount = 0.0; message = "Coupon usage limit reached" } : CouponValidation);
        };
      };
      case null {};
    };
    switch (coupon.minOrderAmount) {
      case (?minAmt) {
        if (orderTotal < minAmt) {
          return ({
            isValid = false;
            discountAmount = 0.0;
            message = "Order total below minimum required amount";
          } : CouponValidation);
        };
      };
      case null {};
    };
    // Category restriction
    if (coupon.applicableCategories.size() > 0) {
      let hasMatch = categoryIds.find(func(cid) {
        coupon.applicableCategories.find(func(ac) { ac == cid }) != null
      });
      if (hasMatch == null) {
        return ({ isValid = false; discountAmount = 0.0; message = "Coupon not applicable to selected categories" } : CouponValidation);
      };
    };

    let discountAmount = switch (coupon.discountType) {
      case (#Percent) {
        let amt = orderTotal * coupon.discountValue / 100.0;
        if (amt > orderTotal) orderTotal else amt;
      };
      case (#Fixed) {
        if (coupon.discountValue > orderTotal) orderTotal else coupon.discountValue;
      };
    };

    { isValid = true; discountAmount; message = "Coupon applied successfully" };
  };

  public func incrementUsage(self : CouponInternal) : () {
    self.usageCount += 1;
  };

  public func deactivate(self : CouponInternal) : () {
    self.isActive := false;
  };

  public func listAll(
    coupons : List.List<CouponInternal>,
    activeOnly : Bool,
  ) : [Coupon] {
    let filtered = if (activeOnly)
      coupons.filter(func(c) { c.isActive })
    else
      coupons;
    filtered.toArray().map(toPublic);
  };
};
