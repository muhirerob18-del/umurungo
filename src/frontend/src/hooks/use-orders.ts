import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { CreateOrderInput, Order, OrderFilter } from "../backend";
import { OrderStatus } from "../backend";

export { OrderStatus };

export function useMyOrders(page = 0, pageSize = 10) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: [
      "my-orders",
      page,
      pageSize,
      identity?.getPrincipal().toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders(BigInt(page * pageSize), BigInt(pageSize));
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 1 * 60 * 1000,
  });
}

export function useOrderDetail(id: bigint | undefined) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<Order | null>({
    queryKey: ["order", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getOrderDetail(id);
    },
    enabled: !!actor && !actorFetching && !!id && !!identity,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCancelOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelOrder(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id.toString()] });
    },
  });
}

export function useAdminOrders(filter: OrderFilter, page = 0, pageSize = 20) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Order[]>({
    queryKey: ["admin-orders", filter, page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListOrders(
        filter,
        BigInt(page * pageSize),
        BigInt(pageSize),
      );
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1 * 60 * 1000,
  });
}

export function useAdminUpdateOrderStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUpdateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}
