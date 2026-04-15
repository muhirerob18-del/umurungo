module {
  public type UserId = Principal;
  public type ProductId = Nat;
  public type OrderId = Nat;
  public type ReviewId = Nat;
  public type CouponId = Nat;
  public type CategoryId = Nat;
  public type Timestamp = Int;

  public type Role = { #Admin; #Customer };

  public type PaymentMethod = { #Stripe; #PayPal; #MtnMomo };

  public type Address = {
    fullName : Text;
    street : Text;
    city : Text;
    state : Text;
    country : Text;
    postalCode : Text;
    phone : Text;
  };

  public type PaginationParams = {
    offset : Nat;
    limit : Nat;
  };

  public type SortOrder = { #Asc; #Desc };
};
