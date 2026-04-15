import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type Role = CommonTypes.Role;
  public type Address = CommonTypes.Address;
  public type ProductId = CommonTypes.ProductId;

  public type UserPreferences = {
    emailNotifications : Bool;
    currency : Text;
    language : Text;
  };

  public type UserInternal = {
    id : UserId;
    var role : Role;
    var displayName : Text;
    var email : Text;
    var avatarUrl : ?Text;
    var addresses : [Address];
    var defaultAddressIndex : ?Nat;
    var preferences : UserPreferences;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
    var isActive : Bool;
  };

  public type User = {
    id : UserId;
    role : Role;
    displayName : Text;
    email : Text;
    avatarUrl : ?Text;
    addresses : [Address];
    defaultAddressIndex : ?Nat;
    preferences : UserPreferences;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    isActive : Bool;
  };

  public type RegisterInput = {
    displayName : Text;
    email : Text;
  };

  public type UpdateProfileInput = {
    displayName : ?Text;
    email : ?Text;
    avatarUrl : ?Text;
    preferences : ?UserPreferences;
  };

  public type CartItemInternal = {
    productId : ProductId;
    var quantity : Nat;
    addedAt : Timestamp;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
    addedAt : Timestamp;
  };
};
