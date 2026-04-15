import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AnalyticsTypes "../types/analytics";
import OrderTypes "../types/order";
import ProductTypes "../types/product";
import UserTypes "../types/user";
import AnalyticsLib "../lib/analytics";

mixin (
  orders : List.List<OrderTypes.OrderInternal>,
  products : List.List<ProductTypes.ProductInternal>,
  users : List.List<UserTypes.UserInternal>,
) {
  public shared ({ caller }) func adminGetDashboardStats() : async AnalyticsTypes.DashboardStats {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    AnalyticsLib.getDashboardStats(orders, products, users);
  };

  public shared ({ caller }) func adminGetRevenueByPeriod(
    period : AnalyticsTypes.AnalyticsPeriod,
    count : Nat,
  ) : async [AnalyticsTypes.RevenueByPeriod] {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    AnalyticsLib.getRevenueByPeriod(orders, period, count);
  };

  public shared ({ caller }) func adminGetTopProducts(limit : Nat) : async [AnalyticsTypes.TopProduct] {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    AnalyticsLib.getTopProducts(orders, products, limit);
  };
};
