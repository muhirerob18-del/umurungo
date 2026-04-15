import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Address {
    street: string;
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    state: string;
    phone: string;
}
export interface UserPreferences {
    emailNotifications: boolean;
    language: string;
    currency: string;
}
export type Timestamp = bigint;
export interface OrderItem {
    title: string;
    productId: ProductId;
    imageUrl: string;
    quantity: bigint;
    price: number;
}
export interface ProductRatingSummary {
    ratingCounts: Array<bigint>;
    productId: ProductId;
    averageRating: number;
    totalReviews: bigint;
}
export interface UpdateProductInput {
    sku?: string;
    categoryId?: CategoryId;
    title?: string;
    reorderPoint?: bigint;
    tags?: Array<string>;
    description?: string;
    isActive?: boolean;
    stock?: bigint;
    compareAtPrice?: number;
    subcategoryId?: CategoryId;
    price?: number;
    images?: Array<string>;
}
export interface TopProduct {
    title: string;
    revenue: number;
    productId: ProductId;
    soldCount: bigint;
}
export interface Subcategory {
    id: CategoryId;
    name: string;
    slug: string;
}
export interface RegisterInput {
    displayName: string;
    email: string;
}
export interface CreateOrderInput {
    couponCode?: string;
    paymentMethod: PaymentMethod;
    shippingAddress: Address;
    items: Array<{
        productId: ProductId;
        quantity: bigint;
    }>;
}
export type ReviewId = bigint;
export interface CouponValidation {
    discountAmount: number;
    message: string;
    isValid: boolean;
}
export type CouponId = bigint;
export interface CreateReviewInput {
    title: string;
    productId: ProductId;
    comment: string;
    rating: bigint;
    images: Array<string>;
}
export interface Review {
    id: ReviewId;
    status: ReviewStatus;
    title: string;
    userId: UserId;
    createdAt: Timestamp;
    productId: ProductId;
    comment: string;
    updatedAt: Timestamp;
    rating: bigint;
    images: Array<string>;
}
export interface Category {
    id: CategoryId;
    name: string;
    slug: string;
    subcategories: Array<Subcategory>;
}
export interface RevenueByPeriod {
    revenue: number;
    period: string;
    orderCount: bigint;
}
export interface User {
    id: UserId;
    displayName: string;
    createdAt: Timestamp;
    role: Role;
    defaultAddressIndex?: bigint;
    isActive: boolean;
    email: string;
    preferences: UserPreferences;
    updatedAt: Timestamp;
    addresses: Array<Address>;
    avatarUrl?: string;
}
export interface Coupon {
    id: CouponId;
    discountValue: number;
    validFrom: Timestamp;
    code: string;
    createdAt: Timestamp;
    discountType: DiscountType;
    usageCount: bigint;
    validTo: Timestamp;
    isActive: boolean;
    usageLimit?: bigint;
    applicableCategories: Array<CategoryId>;
    minOrderAmount?: number;
}
export interface DashboardStats {
    totalProducts: bigint;
    totalOrders: bigint;
    pendingOrders: bigint;
    lowStockCount: bigint;
    revenueToday: number;
    ordersToday: bigint;
    totalUsers: bigint;
    totalRevenue: number;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    couponCode?: string;
    trackingNumber?: string;
    total: number;
    paymentMethod: PaymentMethod;
    discountAmount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    notes?: string;
    shippingAddress: Address;
    customerId: UserId;
    paymentReference?: string;
    items: Array<OrderItem>;
    subtotal: number;
}
export interface ProductFilter {
    categoryId?: CategoryId;
    inStockOnly: boolean;
    tags: Array<string>;
    isActive?: boolean;
    maxPrice?: number;
    searchTerm?: string;
    subcategoryId?: CategoryId;
    minPrice?: number;
}
export interface CreateProductInput {
    sku: string;
    categoryId: CategoryId;
    title: string;
    reorderPoint: bigint;
    tags: Array<string>;
    description: string;
    isActive: boolean;
    stock: bigint;
    compareAtPrice?: number;
    subcategoryId?: CategoryId;
    price: number;
    images: Array<string>;
}
export type UserId = Principal;
export interface UpdateProfileInput {
    displayName?: string;
    email?: string;
    preferences?: UserPreferences;
    avatarUrl?: string;
}
export interface CreateCouponInput {
    discountValue: number;
    validFrom: Timestamp;
    code: string;
    discountType: DiscountType;
    validTo: Timestamp;
    usageLimit?: bigint;
    applicableCategories: Array<CategoryId>;
    minOrderAmount?: number;
}
export interface LowStockAlert {
    title: string;
    reorderPoint: bigint;
    productId: ProductId;
    stock: bigint;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface OrderFilter {
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    toDate?: Timestamp;
    fromDate?: Timestamp;
    customerId?: UserId;
}
export interface CartItem {
    productId: ProductId;
    addedAt: Timestamp;
    quantity: bigint;
}
export type OrderId = bigint;
export interface Product {
    id: ProductId;
    sku: string;
    categoryId: CategoryId;
    title: string;
    reorderPoint: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    isActive: boolean;
    updatedAt: Timestamp;
    stock: bigint;
    compareAtPrice?: number;
    subcategoryId?: CategoryId;
    price: number;
    soldCount: bigint;
    images: Array<string>;
}
export enum AnalyticsPeriod {
    Day = "Day",
    Week = "Week",
    Year = "Year",
    Month = "Month"
}
export enum DiscountType {
    Percent = "Percent",
    Fixed = "Fixed"
}
export enum OrderStatus {
    Refunded = "Refunded",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
    Processing = "Processing",
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum PaymentMethod {
    PayPal = "PayPal",
    Stripe = "Stripe",
    MtnMomo = "MtnMomo"
}
export enum ReviewStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export enum Role {
    Customer = "Customer",
    Admin = "Admin"
}
export interface backendInterface {
    addAddress(address: Address): Promise<boolean>;
    addToCart(productId: ProductId, quantity: bigint): Promise<boolean>;
    addToWishlist(productId: ProductId): Promise<boolean>;
    adminAdjustStock(id: ProductId, delta: bigint): Promise<boolean>;
    adminBulkSetActive(ids: Array<ProductId>, isActive: boolean): Promise<bigint>;
    adminCreateCoupon(input: CreateCouponInput): Promise<Coupon>;
    adminCreateProduct(input: CreateProductInput): Promise<Product>;
    adminDeactivateCoupon(id: CouponId): Promise<boolean>;
    adminDeactivateUser(userId: UserId): Promise<boolean>;
    adminDeleteProduct(id: ProductId): Promise<boolean>;
    adminGetDashboardStats(): Promise<DashboardStats>;
    adminGetLowStockAlerts(): Promise<Array<LowStockAlert>>;
    adminGetPendingReviews(): Promise<Array<Review>>;
    adminGetRevenueByPeriod(period: AnalyticsPeriod, count: bigint): Promise<Array<RevenueByPeriod>>;
    adminGetTopProducts(limit: bigint): Promise<Array<TopProduct>>;
    adminListCoupons(activeOnly: boolean): Promise<Array<Coupon>>;
    adminListOrders(filter: OrderFilter, offset: bigint, limit: bigint): Promise<Array<Order>>;
    adminListUsers(offset: bigint, limit: bigint): Promise<Array<User>>;
    adminModerateReview(id: ReviewId, status: ReviewStatus): Promise<boolean>;
    adminSetTrackingNumber(id: OrderId, trackingNumber: string): Promise<boolean>;
    adminSetUserRole(userId: UserId, role: Role): Promise<boolean>;
    adminUpdateCoupon(id: CouponId, input: CreateCouponInput): Promise<Coupon | null>;
    adminUpdateOrderStatus(id: OrderId, status: OrderStatus): Promise<boolean>;
    adminUpdateProduct(id: ProductId, input: UpdateProductInput): Promise<Product | null>;
    cancelOrder(id: OrderId): Promise<boolean>;
    clearCart(): Promise<boolean>;
    getCart(): Promise<Array<CartItem>>;
    getMyOrders(offset: bigint, limit: bigint): Promise<Array<Order>>;
    getMyProfile(): Promise<User | null>;
    getMyReviews(): Promise<Array<Review>>;
    getOrderDetail(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProductRating(productId: ProductId): Promise<ProductRatingSummary>;
    getProductRatingSummary(id: ProductId): Promise<ProductId | null>;
    getProductReviews(productId: ProductId, approvedOnly: boolean): Promise<Array<Review>>;
    getWishlist(): Promise<Array<ProductId>>;
    listCategories(): Promise<Array<Category>>;
    listProducts(filter: ProductFilter, offset: bigint, limit: bigint): Promise<Array<Product>>;
    placeOrder(input: CreateOrderInput): Promise<Order>;
    registerUser(input: RegisterInput): Promise<User>;
    removeAddress(index: bigint): Promise<boolean>;
    removeFromCart(productId: ProductId): Promise<boolean>;
    removeFromWishlist(productId: ProductId): Promise<boolean>;
    searchProducts(term: string, limit: bigint): Promise<Array<Product>>;
    seedData(): Promise<string>;
    setDefaultAddress(index: bigint): Promise<boolean>;
    submitReview(input: CreateReviewInput): Promise<Review>;
    updateCartItem(productId: ProductId, quantity: bigint): Promise<boolean>;
    updateMyProfile(input: UpdateProfileInput): Promise<User>;
    validateCoupon(code: string, orderTotal: number, categoryIds: Array<CategoryId>): Promise<CouponValidation>;
}
