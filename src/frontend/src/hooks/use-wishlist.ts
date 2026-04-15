import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductId } from "../backend";

interface WishlistStore {
  items: string[]; // productId as string
  addItem: (productId: ProductId) => void;
  removeItem: (productId: ProductId) => void;
  hasItem: (productId: ProductId) => boolean;
  setItems: (ids: ProductId[]) => void;
  clearItems: () => void;
  count: () => number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (ids) => set({ items: ids.map((id) => id.toString()) }),

      addItem: (productId) =>
        set((state) => {
          const id = productId.toString();
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId.toString()),
        })),

      hasItem: (productId) => {
        return get().items.includes(productId.toString());
      },

      clearItems: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "shopverse-wishlist",
    },
  ),
);
