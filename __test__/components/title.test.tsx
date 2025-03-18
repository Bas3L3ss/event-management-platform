import React from "react";
import { render, screen } from "@testing-library/react";
import Title from "@/components/Title";

describe("Title Component", () => {
  it("renders the title with the correct text", () => {
    render(<Title title="Test Title" />);
    const titleElement = screen.getByText(/Test Title/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("applies the correct className", () => {
    render(<Title title="Test Title" className="custom-class" />);
    const titleElement = screen.getByText(/Test Title/i);
    expect(titleElement).toHaveClass("custom-class");
  });
});
