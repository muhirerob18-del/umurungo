import { a as useActor, i as useQueryClient, t as useInternetIdentity, p as useQuery, d as createActor } from "./index-CzdgUJ7r.js";
import { u as useMutation } from "./useMutation-keq2ozyC.js";
function useMyOrders(page = 0, pageSize = 10) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: [
      "my-orders",
      page,
      pageSize,
      identity == null ? void 0 : identity.getPrincipal().toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders(BigInt(page * pageSize), BigInt(pageSize));
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 1 * 60 * 1e3
  });
}
function useOrderDetail(id) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["order", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getOrderDetail(id);
    },
    enabled: !!actor && !actorFetching && !!id && !!identity,
    staleTime: 2 * 60 * 1e3
  });
}
function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
}
function useCancelOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelOrder(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id.toString()] });
    }
  });
}
export {
  useOrderDetail as a,
  useMyOrders as b,
  useCancelOrder as c,
  usePlaceOrder as u
};
