// Core
import { JSX } from "react";

// Libraries
import { render, screen } from "@testing-library/react";

// HOOK
import withAuth from "./withAuth";

const pushMock: jest.Mock = jest.fn();

jest.mock("next/navigation", (): { useRouter: () => { push: jest.Mock } } => ({
  useRouter: (): { push: jest.Mock } => ({
    push: pushMock,
  }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("withAuth HOC", (): void => {
  const TestComponent = (): JSX.Element => <div>Protected Component</div>;
  const WrappedComponent = withAuth(TestComponent);

  beforeEach(() => {
    pushMock.mockClear();
    localStorage.clear();
  });

  it("should render the component if the token exists", () => {
    localStorage.setItem("token", "my-token");

    render(<WrappedComponent />);

    expect(screen.getByText("Protected Component")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should redirect to /login if the token does not exist", () => {
    render(<WrappedComponent />);

    expect(pushMock).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected Component")).not.toBeInTheDocument();
  });
});
