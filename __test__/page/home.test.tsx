import { render, screen, act } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/components/Hero", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero">Mock Hero</div>,
}));

jest.mock("@/components/FeaturedEvents", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-featured-events">Mock Featured Events</div>
  ),
}));

jest.mock("@/components/RecomendationCarousel", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-recommendation-carousel">
      Mock Recommendation Carousel
    </div>
  ),
}));

describe("Home Page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      const { container } = render(<Home />);
      expect(container).toBeInTheDocument();
    });
  });

  it("renders all main components", async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-featured-events")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-recommendation-carousel")
    ).toBeInTheDocument();
  });

  it("renders components in correct order", async () => {
    await act(async () => {
      render(<Home />);
    });

    const components = screen.getAllByTestId(/mock-/);
    expect(components[0]).toHaveTextContent("Mock Hero");
    expect(components[1]).toHaveTextContent("Mock Featured Events");
    expect(components[2]).toHaveTextContent("Mock Recommendation Carousel");
  });
  it("renders exactly three main components", async () => {
    await act(async () => {
      render(<Home />);
    });

    const components = screen.getAllByTestId(/mock-/);
    expect(components.length).toBe(3); // Expect exactly three components
  });
});
