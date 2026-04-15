import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/user";
import CommonTypes "../types/common";

module {
  public type UserInternal = Types.UserInternal;
  public type User = Types.User;
  public type RegisterInput = Types.RegisterInput;
  public type UpdateProfileInput = Types.UpdateProfileInput;
  public type CartItemInternal = Types.CartItemInternal;
  public type CartItem = Types.CartItem;

  public func toPublic(self : UserInternal) : User {
    {
      id                  = self.id;
      role                = self.role;
      displayName         = self.displayName;
      email               = self.email;
      avatarUrl           = self.avatarUrl;
      addresses           = self.addresses;
      defaultAddressIndex = self.defaultAddressIndex;
      preferences         = self.preferences;
      createdAt           = self.createdAt;
      updatedAt           = self.updatedAt;
      isActive            = self.isActive;
    };
  };

  public func register(
    users : List.List<UserInternal>,
    caller : CommonTypes.UserId,
    input : RegisterInput,
  ) : UserInternal {
    let now = Time.now();
    let u : UserInternal = {
      id                      = caller;
      var role                = #Customer;
      var displayName         = input.displayName;
      var email               = input.email;
      var avatarUrl           = null;
      var addresses           = [];
      var defaultAddressIndex = null;
      var preferences         = { emailNotifications = true; currency = "USD"; language = "en" };
      createdAt               = now;
      var updatedAt           = now;
      var isActive            = true;
    };
    users.add(u);
    u;
  };

  public func getById(
    users : List.List<UserInternal>,
    id : CommonTypes.UserId,
  ) : ?UserInternal {
    users.find(func(u) { u.id == id });
  };

  public func updateProfile(
    self : UserInternal,
    input : UpdateProfileInput,
  ) : () {
    let now = Time.now();
    switch (input.displayName) { case (?v) { self.displayName := v }; case null {} };
    switch (input.email)       { case (?v) { self.email       := v }; case null {} };
    switch (input.avatarUrl)   { case (?v) { self.avatarUrl   := ?v }; case null {} };
    switch (input.preferences) { case (?v) { self.preferences := v }; case null {} };
    self.updatedAt := now;
  };

  public func addAddress(
    self : UserInternal,
    address : CommonTypes.Address,
  ) : () {
    self.addresses := self.addresses.concat([address]);
    self.updatedAt := Time.now();
  };

  public func removeAddress(
    self : UserInternal,
    index : Nat,
  ) : () {
    let arr = self.addresses;
    if (index >= arr.size()) return;
    let before = arr.sliceToArray(0, index.toInt());
    let after  = arr.sliceToArray(index.toInt() + 1, arr.size().toInt());
    self.addresses := before.concat(after);
    // Reset default if it was removed
    switch (self.defaultAddressIndex) {
      case (?di) {
        if (di == index) { self.defaultAddressIndex := null }
        else if (di > index) { self.defaultAddressIndex := ?(di - 1) };
      };
      case null {};
    };
    self.updatedAt := Time.now();
  };

  public func setDefaultAddress(
    self : UserInternal,
    index : Nat,
  ) : () {
    if (index < self.addresses.size()) {
      self.defaultAddressIndex := ?index;
      self.updatedAt := Time.now();
    };
  };

  public func setRole(
    self : UserInternal,
    role : CommonTypes.Role,
  ) : () {
    self.role := role;
    self.updatedAt := Time.now();
  };

  public func listAll(
    users : List.List<UserInternal>,
    offset : Nat,
    limit : Nat,
  ) : [User] {
    let total = users.size();
    if (offset >= total) return [];
    let end = if (offset + limit > total) total else offset + limit;
    users.sliceToArray(offset.toInt(), end.toInt()).map(toPublic);
  };

  public func cartToPublic(items : List.List<CartItemInternal>) : [CartItem] {
    items.toArray().map(func(i : CartItemInternal) : CartItem {
      { productId = i.productId; quantity = i.quantity; addedAt = i.addedAt };
    });
  };

  public func addToCart(
    cart : List.List<CartItemInternal>,
    productId : CommonTypes.ProductId,
    quantity : Nat,
  ) : () {
    let existing = cart.find(func(i) { i.productId == productId });
    switch (existing) {
      case (?item) {
        item.quantity += quantity;
      };
      case null {
        cart.add({ productId; var quantity; addedAt = Time.now() });
      };
    };
  };

  public func removeFromCart(
    cart : List.List<CartItemInternal>,
    productId : CommonTypes.ProductId,
  ) : () {
    // filter in-place: rebuild by removing matching entry
    let keep = cart.filter(func(i) { i.productId != productId });
    cart.clear();
    cart.append(keep);
  };

  public func updateCartQuantity(
    cart : List.List<CartItemInternal>,
    productId : CommonTypes.ProductId,
    quantity : Nat,
  ) : () {
    if (quantity == 0) {
      removeFromCart(cart, productId);
    } else {
      cart.mapInPlace(func(i) {
        if (i.productId == productId) {
          let newQuantity = quantity;
          { i with var quantity = newQuantity };
        } else i
      });
    };
  };

  public func clearCart(cart : List.List<CartItemInternal>) : () {
    cart.clear();
  };
};
