import List "mo:core/List";
import Runtime "mo:core/Runtime";
import CouponTypes "../types/coupon";
import CommonTypes "../types/common";
import CouponLib "../lib/coupon";

mixin (
  coupons : List.List<CouponTypes.CouponInternal>,
  nextCouponId : { var value : Nat },
) {
  public query func validateCoupon(
    code : Text,
    orderTotal : Float,
    categoryIds : [CommonTypes.CategoryId],
  ) : async CouponTypes.CouponValidation {
    switch (CouponLib.getByCode(coupons, code)) {
      case (?c) CouponLib.validate(c, orderTotal, categoryIds);
      case null (({ isValid = false; discountAmount = 0.0; message = "Coupon not found" } : CouponTypes.CouponValidation));
    };
  };

  public shared ({ caller }) func adminCreateCoupon(
    input : CouponTypes.CreateCouponInput
  ) : async CouponTypes.Coupon {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let id = nextCouponId.value;
    nextCouponId.value += 1;
    let c = CouponLib.create(coupons, id, input);
    c.toPublic();
  };

  public shared ({ caller }) func adminListCoupons(activeOnly : Bool) : async [CouponTypes.Coupon] {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    CouponLib.listAll(coupons, activeOnly);
  };

  public shared ({ caller }) func adminDeactivateCoupon(id : CommonTypes.CouponId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let c = switch (coupons.find(func(c) { c.id == id })) {
      case (?c) c;
      case null Runtime.trap("Coupon not found");
    };
    c.deactivate();
    true;
  };

  public shared ({ caller }) func adminUpdateCoupon(
    id : CommonTypes.CouponId,
    input : CouponTypes.CreateCouponInput,
  ) : async ?CouponTypes.Coupon {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (coupons.find(func(c) { c.id == id })) {
      case (?c) {
        c.code                  := input.code.toUpper();
        c.discountType          := input.discountType;
        c.discountValue         := input.discountValue;
        c.validFrom             := input.validFrom;
        c.validTo               := input.validTo;
        c.usageLimit            := input.usageLimit;
        c.applicableCategories  := input.applicableCategories;
        c.minOrderAmount        := input.minOrderAmount;
        ?c.toPublic();
      };
      case null null;
    };
  };
};
