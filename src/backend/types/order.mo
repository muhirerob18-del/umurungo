import CommonTypes "common";

module {
  public type OrderId = CommonTypes.OrderId;
  public type ProductId = CommonTypes.ProductId;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type PaymentMethod = CommonTypes.PaymentMethod;
  public type Address = CommonTypes.Address;

  public type OrderStatus = {
    #Pending;
    #Processing;
    #Shipped;
    #Delivered;
    #Cancelled;
    #Refunded;
  };

  public type OrderItem = {
    productId : ProductId;
    title : Text;
    price : Float;
    quantity : Nat;
    imageUrl : Text;
  };

  public type OrderInternal = {
    id : OrderId;
    customerId : UserId;
    items : [OrderItem];
    var status : OrderStatus;
    shippingAddress : Address;
    var subtotal : Float;
    var discountAmount : Float;
    var total : Float;
    couponCode : ?Text;
    paymentMethod : PaymentMethod;
    var paymentReference : ?Text;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
    var trackingNumber : ?Text;
    var notes : ?Text;
  };

  public type Order = {
    id : OrderId;
    customerId : UserId;
    items : [OrderItem];
    status : OrderStatus;
    shippingAddress : Address;
    subtotal : Float;
    discountAmount : Float;
    total : Float;
    couponCode : ?Text;
    paymentMethod : PaymentMethod;
    paymentReference : ?Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    trackingNumber : ?Text;
    notes : ?Text;
  };

  public type CreateOrderInput = {
    items : [{ productId : ProductId; quantity : Nat }];
    shippingAddress : Address;
    couponCode : ?Text;
    paymentMethod : PaymentMethod;
  };

  public type OrderFilter = {
    customerId : ?UserId;
    status : ?OrderStatus;
    fromDate : ?Timestamp;
    toDate : ?Timestamp;
    paymentMethod : ?PaymentMethod;
  };
};
