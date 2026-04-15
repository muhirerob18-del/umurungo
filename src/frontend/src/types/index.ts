// Re-export all backend types
export type {
  Address,
  UserPreferences,
  Timestamp,
  OrderItem,
  ProductRatingSummary,
  UpdateProductInput,
  TopProduct,
  Subcategory,
  RegisterInput,
  CreateOrderInput,
  CouponValidation,
  CreateReviewInput,
  Review,
  Category,
  RevenueByPeriod,
  User,
  Coupon,
  DashboardStats,
  Order,
  ProductFilter,
  CreateProductInput,
  UpdateProfileInput,
  CreateCouponInput,
  LowStockAlert,
  CartItem,
  Product,
  OrderFilter,
  CategoryId,
  ProductId,
  OrderId,
  ReviewId,
  CouponId,
  UserId,
} from "../backend";

export {
  AnalyticsPeriod,
  DiscountType,
  OrderStatus,
  PaymentMethod,
  ReviewStatus,
  Role,
} from "../backend";

// UI-specific types
export interface CartItemWithProduct {
  productId: bigint;
  quantity: bigint;
  addedAt: bigint;
  product?: import("../backend").Product;
}

export interface WishlistItemWithProduct {
  productId: bigint;
  product?: import("../backend").Product;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total?: number;
}

export interface FilterState {
  categoryId?: bigint;
  subcategoryId?: bigint;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  tags: string[];
  searchTerm?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
}
