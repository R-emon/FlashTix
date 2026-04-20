import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// We wrap our entire store inside persist()
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, 
      token: null,
      login: (userData, authToken) => set({ user: userData, token: authToken }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'flashtix-auth-storage', // This is the file in browser's local storage cache
    }
  )
)
