import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import UserTypes "../types/user";
import CommonTypes "../types/common";
import UserLib "../lib/user";

mixin (
  users : List.List<UserTypes.UserInternal>,
  carts : Map.Map<CommonTypes.UserId, List.List<UserTypes.CartItemInternal>>,
  wishlists : Map.Map<CommonTypes.UserId, List.List<CommonTypes.ProductId>>,
) {
  // ── Helpers ──────────────────────────────────────────────────────────────

  func getOrCreateCart(caller : CommonTypes.UserId) : List.List<UserTypes.CartItemInternal> {
    switch (carts.get(caller)) {
      case (?cart) cart;
      case null {
        let cart = List.empty<UserTypes.CartItemInternal>();
        carts.add(caller, cart);
        cart;
      };
    };
  };

  func getOrCreateWishlist(caller : CommonTypes.UserId) : List.List<CommonTypes.ProductId> {
    switch (wishlists.get(caller)) {
      case (?wl) wl;
      case null {
        let wl = List.empty<CommonTypes.ProductId>();
        wishlists.add(caller, wl);
        wl;
      };
    };
  };

  func requireAdmin(caller : CommonTypes.UserId) {
    switch (UserLib.getById(users, caller)) {
      case (?u) {
        if (u.role != #Admin) Runtime.trap("Unauthorized: admin only");
      };
      case null Runtime.trap("Unauthorized: user not found");
    };
  };

  // ── Profile ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func registerUser(input : UserTypes.RegisterInput) : async UserTypes.User {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    switch (UserLib.getById(users, caller)) {
      case (?existing) existing.toPublic();
      case null {
        let u = UserLib.register(users, caller, input);
        u.toPublic();
      };
    };
  };

  public query ({ caller }) func getMyProfile() : async ?UserTypes.User {
    switch (UserLib.getById(users, caller)) {
      case (?u) ?u.toPublic();
      case null null;
    };
  };

  public shared ({ caller }) func updateMyProfile(input : UserTypes.UpdateProfileInput) : async UserTypes.User {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let u = switch (UserLib.getById(users, caller)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.updateProfile(input);
    u.toPublic();
  };

  public shared ({ caller }) func addAddress(address : CommonTypes.Address) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let u = switch (UserLib.getById(users, caller)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.addAddress(address);
    true;
  };

  public shared ({ caller }) func removeAddress(index : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let u = switch (UserLib.getById(users, caller)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.removeAddress(index);
    true;
  };

  public shared ({ caller }) func setDefaultAddress(index : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let u = switch (UserLib.getById(users, caller)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.setDefaultAddress(index);
    true;
  };

  // ── Cart ──────────────────────────────────────────────────────────────────

  public query ({ caller }) func getCart() : async [UserTypes.CartItem] {
    let cart = switch (carts.get(caller)) { case (?c) c; case null List.empty<UserTypes.CartItemInternal>() };
    UserLib.cartToPublic(cart);
  };

  public shared ({ caller }) func addToCart(productId : CommonTypes.ProductId, quantity : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let cart = getOrCreateCart(caller);
    UserLib.addToCart(cart, productId, quantity);
    true;
  };

  public shared ({ caller }) func updateCartItem(productId : CommonTypes.ProductId, quantity : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let cart = getOrCreateCart(caller);
    UserLib.updateCartQuantity(cart, productId, quantity);
    true;
  };

  public shared ({ caller }) func removeFromCart(productId : CommonTypes.ProductId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let cart = getOrCreateCart(caller);
    UserLib.removeFromCart(cart, productId);
    true;
  };

  public shared ({ caller }) func clearCart() : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let cart = getOrCreateCart(caller);
    UserLib.clearCart(cart);
    true;
  };

  // ── Wishlist ──────────────────────────────────────────────────────────────

  public query ({ caller }) func getWishlist() : async [CommonTypes.ProductId] {
    let wl = switch (wishlists.get(caller)) { case (?w) w; case null List.empty<CommonTypes.ProductId>() };
    wl.toArray();
  };

  public shared ({ caller }) func addToWishlist(productId : CommonTypes.ProductId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let wl = getOrCreateWishlist(caller);
    if (wl.find(func(pid) { pid == productId }) == null) {
      wl.add(productId);
    };
    true;
  };

  public shared ({ caller }) func removeFromWishlist(productId : CommonTypes.ProductId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be authenticated");
    let wl = getOrCreateWishlist(caller);
    let kept = wl.filter(func(pid) { pid != productId });
    wl.clear();
    wl.addAll(kept.values());
    true;
  };

  // ── Admin user management ─────────────────────────────────────────────────

  public shared ({ caller }) func adminListUsers(offset : Nat, limit : Nat) : async [UserTypes.User] {
    requireAdmin(caller);
    UserLib.listAll(users, offset, limit);
  };

  public shared ({ caller }) func adminSetUserRole(
    userId : CommonTypes.UserId,
    role : CommonTypes.Role,
  ) : async Bool {
    requireAdmin(caller);
    let u = switch (UserLib.getById(users, userId)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.setRole(role);
    true;
  };

  public shared ({ caller }) func adminDeactivateUser(userId : CommonTypes.UserId) : async Bool {
    requireAdmin(caller);
    let u = switch (UserLib.getById(users, userId)) {
      case (?u) u;
      case null Runtime.trap("User not found");
    };
    u.isActive := false;
    true;
  };
};
