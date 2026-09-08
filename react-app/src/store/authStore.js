import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      // Convenience role checks — matches your Spatie roles: buyer | seller | admin
      hasRole: (role) => get().user?.roles?.some((r) => r.name === role) ?? false,

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);