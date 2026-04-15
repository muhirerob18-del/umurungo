import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type {
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
  CreateOrderInput,
  RegisterInput,
  UpdateProfileInput,
  Address,
  CreateReviewInput,
  CreateCouponInput,
  OrderFilter,
  ProductId,
  OrderId,
  ReviewId,
  CouponId,
  UserId,
  CategoryId,
} from "../backend";
import { AnalyticsPeriod, ReviewStatus, Role, OrderStatus } from "../backend";

// Re-export for convenience
export { AnalyticsPeriod, ReviewStatus, Role, OrderStatus };

// Hook to get actor
export { useActor };

// Format price
export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format BigInt timestamp to readable date string
export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Unwrap Option type from backend
export function unwrapOption<T>(
  opt: { __kind__: "Some"; value: T } | { __kind__: "None" } | T | null | undefined
): T | null {
  if (opt === null || opt === undefined) return null;
  if (typeof opt === "object" && "__kind__" in (opt as object)) {
    const o = opt as { __kind__: string; value?: T };
    if (o.__kind__ === "Some") return o.value as T;
    if (o.__kind__ === "None") return null;
  }
  return opt as T;
}

// Type aliases for convenience
export type {
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
  CreateOrderInput,
  RegisterInput,
  UpdateProfileInput,
  Address,
  CreateReviewInput,
  CreateCouponInput,
  OrderFilter,
  ProductId,
  OrderId,
  ReviewId,
  CouponId,
  UserId,
  CategoryId,
};
