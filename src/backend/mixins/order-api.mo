import List "mo:core/List";
import Runtime "mo:core/Runtime";
import OrderTypes "../types/order";
import CommonTypes "../types/common";
import ProductTypes "../types/product";
import CouponTypes "../types/coupon";
import OrderLib "../lib/order";
import CouponLib "../lib/coupon";

mixin (
  orders    : List.List<OrderTypes.OrderInternal>,
  products  : List.List<ProductTypes.ProductInternal>,
  coupons   : List.List<CouponTypes.CouponInternal>,
  nextOrderId : { var value : Nat },
) {
  // ── Customer order operations ─────────────────────────────────────────────

  public shared ({ caller }) func placeOrder(
    input : OrderTypes.CreateOrderInput
  ) : async OrderTypes.Order {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    // Resolve coupon if provided
    let coupon : ?CouponTypes.CouponInternal = switch (input.couponCode) {
      case (?code) CouponLib.getByCode(coupons, code);
      case null null;
    };
    let id = nextOrderId.value;
    nextOrderId.value += 1;
    let o = OrderLib.create(orders, products, id, caller, input, coupon);
    o.toPublic();
  };

  public query ({ caller }) func getMyOrders(offset : Nat, limit : Nat) : async [OrderTypes.Order] {
    let filter : OrderTypes.OrderFilter = {
      customerId    = ?caller;
      status        = null;
      fromDate      = null;
      toDate        = null;
      paymentMethod = null;
    };
    OrderLib.listByFilter(orders, filter, offset, limit);
  };

  public query ({ caller }) func getOrderDetail(id : CommonTypes.OrderId) : async ?OrderTypes.Order {
    switch (OrderLib.getById(orders, id)) {
      case (?o) {
        if (o.customerId == caller) ?o.toPublic()
        else null;
      };
      case null null;
    };
  };

  public shared ({ caller }) func cancelOrder(id : CommonTypes.OrderId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let o = switch (OrderLib.getById(orders, id)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    if (o.customerId != caller) Runtime.trap("Not your order");
    if (o.status != #Pending and o.status != #Processing) {
      Runtime.trap("Cannot cancel order in current status");
    };
    o.updateStatus(#Cancelled);
    true;
  };

  // ── Admin order management ────────────────────────────────────────────────

  public shared ({ caller }) func adminListOrders(
    filter : OrderTypes.OrderFilter,
    offset : Nat,
    limit : Nat,
  ) : async [OrderTypes.Order] {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    OrderLib.listByFilter(orders, filter, offset, limit);
  };

  public shared ({ caller }) func adminUpdateOrderStatus(
    id : CommonTypes.OrderId,
    status : OrderTypes.OrderStatus,
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let o = switch (OrderLib.getById(orders, id)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    o.updateStatus(status);
    true;
  };

  public shared ({ caller }) func adminSetTrackingNumber(
    id : CommonTypes.OrderId,
    trackingNumber : Text,
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let o = switch (OrderLib.getById(orders, id)) {
      case (?o) o;
      case null Runtime.trap("Order not found");
    };
    o.setTracking(trackingNumber);
    true;
  };
};
