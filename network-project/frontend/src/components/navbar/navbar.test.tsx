// Libraries
import { render, screen } from "@testing-library/react";

// Components
import { Navbar } from "../navbar/navbar";

describe("Navbar component", (): void => {
  it("should render the title when provided", (): void => {
    render(<Navbar title="My App" actions={<div>Buttons</div>} />);
    
    const titleElement: HTMLElement = screen.getByText("My App");
    expect(titleElement).toBeInTheDocument();
  });

  it("should not break if title is not provided", (): void => {
    render(<Navbar actions={<div>Buttons</div>} />);
    
    const navElement: HTMLElement = screen.getByRole("navigation");
    expect(navElement).toBeInTheDocument();
  });

  it("should render the actions", (): void => {
    render(
      <Navbar
        title="My App"
        actions={
          <div>
            <button>Login</button>
            <button>Signup</button>
          </div>
        }
      />
    );

    const loginButton: HTMLElement = screen.getByText("Login");
    const signupButton: HTMLElement = screen.getByText("Signup");

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  it("should contain the <nav> tag with the correct class", (): void => {
    render(<Navbar title="App" actions={<div />} />);

    const navElement: HTMLElement = screen.getByRole("navigation");
    expect(navElement).toHaveClass("bg-gray-800 p-4");
  });
});
