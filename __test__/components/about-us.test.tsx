import AboutUsPage from "@/app/aboutus/page";
import { render, screen } from "@testing-library/react";

describe("AboutUsPage", () => {
  it("renders the About Us header", () => {
    render(<AboutUsPage />);
    const headerElement = screen.getByText(/About Us/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("renders the mission section", () => {
    render(<AboutUsPage />);
    const missionElement = screen.getByText(/Our Mission/i);
    expect(missionElement).toBeInTheDocument();
  });
});
