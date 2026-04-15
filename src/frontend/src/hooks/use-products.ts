import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Category, Product, ProductFilter } from "../backend";

const DEFAULT_FILTER: ProductFilter = {
  inStockOnly: false,
  tags: [],
};

export function useProducts(
  filter: Partial<ProductFilter> = {},
  page = 0,
  pageSize = 20,
) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const mergedFilter: ProductFilter = { ...DEFAULT_FILTER, ...filter };
  const offset = BigInt(page * pageSize);
  const limit = BigInt(pageSize);

  return useQuery<Product[]>({
    queryKey: ["products", mergedFilter, page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts(mergedFilter, offset, limit);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(id: bigint | undefined) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorFetching && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchProducts(term: string, limit = 20) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Product[]>({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchProducts(term, BigInt(limit));
    },
    enabled: !!actor && !actorFetching && term.trim().length > 1,
    staleTime: 1 * 60 * 1000,
  });
}

export function useCategories() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function useProductRating(productId: bigint | undefined) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery({
    queryKey: ["product-rating", productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProductRating(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductReviews(
  productId: bigint | undefined,
  approvedOnly = true,
) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery({
    queryKey: ["product-reviews", productId?.toString(), approvedOnly],
    queryFn: async () => {
      if (!actor || !productId) return [];
      return actor.getProductReviews(productId, approvedOnly);
    },
    enabled: !!actor && !actorFetching && !!productId,
    staleTime: 3 * 60 * 1000,
  });
}
