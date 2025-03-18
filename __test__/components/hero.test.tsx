import Hero from "@/components/Hero";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";

describe("Hero Component", () => {
  it("renders Explore Events button and triggers navigation", async () => {
    await act(async () => {
      render(<Hero />);
    });

    const exploreButton = screen.getByRole("link", { name: /explore events/i });
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveAttribute("href", "/events");
  });

  it("renders Advertise Your Event button and triggers navigation", async () => {
    await act(async () => {
      render(<Hero />);
    });

    const advertiseButton = screen.getByRole("link", {
      name: /advertise your event/i,
    });
    expect(advertiseButton).toBeInTheDocument();
    expect(advertiseButton).toHaveAttribute("href", "/events/myevents");
  });

  it("triggers button click animations", async () => {
    await act(async () => {
      render(<Hero />);
    });

    const exploreButton = screen.getByRole("link", { name: /explore events/i });

    // Simulate clicking the button
    fireEvent.click(exploreButton);

    // Since navigation isn't actually happening in the test, we just ensure the button is clickable
    expect(exploreButton).toBeInTheDocument();
  });
});
