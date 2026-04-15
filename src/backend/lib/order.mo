import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/order";
import ProductTypes "../types/product";
import CouponTypes "../types/coupon";
import CouponLib "../lib/coupon";
import CommonTypes "../types/common";

module {
  public type OrderInternal = Types.OrderInternal;
  public type Order = Types.Order;
  public type CreateOrderInput = Types.CreateOrderInput;
  public type OrderFilter = Types.OrderFilter;

  public func toPublic(self : OrderInternal) : Order {
    {
      id               = self.id;
      customerId       = self.customerId;
      items            = self.items;
      status           = self.status;
      shippingAddress  = self.shippingAddress;
      subtotal         = self.subtotal;
      discountAmount   = self.discountAmount;
      total            = self.total;
      couponCode       = self.couponCode;
      paymentMethod    = self.paymentMethod;
      paymentReference = self.paymentReference;
      createdAt        = self.createdAt;
      updatedAt        = self.updatedAt;
      trackingNumber   = self.trackingNumber;
      notes            = self.notes;
    };
  };

  public func create(
    orders : List.List<OrderInternal>,
    products : List.List<ProductTypes.ProductInternal>,
    nextId : Nat,
    caller : CommonTypes.UserId,
    input : CreateOrderInput,
    coupon : ?CouponTypes.CouponInternal,
  ) : OrderInternal {
    let now = Time.now();

    // Build order items and compute subtotal
    var subtotal : Float = 0.0;
    let items : [Types.OrderItem] = input.items.map(func(item) : Types.OrderItem {
      let product = switch (products.find(func(p) { p.id == item.productId })) {
        case (?p) p;
        case null Runtime.trap("Product not found: " # item.productId.toText());
      };
      // Deduct stock
      let newStock = product.stock.toInt() - item.quantity.toInt();
      product.stock := if (newStock < 0) 0 else newStock.toNat();
      product.soldCount += item.quantity;
      product.updatedAt := now;

      let lineTotal = product.price * item.quantity.toFloat();
      subtotal += lineTotal;
      {
        productId = item.productId;
        title     = product.title;
        price     = product.price;
        quantity  = item.quantity;
        imageUrl  = if (product.images.size() > 0) product.images[0] else "";
      };
    });

    // Apply coupon discount
    var discountAmount : Float = 0.0;
    switch (coupon) {
      case (?c) {
        let catIds = items.map(func(i : Types.OrderItem) : CommonTypes.CategoryId {
          switch (products.find(func(p) { p.id == i.productId })) {
            case (?p) p.categoryId;
            case null 0;
          };
        });
        let validation = CouponLib.validate(c, subtotal, catIds);
        if (validation.isValid) {
          discountAmount := validation.discountAmount;
          c.incrementUsage();
        };
      };
      case null {};
    };

    let total = subtotal - discountAmount;

    let o : OrderInternal = {
      id                        = nextId;
      customerId                = caller;
      items;
      var status                = #Pending;
      shippingAddress           = input.shippingAddress;
      var subtotal              = subtotal;
      var discountAmount        = discountAmount;
      var total                 = if (total < 0.0) 0.0 else total;
      couponCode                = input.couponCode;
      paymentMethod             = input.paymentMethod;
      var paymentReference      = null;
      createdAt                 = now;
      var updatedAt             = now;
      var trackingNumber        = null;
      var notes                 = null;
    };
    orders.add(o);
    o;
  };

  public func updateStatus(
    self : OrderInternal,
    status : Types.OrderStatus,
  ) : () {
    self.status    := status;
    self.updatedAt := Time.now();
  };

  public func setTracking(
    self : OrderInternal,
    trackingNumber : Text,
  ) : () {
    self.trackingNumber := ?trackingNumber;
    self.updatedAt      := Time.now();
  };

  public func getById(
    orders : List.List<OrderInternal>,
    id : CommonTypes.OrderId,
  ) : ?OrderInternal {
    orders.find(func(o) { o.id == id });
  };

  func matchesFilter(o : OrderInternal, filter : OrderFilter) : Bool {
    switch (filter.customerId) {
      case (?cid) { if (o.customerId != cid) return false };
      case null {};
    };
    switch (filter.status) {
      case (?s) { if (o.status != s) return false };
      case null {};
    };
    switch (filter.fromDate) {
      case (?from) { if (o.createdAt < from) return false };
      case null {};
    };
    switch (filter.toDate) {
      case (?to) { if (o.createdAt > to) return false };
      case null {};
    };
    switch (filter.paymentMethod) {
      case (?pm) { if (o.paymentMethod != pm) return false };
      case null {};
    };
    true;
  };

  public func listByFilter(
    orders : List.List<OrderInternal>,
    filter : OrderFilter,
    offset : Nat,
    limit : Nat,
  ) : [Order] {
    let filtered = orders.filter(func(o) { matchesFilter(o, filter) });
    let total = filtered.size();
    if (offset >= total) return [];
    let end = if (offset + limit > total) total else offset + limit;
    filtered.sliceToArray(offset.toInt(), end.toInt()).map(toPublic);
  };

  public func getTotalRevenue(
    orders : List.List<OrderInternal>,
  ) : Float {
    orders.foldLeft(0.0 : Float, func(acc : Float, o : OrderInternal) : Float {
      if (o.status == #Cancelled or o.status == #Refunded) acc
      else acc + o.total
    });
  };

  // Returns period labels for "count" periods back from now
  // period: "day" | "week" | "month"
  public func getRevenueByPeriod(
    orders : List.List<OrderInternal>,
    period : Text,
    count : Nat,
  ) : [{ period : Text; revenue : Float; orderCount : Nat }] {
    let now = Time.now();
    // nanoseconds
    let nsPerSec  : Int = 1_000_000_000;
    let nsPerDay  : Int = nsPerSec * 86400;
    let nsPerWeek : Int = nsPerDay * 7;
    // approximate month as 30 days
    let nsPerMonth : Int = nsPerDay * 30;

    let periodLen : Int = switch (period) {
      case "week"  nsPerWeek;
      case "month" nsPerMonth;
      case _       nsPerDay;  // default "day"
    };

    let periodPrefix = switch (period) {
      case "week"  "W";
      case "month" "M";
      case _       "D";
    };

    // Use Maps for mutable bucket accumulation
    let bucketRevenue : Map.Map<Nat, Float> = Map.empty<Nat, Float>();
    let bucketCount   : Map.Map<Nat, Nat>   = Map.empty<Nat, Nat>();

    // Aggregate orders into buckets
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

    Array.tabulate<{ period : Text; revenue : Float; orderCount : Nat }>(
      count,
      func(i) {
        {
          period     = periodPrefix # "-" # (i + 1).toText();
          revenue    = switch (bucketRevenue.get(i)) { case (?v) v; case null 0.0 };
          orderCount = switch (bucketCount.get(i))   { case (?v) v; case null 0   };
        }
      }
    );
  };
};
