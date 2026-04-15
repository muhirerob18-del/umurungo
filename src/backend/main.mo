import List "mo:core/List";
import Map "mo:core/Map";
import ProductTypes "types/product";
import OrderTypes "types/order";
import UserTypes "types/user";
import ReviewTypes "types/review";
import CouponTypes "types/coupon";
import CommonTypes "types/common";

import ProductApi "mixins/product-api";
import OrderApi "mixins/order-api";
import UserApi "mixins/user-api";
import ReviewApi "mixins/review-api";
import CouponApi "mixins/coupon-api";
import AnalyticsApi "mixins/analytics-api";

actor {
  // ── Counters ──────────────────────────────────────────────────────────────
  let nextProductIdRef = { var value : Nat = 1 };
  let nextOrderIdRef   = { var value : Nat = 1 };
  let nextReviewIdRef  = { var value : Nat = 1 };
  let nextCouponIdRef  = { var value : Nat = 1 };
  let seededRef        = { var value : Bool = false };

  // ── Core state ────────────────────────────────────────────────────────────
  let products   : List.List<ProductTypes.ProductInternal>  = List.empty();
  let categories : List.List<ProductTypes.Category>         = List.empty();
  let orders     : List.List<OrderTypes.OrderInternal>      = List.empty();
  let users      : List.List<UserTypes.UserInternal>        = List.empty();
  let reviews    : List.List<ReviewTypes.ReviewInternal>    = List.empty();
  let coupons    : List.List<CouponTypes.CouponInternal>    = List.empty();

  // ── Per-user maps ─────────────────────────────────────────────────────────
  let carts     : Map.Map<CommonTypes.UserId, List.List<UserTypes.CartItemInternal>> = Map.empty();
  let wishlists : Map.Map<CommonTypes.UserId, List.List<CommonTypes.ProductId>>      = Map.empty();

  // ── Mixin composition ─────────────────────────────────────────────────────
  include ProductApi(products, categories, nextProductIdRef, seededRef);
  include OrderApi(orders, products, coupons, nextOrderIdRef);
  include UserApi(users, carts, wishlists);
  include ReviewApi(reviews, nextReviewIdRef);
  include CouponApi(coupons, nextCouponIdRef);
  include AnalyticsApi(orders, products, users);
};
