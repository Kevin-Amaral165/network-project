// Libraries
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Components
import { Input } from "../input/input";

describe("Input component", (): void => {
  it("should render the input with placeholder", (): void => {
    render(<Input placeholder="Digite seu nome" />);

    const input: HTMLElement = screen.getByPlaceholderText("Digite seu nome");

    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute("readOnly");
  });

  it("should render the label when provided", (): void => {
    render(<Input id="name" label="Name" />);

    const label: HTMLElement = screen.getByText("Name");
    const input: HTMLElement = screen.getByLabelText("Name");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("should disable the input when disabled is true", (): void => {
    render(<Input placeholder="Send Text" disabled />);

    const input: HTMLElement = screen.getByPlaceholderText("Send Text");

    expect(input).toBeDisabled();
  });

  it("should set the input to read‑only when readOnly is true", (): void => {
    render(<Input placeholder="Send Text" readOnly />);

    const input: HTMLElement = screen.getByPlaceholderText("Send Text");

    expect(input).toHaveAttribute("readOnly");
  });

  it("should allow typing into the input and fire onChange", async (): Promise<void> => {
    const user: ReturnType<typeof userEvent.setup> = userEvent.setup();
    const handleChange: jest.Mock = jest.fn();

    render(<Input placeholder="Send Text" onChange={handleChange} />);

    const input: HTMLElement = screen.getByPlaceholderText("Send Text");

    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("Hello");
  });
});
