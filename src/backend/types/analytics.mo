import CommonTypes "common";

module {
  public type ProductId = CommonTypes.ProductId;
  public type Timestamp = CommonTypes.Timestamp;

  public type RevenueByPeriod = {
    period : Text;
    revenue : Float;
    orderCount : Nat;
  };

  public type TopProduct = {
    productId : ProductId;
    title : Text;
    soldCount : Nat;
    revenue : Float;
  };

  public type DashboardStats = {
    totalRevenue : Float;
    totalOrders : Nat;
    totalUsers : Nat;
    totalProducts : Nat;
    pendingOrders : Nat;
    lowStockCount : Nat;
    revenueToday : Float;
    ordersToday : Nat;
  };

  public type AnalyticsPeriod = { #Day; #Week; #Month; #Year };
};
