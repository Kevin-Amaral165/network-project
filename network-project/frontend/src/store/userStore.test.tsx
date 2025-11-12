// Store
import { useUserStore } from "./userStore";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useUserStore", (): void => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set the user and save it to localStorage", (): void => {
    const user = { id: 1, username: "kevin", email: "kevin@example.com", role: "user" };
    const token: string = "token_123";

    const setUser: (user: {
      id: number;
      username: string;
      email: string;
      role: string;
    }, token: string) => void = useUserStore.getState().setUser;

    setUser(user, token);

    const storedUser: { id: number; username: string; email: string; role: string; token: string } = JSON.parse(localStorage.getItem("user")!);
    expect(storedUser).toEqual({ ...user, token });
    expect(useUserStore.getState().user).toEqual({ ...user, token });
  });

  it("should log out and clear localStorage", (): void => {
    const logout = useUserStore.getState().logout;

    localStorage.setItem("user", JSON.stringify({ id: 1, username: "kevin", email: "kevin@example.com", role: "user", token: "token_123" }));

    logout();

    expect(localStorage.getItem("user")).toBeNull();
    expect(useUserStore.getState().user).toBeNull();
  });

  it("should load the user from localStorage when initializing the store", (): void => {
    const user: {
      id: number;
      username: string;
      email: string;
      role: string;
      token: string;
    } = { id: 1, username: "kevin", email: "kevin@example.com", role: "user", token: "token_123" };
    localStorage.setItem("user", JSON.stringify(user));

    const loadFromStorage: () => void = useUserStore.getState().loadFromStorage;
    loadFromStorage();

    expect(useUserStore.getState().user).toEqual(user);
    expect(useUserStore.getState().hydrated).toBe(true);
  });
});
