import List "mo:core/List";
import ProductTypes "../types/product";
import CommonTypes "../types/common";
import ProductLib "../lib/product";

mixin (
  products      : List.List<ProductTypes.ProductInternal>,
  categories    : List.List<ProductTypes.Category>,
  nextProductId : { var value : Nat },
  seeded        : { var value : Bool },
) {
  // ── Catalog (query) ────────────────────────────────────────────────────────

  public query func listProducts(
    filter : ProductTypes.ProductFilter,
    offset : Nat,
    limit  : Nat,
  ) : async [ProductTypes.Product] {
    ProductLib.list(products, filter, offset, limit);
  };

  public query func getProduct(id : CommonTypes.ProductId) : async ?ProductTypes.Product {
    switch (ProductLib.getById(products, id)) {
      case (?p) ?p.toPublic();
      case null null;
    };
  };

  public query func searchProducts(term : Text, limit : Nat) : async [ProductTypes.Product] {
    ProductLib.search(products, term, limit);
  };

  public query func listCategories() : async [ProductTypes.Category] {
    categories.toArray();
  };

  // Returns the product id itself as a lightweight existence check used by the review mixin
  public query func getProductRatingSummary(id : CommonTypes.ProductId) : async ?ProductTypes.ProductId {
    switch (ProductLib.getById(products, id)) {
      case (?p) ?p.id;
      case null null;
    };
  };

  // ── Admin product management ───────────────────────────────────────────────

  public shared ({ caller }) func adminCreateProduct(
    input : ProductTypes.CreateProductInput
  ) : async ProductTypes.Product {
    let p = ProductLib.create(products, nextProductId.value, input);
    nextProductId.value += 1;
    p.toPublic();
  };

  public shared ({ caller }) func adminUpdateProduct(
    id    : CommonTypes.ProductId,
    input : ProductTypes.UpdateProductInput,
  ) : async ?ProductTypes.Product {
    switch (ProductLib.getById(products, id)) {
      case (?p) {
        p.update(input);
        ?p.toPublic();
      };
      case null null;
    };
  };

  public shared ({ caller }) func adminDeleteProduct(id : CommonTypes.ProductId) : async Bool {
    switch (ProductLib.getById(products, id)) {
      case null false;
      case (?_) {
        let kept = products.filter(func(p) { p.id != id });
        products.clear();
        products.addAll(kept.values());
        true;
      };
    };
  };

  public shared ({ caller }) func adminBulkSetActive(
    ids      : [CommonTypes.ProductId],
    isActive : Bool,
  ) : async Nat {
    ProductLib.bulkUpdateActive(products, ids, isActive);
  };

  public shared ({ caller }) func adminGetLowStockAlerts() : async [ProductTypes.LowStockAlert] {
    ProductLib.getLowStockAlerts(products);
  };

  public shared ({ caller }) func adminAdjustStock(
    id    : CommonTypes.ProductId,
    delta : Int,
  ) : async Bool {
    switch (ProductLib.getById(products, id)) {
      case (?p) { p.adjustStock(delta); true };
      case null false;
    };
  };

  // ── Seeding ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func seedData() : async Text {
    if (seeded.value) return "Already seeded";
    let cats = ProductLib.seedCategories();
    for (c in cats.values()) {
      categories.add(c);
    };
    let prods = ProductLib.seedProducts(cats, nextProductId.value);
    for (p in prods.values()) {
      products.add(p);
      nextProductId.value += 1;
    };
    seeded.value := true;
    "Seeded " # debug_show(prods.size()) # " products across " # debug_show(cats.size()) # " categories";
  };
};
