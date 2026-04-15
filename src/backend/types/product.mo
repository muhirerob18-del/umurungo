import CommonTypes "common";

module {
  public type CategoryId = CommonTypes.CategoryId;
  public type ProductId = CommonTypes.ProductId;
  public type Timestamp = CommonTypes.Timestamp;

  public type Subcategory = {
    id : CategoryId;
    name : Text;
    slug : Text;
  };

  public type Category = {
    id : CategoryId;
    name : Text;
    slug : Text;
    subcategories : [Subcategory];
  };

  public type ProductInternal = {
    id : ProductId;
    var title : Text;
    var description : Text;
    var price : Float;
    var compareAtPrice : ?Float;
    var images : [Text];
    var stock : Nat;
    var sku : Text;
    var categoryId : CategoryId;
    var subcategoryId : ?CategoryId;
    var tags : [Text];
    var isActive : Bool;
    var reorderPoint : Nat;
    var soldCount : Nat;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  public type Product = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Float;
    compareAtPrice : ?Float;
    images : [Text];
    stock : Nat;
    sku : Text;
    categoryId : CategoryId;
    subcategoryId : ?CategoryId;
    tags : [Text];
    isActive : Bool;
    reorderPoint : Nat;
    soldCount : Nat;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type CreateProductInput = {
    title : Text;
    description : Text;
    price : Float;
    compareAtPrice : ?Float;
    images : [Text];
    stock : Nat;
    sku : Text;
    categoryId : CategoryId;
    subcategoryId : ?CategoryId;
    tags : [Text];
    isActive : Bool;
    reorderPoint : Nat;
  };

  public type UpdateProductInput = {
    title : ?Text;
    description : ?Text;
    price : ?Float;
    compareAtPrice : ?Float;
    images : ?[Text];
    stock : ?Nat;
    sku : ?Text;
    categoryId : ?CategoryId;
    subcategoryId : ?CategoryId;
    tags : ?[Text];
    isActive : ?Bool;
    reorderPoint : ?Nat;
  };

  public type ProductFilter = {
    categoryId : ?CategoryId;
    subcategoryId : ?CategoryId;
    minPrice : ?Float;
    maxPrice : ?Float;
    inStockOnly : Bool;
    tags : [Text];
    searchTerm : ?Text;
    isActive : ?Bool;
  };

  public type LowStockAlert = {
    productId : ProductId;
    title : Text;
    stock : Nat;
    reorderPoint : Nat;
  };
};
