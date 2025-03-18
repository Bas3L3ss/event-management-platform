import React from "react";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { EventStatus } from "@prisma/client";
import RecommendationCarousel from "@/components/RecomendationCarousel";

jest.mock("@/components/MediaFileRender", () => ({
  __esModule: true,
  default: () => <span>Mocked Media</span>,
}));
jest.mock("@/utils/actions/eventsActions", () => ({
  getRandomEvents: () => mockEvents,
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const mockEvents = [
  {
    id: "1",
    eventName: "Event 1",
    eventDescription: "Description 1",
    dateStart: "2023-01-01",
    dateEnd: "2023-01-02",
    eventLocation: "Location 1",
    type: "CONFERENCE",
    status: EventStatus.UPCOMING,
    eventImgOrVideoFirstDisplay: "image1.jpg",
    featured: true,
  },
];

describe("RecommendationCarousel Component", () => {
  it("renders loading skeleton when data is loading", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<RecommendationCarousel />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders events when data is available", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    });

    render(<RecommendationCarousel />);
    // expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    const events = screen.getAllByText(/Event /i);

    expect(events.length).toBe(3); // Ensure that there are 3 events
  });

  it("handles error state gracefully", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<RecommendationCarousel />);
    expect(screen.queryByText(/Event 1/i)).not.toBeInTheDocument();
  });
  it("returns null when there is no data", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<RecommendationCarousel />);
    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
});
