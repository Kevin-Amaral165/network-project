import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  hydrated: boolean; // novo
  setUser: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  hydrated: false, // inicial

  setUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({ user: JSON.parse(storedUser), token: storedToken, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },
}));
