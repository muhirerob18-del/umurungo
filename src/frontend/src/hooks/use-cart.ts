import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductId } from "../backend";

interface CartStore {
  items: CartItem[];
  products: Record<string, Product>;
  setItems: (items: CartItem[]) => void;
  setProduct: (product: Product) => void;
  addItem: (productId: ProductId, quantity?: bigint) => void;
  updateItem: (productId: ProductId, quantity: bigint) => void;
  removeItem: (productId: ProductId) => void;
  clearItems: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      products: {},

      setItems: (items) => set({ items }),

      setProduct: (product) =>
        set((state) => ({
          products: {
            ...state.products,
            [product.id.toString()]: product,
          },
        })),

      addItem: (productId, quantity = 1n) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId.toString() === productId.toString(),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId.toString() === productId.toString()
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId,
                quantity,
                addedAt: BigInt(Date.now()) * 1_000_000n,
              },
            ],
          };
        }),

      updateItem: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0n
              ? state.items.filter(
                  (i) => i.productId.toString() !== productId.toString(),
                )
              : state.items.map((i) =>
                  i.productId.toString() === productId.toString()
                    ? { ...i, quantity }
                    : i,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.productId.toString() !== productId.toString(),
          ),
        })),

      clearItems: () => set({ items: [] }),

      getTotalCount: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + Number(i.quantity), 0);
      },

      getTotalPrice: () => {
        const { items, products } = get();
        return items.reduce((sum, item) => {
          const product = products[item.productId.toString()];
          if (!product) return sum;
          return sum + product.price * Number(item.quantity);
        }, 0);
      },
    }),
    {
      name: "shopverse-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
