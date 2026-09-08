import { create } from 'zustand';

// Only tracks the badge count for the navbar cart icon.
// Full cart contents are owned by TanStack Query (server state, not client state) —
// this avoids duplicating server data in two places that could drift out of sync.
export const useCartStore = create((set) => ({
  itemsCount: 0,
  setItemsCount: (count) => set({ itemsCount: count }),
}));