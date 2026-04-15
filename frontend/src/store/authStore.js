import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null, 
  token: null,
  login: (userData, authToken) => set({ user: userData, token: authToken }),
  logout: () => set({ user: null, token: null }),
}))
