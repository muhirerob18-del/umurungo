import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AnalyticsTypes "../types/analytics";
import OrderTypes "../types/order";
import ProductTypes "../types/product";
import UserTypes "../types/user";

module {
  public func getDashboardStats(
    orders : List.List<OrderTypes.OrderInternal>,
    products : List.List<ProductTypes.ProductInternal>,
    users : List.List<UserTypes.UserInternal>,
  ) : AnalyticsTypes.DashboardStats {
    let now = Time.now();
    let nsPerDay : Int = 86_400_000_000_000;
    let todayStart = now - nsPerDay;

    var totalRevenue  : Float = 0.0;
    var totalOrders   : Nat   = 0;
    var pendingOrders : Nat   = 0;
    var revenueToday  : Float = 0.0;
    var ordersToday   : Nat   = 0;

    orders.forEach(func(o) {
      let isCounted = o.status != #Cancelled and o.status != #Refunded;
      if (isCounted) {
        totalRevenue += o.total;
        totalOrders  += 1;
        if (o.createdAt >= todayStart) {
          revenueToday += o.total;
          ordersToday  += 1;
        };
      };
      if (o.status == #Pending) pendingOrders += 1;
    });

    let lowStockCount = products
      .filter(func(p) { p.isActive and p.stock <= p.reorderPoint })
      .size();

    {
      totalRevenue;
      totalOrders;
      totalUsers    = users.size();
      totalProducts = products.filter(func(p) { p.isActive }).size();
      pendingOrders;
      lowStockCount;
      revenueToday;
      ordersToday;
    };
  };

  public func getRevenueByPeriod(
    orders : List.List<OrderTypes.OrderInternal>,
    period : AnalyticsTypes.AnalyticsPeriod,
    count : Nat,
  ) : [AnalyticsTypes.RevenueByPeriod] {
    let now = Time.now();
    let nsPerDay   : Int = 86_400_000_000_000;
    let nsPerWeek  : Int = nsPerDay * 7;
    let nsPerMonth : Int = nsPerDay * 30;
    let nsPerYear  : Int = nsPerDay * 365;

    let periodLen : Int = switch (period) {
      case (#Day)   nsPerDay;
      case (#Week)  nsPerWeek;
      case (#Month) nsPerMonth;
      case (#Year)  nsPerYear;
    };

    let periodTag = switch (period) {
      case (#Day)   "D";
      case (#Week)  "W";
      case (#Month) "M";
      case (#Year)  "Y";
    };

    // Use a Map keyed by bucket index for mutable accumulation
    let bucketRevenue : Map.Map<Nat, Float> = Map.empty<Nat, Float>();
    let bucketCount   : Map.Map<Nat, Nat>   = Map.empty<Nat, Nat>();

    orders.forEach(func(o) {
      if (o.status != #Cancelled and o.status != #Refunded) {
        for (i in Nat.range(0, count)) {
          let bucketEnd   = now - (i.toInt() * periodLen);
          let bucketStart = bucketEnd - periodLen;
          if (o.createdAt >= bucketStart and o.createdAt < bucketEnd) {
            let prevRev = switch (bucketRevenue.get(i)) { case (?v) v; case null 0.0 };
            let prevCnt = switch (bucketCount.get(i))   { case (?v) v; case null 0   };
            bucketRevenue.add(i, prevRev + o.total);
            bucketCount.add(i, prevCnt + 1);
          };
        };
      };
    });

    Array.tabulate<AnalyticsTypes.RevenueByPeriod>(
      count,
      func(i) {
        {
          period     = periodTag # "-" # (i + 1).toText();
          revenue    = switch (bucketRevenue.get(i)) { case (?v) v; case null 0.0 };
          orderCount = switch (bucketCount.get(i))   { case (?v) v; case null 0   };
        }
      }
    );
  };

  public func getTopProducts(
    orders : List.List<OrderTypes.OrderInternal>,
    products : List.List<ProductTypes.ProductInternal>,
    limit : Nat,
  ) : [AnalyticsTypes.TopProduct] {
    // Aggregate per product
    let revenueMap  = Map.empty<Nat, Float>();
    let soldMap     = Map.empty<Nat, Nat>();

    orders.forEach(func(o) {
      if (o.status != #Cancelled and o.status != #Refunded) {
        for (item in o.items.values()) {
          let rev = item.price * item.quantity.toFloat();
          let prevRev = switch (revenueMap.get(item.productId)) { case (?v) v; case null 0.0 };
          revenueMap.add(item.productId, prevRev + rev);
          let prevSold = switch (soldMap.get(item.productId)) { case (?v) v; case null 0 };
          soldMap.add(item.productId, prevSold + item.quantity);
        };
      };
    });

    let entries : [(Nat, Float)] = revenueMap.toArray();
    let sorted = entries.sort(func((_, a), (_, b)) {
      if (a > b) #less else if (a < b) #greater else #equal
    });

    let end = if (limit > sorted.size()) sorted.size() else limit;
    sorted.sliceToArray(0, end.toInt()).map(func((pid, rev) : (Nat, Float)) : AnalyticsTypes.TopProduct {
      let title = switch (products.find(func(p) { p.id == pid })) {
        case (?p) p.title;
        case null "Unknown";
      };
      let soldCount = switch (soldMap.get(pid)) { case (?v) v; case null 0 };
      { productId = pid; title; soldCount; revenue = rev };
    });
  };
};
