import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string; // ✅ adicionamos o token dentro do objeto user
}

interface UserState {
  user: User | null;
  hydrated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hydrated: false,

  // ✅ Ao setar o usuário, também adiciona o token dentro do próprio objeto user
  setUser: (user, token) => {
    const userWithToken = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    set({ user: userWithToken });
  },

  // ✅ Remove tudo do localStorage ao sair
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  // ✅ Carrega usuário do localStorage ao iniciar o app
  loadFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser), hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },
}));
