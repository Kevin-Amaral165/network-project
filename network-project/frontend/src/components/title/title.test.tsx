// Libraries
import { render, screen } from "@testing-library/react";

// Components
import { Title } from "../title/title";

describe("Title component", (): void => {
  it("should render the text passed via children", (): void => {
    render(<Title>Text</Title>);
    const title = screen.getByText("Text");
    expect(title).toBeInTheDocument();
  });

  it("should apply the correct size class", (): void => {
    const { rerender } = render(<Title size="xs">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-xs");

    rerender(<Title size="sm">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-sm");

    rerender(<Title size="md">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-base");

    rerender(<Title size="lg">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-lg");

    rerender(<Title size="xl">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-xl");

    rerender(<Title size="2xl">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-2xl");
  });

  it("should apply the correct weight class", (): void => {
    const { rerender } = render(<Title weight="normal">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("font-normal");

    rerender(<Title weight="medium">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("font-medium");

    rerender(<Title weight="bold">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("font-bold");
  });

  it("should apply the extra className passed as a prop", (): void => {
    render(<Title className="text-red-500">Text</Title>);
    expect(screen.getByText("Text")).toHaveClass("text-red-500");
  });
});
