// Libraries
import { render, screen } from "@testing-library/react";

// Components
import { Paragraph } from "../paragraph/paragraph";

describe("Paragraph component", (): void => {
  it("should render the text passed via children", (): void => {
    render(<Paragraph>Text</Paragraph>);
    const paragraph = screen.getByText("Text");
    expect(paragraph).toBeInTheDocument();
  });

  it("should apply the correct size class", (): void => {
    const { rerender } = render(<Paragraph size="xs">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("text-xs");

    rerender(<Paragraph size="sm">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("text-sm");

    rerender(<Paragraph size="md">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("text-base");

    rerender(<Paragraph size="lg">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("text-lg");
  });

  it("should apply the correct font weight class", (): void => {
    const { rerender } = render(<Paragraph weight="normal">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("font-normal");

    rerender(<Paragraph weight="medium">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("font-medium");

    rerender(<Paragraph weight="bold">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("font-bold");
  });

  it("should apply the extra className passed as a prop", (): void => {
    render(<Paragraph className="text-red-500">Text</Paragraph>);
    expect(screen.getByText("Text")).toHaveClass("text-red-500");
  });
});
