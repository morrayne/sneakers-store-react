import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  ids: number[];
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  has: (productId: number) => boolean;
  count: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) => {
        const current = get().ids;
        set({
          ids: current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
        });
      },

      remove: (productId) => set({ ids: get().ids.filter((id) => id !== productId) }),

      clear: () => set({ ids: [] }),

      has: (productId) => get().ids.includes(productId),

      count: () => get().ids.length,
    }),
    { name: "favorites-storage" },
  ),
);
