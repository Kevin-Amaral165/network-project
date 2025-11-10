// Libraries
import { create, StoreApi, UseBoundStore } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
}

interface UserState {
  user: User | null;
  hydrated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

/** Zustand store for user authentication and state management */
export const useUserStore: UseBoundStore<StoreApi<UserState>> = create<UserState>((set) => ({
  user: null,
  hydrated: false,

  // Set user and persist to localStorage
  setUser: (user, token) => {
    const userWithToken: User = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    set({ user: userWithToken });
  },

  // Logout the user and clear from localStorage
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  // Load user from localStorage on app start
  loadFromStorage: () => {
    const storedUser: string | null = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser), hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },
}));
