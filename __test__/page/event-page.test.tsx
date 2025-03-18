import { render, screen, act } from "@testing-library/react";
import EventPage from "@/app/events/_component/EventPage";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock("@/utils/actions/eventsActions", () => ({
  getCommentsByEventId: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: jest.fn(),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(),
}));

jest.mock("@/components/RecomendationCarousel", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-recommendation-carousel">
      Mock Recommendation Carousel
    </div>
  ),
}));
jest.mock("@/react-query/prefetch", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-prefetch-link">prefetch</div>,
}));
jest.mock("@/components/MediaFileRender", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-images">images</div>,
}));

const mockSetState = jest.fn();

beforeEach(() => {
  // Mock `useRouter`
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/mock-path",
  });

  // Mock `useSearchParams`
  (useSearchParams as jest.Mock).mockReturnValue(
    new URLSearchParams({
      dateFrom: "2024-01-01",
      dateTo: "2024-01-10",
      search: "event",
      type: "concert",
      minPrice: "10",
      maxPrice: "100",
      status: "available",
      ratingFrom: "4",
      isFeatured: "true",
    })
  );

  // Mock `useInView`
  (useInView as jest.Mock).mockReturnValue({
    ref: jest.fn(),
    inView: true,
  });

  // Mock `useState`
  jest
    .spyOn(React, "useState")
    // @ts-expect-error: no problem
    .mockImplementation((initial) => [initial, mockSetState]);

  // Mock `useEffect` to run immediately
  jest.spyOn(React, "useEffect").mockImplementation((fn) => fn());

  // Mock `useInfiniteQuery`
  (useInfiniteQuery as jest.Mock).mockReturnValue({
    isLoading: false,
    isError: false,
    data: {
      events: [
        {
          id: "1",
          clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
          eventName: "Baseless prod test",
          eventDescription:
            "<p><strong>wdad d wa <em>ds dw </em></strong>dw d sd s dss d s</p>",
          dateEnd: "2025-02-18T17:00:00.000Z",
          dateStart: "2025-02-17T17:00:00.000Z",
          status: "UPCOMING",
          type: "FUNDRAISERS_CHARITY",
          rating: 5,
          eventImg: [
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/images/1739667488239-cat-kitten-cute.webp",
          ],
          eventVideo:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/videos/1739667489579-16.02.2025_07.57.21_REC.mp4",
          eventImgOrVideoFirstDisplay:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/videos/1739667489579-16.02.2025_07.57.21_REC.mp4",
          eventTicketPrice: 3,
          eventLocation: "London, Southwestern Ontario, Ontario, Canada",
          latitude: 42.9832406,
          longitude: -81.243372,
          reservationTicketLink: "https://jubilant-wallaby.name/",
          createdAt: "2025-02-16T00:58:12.890Z",
          updatedAt: "2025-02-23T10:18:19.915Z",
          activationTotal: 0,
          featured: false,
          hostName: "Dach, McDermott and Cummerata",
        },
        {
          id: "2",
          clerkId: "user_2mSGcOZyhk3BJR90ZnQB28neavt",
          eventName: "Recycled",
          eventDescription: "d d d d d d d dd d d d",
          dateEnd: "2025-01-26T17:00:00.000Z",
          dateStart: "2025-01-25T17:00:00.000Z",
          status: "UPCOMING",
          type: "CONFERENCE",
          rating: 5,
          eventImg: [
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/images/1735879847790-event.webp",
          ],
          eventVideo:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/videos/1735880103230-31.12.2024_16.08.18_REC.mp4",
          eventImgOrVideoFirstDisplay:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/images/1735879847790-event.webp",
          eventTicketPrice: 3,
          eventLocation: "Ho Chi Minh City, Vietnam",
          latitude: 10.7763897,
          longitude: 106.7011391,
          reservationTicketLink: "https://plump-bin.info/",
          createdAt: "2025-01-03T04:50:49.530Z",
          updatedAt: "2025-02-20T04:22:54.042Z",
          activationTotal: 0,
          featured: false,
          hostName: "Gottlieb - Sipes",
        },
        {
          id: "3",
          clerkId: "user_2mPkcZJJEbsk1q1CCAJXq4ejfKm",
          eventName: "Luxurious Bronze Chipsd",
          eventDescription:
            "ds sdsdds sdsdds sdsdds sdsdds sdsdvds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdvds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdds sdsdvds sdsdds sdsdds sdsd",
          dateEnd: "2025-01-23T16:08:00.000Z",
          dateStart: "2025-01-23T00:11:00.000Z",
          status: "UPCOMING",
          type: "FUNDRAISERS_CHARITY",
          rating: 2,
          eventImg: [
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/images/1735638162287-desktop.jpg",
          ],
          eventVideo:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/videos/1735638164270-31.12.2024_16.08.18_REC.mp4",
          eventImgOrVideoFirstDisplay:
            "https://iydadvcfuuolbgpildmx.supabase.co/storage/v1/object/public/main-bucket/images/1735638162287-desktop.jpg",
          eventTicketPrice: 100,
          eventLocation:
            "Hẻm 195/1 Phạm Văn Bạch, Ward 15, Tân Bình District, Ho Chi Minh City, 70500, Vietnam",
          latitude: 10.81788109989761,
          longitude: 106.6368613394209,
          reservationTicketLink: "https://plump-bin.info/",
          createdAt: "2024-12-31T09:42:45.417Z",
          updatedAt: "2025-02-16T03:59:28.550Z",
          activationTotal: 0,
          featured: false,
          hostName: "Crist - Reynolds",
        },
      ],
    },
    error: null,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
  });
});

describe("EventPage Component", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<EventPage />);
    });
    expect(
      screen.getByRole("heading", { name: /events/i })
    ).toBeInTheDocument();
  });

  it("renders the recommendation carousel", async () => {
    await act(async () => {
      render(<EventPage />);
    });
    expect(
      screen.getByTestId("mock-recommendation-carousel")
    ).toBeInTheDocument();
  });

  it("renders individual events correctly", async () => {
    await act(async () => {
      render(<EventPage />);
    });

    expect(screen.getByText("Baseless prod test")).toBeInTheDocument();
    expect(screen.getByText("Recycled")).toBeInTheDocument();
    expect(screen.getByText("Luxurious Bronze Chipsd")).toBeInTheDocument();
  });

  it("displays a message when no events are found", async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isError: false,
      data: { events: [], pageParams: [""] },
      error: null,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
    });

    await act(async () => {
      render(<EventPage />);
    });

    expect(screen.getByRole("alert")).toHaveTextContent("No events found.");
  });
});
